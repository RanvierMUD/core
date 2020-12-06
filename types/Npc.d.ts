import { Area } from './Area';
import { Character, CharacterConfig } from './Character';
import { GameState } from './GameState';
import { Room } from './Room';
import { Scriptable } from './Scriptable';

/**
 * @property {number} id   Area-relative id (vnum)
 * @property {Area}   area Area npc belongs to (not necessarily the area they're currently in)
 * @property {Map} behaviors
 * @extends Character
 * @mixes Scriptable
 */
export declare class Npc extends Scriptable(Character) {
  constructor(area: Area, data: CharacterConfig);

  /**
   * Move the npc to the given room, emitting events appropriately
   * @param {Room} nextRoom
   * @param {function} onMoved Function to run after the npc is moved to the next room but before enter events are fired
   * @fires Room#npcLeave
   * @fires Room#npcEnter
   * @fires Npc#enterRoom
   */
  moveTo(nextRoom: Room, onMoved: Function): void;

  hydrate(state: GameState): void;

  get isNpc(): boolean;
}
