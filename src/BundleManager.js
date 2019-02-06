/*jshint node: true, esversion: 6 */
'use strict';

const fs = require('fs'),
    path = require('path'),
    Data = require('./Data'),
    Area = require('./Area'),
    Command = require('./Command'),
    CommandType = require('./CommandType'),
    Item = require('./Item'),
    Npc = require('./Npc'),
    QuestGoal = require('./QuestGoal'),
    QuestReward = require('./QuestReward'),
    Room = require('./Room'),
    Skill = require('./Skill'),
    SkillType = require('./SkillType'),
    Helpfile = require('./Helpfile'),
    Logger = require('./Logger')
;

const { AttributeFormula } = require('./Attribute');

const srcPath = __dirname + '/';
/**
 * Handles loading/parsing/initializing all bundles. AKA where the magic happens
 */
class BundleManager {
  /**
   * @param {GameState} state
   */
  constructor(path, state) {
    if (!path || !fs.existsSync(path)) {
      throw new Error('Invalid bundle path');
    }

    this.state = state;
    this.bundlesPath = path;
    this.areas = [];
    this.loaderRegistry = this.state.EntityLoaderRegistry;
  }

  /**
   * Load in all bundles
   */
  async loadBundles(distribute = true) {
    Logger.verbose('LOAD: BUNDLES');

    const bundles = fs.readdirSync(this.bundlesPath);
    for (const bundle of bundles) {
      const bundlePath = this.bundlesPath + bundle;
      if (fs.statSync(bundlePath).isFile() || bundle === '.' || bundle === '..') {
        continue;
      }

      // only load bundles the user has configured to be loaded
      if (this.state.Config.get('bundles', []).indexOf(bundle) === -1) {
        continue;
      }

      await this.loadBundle(bundle, bundlePath);
    }

    try {
      this.state.AttributeFactory.validateAttributes();
    } catch (err) {
      Logger.error(err.message);
      process.exit(0);
    }

    Logger.verbose('ENDLOAD: BUNDLES');

    if (!distribute) {
      return;
    }

    // Distribution is done after all areas are loaded in case items use areas from each other
    for (const areaRef of this.areas) {
      const area = this.state.AreaFactory.create(areaRef);
      try {
        area.hydrate(this.state);
      } catch (err) {
        Logger.error(err.message);
        process.exit(0);
      }
      this.state.AreaManager.addArea(area);
    }
  }

  /**
   * @param {string} bundle Bundle name
   * @param {string} bundlePath Path to bundle directory
   */
  async loadBundle(bundle, bundlePath) {
    const features = [
      // quest goals/rewards have to be loaded before areas that have quests which use those goals
      { path: 'quest-goals/', fn: 'loadQuestGoals' },
      { path: 'quest-rewards/', fn: 'loadQuestRewards' },

      { path: 'attributes.js', fn: 'loadAttributes' },

      // any entity in an area, including the area itself, can have behaviors so load them first
      { path: 'behaviors/', fn: 'loadBehaviors' },

      { path: 'channels.js', fn: 'loadChannels' },
      { path: 'commands/', fn: 'loadCommands' },
      { path: 'effects/', fn: 'loadEffects' },
      { path: 'input-events/', fn: 'loadInputEvents' },
      { path: 'server-events/', fn: 'loadServerEvents' },
      { path: 'player-events.js', fn: 'loadPlayerEvents' },
      { path: 'skills/', fn: 'loadSkills' },
    ];

    Logger.verbose(`LOAD: BUNDLE [\x1B[1;33m${bundle}\x1B[0m] START`);
    for (const feature of features) {
      const path = bundlePath + '/' + feature.path;
      if (fs.existsSync(path)) {
        this[feature.fn](bundle, path);
      }
    }

    await this.loadAreas(bundle);
    await this.loadHelp(bundle);

    Logger.verbose(`ENDLOAD: BUNDLE [\x1B[1;32m${bundle}\x1B[0m]`);
  }

