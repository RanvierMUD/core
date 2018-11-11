'use strict';

const Attribute = require('./Attribute');

/**
 * @property {Map} attributes
 */
class AttributeFactory {
  constructor() {
    this.attributes = new Map();
  }

  add(name, formula = null) {
    this.attributes.set(name, {
      name,
      formula,
    });
  }

  /**
   * Get a attribute definition. Use `create` if you want an instance of a attribute
   * @param {string} name
   * @return {object}
   */
  get(name) {
    return this.attributes.get(name);
  }

  /**
   * @param {GameState} GameState
   * @param {string} name
   * @param {number} delta
   * @return {Attribute}
   */
  create(GameState, name, delta = 0) {
    if (!this.has(name)) {
      throw new RangeError(`No attribute definition found for [${name}]`);
    }

    const def = this.attributes.get(name);
    if (def.formula && !(def.formula instanceof AttributeFormula)) {
      def.formula = new AttributeFormula(def.formula);
    }

    return new Attribute(name, base, delta, def.formula);
  }
}

module.exports = AttributeFactory;

