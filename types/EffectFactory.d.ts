import { Effect } from "./Effect";
import { GameState } from "./GameState";

export declare type EffectConfig = {
    config: Object<string, any>;
    listeners: Object<string, Function>;
}

export declare class EffectFactory {
    constructor(): EffectFactory;

    /**
     * @param {string} id
     * @param {EffectConfig} config
     * @param {GameState} state
     */
    add(id: string, config: EffectConfig, state: GameState): void;

    /**
     * @param {string} id
     */
    has(id: string): boolean;

    /**
     * Get a effect definition. Use `create` if you want an instance of a effect
     * @param {string} id
     * @return {object}
     */
    get(id: string): Effect;

    /**
     * @param {string}  id      effect id
     * @param {?object} config  Effect.config override
     * @param {?object} state   Effect.state override
     * @return {Effect}
     */
    create(id: string, config?: EffectConfig, state?: object): Effect
}
