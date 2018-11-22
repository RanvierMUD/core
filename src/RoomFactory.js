'use strict';

const Room = require('./Room');
const EntityFactory = require('./EntityFactory');

/**
 * Stores definitions of npcs to allow for easy creation/cloning
 * @extends EntityFactory
 */
class RoomFactory extends EntityFactory {
  /**
   * Create a new instance of a given room. Room will not be hydrated
   *
   * @param {Area}   area
   * @param {string} entityRef
   * @return {Room}
   */
  create(area, entityRef) {
    const npc = this.createByType(area, entityRef, Room);
    npc.area = area;
    return npc;
  }
}

module.exports = RoomFactory;
