'use strict';

/** @module SkillType */
module.exports = {
  /**
   * Used by the core to differentiate between skills and spells.
   * @enum {Symbol}
   */
  SkillType: {
    SKILL: Symbol("SKILL"),
    SPELL: Symbol("SPELL"),
  }
};
