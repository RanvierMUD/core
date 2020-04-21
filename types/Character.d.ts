import { EffectableEntity } from './EffectableEntity';
import { EffectList } from './EffectList';
import { Inventory } from './Inventory';
import { Metadatable } from './Metadatable';
import { Room } from './Room';
import { EntityReference } from './EntityReference';
import { Item } from './Item';

export declare interface CharacterConfig {
  /** @property {string}     name       Name shown on look/who/login */
  name: string;
  /** @property {Inventory}  inventory */
  inventory: Inventory;
  equipment: Map<string, Item>;
  /** @property {number}     level */
  level: number;
  /** @property {Room}       room       Room the character is currently in */
  room: Room;
  metadata: object;
}

export declare class Character extends Metadatable(EffectableEntity) {
  /** @property {string}     name       Name shown on look/who/login */
  name: string;
  /** @property {Inventory}  inventory */
  inventory: Inventory;
  /** @property {Set}        combatants Enemies this character is currently in combat with */
  combatants: Set<any>;
  /** @property {number}     level */
  level: number;
  /** @property {EffectList} effects    List of current effects applied to the character */
  effects: EffectList;
  /** @property {Room}       room       Room the character is currently in */
  room: Room;

  constructor(data: CharacterConfig);

  /**
   * Start combat with a given target.
   * @param {Character} target
   * @param {?number}   lag    Optional milliseconds of lag to apply before the first attack
   * @fires Character#combatStart
   */
  initiateCombat(target: Character, lag: number): void;

  /**
   * Check to see if this character is currently in combat or if they are
   * currently in combat with a specific character
   * @param {?Character} target
   * @return boolean
   */
  isInCombat(target: Character): boolean;

  /**
   * @param {Character} target
   * @fires Character#combatantAdded
   */
  addCombatant(target: Character): void;

  /**
   * @param {Character} target
   * @fires Character#combatantRemoved
   * @fires Character#combatEnd
   */
  removeCombatant(target: Character): void;

  /**
   * Fully remove this character from combat
   */
  removeFromCombat(): void;

  /**
   * @param {Item} item
   * @param {string} slot Slot to equip the item in
   *
   * @throws EquipSlotTakenError
   * @throws EquipAlreadyEquippedError
   * @fires Character#equip
   * @fires Item#equip
   */
  equip(item: Item, slot: string): void;

  /**
   * Remove equipment in a given slot and move it to the character's inventory
   * @param {string} slot
   *
   * @throws InventoryFullError
   * @fires Item#unequip
   * @fires Character#unequip
   */
  unequip(slot: string): void;

  /**
   * Move an item to the character's inventory
   * @param {Item} item
   */
  addItem(item: Item): void;

  /**
   * Remove an item from the character's inventory. Warning: This does not automatically place the
   * item in any particular place. You will need to manually add it to the room or another
   * character's inventory
   * @param {Item} item
   */
  removeItem(item: Item): void;

  /**
   * Check to see if this character has a particular item by EntityReference
   * @param {EntityReference} itemReference
   * @return {Item|boolean}
   */
  hasItem(itemReference: EntityReference): Item | boolean;

  /**
   * @return {boolean}
   */
  isInventoryFull(): boolean;

  /**
   * Begin following another character. If the character follows itself they stop following.
   * @param {Character} target
   */
  follow(target: Character): void;

  /**
   * Stop following whoever the character was following
   * @fires Character#unfollowed
   */
  unfollow(): void;

  /**
   * @param {Character} follower
   * @fires Character#gainedFollower
   */
  addFollower(follower: Character): void;

  /**
   * @param {Character} follower
   * @fires Character#lostFollower
   */
  removeFollower(follower: Character): void;

  /**
   * @param {Character} target
   * @return {boolean}
   */
  isFollowing(target: Character): boolean;

  /**
   * @param {Character} target
   * @return {boolean}
   */
  hasFollower(target: Character): boolean;

  /**
   * Gather data to be persisted
   * @return {Object}
   */
  serialize(): Object;
}
