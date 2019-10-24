'use strict';

const EntityLoader = require('./EntityLoader');

/**
 * Holds instances of configured DataSources
 * @type {Map<string, DataSource>}
 */
class DataSourceRegistry extends Map {
  /**
   * @param {Function} requireFn used to require() the loader
   * @param {string} rootPath project root
   * @param {object} config configuration to load
   */
  load(requireFn, rootPath, config = {}) {
    for (const [name, settings] of Object.entries(config)) {
      if (!settings.hasOwnProperty('require')) {
        throw new Error(`DataSource [${name}] does not specify a 'require'`);
      }

      if (typeof settings.require !== 'string') {
        throw new TypeError(`DataSource [${name}] has an invalid 'require'`);
      }

      const sourceConfig = settings.config || {};

      const datasource = this._resolveRequire(
        requireFn,
        rootPath,
        settings.require
      );

      const instance = new datasource(sourceConfig, rootPath);
      if (!('hasData' in instance)) {
        throw new Error(`Data Source ${name} requires at minimum a 'hasData(config): boolean' method`);
      }
      instance.name = name;

      this.set(name, instance);

      // resolve loader extension, if one is set for this DataSource
      if (!settings.extendLoader) continue;

      if (typeof settings.extendLoader !== "string") {
        throw new Error(
          `Data Source "${name}" defines an invalid "extendLoader" option`
        );
      }

      const loaderExtension = this._resolveRequire(
        requireFn,
        rootPath,
        settings.extendLoader
      );

      instance._loader = loaderExtension(EntityLoader);
    }
  }

  /**
   * @private
   * @param {function} requireFn 
   * @param {string} rootPath 
   * @param {string} requirePath 
   */
  _resolveRequire(requireFn, rootPath, requirePath) {
    if (requirePath[0] === ".") {
      return require(rootPath + "/" + requirePath);
    } else if (!requirePath.includes(".")) {
      return require(requirePath);
    } else {
      const [moduleName, exportName] = requirePath.split(".");
      return requireFn(moduleName)[exportName];
    }
  }
}

module.exports = DataSourceRegistry;
