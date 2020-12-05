import { Attribute } from "./Attribute";
import { Character } from "./Character";
import { Damage } from "./Damage";
import { Effect } from "./Effect";
import { GameState } from "./GameState";

export declare class EffectList {
    effects: Set<Object|Effect>;
    target: Character;

    /**
     * @param {Character} target
     * @param {Array<Object|Effect>} effects array of serialized effects (Object) or actual Effect instances
     */
    constructor(target: Character, effects: Array<Object|Effect>): EffectList;

    /**
     * @type {number}
     */
    get size(): number;

    /**
     * Get current list of effects as an array
     * @return {Array<Effect>}
     */
    entries(): Array<Effect>;

    /**
     * @param {string} type
     * @return {boolean}
     */
    hasEffectType(type: string): boolean;

    /**
     * @param {string} type
     * @return {Effect}
     */
    getByType(type: string): Effect;

    /**
     * Proxy an event to all effects
     * @param {string} event
     * @param {...*}   args
     */
    emit(event: string, ...args: Array<any>): void;

    /**
     * @param {Effect} effect
     * @fires Effect#effectAdded
     * @fires Effect#effectStackAdded
     * @fires Effect#effectRefreshed
     * @fires Character#effectAdded
     */
    add(effect: Effect): void;

    /**
     * Deactivate and remove an effect
     * @param {Effect} effect
     * @throws ReferenceError
     * @fires Character#effectRemoved
     */
    remove(effect: Effect): void;

    /**
     * Remove all effects, bypassing all deactivate and remove events
     */
    clear(): void;

    /**
     * Ensure effects are still current and if not remove them
     */
    validateEffects(): void;

    /**
     * Gets the effective "max" value of an attribute (before subtracting delta).
     * Does the work of actaully applying attribute modification
     * @param {Atrribute} attr
     * @return {number}
     */
    evaluateAttribute(attr: Attribute): number;

    /**
     * Gets the effective value of property doing all effect modifications.
     * @param {string} propertyName
     * @param {number} propertyValue
     * @return {number}
     */
    evaluateProperty(propertyName: string, propertyValue: number): number;

    /**
     * @param {Damage} damage
     * @param {number} currentAmount
     * @return {number}
     */
    evaluateIncomingDamage(damage: Damage, currentAmount: number): number;

    /**
     * @param {Damage} damage
     * @param {number} currentAmount
     * @return {number}
     */
    evaluateOutgoingDamage(damage: Damage, currentAmount: number): number;

    serialize(): Array<any>;

    hydrate(state: GameState): void;
}