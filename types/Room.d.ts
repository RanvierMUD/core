import { Player } from '../src/Player';

export namespace Room {
    /**
     * @property Area room is in
     */
    let area: Area;

    function constructor(area: Area, def);

    /**
     * Emits event on self and proxies certain events to other entities in the room.
     * @param {string} eventName
     * @param {...*} args
     * @return {void}
     */
    function emit(eventName: string, ...args): void;

    /**
     * @param {Player} player
     */
    function addPlayer(player: Player): void;

    /**
     * @param {Player} player
     */
    function removePlayer(player: Player): void;

    /**
     * @param {Npc} npc
     */
    function addNpc(npc: Npc): void;

    /**
     * @param {Npc} npc
     * @param {boolean} removeSpawn
     */
    function removeNpc(npc: Npc, removeSpawn: boolean): void;

    /**
     * @param {Item} item
     */
    function addItem(item: Item): void;

    /**
     * @param {Item} item
     */
    function removeItem(item: Item): void;

    /**
     * Get exits for a room. Both inferred from coordinates and  defined in the
     * 'exits' property.
     *
     * @return {Array<{ id: string, direction: string, inferred: boolean, room: Room= }>}
     */
    function getExits(): Array<{ id: string, direction: string, inferred: boolean, room: Room }>;

    /**
     * Get the exit definition of a room's exit by searching the exit name
     * @param {string} exitName exit name search
     * @return {false|Object}
     */
    function findExit(exitName: string): false|Object;

    /**
     * Get the exit definition of a room's exit to a given room
     * @param {Room} nextRoom
     * @return {false|Object}
     */
    function getExitToRoom(nextRoom: Room): false|Object;

    /**
     * Check to see if this room has a door preventing movement from `fromRoom` to here
     * @param {Room} fromRoom
     * @return {boolean}
     */
    function hasDoor(fromRoom: Room): boolean;

    /**
     * @param {Room} fromRoom
     * @return {{lockedBy: EntityReference, locked: boolean, closed: boolean}}
     */
    function getDoor(fromRoom: Room): Object<{lockedBy: EntityReference, locked: boolean, closed: boolean}>

    /**
     * Check to see of the door for `fromRoom` is locked
     * @param {Room} fromRoom
     * @return {boolean}
     */
    function isDoorLocked(fromRoom: Room): boolean;

    /**
     * @param {Room} fromRoom
     */
    function openDoor(fromRoom: Room): void;

    /**
     * @param {Room} fromRoom
     */
    function closeDoor(fromRoom: Room): void;

    /**
     * @param {Room} fromRoom
     */
    function unlockDoor(fromRoom: Room): void;

    /**
     * @param {Room} fromRoom
     */
    function lockDoor(fromRoom: Room): void;

    /**
     * @param {GameState} state
     * @param {string} entityRef
     * @return {Item} The newly created item
     */
    function spawnItem(state: GameState, entityRef: string): Item;

    /**
     * @param {GameState} state
     * @param {string} entityRef
     * @fires Npc#spawn
     * @return {Npc}
     */
    function spawnNpc(state: GameState, entityRef: string): Npc;

    function hydrate(state: GameState): void;

    /**
     * Used by Broadcaster
     * @return {Array<Character>}
     */
    function getBroadcastTargets(): Array<Character>
}