  loadQuestGoals(bundle, goalsDir) {
    Logger.verbose(`\tLOAD: Quest Goals...`);
    const files = fs.readdirSync(goalsDir);

    for (const goalFile of files) {
      const goalPath = goalsDir + goalFile;
      if (!Data.isScriptFile(goalPath, goalFile)) {
        continue;
      }

      const goalName = path.basename(goalFile, path.extname(goalFile));
      const loader = require(goalPath);
      let goalImport = QuestGoal.isPrototypeOf(loader) ? loader : loader(srcPath);
      Logger.verbose(`\t\t${goalName}`);

      this.state.QuestGoalManager.set(goalName, goalImport);
    }

    Logger.verbose(`\tENDLOAD: Quest Goals...`);
  }

  loadQuestRewards(bundle, rewardsDir) {
    Logger.verbose(`\tLOAD: Quest Rewards...`);
    const files = fs.readdirSync(rewardsDir);

    for (const rewardFile of files) {
      const rewardPath = rewardsDir + rewardFile;
      if (!Data.isScriptFile(rewardPath, rewardFile)) {
        continue;
      }

      const rewardName = path.basename(rewardFile, path.extname(rewardFile));
      const loader = require(rewardPath);
      let rewardImport = QuestReward.isPrototypeOf(loader) ? loader : loader(srcPath);
      Logger.verbose(`\t\t${rewardName}`);

      this.state.QuestRewardManager.set(rewardName, rewardImport);
    }

    Logger.verbose(`\tENDLOAD: Quest Rewards...`);
  }

  /**
   * Load attribute definitions
   * @param {string} bundle
   * @param {string} attributesFile
   */
  loadAttributes(bundle, attributesFile) {
    Logger.verbose(`\tLOAD: Attributes...`);

    const attributes = require(attributesFile);
    let error = `\tAttributes file [${attributesFile}] from bundle [${bundle}]`;
    if (!Array.isArray(attributes)) {
      Logger.error(`${error} does not define an array of attributes`);
      return;
    }

    for (const attribute of attributes) {
      if (typeof attribute !== 'object') {
        Logger.error(`${error} not an object`);
        continue;
      }

      if (!('name' in attribute) || !('base' in attribute)) {
        Logger.error(`${error} does not include required properties name and base`);
        continue;
      }

      let formula = null;
      if (attribute.formula) {
        formula = new AttributeFormula(
          attribute.formula.requires,
          attribute.formula.fn,
        );
      }

      Logger.verbose(`\t\t-> ${attribute.name}`);

      this.state.AttributeFactory.add(attribute.name, attribute.base, formula, attribute.metadata);
    }

    Logger.verbose(`\tENDLOAD: Attributes...`);
  }

  /**
   * Load/initialize player. See the {@link http://ranviermud.com/extending/input_events/|Player Event guide}
   * @param {string} bundle
   * @param {string} eventsFile event js file to load
   */
  loadPlayerEvents(bundle, eventsFile) {
    Logger.verbose(`\tLOAD: Player Events...`);

    const loader = require(eventsFile);
    const playerListeners = this._getLoader(loader, srcPath).listeners;

    for (const [eventName, listener] of Object.entries(playerListeners)) {
      Logger.verbose(`\t\tEvent: ${eventName}`);
      this.state.PlayerManager.addListener(eventName, listener(this.state));
    }

    Logger.verbose(`\tENDLOAD: Player Events...`);
  }

  /**
  * @param {string} bundle
  */
  async loadAreas(bundle) {
    Logger.verbose(`\tLOAD: Areas...`);

    const areaLoader = this.loaderRegistry.get('areas');
    areaLoader.setBundle(bundle);
    let areas = [];

    if (!await areaLoader.hasData()) {
      return areas;
    }

    areas = await areaLoader.fetchAll();

    for (const name in areas) {
      const manifest = areas[name];
      this.areas.push(name);
      await this.loadArea(bundle, name, manifest);
    }

    Logger.verbose(`\tENDLOAD: Areas`);
  }

