import { EffectableEntity } from './EffectableEntity';
import { EffectList } from './EffectList';
import { Inventory } from './Inventory';
import { Metadatable } from './Metadatable';
import { Room } from './Room';

export declare class Character extends Metadatable(EffectableEntity) {
  /** @property {string}     name       Name shown on look/who/login */
  name: string;
  /** @property {Inventory}  inventory */
  inventory: Inventory;
  /** @property {Set}        combatants Enemies this character is currently in combat with */
  combatants: Set<any>;
  /** @property {number}     level */
  level: number;
  /** @property {EffectList} effects    List of current effects applied to the character */
  effects: EffectList;
  /** @property {Room}       room       Room the character is currently in */
  room: Room;
}
