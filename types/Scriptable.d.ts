import { BehaviorManager } from './BehaviorManager';

export declare class ScriptableClass {
    emit(name: string, ...args: any[]): void;

    /**
     * @param {string} name
     * @return {boolean}
     */
    hasBehavior(name: string): boolean;

    /**
     * @param {string} name
     * @return {*}
     */
    getBehavior(name: string): any;

    /**
     * Attach this entity's behaviors from the manager
     * @param {BehaviorManager} manager
     */
    setupBehaviors(manager: BehaviorManager): void;
}

export declare function Scriptable(parentClass: any): any & ScriptableClass;

