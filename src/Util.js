'use strict';

/** @module Util */
module.exports = {
  /**
   * Check to see if a given object is iterable
   * @param {Object} obj
   * @return {boolean}
   */
  isIterable(obj) {
    return obj && typeof obj[Symbol.iterator] === 'function';
  }
};
