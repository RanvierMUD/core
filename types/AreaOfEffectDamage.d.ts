import { Character } from './Character';
import { Damage } from './Damage';
import { Room } from './Room';

export declare class AreaOfEffectDamage extends Damage {
    /**
     * @param {Room|Character} target
     * @throws RangeError
     * @fires Room#areaDamage
     */
    commit(room: Room|Character): void;

    /**
     * Override this method to customize valid targets such as
     * only targeting hostile npcs, or only targeting players, etc.
     * @param {Room} room
     * @return {Array<Character>}
     */
    getValidTargets(room: Room): Array<Character>;
}