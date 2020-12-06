import { EntityLoaderConfig } from './EntityLoader';

export declare interface DataSource {
    hasData(config: EntityLoaderConfig): Promise<any>;

    fetchAll(config: EntityLoaderConfig): Promise<any>;

    fetch(config: EntityLoaderConfig, id: string|number): any;

    replace(config: EntityLoaderConfig, data: any): void;

    update(config: EntityLoaderConfig, id: string|number, data: any): void;
}
