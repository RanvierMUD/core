import { ChannelAudience } from "./ChannelAudience";
import { Player } from "./Player";

export declare class RoomAudience extends ChannelAudience {
    getBroadcastTargets(): Player[];
}