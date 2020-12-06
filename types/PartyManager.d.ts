import { Party } from './Party';
import { Player } from './Player';

/**
 * Keeps track of active in game parties and is used to create new parties
 * @extends Set
 */
export declare class PartyManager extends Set {
  /**
   * Create a new party from with a given leader
   * @param {Player} leader
   */
  create(leader: Player): void;

  /**
   * @param {Party} party
   */
  disband(party: Party): void;
}
