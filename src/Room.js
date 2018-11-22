'use strict';

const GameEntity = require('./GameEntity');
const Logger = require('./Logger');

/**
 * @property {Area}          area         Area room is in
 * @property {{x: number, y: number, z: number}} [coordinates] Defined in yml with array [x, y, z]. Retrieved with coordinates.x, coordinates.y, ...
 * @property {Array<number>} defaultItems Default list of item ids that should load in this room
 * @property {Array<number>} defaultNpcs  Default list of npc ids that should load in this room
 * @property {string}        description  Room description seen on 'look'
 * @property {Array<object>} exits        Exits out of this room { id: number, direction: string, leaveMessage: string }
 * @property {number}        id           Area-relative id (vnum)
 * @property {Set}           items        Items currently in the room
 * @property {Set}           npcs         Npcs currently in the room
 * @property {Set}           players      Players currently in the room
 * @property {string}        script       Name of custom script attached to this room
 * @property {string}        title        Title shown on look/scan
 * @property {object}        doors        Doors restricting access to this room. See documentation for format
 *
 * @extends GameEntity
 */
class Room extends GameEntity {
  constructor(area, def) {
    super();
    const required = ['title', 'description', 'id'];
    for (const prop of required) {
      if (!(prop in def)) {
        throw new Error(`ERROR: AREA[${area.name}] Room does not have required property ${prop}`);
      }
    }

    this.def = def;
    this.area = area;
    this.defaultItems = def.items || [];
    this.defaultNpcs  = def.npcs || [];
    this.metadata = def.metadata || {};
    this.script = def.script;
    this.behaviors = new Map(Object.entries(def.behaviors || {}));
    this.coordinates = Array.isArray(def.coordinates) && def.coordinates.length === 3 ? {
      x: def.coordinates[0],
      y: def.coordinates[1],
      z: def.coordinates[2],
    } : null;
    this.description = def.description;
    this.entityReference = this.area.name + ':' + def.id;
    this.exits = def.exits || [];
    this.id = def.id;
    this.title = def.title;
    // create by-val copies of the doors config so the lock/unlock don't accidentally modify the original definition
    this.doors = new Map(Object.entries(JSON.parse(JSON.stringify(def.doors || {}))));
    this.defaultDoors = def.doors;

    this.items = new Set();
    this.npcs = new Set();
    this.players = new Set();

    /**
     * spawnedNpcs keeps track of NPCs even when they leave the room for the purposes of respawn. So if we spawn NPC A
     * into the room and it walks away we don't want to respawn the NPC until it's killed or otherwise removed from the
     * area
     */
    this.spawnedNpcs = new Set();
  }

  /**
   * Emits event on self and proxies certain events to other entities in the room.
   * @param {string} eventName
   * @param {...*} args
   * @return {void}
   */
  emit(eventName, ...args) {
    super.emit(eventName, ...args);

    const proxiedEvents = [
      'playerEnter',
      'playerLeave'
    ];

    if (proxiedEvents.includes(eventName)) {
      const entities = [...this.npcs, ...this.players, ...this.items];
      for (const entity of entities) {
        entity.emit(eventName, ...args);
      }
    }
  }

  /**
   * @param {Player} player
   */
  addPlayer(player) {
    this.players.add(player);
  }

  /**
   * @param {Player} player
   */
  removePlayer(player) {
    this.players.delete(player);
  }

  /**
   * @param {Npc} npc
   */
  addNpc(npc) {
    this.npcs.add(npc);
    npc.room = this;
    this.area.addNpc(npc);
  }

  /**
   * @param {Npc} npc
   */
  removeNpc(npc) {
    this.npcs.delete(npc);
    // NOTE: It is _very_ important that the NPC's room is set to null before the Area.removeNpc call
    // otherwise the area will also remove it from its originating room spawn list and will try
    // to respawn it. Not good
    npc.room = null;
    this.area.removeNpc(npc);
  }

  /**
   * @param {Item} item
   */
  addItem(item) {
    this.items.add(item);
    item.room = this;
  }

  /**
   * @param {Item} item
   */
  removeItem(item) {
    this.items.delete(item);
    item.room = null;
  }

  /**
   * Check to see if this room has a door preventing movement from `fromRoom` to here
   * @param {Room} fromRoom
   * @return {boolean}
   */
  hasDoor(fromRoom) {
    return this.doors.has(fromRoom.entityReference);
  }

