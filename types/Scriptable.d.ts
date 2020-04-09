export function Scriptable(parentClass): any {
    function emit(name: string, ...args): void;

    /**
     * @param {string} name
     * @return {boolean}
     */
    function hasBehavior(name: string): boolean;

    /**
     * @param {string} name
     * @return {*}
     */
    function getBehavior(name: string): any;

    /**
     * Attach this entity's behaviors from the manager
     * @param {BehaviorManager} manager
     */
    function setupBehaviors(manager: BehaviorManager): void;
}
