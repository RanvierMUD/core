'use strict';

const Area = require('./Area');
const EntityFactory = require('./EntityFactory');

/**
 * Stores definitions of items to allow for easy creation/cloning of objects
 */
class AreaFactory extends EntityFactory {
  /**
   * Create a new instance of an area by name. Resulting area will not have
   * any of its contained entities (items, npcs, rooms) hydrated. You will
   * need to call `area.hydrate(state)`
   *
   * @param {GameState} state
   * @param {string} bundle Name of this bundle this area is defined in
   * @param {string} entityRef Area name
   * @return {Area}
   */
  create(entityRef) {
    const definition = this.getDefinition(entityRef);
    if (!definition) {
      throw new Error('No Entity definition found for ' + entityRef)
    }

    const area = new Area(definition.bundle, entityRef, definition.manifest);

    if (this.scripts.has(entityRef)) {
      this.scripts.get(entityRef).attach(area);
    }

    return area;
  }

  /**
   * @see AreaFactory#create
   */
  clone(area) {
    return this.create(area.name);
  }

  /**
   * @param {string} entityRef
   * @return string
   */
  getNameByEntityReference(entityRef) {
    return entityRef.split(':')[0];
  }

  /**
   * @param {string} areaName
   * @return boolean
   */
  isInstanced(areaName) {
    return this.getInstanceType(areaName) !== null;
  }

  /**
   * @param {string} areaName
   * @return ?string
   */
  getInstanceType(areaName) {
    const def = this.getDefinition(areaName);
    return def.manifest.instanced || null;
  }

  /**
   * Create and hydrate a new instanced version of a given area. Note that the
   * given area does not need to be defined as instanced in the first place
   *
   * @param {GameState} gameState
   * @param {string} areaName
   * @param {string} instanceId
   * @return Area
   */
  createInstance(gameState, areaName, instanceId) {
    const area = gameState.AreaFactory.create(areaName);
    area.instanceId = instanceId;
    gameState.AreaManager.addArea(area, instanceId);
    area.hydrate(gameState);

    return area;
  }
}

module.exports = AreaFactory;

