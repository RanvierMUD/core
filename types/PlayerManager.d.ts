import EventEmitter from 'events';

import { Account } from './Account';
import { EntityLoader } from './EntityLoader';
import { EventManager } from './EventManager';
import { GameState } from './GameState';
import { Player } from './Player';

export declare class PlayerManager extends EventEmitter {
  players: Map<string, Player>;
  events: EventManager;
  loader: EntityLoader | null;

  /**
   * Set the entity loader from which players are loaded
   * @param {EntityLoader}
   */
  setLoader(loader: EntityLoader): void;

  getPlayer(name: string): Player;

  addPlayer(player: Player): void;

  /**
   * Remove the player from the game. WARNING: You must manually save the player first
   * as this will modify serializable properties
   */
  removePlayer(player: Player, killSocket?: boolean): void;

  getPlayersAsArray(): Player[];

  addListener(event: string, listener: function): void;

  filter(fn: (current: Player, index: string | number, array: Player[]) => boolean): Player[];

  /**
   * Load a player for an account
   * @param {GameState} state
   * @param {Account} account
   * @param {string} username
   * @param {boolean} force true to force reload from storage
   * @return {Player}
   */
  loadPlayer(state: GameState, account: Account, username: string, force?: boolean): Promise<Player>;

  /**
   * Turn player into a key used by this class's map
   * @param {Player} player
   * @return {string}
   */
  keyify(player: Player): string;

  exists(name: string): boolean;

  /**
   * Save a player
   * @fires Player#save
   */
  save(player: Player): Promise<void>;

  /**
   * Save all players
   * @fires Player#save
   */
  saveAll(): Promise<void>;

  /**
   * @fires Player#updateTick
   */
  tickAll(): void;

  /**
   * Used by Broadcaster
   */
  getBroadcastTargets(): Player;
}
