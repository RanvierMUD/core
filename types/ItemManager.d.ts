import { Item } from './Item';

export declare class ItemManager {
  constructor();

  add(item: Item): void;

  remove(item: Item): void;

  /**
   * @fires Item#updateTick
   */
  tickAll(): void;
}
