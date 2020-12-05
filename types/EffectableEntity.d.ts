import { EventEmitter } from 'events';
import { Damage } from './Damage';
import { Effect } from './Effect';
import { GameState } from './GameState';

export declare class EffectableEntity extends EventEmitter {
    constructor(data): EffectableEntity;

    /**
     * Proxy all events on the entity to effects
     * @param {string} event
     * @param {...*}   args
     */
    emit(event: string, ...args: any[]): void;

    /**
     * @param {string} attr Attribute name
     * @return {boolean}
     */
    hasAttribute(attr: string): boolean;

    /**
     * Get current maximum value of attribute (as modified by effects.)
     * @param {string} attr
     * @return {number}
     */
    getMaxAttribute(attr: string): number;

    /**
     * @see {@link Attributes#add}
     */
    addAttribute(attribute): void;

    /**
     * Get the current value of an attribute (base modified by delta)
     * @param {string} attr
     * @return {number}
     */
    getAttribute(attr: string): number;

    /**
     * Get the effected value of a given property
     * @param {string} propertyName
     * @return {*}
     */
    getProperty(propertyName: string): any;

    /**
     * Get the base value for a given attribute
     * @param {string} attrName Attribute name
     * @return {number}
     */
    getBaseAttribute(attrName: string): number;

    /**
     * Clears any changes to the attribute, setting it to its base value.
     * @param {string} attr
     * @fires EffectableEntity#attributeUpdate
     */
    setAttributeToMax(attr: string): void;

    /**
     * Raise an attribute by name
     * @param {string} attr
     * @param {number} amount
     * @see {@link Attributes#raise}
     * @fires EffectableEntity#attributeUpdate
     */
    raiseAttribute(attr: string, amount: number): void;

    /**
     * Lower an attribute by name
     * @param {string} attr
     * @param {number} amount
     * @see {@link Attributes#lower}
     * @fires EffectableEntity#attributeUpdate
     */
    lowerAttribute(attr: string, amount: number): void;

    /**
     * Update an attribute's base value.
     *
     * NOTE: You _probably_ don't want to use this the way you think you do. You should not use this
     * for any temporary modifications to an attribute, instead you should use an Effect modifier.
     *
     * This will _permanently_ update the base value for an attribute to be used for things like a
     * player purchasing a permanent upgrade or increasing a stat on level up
     *
     * @param {string} attr Attribute name
     * @param {number} newBase New base value
     * @fires EffectableEntity#attributeUpdate
     */
    setAttributeBase(attr: string, newBase: number): void;

    /**
     * @param {string} type
     * @return {boolean}
     * @see {@link Effect}
     */
    hasEffectType(type: string): boolean;

    /**
     * @param {Effect} effect
     * @see {@link Effect#remove}
     */
    removeEffect(effect: Effect): void;

    /**
     * @see EffectList.evaluateIncomingDamage
     * @param {Damage} damage
     * @param {number} currentAmount
     * @return {number}
     */
    evaluateIncomingDamage(damage: Damage, currentAmount: number): number;

    /**
     * @see EffectList.evaluateOutgoingDamage
     * @param {Damage} damage
     * @param {number} currentAmount
     * @return {number}
     */
    evaluateOutgoingDamage(damage: Damage, currentAmount: number): number;

    /**
     * Initialize the entity from storage
     * @param {GameState} state
     * @param {object} serialized
     */
    hydrate(state: GameState, serialized: object = {}): void;

    /**
     * Gather data to be persisted
     * @return {EffectableEntity}
     */
    serialize(): EffectableEntity;
}