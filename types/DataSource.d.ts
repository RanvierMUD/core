export declare interface DataSource {
    hasData(config: object): Promise<any>;

    fetchAll(config: object): Promise<any>;

    fetch(config: object, id: string|number): any;

    replace(config: object, data: any): void;

    update(config: object, id: string|number, data: any): void;
}