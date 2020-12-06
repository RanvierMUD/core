import { Effect } from './Effect';

/**
 * Error used when trying to execute a skill and the player doesn't have enough resources
 * @extends Error
 */
export declare class NotEnoughResourcesError extends Error { }

/**
 * Error used when trying to execute a passive skill
 * @extends Error
 */
export declare class PassiveError extends Error { }


export declare class CooldownError extends Error {
    /** @property {Effect} effect */
    effect: Effect;

    /**
     * @param {Effect} effect Cooldown effect that triggered this error
     */
    constructor(effect: Effect);
}