  /**
   * @param {string} bundle
   * @param {string} areaName
   * @param {string} areaPath
   */
  async loadArea(bundle, areaName, manifest) {
    const definition = {
      bundle,
      manifest,
      quests: [],
      items: [],
      npcs: [],
      rooms: [],
    };

    const scriptPath = this._getAreaScriptPath(bundle, areaName);

    if (manifest.script) {
      const scriptPath = `${scriptPath}/${area.script}.js`;
      if (!fs.existsSync(scriptPath)) {
        Logger.warn(`\t\t\t[${areaName}] has non-existent script "${area.script}"`);
      }

      Logger.verbose(`\t\t\tLoading Item Script [${entityRef}] ${item.script}`);
      this.loadEntityScript(this.state.AreaFactory, entityRef, scriptPath);
    }

    Logger.verbose(`\t\tLOAD: Quests...`);
    definition.quests = await this.loadQuests(bundle, areaName);
    Logger.verbose(`\t\tLOAD: Items...`);
    definition.items  = await this.loadEntities(bundle, areaName, 'items', this.state.ItemFactory);
    Logger.verbose(`\t\tLOAD: NPCs...`);
    definition.npcs   = await this.loadEntities(bundle, areaName, 'npcs', this.state.MobFactory);
    Logger.verbose(`\t\tLOAD: Rooms...`);
    definition.rooms  = await this.loadEntities(bundle, areaName, 'rooms', this.state.RoomFactory);
    Logger.verbose('\t\tDone.');

    for (const npcRef of definition.npcs) {
      const npc = this.state.MobFactory.getDefinition(npcRef);
      if (!npc.quests) {
        continue;
      }

      // Update quest definitions with their questor
      // TODO: This currently means a given quest can only have a single questor, perhaps not optimal
      for (const qid of npc.quests) {
        const quest = this.state.QuestFactory.get(qid);
        if (!quest) {
          Logger.error(`\t\t\tError: NPC is questor for non-existent quest [${qid}]`);
          continue;
        }
        quest.npc = npcRef;
        this.state.QuestFactory.set(qid, quest);
      }
    }

    this.state.AreaFactory.setDefinition(areaName, definition);
  }

  /**
   * Load an entity (item/npc/room) from file
   * @param {string} bundle
   * @param {string} areaName
   * @param {string} type
   * @param {EntityFactory} factory
   * @return {Array<entityReference>}
   */
  async loadEntities(bundle, areaName, type, factory) {
    const loader = this.loaderRegistry.get(type);
    loader.setBundle(bundle);
    loader.setArea(areaName);

    if (!await loader.hasData()) {
      return [];
    }

    const entities = await loader.fetchAll();
    if (!entities) {
      Logger.warn(`\t\t\t${type} has an invalid value [${entities}]`);
      return [];
    }

    const scriptPath = this._getAreaScriptPath(bundle, areaName);

    return entities.map(entity => {
      const entityRef = factory.createEntityRef(areaName, entity.id);
      factory.setDefinition(entityRef, entity);
      if (entity.script) {
        const entityScript = `${scriptPath}/${type}/${entity.script}.js`;
        if (!fs.existsSync(entityScript)) {
          Logger.warn(`\t\t\t[${entityRef}] has non-existent script "${entity.script}"`);
        } else {
          Logger.verbose(`\t\t\tLoading Script [${entityRef}] ${entity.script}`);
          this.loadEntityScript(factory, entityRef, entityScript);
        }
      }

      return entityRef;
    });
  }

  /**
   * @param {EntityFactory} factory Instance of EntityFactory that the item/npc will be loaded into
   * @param {EntityReference} entityRef
   * @param {string} scriptPath
   */
  loadEntityScript(factory, entityRef, scriptPath) {
    const loader = require(scriptPath);
    const scriptListeners = this._getLoader(loader, srcPath).listeners;

    for (const [eventName, listener] of Object.entries(scriptListeners)) {
      Logger.verbose(`\t\t\t\tEvent: ${eventName}`);
      factory.addScriptListener(entityRef, eventName, listener(this.state));
    }
  }

  /**
   * @param {string} areaName
   * @param {string} questsFile
   * @return {Promise<Array<entityReference>>}
   */
  async loadQuests(bundle, areaName) {
    const loader = this.loaderRegistry.get('quests');
    loader.setBundle(bundle);
    loader.setArea(areaName);
    let quests = [];
    try {
       quests = await loader.fetchAll();
    } catch (err) {}

    return quests.map(quest => {
      Logger.verbose(`\t\t\tLoading Quest [${areaName}:${quest.id}]`);
      this.state.QuestFactory.add(areaName, quest.id, quest);
      return this.state.QuestFactory.makeQuestKey(areaName, quest.id);
    });
  }

