export declare class Attribute {
    /** @property {string} name */
    name: string;
    /** @property {number} base */
    base: number;
    /** @property {number} delta Current difference from the base */
    delta: number;
    /** @property {AttributeFormula} formula */
    formula: AttributeFormula;
    /** @property {object} metadata any custom info for this attribute */
    metadata: object;

    constructor(name: string, base: number, delta: number, formula: AttributeFormula, metadata: object);

    /**
     * Lower current value
     * @param {number} amount
     */
    lower(amount: number): void;

    /**
     * Raise current value
     * @param {number} amount
     */
    raise(amount: number): void;

    /**
     * Change the base value
     * @param {number} amount
     */
    setBase(amount: number): void;

    /**
     * Bypass raise/lower, directly setting the delta
     * @param {number} amount
     */
    setDelta(amount: number): void;

    serialize(): object;
}

export declare class AttributeFormula {
    /** @property {Array<string>} requires Array of attributes required for this formula to run */
    requires: Array<string>;
    /** @property {function (...number) : number} formula */
    formula: Function;

    constructor(requires: Array<string>, fn: Function);

    evaluate(attribute, ...args): any;
}