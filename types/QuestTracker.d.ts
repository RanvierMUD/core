import { GameState } from './GameState';
import { Player } from './Player';
import { Quest } from './Quest';

export declare type SerializedQuestTracker = {
  completed: Quest[];
  active: Quest[];
};

export declare class QuestTracker {
  /**
   * @param {Player} player
   * @param {Array}  active
   * @param {Array}  completed
   */
  constructor(player: Player, active: Quest[], completed: Quest[]);

  /**
   * Proxy events to all active quests
   * @param {string} event
   * @param {...*}   args
   */
  emit(event: string, ...args: any[]): void;

  /**
   * @param {EntityReference} qid
   * @return {boolean}
   */
  isActive(qid: string): boolean;

  /**
   * @param {EntityReference} qid
   * @return {boolean}
   */
  isComplete(qid: string): boolean;

  get(qid: string): Quest;

  /**
   * @param {EntityReference} qid
   */
  complete(qid: string);

  /**
   * @param {Quest} quest
   */
  start(quest: Quest): void;

  /**
   * @param {GameState} state
   */
  hydrate(state: GameState): void;

  /**
   * @return {object}
   */
  serialize(): SerializedQuestTracker;
}
