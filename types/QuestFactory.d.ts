import { GameState } from './GameState';
import { Player } from './Player';
import { Quest, QuestConfig } from './Quest';

export declare class QuestFactory {
  constructor();

  add(areaName: string, id: string, config: QuestConfig);

  set(qid: string, val: QuestConfig);

  /**
   * Get a quest definition. Use `create` if you want an instance of a quest
   * @param {string} qid
   * @return {object}
   */
  get(qid: string): Quest;

  /**
   * Check to see if a player can start a given quest based on the quest's
   * prerequisite quests
   * @param {entityReference} questRef
   * @return {boolean}
   */
  canStart(player: Player, questRef: string);

  /**
   * @param {GameState} GameState
   * @param {entityReference} qid
   * @param {Player}    player
   * @param {Array}     state     current quest state
   * @return {Quest}
   */
  create(
    GameState: GameState,
    qid: string,
    player: Player,
    state: any[]
  ): Quest;

  /**
   * @param {string} areaName
   * @param {number} id
   * @return {string}
   */
  makeQuestKey(area: string, id: number): string;
}
