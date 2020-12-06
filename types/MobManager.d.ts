import { Npc } from './Npc';

export declare class MobManager {
  constructor();

  /**
   * @param {Npc} mob
   */
  addMob(mob: Npc): void;

  /**
   * Completely obliterate a mob from the game, nuclear option
   * @param {Npc} mob
   */
  removeMob(mob: Npc): void;
}