  /**
   * @param {string} bundle
   * @param {string} commandsDir
   */
  loadCommands(bundle, commandsDir) {
    Logger.verbose(`\tLOAD: Commands...`);
    const files = fs.readdirSync(commandsDir);

    for (const commandFile of files) {
      const commandPath = commandsDir + commandFile;
      if (!Data.isScriptFile(commandPath, commandFile)) {
        continue;
      }

      const commandName = path.basename(commandFile, path.extname(commandFile));
      const command = this.createCommand(commandPath, commandName, bundle);
      this.state.CommandManager.add(command);
    }

    Logger.verbose(`\tENDLOAD: Commands...`);
  }

  /**
   * @param {string} commandPath
   * @param {string} commandName
   * @param {string} bundle
   * @return {Command}
   */
  createCommand(commandPath, commandName, bundle) {
    const loader = require(commandPath);
    let cmdImport = this._getLoader(loader, srcPath, this.bundlesPath);
    cmdImport.command = cmdImport.command(this.state);


    return new Command(
      bundle,
      commandName,
      cmdImport,
      commandPath
    );
  }

  /**
   * @param {string} bundle
   * @param {string} channelsFile
   */
  loadChannels(bundle, channelsFile) {
    Logger.verbose(`\tLOAD: Channels...`);

    const loader = require(channelsFile);
    let channels = this._getLoader(loader, srcPath);

    if (!Array.isArray(channels)) {
      channels = [channels];
    }

    channels.forEach(channel => {
      channel.bundle = bundle;
      this.state.ChannelManager.add(channel);
    });

    Logger.verbose(`\tENDLOAD: Channels...`);
  }

  /**
   * @param {string} bundle
   * @param {string} helpDir
   */
  async loadHelp(bundle) {
    Logger.verbose(`\tLOAD: Help...`);
    const loader = this.loaderRegistry.get('help');
    loader.setBundle(bundle);

    if (!await loader.hasData()) {
      return;
    }

    const records = await loader.fetchAll();
    for (const helpName in records) {
      try {
        const hfile = new Helpfile(
          bundle,
          helpName,
          records[helpName]
        );

        this.state.HelpManager.add(hfile);
      } catch (e) {
        Logger.warn(`\t\t${e.message}`);
        continue;
      }
    }

    Logger.verbose(`\tENDLOAD: Help...`);
  }

  /**
   * @param {string} bundle
   * @param {string} inputEventsDir
   */
  loadInputEvents(bundle, inputEventsDir) {
    Logger.verbose(`\tLOAD: Events...`);
    const files = fs.readdirSync(inputEventsDir);

    for (const eventFile of files) {
      const eventPath = inputEventsDir + eventFile;
      if (!Data.isScriptFile(eventPath, eventFile)) {
        continue;
      }

      const eventName = path.basename(eventFile, path.extname(eventFile));
      const loader = require(eventPath);
      const eventImport = this._getLoader(loader, srcPath);

      this.state.InputEventManager.add(eventName, eventImport.event(this.state));
    }

    Logger.verbose(`\tENDLOAD: Events...`);
  }

  /**
   * @param {string} bundle
   * @param {string} behaviorsDir
   */
  loadBehaviors(bundle, behaviorsDir) {
    Logger.verbose(`\tLOAD: Behaviors...`);

    const loadEntityBehaviors = (type, manager, state) => {
      let typeDir = behaviorsDir + type + '/';

      if (!fs.existsSync(typeDir)) {
        return;
      }

      Logger.verbose(`\t\tLOAD: BEHAVIORS [${type}]...`);
      const files = fs.readdirSync(typeDir);

      for (const behaviorFile of files) {
        const behaviorPath = typeDir + behaviorFile;
        if (!Data.isScriptFile(behaviorPath, behaviorFile)) {
          continue;
        }

        const behaviorName = path.basename(behaviorFile, path.extname(behaviorFile));
        Logger.verbose(`\t\t\tLOAD: BEHAVIORS [${type}] ${behaviorName}...`);
        const loader = require(behaviorPath);
        const behaviorListeners = this._getLoader(loader, srcPath).listeners;

        for (const [eventName, listener] of Object.entries(behaviorListeners)) {
          manager.addListener(behaviorName, eventName, listener(state));
        }
      }
    };

    loadEntityBehaviors('area', this.state.AreaBehaviorManager, this.state);
    loadEntityBehaviors('npc', this.state.MobBehaviorManager, this.state);
    loadEntityBehaviors('item', this.state.ItemBehaviorManager, this.state);
    loadEntityBehaviors('room', this.state.RoomBehaviorManager, this.state);

    Logger.verbose(`\tENDLOAD: Behaviors...`);
  }

