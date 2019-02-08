'use strict';

/**
 * Contain/look up helpfiles
 */
class HelpManager {
  constructor() {
    this.helps = new Map();
  }

  /**
   * @param {string} help Helpfile name
   */
  get(help) {
    return this.helps.get(help);
  }

  /**
   * @param {Helpfile} help
   */
  add(help) {
    this.helps.set(help.name, help);
  }

  /**
   * @param {string} search
   * @return {Help}
   */
  find(search) {
    const results = new Map();
    for (const [name, help] of this.helps.entries()) {
      if (name.indexOf(search) === 0) {
        results.set(name, help);
        continue;
      }
      if (help.keywords.some(keyword => keyword.includes(search))) {
        results.set(name, help);
      }
    }
    return results;
  }

  /**
   * Returns first help matching keywords
   * @param {string} help Helpfile name
   */
  getFirst(help) {
    const results = this.find(help);

    if (!results.size) {
      /**
       * No results found
       */
      return;
    }

    const [_, hfile] = [...results][0];

    return hfile;
  }
}

module.exports = HelpManager;
