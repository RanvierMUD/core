export declare class Data {
    static setDataPath(path: string): void;

    /**
     * Read in and parse a file. Current supports yaml and json
     * @param {string} filepath
     * @return {*} parsed contents of file
     */
    static parseFile(filepath: string): any;

    /**
     * Write data to a file
     * @param {string} filepath
     * @param {*} data
     * @param {function} callback
     */
    static saveFile(filepath: string, data: any, callback: Function): void;

    /**
     * load/parse a data file (player/account)
     * @param {string} type
     * @param {string} id
     * @return {*}
     */
    static load(type: string, id: string): any;

    /**
     * Save data file (player/account) data to disk
     * @param {string} type
     * @param {string} id
     * @param {*} data
     * @param {function} callback
     */
    static save(type: string, id: string, data: any, callback: Function): void;

    /**
     * Check if a data file exists
     * @param {string} type
     * @param {string} id
     * @return {boolean}
     */
    static exists(type: string, id: string): boolean;

    /**
     * get the file path for a given data file by type (player/account)
     * @param {string} type
     * @param {string} id
     * @return {string}
     */
    static getDataFilePath(type: string, id: string): string;

    /**
     * Determine whether or not a path leads to a legitimate JS file or not.
     * @param {string} path
     * @param {string} [file]
     * @return {boolean}
     */
    static isScriptFile(path: string, file: string): booleanM

    /**
     * load the MOTD for the intro screen
     * @return string
     */
    static loadMotd(): string;
}