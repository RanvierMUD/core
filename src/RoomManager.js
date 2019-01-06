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
  getRoom(entityRef) {
    return this.rooms.get(entityRef);
  }

  /**
   * @param {Room} room
   */
  addRoom(room) {
    this.rooms.set(room.entityReference, room);
  }

  /**
   * @param {Room} room
   */
  removeRoom(room) {
    this.rooms.delete(room.entityReference);
  }
}

module.exports = RoomManager;
