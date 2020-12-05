import { DataSource } from './DataSource';

/**
 * Holds instances of configured DataSources
 * @type {Map<string, DataSource>}
 */
export declare class DataSourceRegistry extends Map<string, DataSource> {
    /**
     * @param {Function} requireFn used to require() the loader
     * @param {string} rootPath project root
     * @param {object} config configuration to load
     */
    load(requireFn: Function, rootPath: string, config: object = {}): void;
}
