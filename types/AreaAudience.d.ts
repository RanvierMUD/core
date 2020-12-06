import { ChannelAudience } from './ChannelAudience';
import { Player } from './Player';

/**
 * Audience class representing characters in the same area as the sender
 * @memberof ChannelAudience
 * @extends ChannelAudience
 */
export declare class AreaAudience extends ChannelAudience {
    getBroadcastTargets(): Array<Player>;
}