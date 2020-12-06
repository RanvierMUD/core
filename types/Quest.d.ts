import { EventEmitter } from 'events';
import { GameState } from './GameState';
import { Player } from './Player';
import { QuestGoal } from './QuestGoal';
import { QuestReward } from './QuestReward';

export declare type QuestConfig = {
    title: string;
    description: string,
    completionMessage: string | null,
    requires: string[],
    level: number,
    autoComplete: boolean,
    repeatable: boolean,
    rewards: QuestReward[],
    goals: QuestGoal[]

}

/**
 * @property {object} config Default config for this quest, see individual quest types for details
 * @property {Player} player
 * @property {object} state  Current completion state
 * @extends EventEmitter
 */
export declare class Quest extends EventEmitter {
  constructor(GameState: GameState, id: string, config: QuestConfig, player: Player);

  /**
   * Proxy all events to all the goals
   * @param {string} event
   * @param {...*}   args
   */
  emit(event, ...args);

  addGoal(goal);

  /**
   * @fires Quest#turn-in-ready
   * @fires Quest#progress
   */
  onProgressUpdated();

  /**
   * @return {{ percent: number, display: string }}
   */
  getProgress();

  /**
   * Save the current state of the quest on player save
   * @return {object}
   */
  serialize();

  hydrate();

  /**
   * @fires Quest#complete
   */
  complete();
}
