import { DataSource } from './DataSource';

export declare interface EntityLoaderConfig {
    area?: string;
    bundle?: string;
}

/**
 * Used to CRUD an entity from a configured DataSource
 */
export declare class EntityLoader {
    dataSource: DataSource;
    config: EntityLoaderConfig;

    /**
     * @param {DataSource} dataSource A class that implements DataSource interface
     * @param {object} config
     */
    constructor(dataSource: DataSource, config: EntityLoaderConfig);

    setArea(name: string): void;

    setBundle(name: string): void;

    hasData(): Promise<any>;

    fetchAll(): Promise<any>;

    fetch(id: string|number);

    replace(data: any): void;

    update(id: string|number, data: any): void;
}