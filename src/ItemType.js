'use strict';

;

/** @module CommandType */
module.exports = {
  /**
   * @enum {Symbol}
   */
  ItemType: {
    ARMOR: Symbol("ARMOR"),
    CONTAINER: Symbol("CONTAINER"),
    OBJECT: Symbol("OBJECT"),
    POTION: Symbol("POTION"),
    WEAPON: Symbol("WEAPON"),
    RESOURCE: Symbol("RESOURCE"),
  }
};
