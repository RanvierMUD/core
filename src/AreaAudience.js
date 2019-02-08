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

    // It would be more elegant to just pass the area but that could be very
    // inefficient as it's much more likely that there are fewer players than
    // there are rooms in the area
    const players = this.state.PlayerManager.filter(player =>
      player.room &&
      (player.room.area === this.sender.room.area) &&
      (player !== this.sender)
    );

    return players.concat(this.sender.room.area.npcs);
  }
}

module.exports = AreaAudience;
