import { Area } from './Area';
import { EntityFactory } from './EntityFactory';
import { Room } from './Room';

/**
 * Stores definitions of rooms to allow for easy creation/cloning
 * @extends EntityFactory
 */
export declare class RoomFactory extends EntityFactory {
  /**
   * Create a new instance of a given room. Room will not be hydrated
   *
   * @param {Area}   area
   * @param {string} entityRef
   * @return {Room}
   */
  create(area: Area, entityRef: string): Room;
}
