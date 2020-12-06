import { Player } from "./Player";

export declare class Party extends Set {
    constructor(leader: Player);

    delete(member: Player): boolean;

    add(member: Player): this;

    disband(): void;

    invite(target: Player): void;

    isInvited(target: Player): boolean;

    removeInvite(target: Player): void;

    getBroadcastTargets(): Array<Player>;
}