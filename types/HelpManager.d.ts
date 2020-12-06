import { Helpfile } from "./Helpfile";

export declare class HelpManager {
    constructor();

    /**
     * @param {string} help Helpfile name
     */
    get(help: string): Helpfile | undefined;

    /**
     * @param {Helpfile} help
     */
    add(help: Helpfile): void;

    /**
     * @param {string} search
     * @return {Help}
     */
    find(search: string): Helpfile;

    /**
     * Returns first help matching keywords
     * @param {string} search
     * @return {?string}
     */
    getFirst(help: string): Helpfile | null;
}