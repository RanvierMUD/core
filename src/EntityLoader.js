'use strict';

/**
 * Used to CRUD an entity from a configured DataSource
 */
class EntityLoader {
  /**
   * @param {DataSource}
   * @param {object} config
   */
  constructor(dataSource, config = {}) {
    this.dataSource = dataSource;
    this.config = config;
  }

  setArea(name) {
    this.config.area = name;
  }

  setBundle(name) {
    this.config.bundle = name;
  }

  hasData() {
    return this.dataSource.hasData(this.config);
  }

  fetchAll() {
    if (!('fetchAll' in this.dataSource)) {
      throw new Error(`fetchAll not supported by ${this.dataSource.name}`);
    }

    return this.dataSource.fetchAll(this.config);
  }

  fetch(id) {
    if (!('fetch' in this.dataSource)) {
      throw new Error(`fetch not supported by ${this.dataSource.name}`);
    }

    return this.dataSource.fetch(this.config, id);
  }

  replace(data) {
    if (!('replace' in this.dataSource)) {
      throw new Error(`replace not supported by ${this.dataSource.name}`);
    }

    return this.dataSource.replace(this.config, data);
  }

  update(id, data) {
    if (!('update' in this.dataSource)) {
      throw new Error(`update not supported by ${this.dataSource.name}`);
    }

    return this.dataSource.update(this.config, id, data);
  }
}

module.exports = EntityLoader;
