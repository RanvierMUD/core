import { Area } from "./Area";
import { GameState } from "./GameState";

export declare class AreaManager {
    /** @property {Map<string,Area>} areas */
    areas: Map<string,Area>;

    constructor();

    /**
     * @param {string} name
     * @return Area
     */
    getArea(name: string): Area;

    /**
     * @param {string} entityRef
     * @return Area
     */
    getAreaByReference(entityRef: string): Area;

    /**
     * @param {Area} area
     */
    addArea(area: Area): void;

    /**
     * @param {Area} area
     */
    removeArea(area: Area): void;

    /**
     * Apply `updateTick` to all areas in the game
     * @param {GameState} state
     * @fires Area#updateTick
     */
    tickAll(state: GameState): void;

    /**
     * Get the placeholder area used to house players who were loaded into
     * an invalid room
     *
     * @return {Area}
     */
    getPlaceholderArea(): Area;
}