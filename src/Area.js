'use strict';

const GameEntity = require('./GameEntity');
const AreaFloor = require('./AreaFloor');

/**
 * Representation of an in game area
 * See the {@link http://ranviermud.com/extending/areas/|Area guide} for documentation on how to
 * actually build areas.
 *
 * @property {string} bundle Bundle this area comes from
 * @property {string} name
 * @property {string} title
 * @property {string} script A custom script for this item
 * @property {Map}    map a Map object keyed by the floor z-index, each floor is an array with [x][y] indexes for coordinates.
 * @property {Map<string, Room>} rooms Map of room id to Room
 * @property {Set<Npc>} npcs Active NPCs that originate from this area. Note: this is NPCs that
 *   _originate_ from this area. An NPC may not actually be in this area at any given moment.
 * @property {Object} info Area configuration
 * @property {Number} lastRespawnTick milliseconds since last respawn tick. See {@link Area#update}
 *
 * @extends GameEntity
 */
class Area extends GameEntity {
  constructor(bundle, name, manifest) {
    super();
    this.bundle = bundle;
    this.name = name;
    this.title = manifest.title;
    this.metadata = manifest.metadata || {};
    this.rooms = new Map();
    this.npcs = new Set();
    this.map = new Map();
    this.script = manifest.script;
    this.behaviors = new Map(Object.entries(manifest.behaviors || {}));

    this.on('updateTick', state => {
      this.update(state);
    });
  }

  /**
   * Get ranvier-root-relative path to this area
   * @return {string}
   */
  get areaPath() {
    return `${this.bundle}/areas/${this.name}`;
  }

  /**
   * Get an ordered list of floors in this area's map
   * @return {Array<number>}
   */
  get floors() {
    return [...this.map.keys()].sort();
  }


  /**
   * @param {string} id Room id
   * @return {Room|undefined}
   */
  getRoomById(id) {
    return this.rooms.get(id);
  }

  /**
   * @param {Room} room
   * @fires Area#roomAdded
   */
  addRoom(room) {
    this.rooms.set(room.id, room);

    if (room.coordinates) {
      this.addRoomToMap(room);
    }

    /**
     * @event Area#roomAdded
     * @param {Room} room
     */
    this.emit('roomAdded', room);
  }

  /**
   * @param {Room} room
   * @fires Area#roomRemoved
   */
  removeRoom(room) {
    this.rooms.delete(room.id);

    /**
     * @event Area#roomRemoved
     * @param {Room} room
     */
    this.emit('roomRemoved', room);
  }

  /**
   * @param {Room} room
   * @throws Error
   */
  addRoomToMap(room) {
    if (!room.coordinates) {
      throw new Error('Room does not have coordinates');
    }

    const {x, y, z} = room.coordinates;

    if (!this.map.has(z)) {
      this.map.set(z, new AreaFloor(z));
    }

    const floor = this.map.get(z);
    floor.addRoom(x, y, room);
  }

  /**
   * find a room at the given coordinates for this area
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @return {Room|boolean}
   */
  getRoomAtCoordinates(x, y, z) {
    const floor = this.map.get(z);
    return floor && floor.getRoom(x, y);
  }

  /**
   * @param {Npc} npc
   */
  addNpc(npc) {
    this.npcs.add(npc);
  }

  /**
   * Removes an NPC from the area. NOTE: This must manually remove the NPC from its room as well
   * @param {Npc} npc
   */
  removeNpc(npc) {
    this.npcs.delete(npc);
  }

  /**
   * This method is automatically called every N milliseconds where N is defined in the
   * `setInterval` call to `GameState.AreaMAnager.tickAll` in the `ranvier` executable. It, in turn,
   * will fire the `updateTick` event on all its rooms and npcs
   * 
   * @param {GameState} state
   * @fires Room#updateTick
   * @fires Npc#updateTick
   */
  update(state) {
    for(const [id, room] of this.rooms) {
      /**
       * @see Area#update
       * @event Room#updateTick
       */
      room.emit('updateTick');
    }

    for (const npc of this.npcs) {
      /**
       * @see Area#update
       * @event Npc#updateTick
       */
      npc.emit('updateTick');
    }
  }

  hydrate(state) {
    this.setupBehaviors(state.AreaBehaviorManager);
    const { rooms } = state.AreaFactory.getDefinition(this.name);
    for (const roomRef of rooms) {
      const room = state.RoomFactory.create(this, roomRef);
      this.addRoom(room);
      state.RoomManager.addRoom(room);
      room.hydrate(state);
    }
  }
}

module.exports = Area;
