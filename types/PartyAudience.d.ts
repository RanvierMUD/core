import { ChannelAudience } from './ChannelAudience';
import { Player } from './Player';

export declare class PartyAudience extends ChannelAudience {
    getBroadcastTargets(): Array<Player>;
}