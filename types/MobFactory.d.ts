import { Area } from './Area';
import { EntityFactory } from './EntityFactory';
import { Npc } from './Npc';

export declare class MobFactory extends EntityFactory {
  /**
   * Create a new instance of a given npc definition. Resulting npc will not
   * have its default inventory.  If you want to also populate its default
   * contents you must manually call `npc.hydrate(state)`
   *
   * @param {Area}   area
   * @param {string} entityRef
   * @return {Npc}
   */
  create(area: Area, entityRef: string): Npc;
}
