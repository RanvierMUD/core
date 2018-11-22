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
      this.scripts.get(entityRef).attach(entity);
    }

    return area;
  }

  /**
   * @see AreaFactory#create
   */
  clone(area) {
    return this.create(area.name);
  }
}

module.exports = AreaFactory;

