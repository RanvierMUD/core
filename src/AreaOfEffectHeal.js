'use strict';

const Heal = require('./Heal');
const Room = require('./Room');
const Character = require('./Character');

/**
 * Heal class used for applying healing to multiple entities in a room. By
 * default it will target all players in the room. To customize this behavior you
 * can extend this class and override the `getValidTargets` method
 */
class AreaOfEffectHeal extends Heal
{
  /**
   * @param {Room|Character} target
   * @throws RangeError
   * @fires Room#areaHeal
   */
  commit(room) {
    if (!(room instanceof Room)) {
      if (!(room instanceof Character)) {
        throw new RangeError('AreaOfEffectHeal commit target must be an instance of Room or Character');
      }

      super.commit(room);
      return;
    }

    const targets = this.getValidTargets(room);
    for (const target of targets) {
      super.commit(target);
    }


    /**
     * @event Room#areaHeal
     * @param {Heal} heal
     * @param {Array<Character>} targets
     */
    room.emit('areaHeal', this, targets);
  }

  /**
   * Override this method to customize valid targets such as
   * only targeting hostile npcs, or only targeting players, etc.
   * @param {Room} room
   * @return {Array<Character>}
   */
  getValidTargets(room) {
    const targets = [...room.players];
    return targets.filter(t => t.hasAttribute(this.attribute));
  }
}

module.exports = AreaOfEffectHeal;
