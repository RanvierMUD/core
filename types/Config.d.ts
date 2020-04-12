export declare class Config {
    /**
     * @param {string} key
     * @param {*} fallback fallback value
     */
    get(key: string, fallback: any): any;

    /**
     * Load `ranvier.json` from disk
     */
    load(data: any): void;
}