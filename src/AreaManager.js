'use strict';

const BehaviorManager = require('./BehaviorManager');

/**
 * Stores references to, and handles distribution of, active areas
 * @property {Map<string,Area>} areas
 */
class AreaManager {
  constructor() {
    this.areas = new Map();
    this.scripts = new BehaviorManager();
  }

  /**
   * @param {string} name
   * @return Area
   */
  getArea(name) {
    return this.areas.get(name);
  }

  /**
   * @param {string} entityRef
   * @return Area
   */
  getAreaByReference(entityRef) {
    const [ name ] = entityRef.split(':');
    return this.getArea(name);
  }

  /**
   * @param {Area} area
   */
  addArea(area) {
    this.areas.set(area.name, area);
  }

  /**
   * @param {Area} area
   */
  removeArea(area) {
    this.areas.delete(area.name);
  }

  /**
   * Apply `updateTick` to all areas in the game
   * @param {GameState} state
   * @fires Area#updateTick
   */
  tickAll(state) {
    for (const [ name, area ] of this.areas) {
      /**
       * @see Area#update
       * @event Area#updateTick
       */
      area.emit('updateTick', state);
    }
  }

  /**
   * Get the placeholder area used to house players who were loaded into
   * an invalid room
   *
   * @return {Area}
   */
  getPlaceholderArea() {
    if (this._placeholder) {
      return this._placeholder;
    }

    this._placeholder = new Area(null, 'placeholder', {
      title: 'Placeholder'
    });

    const placeholderRoom = new Room(this._placeholder, {
      id: 'placeholder',
      title: 'Placeholder',
      description: 'You are not in a valid room. Please contact an administrator.',
    });

    this._placeholder.addRoom(placeholderRoom);

    return this._placeholder;
  }
}

module.exports = AreaManager;
