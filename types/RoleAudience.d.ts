import { AudienceOptions, ChannelAudience } from "./ChannelAudience";
import { Player } from "./Player";

export declare class RoleAudience extends ChannelAudience {
    constructor(options: AudienceOptions);

    getBroadcastTargets(): Player[];
}