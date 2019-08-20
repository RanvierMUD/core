'use strict';

const BehaviorManager = require('./BehaviorManager');
const Area = require('./Area');
const Room = require('./Room');

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
   * @param {?string} instanceId
   * @return Area
   */
  getArea(name, instanceId = null) {
    return this.areas.get(this.getInstanceRef(name, instanceId));
  }

  /**
   * @param {string} entityRef
   * @param {?string} instanceId
   * @return Area
   */
  getAreaByReference(entityRef, instanceId = null) {
    const name = entityRef.split(':')[0];
    return this.getArea(this.getInstanceRef(name, instanceId));
  }

  /**
   * @param {Area} area
   * @param {?string} instanceId
   */
  addArea(area, instanceId = null) {
    this.areas.set(this.getInstanceRef(area.name, instanceId), area);
  }

  /**
   * WARNING: This does not do any cleanup of the instance area, it simply removes
   * it from the AreaManager's list. You will need to remove any players or other
   * entities from the instance manually
   * @param {Area} area
   * @param {?string} instanceId
   */
  removeArea(area, instanceId = null) {
    this.areas.delete(this.getInstanceRef(area.name, instanceId));
  }

  /**
   * @param {string} areaName
   * @param {?string} instanceId
   * @return string
   */
  getInstanceRef(areaName, instanceId = null) {
    return areaName + (instanceId ? '__' + instanceId : '');
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
