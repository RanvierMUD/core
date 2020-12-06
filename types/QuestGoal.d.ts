import { EventEmitter } from 'events';
import { GameState } from './GameState';
import { Player } from './Player';
import { Quest } from './Quest';

export declare type QuestGoalConfig = {};
export declare type QuestGoalProgress = {
  percent: number;
  display: string;
};
export declare type QuestGoalSerialized = {
  state: GameState;
  progress: QuestGoalProgress;
  config: QuestGoalConfig;
};

export declare class QuestGoal extends EventEmitter {
  /**
   * @param {Quest} quest Quest this goal is for
   * @param {object} config
   * @param {Player} player
   */
  constructor(quest: Quest, config: QuestGoalConfig, player: Player);

  /**
   * @return {{ percent: number, display: string}}
   */
  getProgress(): QuestGoalProgress;

  /**
   * Put any cleanup activities after the quest is finished here
   */
  complete(): void;

  serialize(): QuestGoalSerialized;
}
