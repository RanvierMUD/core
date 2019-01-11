'use strict';


/** @module SkillFlag */
module.exports = {
  /**
   * Used by the core skills to differentiate between passive and active skills.
   * @enum {Symbol}
   */
  SkillFlag: {
    PASSIVE: Symbol("PASSIVE"),
    ACTIVE: Symbol("ACTIVE"),
  }
};
