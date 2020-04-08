import { Player } from './Player';

export declare class Room {
    constructor(area: Area, def);

    /**
     * Emits event on self and proxies certain events to other entities in the room.
     * @param {string} eventName
     * @param {...*} args
     * @return {void}
     */
    emit(eventName: string, ...args): void;

    /**
     * @param {Player} player
     */
    addPlayer(player: Player): void;

    /**
     * @param {Player} player
     */
    removePlayer(player: Player): void;

    /**
     * @param {Npc} npc
     */
    addNpc(npc: Npc): void;

    /**
     * @param {Npc} npc
     * @param {boolean} removeSpawn
     */
    removeNpc(npc: Npc, removeSpawn: boolean): void;

    /**
     * @param {Item} item
     */
    addItem(item: Item): void;

    /**
     * @param {Item} item
     */
    removeItem(item: Item): void;

    /**
     * Get exits for a room. Both inferred from coordinates and  defined in the
     * 'exits' property.
     *
     * @return {Array<{ id: string, direction: string, inferred: boolean, room: Room= }>}
     */
    getExits(): Array<{ id: string, direction: string, inferred: boolean, room: Room }>;

    /**
     * Get the exit definition of a room's exit by searching the exit name
     * @param {string} exitName exit name search
     * @return {false|Object}
     */
    findExit(exitName: string): false|Object;

    /**
     * Get the exit definition of a room's exit to a given room
     * @param {Room} nextRoom
     * @return {false|Object}
     */
    getExitToRoom(nextRoom: Room): false|Object;

    /**
     * Check to see if this room has a door preventing movement from `fromRoom` to here
     * @param {Room} fromRoom
     * @return {boolean}
     */
    hasDoor(fromRoom: Room): boolean;

    /**
     * @param {Room} fromRoom
     * @return {{lockedBy: EntityReference, locked: boolean, closed: boolean}}
     */
    getDoor(fromRoom: Room): Object<{lockedBy: EntityReference, locked: boolean, closed: boolean}>

    /**
     * Check to see of the door for `fromRoom` is locked
     * @param {Room} fromRoom
     * @return {boolean}
     */
    isDoorLocked(fromRoom: Room): boolean;

    /**
     * @param {Room} fromRoom
     */
    openDoor(fromRoom: Room): void;

    /**
     * @param {Room} fromRoom
     */
    closeDoor(fromRoom: Room): void;

    /**
     * @param {Room} fromRoom
     */
    unlockDoor(fromRoom: Room): void;

    /**
     * @param {Room} fromRoom
     */
    lockDoor(fromRoom: Room): void;

    /**
     * @param {GameState} state
     * @param {string} entityRef
     * @return {Item} The newly created item
     */
    spawnItem(state: GameState, entityRef: string): Item;

    /**
     * @param {GameState} state
     * @param {string} entityRef
     * @fires Npc#spawn
     * @return {Npc}
     */
    spawnNpc(state: GameState, entityRef: string): Npc;

    hydrate(state: GameState): void;

    /**
     * Used by Broadcaster
     * @return {Array<Character>}
     */
    getBroadcastTargets(): Array<Character>
}