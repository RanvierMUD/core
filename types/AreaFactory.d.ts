import { Area } from './Area';
import { EntityFactory } from './EntityFactory';

export declare class AreaFactory extends EntityFactory {
    /**
     * Create a new instance of an area by name. Resulting area will not have
     * any of its contained entities (items, npcs, rooms) hydrated. You will
     * need to call `area.hydrate(state)`
     *
     * @param {string} entityRef Area name
     * @return {Area}
     */
    create(entityRef: string): Area;

    /**
     * @see AreaFactory#create
     */
    clone(area: Area): Area;
}