  /**
   * @param {string} bundle
   * @param {string} effectsDir
   */
  loadEffects(bundle, effectsDir) {
    Logger.verbose(`\tLOAD: Effects...`);
    const files = fs.readdirSync(effectsDir);

    for (const effectFile of files) {
      const effectPath = effectsDir + effectFile;
      if (!Data.isScriptFile(effectPath, effectFile)) {
        continue;
      }

      const effectName = path.basename(effectFile, path.extname(effectFile));
      const loader = require(effectPath);

      Logger.verbose(`\t\t${effectName}`);
      this.state.EffectFactory.add(effectName, this._getLoader(loader, srcPath), this.state);
    }

    Logger.verbose(`\tENDLOAD: Effects...`);
  }

  /**
   * @param {string} bundle
   * @param {string} skillsDir
   */
  loadSkills(bundle, skillsDir) {
    Logger.verbose(`\tLOAD: Skills...`);
    const files = fs.readdirSync(skillsDir);

    for (const skillFile of files) {
      const skillPath = skillsDir + skillFile;
      if (!Data.isScriptFile(skillPath, skillFile)) {
        continue;
      }

      const skillName = path.basename(skillFile, path.extname(skillFile));
      const loader = require(skillPath);
      let skillImport = this._getLoader(loader, srcPath);
      if (skillImport.run) {
        skillImport.run = skillImport.run(this.state);
      }

      Logger.verbose(`\t\t${skillName}`);
      const skill = new Skill(skillName, skillImport, this.state);

      if (skill.type === SkillType.SKILL) {
        this.state.SkillManager.add(skill);
      } else {
        this.state.SpellManager.add(skill);
      }
    }

    Logger.verbose(`\tENDLOAD: Skills...`);
  }

  /**
   * @param {string} bundle
   * @param {string} serverEventsDir
   */
  loadServerEvents(bundle, serverEventsDir) {
    Logger.verbose(`\tLOAD: Server Events...`);
    const files = fs.readdirSync(serverEventsDir);

    for (const eventsFile of files) {
      const eventsPath = serverEventsDir + eventsFile;
      if (!Data.isScriptFile(eventsPath, eventsFile)) {
        continue;
      }

      const eventsName = path.basename(eventsFile, path.extname(eventsFile));
      Logger.verbose(`\t\t\tLOAD: SERVER-EVENTS ${eventsName}...`);
      const loader = require(eventsPath);
      const eventsListeners = this._getLoader(loader, srcPath).listeners;

      for (const [eventName, listener] of Object.entries(eventsListeners)) {
        this.state.ServerEventManager.add(eventName, listener(this.state));
      }
    }

    Logger.verbose(`\tENDLOAD: Server Events...`);
  }

  /**
   * For a given bundle js file require check if it needs to be backwards compatibly loaded with a loader(srcPath)
   * or can just be loaded on its own
   * @private
   * @param {function (string)|object|array} loader
   * @return {loader}
   */
  _getLoader(loader, ...args) {
    if (typeof loader === 'function') {
      // backwards compatible for old module loader(srcPath)
      return loader(...args);
    }

    return loader;
  }

  /**
   * @private
   * @param {string} bundle
   * @param {string} areaName
   * @return {string}
   */
  _getAreaScriptPath(bundle, areaName) {
    return `${this.bundlesPath}/${bundle}/areas/${areaName}/scripts`;
  }
}

module.exports = BundleManager;
