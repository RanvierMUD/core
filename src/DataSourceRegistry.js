'use strict';

/**
 * Holds instances of configured DataSources
 * @type {Map<string, DataSource>}
 */
class DataSourceRegistry extends Map {
  /**
   * @param {string} rootPath project root
   * @param {object} config configuration to load
   */
  load(rootPath, config = {}) {
    for (const [name, settings] of Object.entries(config)) {
      if (!settings.hasOwnProperty('require')) {
        throw new Error(`DataSource [${name}] does not specify a 'require'`);
      }

      if (typeof settings.require !== 'string') {
        throw new TypeError(`DataSource [${name}] has an invalid 'require'`);
      }

      const sourceConfig = settings.config || {};

      let loader = null;

      // relative path to require
      if (settings.require[0] === '.') {
        loader = require(rootPath + '/' + settings.require);
      } else if (!settings.require.includes('.')) {
        loader = require(settings.require);
      } else {
        const [moduleName, exportName] = settings.require.split('.');
        loader = require(moduleName)[exportName];
      }

      const instance = new loader(sourceConfig, rootPath);
      instance.name = name;

      this.set(name, instance);
    }
  }
}

module.exports = DataSourceRegistry;
