'use strict';

const EventEmitter = require('events');
const EffectList = require('./EffectList');
const Attributes = require('./Attributes');

/**
 * Base class for game entities that can have effects/attributes
 * @extends EventEmitter
 */
class EffectableEntity extends EventEmitter
{
  constructor(data) {
    super();

    this.attributes = data.attributes || new Attributes();
    this.effects = new EffectList(this, data.effects);
  }

  /**
   * Proxy all events on the entity to effects
   * @param {string} event
   * @param {...*}   args
   */
  emit(event, ...args) {
    super.emit(event, ...args);

    this.effects.emit(event, ...args);
  }

  /**
   * @param {string} attr Attribute name
   * @return {boolean}
   */
  hasAttribute(attr) {
    return this.attributes.has(attr);
  }

  /**
   * Get current maximum value of attribute (as modified by effects.)
   * @param {string} attr
   * @return {number}
   */
  getMaxAttribute(attr) {
    if (!this.hasAttribute(attr)) {
      throw new RangeError(`Entity does not have attribute [${attr}]`);
    }

    const attribute = this.attributes.get(attr);
    const currentVal = this.effects.evaluateAttribute(attribute);

    if (!attribute.formula) {
      return currentVal;
    }

    const { formula } = attribute;

    const requiredValues = formula.requires.map(
      reqAttr => this.getMaxAttribute(reqAttr)
    );

    return formula.evaluate.apply(formula, [attribute, this, currentVal, ...requiredValues]);
  }

  /**
   * @see {@link Attributes#add}
   */
  addAttribute(attribute) {
    this.attributes.add(attribute);
  }

  /**
   * Get the current value of an attribute (base modified by delta)
   * @param {string} attr
   * @return {number}
  */
  getAttribute(attr) {
    if (!this.hasAttribute(attr)) {
      throw new RangeError(`Entity does not have attribute [${attr}]`);
    }

    return this.getMaxAttribute(attr) + this.attributes.get(attr).delta;
  }

  /**
   * Get the effected value of a given property
   * @param {string} propertyName
   * @return {*}
   */
  getProperty(propertyName) {
    if (!(propertyName in this)) {
      throw new RangeError(`Cannot evaluate uninitialized property [${propertyName}]`);
    }

    let propertyValue = this[propertyName];

    // deep copy non-scalar property values to prevent modifiers from actually
    // changing the original value
    if (typeof propertyValue === 'function' || typeof propertyValue === 'object') {
      propertyValue = JSON.parse(JSON.stringify(propertyValue));
    }

    return this.effects.evaluateProperty(propertyName, propertyValue);
  }

  /**
   * Get the base value for a given attribute
   * @param {string} attrName Attribute name
   * @return {number}
   */
  getBaseAttribute(attrName) {
    const attr = this.attributes.get(attrName);
    return attr && attr.base;
  }

  /**
   * Fired when an Entity's attribute is set, raised, or lowered
   * @event EffectableEntity#attributeUpdate
   * @param {string} attributeName
   * @param {Attribute} attribute
   */

  /**
   * Clears any changes to the attribute, setting it to its base value.
   * @param {string} attr
   * @fires EffectableEntity#attributeUpdate
  */
  setAttributeToMax(attr) {
    if (!this.hasAttribute(attr)) {
      throw new Error(`Invalid attribute ${attr}`);
    }

    this.attributes.get(attr).setDelta(0);
    this.emit('attributeUpdate', attr, this.getAttribute(attr));
  }

  /**
   * Raise an attribute by name
   * @param {string} attr
   * @param {number} amount
   * @see {@link Attributes#raise}
   * @fires EffectableEntity#attributeUpdate
  */
  raiseAttribute(attr, amount) {
    if (!this.hasAttribute(attr)) {
      throw new Error(`Invalid attribute ${attr}`);
    }

    this.attributes.get(attr).raise(amount);
    this.emit('attributeUpdate', attr, this.getAttribute(attr));
  }

  /**
   * Lower an attribute by name
   * @param {string} attr
   * @param {number} amount
   * @see {@link Attributes#lower}
   * @fires EffectableEntity#attributeUpdate
  */
  lowerAttribute(attr, amount) {
    if (!this.hasAttribute(attr)) {
      throw new Error(`Invalid attribute ${attr}`);
    }

    this.attributes.get(attr).lower(amount);
    this.emit('attributeUpdate', attr, this.getAttribute(attr));
  }

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
  setAttributeBase(attr, newBase) {
    if (!this.hasAttribute(attr)) {
      throw new Error(`Invalid attribute ${attr}`);
    }

    this.attributes.get(attr).setBase(newBase);
    this.emit('attributeUpdate', attr, this.getAttribute(attr));
  }

  /**
   * @param {string} type
   * @return {boolean}
   * @see {@link Effect}
   */
  hasEffectType(type) {
    return this.effects.hasEffectType(type);
  }

  /**
   * @param {Effect} effect
   * @return {boolean}
   */
  addEffect(effect) {
    return this.effects.add(effect);
  }

  /**
   * @param {Effect} effect
   * @see {@link Effect#remove}
   */
  removeEffect(effect) {
    this.effects.remove(effect);
  }

  /**
   * @see EffectList.evaluateIncomingDamage
   * @param {Damage} damage
   * @return {number}
   */
  evaluateIncomingDamage(damage, currentAmount) {
    let amount = this.effects.evaluateIncomingDamage(damage, currentAmount);
    return Math.floor(amount);
  }

  /**
   * @see EffectList.evaluateOutgoingDamage
   * @param {Damage} damage
   * @param {number} currentAmount
   * @return {number}
   */
  evaluateOutgoingDamage(damage, currentAmount) {
    return this.effects.evaluateOutgoingDamage(damage, currentAmount);
  }

  /**
   * Initialize the entity from storage
   * @param {GameState} state
   */
  hydrate(state, serialized = {}) {
    if (this.__hydrated) {
      Logger.warn('Attempted to hydrate already hydrated entity.');
      return false;
    }

    if (!(this.attributes instanceof Attributes)) {
      const attributes = this.attributes;
      this.attributes = new Attributes();

      for (const attr in attributes) {
        let attrConfig = attributes[attr];
        if (typeof attrConfig === 'number') {
          attrConfig = { base: attrConfig };
        }

        if (typeof attrConfig !== 'object' || !('base' in attrConfig)) {
          throw new Error('Invalid base value given to attributes.\n' + JSON.stringify(attributes, null, 2));
        }

        if (!state.AttributeFactory.has(attr)) {
          throw new Error(`Entity trying to hydrate with invalid attribute ${attr}`);
        }

        this.addAttribute(state.AttributeFactory.create(attr, attrConfig.base, attrConfig.delta || 0));
      }
    }

    this.effects.hydrate(state);

    // inventory is hydrated in the subclasses because npc and players hydrate their inventories differently

    this.__hydrated = true;
  }

  /**
   * Gather data to be persisted
   * @return {Object}
   */
  serialize() {
    return {
      attributes: this.attributes.serialize(),
      effects: this.effects.serialize(),
    };
  }
}

module.exports = EffectableEntity;

