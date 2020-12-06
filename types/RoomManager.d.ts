import { Room } from "./Room";

/**
 * Keeps track of all the individual rooms in the game
 */
export declare class RoomManager {
  constructor();

  /**
   * @param {string} entityRef
   * @return {Room}
   */
  getRoom(entityRef: string): Room;

  /**
   * @param {Room} room
   */
  addRoom(room: Room): void;

  /**
   * @param {Room} room
   */
  removeRoom(room: Room): void;
}
