import { DataSource } from './DataSource';

export declare class EntityLoader {
    /**
     * @param {DataSource}
     * @param {object} config
     */
    constructor(dataSource: DataSource, config: Object);

    setArea(name: string): void;

    setBundle(name: string): void;

    hasData(): boolean;

    fetchAll();

    fetch(id);

    replace(data);
}