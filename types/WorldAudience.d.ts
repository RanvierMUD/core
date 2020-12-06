import { ChannelAudience } from './ChannelAudience';
import { Player } from './Player';

/**
 * Audience class representing everyone in the game, except sender.
 * @memberof ChannelAudience
 * @extends ChannelAudience
 */
export declare class WorldAudience extends ChannelAudience {
  getBroadcastTargets(): Player[];
}
