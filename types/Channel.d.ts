import { ChannelAudience } from './ChannelAudience';
import { PlayerRoles } from './PlayerRoles';
import { GameState } from './GameState';
import { Player } from './Player';

export declare interface ChannelConfig {
    /** @property {string} name Name of the channel */
    name: string;
    /** @property {ChannelAudience} audience */
    audience: ChannelAudience;
    /** @property {string} [description] */
    description: string;
    /** @property {PlayerRoles} [minRequiredRole] */
    minRequiredRole: PlayerRoles;
    /** @property {string} [color] */
    color: string;
    /** @property {{sender: function, target: function}} [formatter] */
    formatter: Function;
}

export declare class Channel {
    /** @property {ChannelAudience} audience People who receive messages from this channel */
    audience: ChannelAudience;
    /** @property {string} name  Actual name of the channel the user will type */
    name: string;
    /** @property {string} color Default color. This is purely a helper if you're using default format methods */
    color: string;
    /** @property {PlayerRoles} minRequiredRole If set only players with the given role or greater can use the channel */
    minRequiredRole: PlayerRoles;
    /** @property {string} description */
    description: string;
    /** @property {{sender: function, target: function}} [formatter] */
    formatter: Function;

    constructor(config: ChannelConfig);

    /**
     * @param {GameState} state
     * @param {Player}    sender
     * @param {string}    message
     * @fires GameEntity#channelReceive
     */
    send(state: GameState, sender: Player, message: string): void;

    describeSelf(sender: Player): void;

    getUsage(): string;

    /**
     * How to render the message the player just sent to the channel
     * E.g., you may want "chat" to say "You chat, 'message here'"
     * @param {Player} sender
     * @param {Player} target
     * @param {string} message
     * @param {Function} colorify
     * @return {string}
     */
    formatToSender(sender: Player, target: Player, message: string, colorify: Function): string;

    /**
     * How to render the message to everyone else
     * E.g., you may want "chat" to say "Playername chats, 'message here'"
     * @param {Player} sender
     * @param {Player} target
     * @param {string} message
     * @param {Function} colorify
     * @return {string}
     */
    formatToReceipient(sender: Player, target: Player, message: string, colorify: Function): string;

    colorify(message: string): string;
}