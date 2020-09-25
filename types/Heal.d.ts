import { Damage } from './Damage';
export declare class Heal extends Damage {
  /**
   * Raise a given attribute
   * @param {Character} target
   * @fires Character#heal
   * @fires Character#healed
   */
  commit(target: Character): void;
}