import { DataSource } from './DataSource';

export declare class EntityLoader {
    /**
     * @param {DataSource} dataSource A class that implements DataSource interface
     * @param {object} config
     */
    constructor(dataSource: DataSource, config: Object);

    setArea(name: string): void;

    setBundle(name: string): void;

    hasData(): Promise;

    fetchAll(): Promise;

    fetch(id: string|number);

    replace(data: any): void;

    update(id: string|number, data: any): void;
}