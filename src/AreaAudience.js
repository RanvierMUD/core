'use strict';

const ChannelAudience = require('./ChannelAudience');

/**
 * Audience class representing characters in the same area as the sender
 * @memberof ChannelAudience
 * @extends ChannelAudience
 */
class AreaAudience extends ChannelAudience {
  getBroadcastTargets() {
    if (!this.sender.room) {
      return [];
    }

    const { area } = this.sender.room;
    return area.getBroadcastTargets().filter(target => target !== this.sender);
  }
}

module.exports = AreaAudience;
