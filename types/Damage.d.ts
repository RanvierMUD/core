import { Attribute } from "./Attribute";
import { Character } from "./Character";

export declare class Damage {
    attribute: Attribute;
    amount: number;
    attacker?: Character;
    source?: any;
    metadata?: object;

    /**
     * @param {string} attribute Attribute the damage is going to apply to
     * @param {number} amount
     * @param {Character} [attacker=null] Character causing the damage
     * @param {*} [source=null] Where the damage came from: skill, item, room, etc.
     * @property {Object} metadata Extra info about the damage: type, hidden, critical, etc.
     */
    constructor(attribute: string, amount: number, attacker?: Character, source?: any, metadata?: object);

    /**
     * Evaluate actual damage taking attacker/target's effects into account
     * @param {Character} target
     * @return {number} Final damage amount
     */
    evaluate(target: Character): number;

    /**
     * Actually lower the attribute
     * @param {Character} target
     * @fires Character#hit
     * @fires Character#damaged
     */
    commit(target: Character): void;
}