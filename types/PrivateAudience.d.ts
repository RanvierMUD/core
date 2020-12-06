import { ChannelAudience } from './ChannelAudience';
import { Player } from './Player';

/**
 * Audience class representing a specific targeted player.
 * Example: `tell` command or `whisper` command.
 * @memberof ChannelAudience
 * @extends ChannelAudience
 */
export declare class PrivateAudience extends ChannelAudience {
    getBroadcastTargets(): Player[];

    alterMessage(message: string): string;
}