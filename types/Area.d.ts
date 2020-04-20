import { AreaFloor } from './AreaFloor';
import { Broadcastable } from './Broadcast';
import { GameEntity } from './GameEntity';
import { GameState } from './GameState';
import { Npc } from './Npc';
import { Room } from './Room';

export declare class Area extends GameEntity {
    /** Bundle this area comes from */
    bundle: string;
    /** @property {string} name */
    name: string
    /** @property {string} title */
    title: string;
    /** @property {string} script A custom script for this item */
    script: string;
    /** @property {Map<number, AreaFloor>} map a Map object keyed by the floor z-index, each floor is an array with [x][y] indexes for coordinates. */
    map: Map<number, AreaFloor>;
    /** Map of room id to Room */
    rooms: Map<string, Room>;
    /** Active NPCs that originate from this area. Note: this is NPCs that */
    npcs: Set<Npc>;
    /** Area configuration */
    info: Object
    /** milliseconds since last respawn tick. See {@link Area#update} */
    lastRespawnTick: number;

    constructor(bundle, name, manifest);

    /**
     * Get ranvier-root-relative path to this area
     * @return {string}
     */
    get areaPath(): string;

    /**
     * Get an ordered list of floors in this area's map
     * @return {Array<number>}
     */
    get floors(): Array<number>;

    /**
     * @param {string} id Room id
     * @return {Room|undefined}
     */
    getRoomById(id: string): Room|undefined;

    /**
     * @param {Room} room
     * @fires Area#roomAdded
     */
    addRoom(room: Room): void;

    /**
     * @param {Room} room
     * @fires Area#roomRemoved
     */
    removeRoom(room: Room): void

    /**
     * @param {Room} room
     * @throws Error
     */
    addRoomToMap(room: Room): void;

    /**
     * find a room at the given coordinates for this area
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @return {Room|boolean}
     */
    getRoomAtCoordinates(x: number, y: number, z: number): Room|boolean;

    /**
     * @param {Npc} npc
     */
    addNpc(npc: Npc): void;

    /**
     * Removes an NPC from the area. NOTE: This must manually remove the NPC from its room as well
     * @param {Npc} npc
     */
    removeNpc(npc: Npc): void;

    /**
     * This method is automatically called every N milliseconds where N is defined in the
     * `setInterval` call to `GameState.AreaMAnager.tickAll` in the `ranvier` executable. It, in turn,
     * will fire the `updateTick` event on all its rooms and npcs
     *
     * @param {GameState} state
     * @fires Room#updateTick
     * @fires Npc#updateTick
     */
    update(state: GameState): void;

    hydrate(state): void;

    /**
     * Get all possible broadcast targets within an area. This includes all npcs,
     * players, rooms, and the area itself
     * @return {Array<Broadcastable>}
     */
    getBroadcastTargets(): Array<Broadcastable>;
}