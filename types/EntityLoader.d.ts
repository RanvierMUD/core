// import { DataSource } from '../src/DataSource'; FIXME

export namespace EntityLoader {
    /**
     * @param {DataSource}
     * @param {object} config
     */
    function constructor(dataSource: DataSource, config: Object);

    function setArea(name: string): void;

    function setBundle(name: string): void;

    function hasData(): boolean;

    function fetchAll();

    function fetch(id);

    function replace(data);
}