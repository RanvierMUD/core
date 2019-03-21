'use strict';

const Room = require('./Room');
const EntityFactory = require('./EntityFactory');

/**
 * Stores definitions of rooms to allow for easy creation/cloning
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
    const room = this.createByType(area, entityRef, Room);
    room.area = area;
    return room;
  }
}

module.exports = RoomFactory;
