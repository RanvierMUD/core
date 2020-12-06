import { Attribute } from "./Attribute";

export declare class Attributes extends Map {
    /**
     * @param {Attribute} attribute
     */
    add(attribute: Attribute): void;

    /**
     * @return {Iterator} see {@link Map#entries}
     */
    getAttributes(): Iterator<string, object>;

    /**
     * Clear all deltas for all attributes in the list
     */
    clearDeltas(): void;

    /**
     * Gather data that will be persisted
     * @return {Object}
     */
    serialize(): Object;
}