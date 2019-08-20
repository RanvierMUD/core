'use strict';

const Room = require('./Room');

/**
 * Keeps track of all the individual rooms in the game
 */
class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  /**
   * @param {string} entityRef
   * @return {Room}
   */
  getRoom(entityRef, instanceId = null) {
    const ref = this.getInstanceRef(entityRef, instanceId);
    return this.rooms.get(ref);
  }

  /**
   * @param {Room} room
   */
  addRoom(room, instanceId = null) {
    const ref = this.getInstanceRef(room.entityReference, instanceId);
    this.rooms.set(ref, room);
  }

  /**
   * @param {Room} room
   */
  removeRoom(room, instanceId = null) {
    const ref = this.getInstanceRef(room.entityReference, instanceId);
    this.rooms.delete(ref);
  }

  getInstanceRef(entityRef, instanceId = null) {
    return entityRef + (instanceId ? '__' + instanceId : '');
  }
}

module.exports = RoomManager;
