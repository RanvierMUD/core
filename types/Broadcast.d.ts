import { Player } from './Player';

export declare type Broadcastable = { getBroadcastTargets: Array<any> }

export namespace Broadcast {
    /**
     * @param {Broadcastable} source Target to send the broadcast to
     * @param {string} message
     * @param {number|boolean} wrapWidth=false width to wrap the message to or don't wrap at all
     * @param {boolean} useColor Whether to parse color tags in the message
     * @param {?function(target, message): string} formatter=null Function to call to format the
     *   message to each target
     */
    static function at(source: Broadcastable, message: string, wrapWidth: boolean, useColor: boolean, formatter: Function);

    /**
     * Broadcast.at for all except given list of players
     * @see {@link Broadcast#at}
     * @param {Broadcastable} source
     * @param {string} message
     * @param {Array<Player>} excludes
     * @param {number|boolean} wrapWidth
     * @param {boolean} useColor
     * @param {function} formatter
     */
    static function atExcept(source: Broadcastable, message: string, excludes: Array<Player>, wrapWidth: number|boolean, useColor: boolean, formatter: Function);

    /**
     * Helper wrapper around Broadcast.at to be used when you're using a formatter
     * @see {@link Broadcast#at}
     * @param {Broadcastable} source
     * @param {string} message
     * @param {function} formatter
     * @param {number|boolean} wrapWidth
     * @param {boolean} useColor
     */
    static function atFormatted(source: Broadcastable, message, formatter, wrapWidth, useColor);

    /**
     * `Broadcast.at` with a newline
     * @see {@link Broadcast#at}
     */
    static function sayAt(source: Broadcastable, message, wrapWidth, useColor, formatter);
}