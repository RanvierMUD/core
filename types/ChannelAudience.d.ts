import { GameState } from "./GameState"
import { Player } from "./Player";

export declare interface ChannelOptions {
   /** @param {GameState} state */
   state: GameState;
   /** @param {Player} sender */
   sender: Player;
   /** @param {string} message */
   message: string;
}

export declare class ChannelAudience {
    /**
     * Configure the current state for the audience. Called by {@link Channel#send}
     * @param {object} options
     */
    configure(options: ChannelOptions): void;

    /**
     * Find targets for this audience
     * @return {Array<Player>}
     */
    getBroadcastTargets(): Array<Player>;

    /**
     * Modify the message to be sent
     * @param {string} message
     * @return {string}
     */
    alterMessage(message: string): string;
}