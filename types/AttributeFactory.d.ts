import { Attribute, AttributeFormula } from './Attribute';

export declare class AttributeFactory {
    /** @property {Map} attributes */
    attributes: Map<string, object>;
    constructor();

    /**
     * @param {string} name
     * @param {number} base
     * @param {AttributeFormula} formula
     */
    add(name: string, base: number, formula: AttributeFormula, metadata: object): void

    /**
     * @see Map#has
     */
    has(name: string): boolean;

    /**
     * Get a attribute definition. Use `create` if you want an instance of a attribute
     * @param {string} name
     * @return {object}
     */
    get(name: string): object;

    /**
     * @param {string} name
     * @param {number} delta
     * @return {Attribute}
     */
    create(name: string, base: number, delta: number): Attribute;

    /**
     * Make sure there are no circular dependencies between attributes
     * @throws Error
     */
    validateAttributes(): Map<string, object>;
}