export declare class Config {
    /**
     * @param {string} key
     * @param {*} fallback fallback value
     */
    static get(key: string, fallback: any): any;

    /**
     * Load `ranvier.json` from disk
     */
    static load(data: any): void;
}
