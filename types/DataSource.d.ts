export declare interface DataSource {
    hasData(config: object): Promise;

    fetchAll(config: object): Promise;

    fetch(config: object, id: string|number): any;

    replace(config: object, data: any): void;

    update(config: object, id: string|number, data: any): void;
}