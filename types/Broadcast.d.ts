import { Player } from './Player';

export type Broadcastable = { getBroadcastTargets: Array<any> }

export declare class Broadcast {
    /**
     * @param {Broadcastable} source Target to send the broadcast to
     * @param {string} message
     * @param {number|boolean} wrapWidth=false width to wrap the message to or don't wrap at all
     * @param {boolean} useColor Whether to parse color tags in the message
     * @param {?function(target, message): string} formatter=null Function to call to format the
     *   message to each target
     */
    at(source: Broadcastable, message: string, wrapWidth: boolean, useColor: boolean, formatter: Function): void;

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
    atExcept(source: Broadcastable, message: string, excludes: Array<Player>, wrapWidth: number|boolean, useColor: boolean, formatter: Function): void;

    /**
     * Helper wrapper around Broadcast.at to be used when you're using a formatter
     * @see {@link Broadcast#at}
     * @param {Broadcastable} source
     * @param {string} message
     * @param {function} formatter
     * @param {number|boolean} wrapWidth
     * @param {boolean} useColor
     */
    atFormatted(source: Broadcastable, message: string, formatter: Function, wrapWidth: number|boolean, useColor: boolean): void;

    /**
     * `Broadcast.at` with a newline
     * @see {@link Broadcast#at}
     */
    sayAt(source: Broadcastable, message: string, wrapWidth: number|boolean, useColor: boolean, formatter: Function): void;

    /**
     * `Broadcast.atExcept` with a newline
     * @see {@link Broadcast#atExcept}
     */
    sayAtExcept(source: Broadcastable, message: string, excludes, wrapWidth: number|boolean, useColor: boolean, formatter: Function): void;

    /**
     * `Broadcast.atFormatted` with a newline
     * @see {@link Broadcast#atFormatted}
     */
    sayAtFormatted(source: Broadcastable, message: string, formatter: Function, wrapWidth: number|boolean, useColor: boolean): void;

    /**
     * Render the player's prompt including any extra prompts
     * @param {Player} player
     * @param {object} extra     extra data to avail to the prompt string interpolator
     * @param {number} wrapWidth
     * @param {boolean} useColor
     */
    prompt(player: Player, extra: Object, wrapWidth: number, useColor: boolean): void;

    /**
     * Generate an ASCII art progress bar
     * @param {number} width Max width
     * @param {number} percent Current percent
     * @param {string} color
     * @param {string} barChar Character to use for the current progress
     * @param {string} fillChar Character to use for the rest
     * @param {string} delimiters Characters to wrap the bar in
     * @return {string}
     */
    progress(width: number, percent: number, color: string, barChar: string, fillChar: string, delimiters: string): string;

    /**
     * Center a string in the middle of a given width
     * @param {number} width
     * @param {string} message
     * @param {string} color
     * @param {?string} fillChar Character to pad with, defaults to ' '
     * @return {string}
     */
    center(width: number, message: string, color: string, fillChar: string): string;

    /**
     * Render a line of a specific width/color
     * @param {number} width
     * @param {string} fillChar
     * @param {?string} color
     * @return {string}
     */
    line(width: number, fillChar: string, color: string): string;

    /**
     * Wrap a message to a given width. Note: Evaluates color tags
     * @param {string}  message
     * @param {?number} width   Defaults to 80
     * @return {string}
     */
    wrap(message: string, width: number): string;

    /**
     * Indent all lines of a given string by a given amount
     * @param {string} message
     * @param {number} indent
     * @return {string}
     */
    indent(message: string, indent: number): string;

    isBroadcastable(source: Broadcastable): boolean;
}