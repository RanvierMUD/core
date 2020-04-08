import { Npc } from '../src/Npc';
import { Room } from '../src/Room';

export namespace Area {
    /** Bundle this area comes from */
    let bundle: string;
    let name: string
    let title: string;
    /** A custom script for this item */
    let script: string;
    /** a Map object keyed by the floor z-index, each floor is an array with [x][y] indexes for coordinates. */
    let map: Map;
    /** Map of room id to Room */
    let rooms: Map<string, Room>;
    /** Active NPCs that originate from this area. Note: this is NPCs that */
    let npcs: Set<Npc>;
    /** Area configuration */
    let info: Object
    /** milliseconds since last respawn tick. See {@link Area#update} */
    let lastRespawnTick: number;

    function constructor(bundle, name, manifest);

    /**
     * Get ranvier-root-relative path to this area
     * @return {string}
     */
    function areaPath(): string;

    /**
     * Get an ordered list of floors in this area's map
     * @return {Array<number>}
     */
    function floors(): Array<number>;

    /**
     * @param {string} id Room id
     * @return {Room|undefined}
     */
    function getRoomById(id: string): Room|undefined;

    /**
     * @param {Room} room
     * @fires Area#roomAdded
     */
    function addRoom(room: Room): void;

    /**
     * @param {Room} room
     * @fires Area#roomRemoved
     */
    function removeRoom(room: Room): void

    /**
     * @param {Room} room
     * @throws Error
     */
    function addRoomToMap(room: Room): void;

    /**
     * find a room at the given coordinates for this area
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @return {Room|boolean}
     */
    function getRoomAtCoordinates(x: number, y: number, z: number): Room|boolean;

    /**
     * @param {Npc} npc
     */
    function addNpc(npc: Npc): void;

    /**
     * Removes an NPC from the area. NOTE: This must manually remove the NPC from its room as well
     * @param {Npc} npc
     */
    function removeNpc(npc: Npc): void;

    /**
     * This method is automatically called every N milliseconds where N is defined in the
     * `setInterval` call to `GameState.AreaMAnager.tickAll` in the `ranvier` executable. It, in turn,
     * will fire the `updateTick` event on all its rooms and npcs
     *
     * @param {GameState} state
     * @fires Room#updateTick
     * @fires Npc#updateTick
     */
    function update(state: GameState): void;

    function hydrate(state): void;

    /**
     * Get all possible broadcast targets within an area. This includes all npcs,
     * players, rooms, and the area itself
     * @return {Array<Broadcastable>}
     */
    function getBroadcastTargets(): Array<Broadcastable>;
}