  /**
   * @param {Room} fromRoom
   * @return {{lockedBy: EntityReference, locked: boolean, closed: boolean}}
   */
  getDoor(fromRoom) {
    if (!fromRoom) {
      return null;
    }
    return this.doors.get(fromRoom.entityReference);
  }

  /**
   * Check to see of the door for `fromRoom` is locked
   * @param {Room} fromRoom
   * @return {boolean}
   */
  isDoorLocked(fromRoom) {
    const door = this.getDoor(fromRoom);
    if (!door) {
      return false;
    }

    return door.locked;
  }

  /**
   * @param {Room} fromRoom
   * @fires Room#doorOpened
   */
  openDoor(fromRoom) {
    const door = this.getDoor(fromRoom);
    if (!door) {
      return;
    }

    /**
     * @event Room#doorOpened
     * @param {Room} fromRoom
     * @param {object} door
     */
    this.emit('doorOpened', fromRoom, door);
    door.closed = false;
  }

  /**
   * @param {Room} fromRoom
   * @throws DoorLockedError
   * @fires Room#doorClosed
   */
  closeDoor(fromRoom) {
    const door = this.getDoor(fromRoom);
    if (!door) {
      return;
    }

    /**
     * @event Room#doorClosed
     * @param {Room} fromRoom
     * @param {object} door
     */
    this.emit('doorClosed', fromRoom, door);
    door.closed = true;
  }

  /**
   * @param {Room} fromRoom
   * @fires Room#doorUnlocked
   */
  unlockDoor(fromRoom) {
    const door = this.getDoor(fromRoom);
    if (!door) {
      return;
    }

    /**
     * @event Room#doorUnlocked
     * @param {Room} fromRoom
     * @param {object} door
     */
    this.emit('doorUnlocked', fromRoom, door);
    door.locked = false;
  }

  /**
   * @param {Room} fromRoom
   * @fires Room#doorUnlocked
   */
  lockDoor(fromRoom) {
    const door = this.getDoor(fromRoom);
    if (!door) {
      return;
    }

    this.closeDoor(fromRoom);
    /**
     * @event Room#doorUnlocked
     * @param {Room} fromRoom
     * @param {object} door
     */
    this.emit('doorLocked', fromRoom, door);
    door.locked = true;
  }

  /**
   * @param {GameState} state
   * @param {string} entityRef
   */
  spawnItem(state, entityRef) {
    Logger.verbose(`\tSPAWN: Adding item [${entityRef}] to room [${this.title}]`);
    const newItem = state.ItemFactory.create(this.area, entityRef);
    newItem.hydrate(state);
    newItem.sourceRoom = this;
    state.ItemManager.add(newItem);
    this.addItem(newItem);
    /**
     * @event Item#spawn
     */
    newItem.emit('spawn');
  }

  /**
   * @param {GameState} state
   * @param {string} entityRef
   * @fires Npc#spawn
   * @return {Npc}
   */
  spawnNpc(state, entityRef) {
    Logger.verbose(`\tSPAWN: Adding npc [${entityRef}] to room [${this.title}]`);
    const newNpc = state.MobFactory.create(this.area, entityRef);
    newNpc.hydrate(state);
    newNpc.sourceRoom = this;
    this.area.addNpc(newNpc);
    this.addNpc(newNpc);
    this.spawnedNpcs.add(newNpc);
    /**
     * @event Npc#spawn
     */
    newNpc.emit('spawn');
    return newNpc;
  }

  /**
   * @param {Npc} npc
   */
  removeSpawnedNpc(npc) {
    this.spawnedNpcs.delete(npc);
  }

  hydrate(state) {
    this.setupBehaviors(state.RoomBehaviorManager);

    this.items = new Set();

    // NOTE: This method effectively defines the fact that items/npcs do not
    // persist through reboot unless they're stored on a player.
    // If you would like to change that functionality this is the place

    this.defaultItems.forEach(defaultItem => {
      if (typeof defaultItem === 'string') {
        defaultItem = { id: defaultItem };
      }

      this.spawnItem(state, defaultItem.id);
    });

    this.defaultNpcs.forEach(defaultNpc => {
      if (typeof defaultNpc === 'string') {
        defaultNpc = { id: defaultNpc };
      }

      try {
        this.spawnNpc(state, defaultNpc.id);
      } catch (err) {
        Logger.error(err);
      }
    });
  }

  /**
   * Used by Broadcaster
   * @return {Array<Character>}
   */
  getBroadcastTargets() {
    return Array.from(this.players.values());
  }
}

module.exports = Room;
