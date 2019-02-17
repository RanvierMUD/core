'use strict';

const EventManager = require('./EventManager');
const Effect = require('./Effect');

/** @typedef {{config: Object<string,*>, listeners: Object<String,function (...*)>}} */
var EffectConfig;

/**
 * @property {Map} effects
 */
class EffectFactory {
  constructor() {
    this.effects = new Map();
  }

  /**
   * @param {string} id
   * @param {EffectConfig} config
   * @param {GameState} state
   */
  add(id, config, state) {
    if (this.effects.has(id)) {
      return;
    }

    let definition = Object.assign({}, config);
    delete definition.listeners;
    let listeners = config.listeners || {};
    if (typeof listeners === 'function') {
      listeners = listeners(state);
    }

    const eventManager = new EventManager();
    for (const event in listeners) {
      eventManager.add(event, listeners[event]);
    }

    this.effects.set(id, { definition, eventManager });
  }

  has(id) {
    return this.effects.has(id);
  }

  /**
   * Get a effect definition. Use `create` if you want an instance of a effect
   * @param {string} id
   * @return {object}
   */
  get(id) {
    return this.get(id);
  }

  /**
   * @param {string}  id      effect id
   * @param {?object} config  Effect.config override
   * @param {?object} state   Effect.state override
   * @return {Effect}
   */
  create(id, config = {}, state = {}) {
    const entry = this.effects.get(id);
    let def = Object.assign({}, entry.definition);
    def.config = Object.assign(def.config, config);
    def.state = Object.assign(def.state || {}, state);
    const effect = new Effect(id, def);
    entry.eventManager.attach(effect);

    return effect;
  }
}

module.exports = EffectFactory;
