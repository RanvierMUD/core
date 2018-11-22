'use strict';

const Logger = require('./Logger');

/**
 * Mixin for entities that can have behaviors attached from a BehaviorManager
 * @mixin
 */
const Scriptable = parentClass => class extends parentClass {
  /**
   * @param {string} name
   * @return {boolean}
   */
  hasBehavior(name) {
    return this.behaviors.has(name);
  }

  /**
   * @param {string} name
   * @return {*}
   */
  getBehavior(name) {
    return this.behaviors.get(name);
  }

  /**
   * Attach this entity's behaviors from the manager
   * @param {BehaviorManager} manager
   */
  setupBehaviors(manager) {
    for (let [behaviorName, config] of this.behaviors) {
      let behavior = manager.get(behaviorName);
      if (!behavior) {
        Logger.warn(`No script found for item behavior ${behaviorName}`);
        continue;
      }

      // behavior may be a boolean in which case it will be `behaviorName: true`
      config = config === true ? {} : config;
      behavior.attach(this, config);
    }
  }
};

module.exports = Scriptable;
