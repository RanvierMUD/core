import { Command } from './Command';
import { EntityFactory } from './EntityFactory';
import { GameState } from './GameState';

export declare class BundleManager {
    /**
     * @param {GameState} state
     */
    constructor(path: string, state: GameState);

    /**
     * Load in all bundles
     */
    loadBundles(distribute?: boolean): Promise<any>;

    /**
     * @param {string} bundle Bundle name
     * @param {string} bundlePath Path to bundle directory
     */
    loadBundle(bundle: string, bundlePath: string): Promise<any>;

    loadQuestGoals(bundle: string, goalsDir: string): void;

    loadQuestRewards(bundle: string, rewardsDir: string): void;

    /**
     * Load attribute definitions
     * @param {string} bundle
     * @param {string} attributesFile
     */
    loadAttributes(bundle: string, attributesFile: string): void;

    /**
     * Load/initialize player. See the {@link http://ranviermud.com/extending/input_events/|Player Event guide}
     * @param {string} bundle
     * @param {string} eventsFile event js file to load
     */
    loadPlayerEvents(bundle: string, eventsFile: string): void;

    /**
     * @param {string} bundle
     */
    loadAreas(bundle: string): Promise<any>;

    /**
     * @param {string} bundle
     * @param {string} areaName
     * @param {string} areaPath
     */
    loadArea(bundle: string, areaName: string, manifest: string): Promise<any>;

    /**
     * Load an entity (item/npc/room) from file
     * @param {string} bundle
     * @param {string} areaName
     * @param {string} type
     * @param {EntityFactory} factory
     * @return {Array<string>}
     */
    loadEntities(bundle: string, areaName: string, type: string, factory: EntityFactory): Promise<string[]>;

    /**
     * @param {EntityFactory} factory Instance of EntityFactory that the item/npc will be loaded into
     * @param {string} entityRef
     * @param {string} scriptPath
     */
    loadEntityScript(factory: EntityFactory, entityRef: string, scriptPath: string): void;

    /**
     * @param {string} bundle
     * @param {string} areaName
     * @return {Promise<Array<string>>}
     */
    loadQuests(bundle: string, areaName: string): Promise<string[]>

    /**
     * @param {string} bundle
     * @param {string} commandsDir
     */
    loadCommands(bundle: string, commandsDir: string): void;

    /**
     * @param {string} commandPath
     * @param {string} commandName
     * @param {string} bundle
     * @return {Command}
     */
    createCommand(commandPath: string, commandName: string, bundle: string): Command;

    /**
     * @param {string} bundle
     * @param {string} channelsFile
     */
    loadChannels(bundle: string, channelsFile: string): void;

    /**
     * @param {string} bundle
     */
    loadHelp(bundle: string): Promise<any>;

    /**
     * @param {string} bundle
     * @param {string} inputEventsDir
     */
    loadInputEvents(bundle: string, inputEventsDir: string): void;

    /**
     * @param {string} bundle
     * @param {string} behaviorsDir
     */
    loadBehaviors(bundle: string, behaviorsDir: string): void;

    /**
     * @param {string} bundle
     * @param {string} effectsDir
     */
    loadEffects(bundle: string, effectsDir: string): void;

    /**
     * @param {string} bundle
     * @param {string} skillsDir
     */
    loadSkills(bundle: string, skillsDir: string): void;

    /**
     * @param {string} bundle
     * @param {string} serverEventsDir
     */
    loadServerEvents(bundle: string, serverEventsDir: string): void;
}