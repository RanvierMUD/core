import { Character } from './Character';
import { Damage } from './Damage';
import { EventEmitter } from 'events';
import { GameState } from './GameState';

/** @typedef EffectModifiers {{attributes: !Object<string,function>}} */
export declare type EffectModifiers = {
  attributes: { [key: string]: Function }
};

export declare interface EffectConfig {
  /** @property {boolean} autoActivate If this effect immediately activates itself when added to the target */
  autoActivate: boolean;
  /** @property {boolean} hidden       If this effect is shown in the character's effect list */
  hidden: boolean;
  /** @property {boolean} refreshes    If an effect with the same type is applied it will trigger an effectRefresh  event instead of applying the additional effect. */
  refreshes: boolean;
  /** @property {boolean} unique       If multiple effects with the same `config.type` can be applied at once */
  unique: boolean;
  /** @property {number}  maxStacks    When adding an effect of the same type it adds a stack to the current */
  /**     effect up to maxStacks instead of adding the effect. Implies `config.unique` */
  maxStacks: number;
  /** @property {boolean} persists     If false the effect will not save to the player */
  persists: boolean;
  /** @property {string}  type         The effect category, mainly used when disallowing stacking */
  type: string;
  /** @property {boolean|number} tickInterval Number of seconds between calls to the `updateTick` listener */
  tickInterval: boolean | number;
}

export declare class Effect extends EventEmitter {
  /** @property {EffectConfig}  config Effect configuration (name/desc/duration/etc.) */
  config: EffectConfig;
  /** @property {string}    id     filename minus .js */
  id: string;
  /** @property {EffectModifiers} modifiers Attribute modifier functions */
  modifier: EffectModifiers;
  /** @property {number}    startedAt Date.now() time this effect became active */
  startedAt: number;
  /** @property {object}    state  Configuration of this _type_ of effect (magnitude, element, stat, etc.) */
  state: object;
  /** @property {Character} target Character this effect is... effecting */
  target: Character;

  constructor(id: string, def: object);

  /**
   * @type {string}
   */
  get name(): string;

  /**
   * @type {string}
   */
  get description(): string;

  /**
   * Total duration of effect in milliseconds
   * @property {number}
   */
  get duration(): number;

  set duration(dur: number);

  /**
   * Elapsed time in milliseconds since event was activated
   * @property {number}
   */
  get elapsed(): number;

  /**
   * Remaining time in seconds
   * @property {number}
   */
  get remaining(): number;

  isCurrent(): boolean;

  /**
   * Set this effect active
   * @fires Effect#effectActivated
   */
  activate(): void;

  /**
   * Set this effect active
   * @fires Effect#effectDeactivated
   */
  deactivate(): void;

  /**
   * Remove this effect from its target
   * @fires Effect#remove
   */
  remove(): void;

  /**
   * Stop this effect from having any effect temporarily
   */
  pause(): void;

  /**
   * Resume a paused effect
   */
  resume(): void;

  /**
   * Apply effect attribute modifiers to a given value
   *
   * @param {string} attrName
   * @param {number} currentValue
   * @return {number} attribute value modified by effect
   */
  modifyAttribute(attrName: string, currentValue: number): number;

  /**
   * Apply effect property modifiers to a given value
   *
   * @param {string} propertyName
   * @param {*} currentValue
   * @return {*} property value modified by effect
   */
  modifyProperty(propertyName: string, currentValue: any): any;

  /**
   * @param {Damage} damage
   * @param {number} currentAmount
   * @return {Damage}
   */
  modifyIncomingDamage(damage: Damage, currentAmount: number): Damage;

  /**
   * @param {Damage} damage
   * @param {number} currentAmount
   * @return {Damage}
   */
  modifyOutgoingDamage(damage: Damage, currentAmount: number): Damage;

  /**
   * Gather data to persist
   * @return {Object}
   */
  serialize(): Object;

  /**
   * Reinitialize from persisted data
   * @param {GameState}
   * @param {Object} data
   */
  hydrate(state: GameState, data: Object): void;
}
