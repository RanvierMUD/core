import { Room } from './Room';

export declare class AreaFloor {
    /** @property {number} lowX The lowest x value */
    lowX: number;
    /** @property {number} highX The highest x value */
    highX: number;
    /** @property {number} lowY The lowest y value */
    lowY: number;
    /** @property {number} highY The highest y value */
    highY: number;
    /** @property {number} z This floor's z index */
    z: number;

    constructor(z: number);

    addRoom(x: number, y: number, room: Room): void;

    /**
     * @return {Room|boolean}
     */
    getRoom(x: number, y: number): Room;

    removeRoom(x: number, y: number): void;
}