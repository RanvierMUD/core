import { Command } from "./Command";

export declare class ChannelManager {
    constructor();

    /**
     * Get command by name
     * @param {string}
     * @return {Command}
     */
    get(command: string): Command;

    /**
     * Add the command and set up aliases
     * @param {Command}
     */
    add(command: Command): void;

    /**
     * @param {Command}
     */
    remove(command: Command): void;

    /**
     * Find a command from a partial name
     * @param {string} search
     * @param {boolean} returnAlias true to also return which alias of the command was used
     * @return {Command}
     */
    find(search: string, returnAlias: boolean): Command;
}