import { GameState } from "./GameState"
import { Player } from "./Player";

export declare interface AudienceOptions {
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
     * @param {AudienceOptions} options
     */
    configure(options: AudienceOptions): void;

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