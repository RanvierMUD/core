import { Area } from "./Area";
import { Item } from "./Item";
import { Npc } from "./Npc";
import { Room } from "./Room";

export declare class EntityFactory {
    constructor();

    /**
     * Create the key used by the entities and scripts maps
     * @param {string} area Area name
     * @param {number} id
     * @return {string}
     */
    createEntityRef(area: string, id: number): string;

    /**
     * @param {string} entityRef
     * @return {Object}
     */
    getDefinition(entityRef: string): object;

    /**
     * @param {string} entityRef
     * @param {Object} def
     */
    setDefinition(entityRef: string, def: object): void;

    /**
     * Add an event listener from a script to a specific item
     * @see BehaviorManager::addListener
     * @param {string}   entityRef
     * @param {string}   event
     * @param {Function} listener
     */
    addScriptListener(entityRef: string, event: string, listener: Function): void;

    /**
     * Create a new instance of a given npc definition. Resulting npc will not be held or equipped
     * and will _not_ have its default contents. If you want it to also populate its default contents
     * you must manually call `npc.hydrate(state)`
     *
     * @param {Area}   area
     * @param {string} entityRef
     * @param {Item|Npc|Room|Area}  Type      Type of entity to instantiate
     * @return {type}
     */
    createByType(area: Area, entityRef: string, Type: Item|Npc|Room|Area): Item|Npc|Room|Area;

    /** Method overloaded on sublasses */
    //create();

    /**
     * Clone an existing entity.
     * @param {Item|Npc|Room|Area} entity
     * @return {Item|Npc|Room|Area}
     */
    clone(entity: Item|Npc|Room|Area): Item|Npc|Room|Area;;
}