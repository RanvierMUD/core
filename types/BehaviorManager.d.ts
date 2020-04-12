import { EventManager } from './EventManager';

export declare class BehaviorManager {
    constructor();

    /**
     * Get EventManager for a given behavior
     * @param {string} name
     * @return {EventManager}
     */
    get(name: string): EventManager;

    /**
     * Check to see if a behavior exists
     * @param {string} name
     * @return {boolean}
     */
    has(name: string): boolean;

    /**
     * @param {string}   behaviorName
     * @param {Function} listener
     */
    addListener(behaviorName: string, event: string, listener: Function)
}