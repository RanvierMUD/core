import { GameState } from './GameState';
import { Player } from './Player';
import { Quest } from './Quest';

export declare type QuestRewardConfig = {};

/**
 * Representation of a quest reward
 * The {@link http://ranviermud.com/extending/areas/quests/|Quest guide} has instructions on to
 * create new reward type for quests
 */
export declare class QuestReward {
  /**
   * Assign the reward to the player
   * @param {GameState} GameState
   * @param {Quest} quest   quest this reward is being given from
   * @param {object} config
   * @param {Player} player
   */
  static reward(
    GameState: GameState,
    quest: Quest,
    config: QuestRewardConfig,
    player: Player
  ): void;

  /**
   * Render the reward
   * @return string
   */
  static display(
    GameState: GameState,
    quest: Quest,
    config: QuestRewardConfig,
    player: Player
  ): string;
}
