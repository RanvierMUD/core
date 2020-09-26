import { Item, ItemDef } from './Item';

export declare class InventoryFullError extends Error { }

export declare interface InventoryDef {
  items?: [string, ItemDef | Item][];
  max?: number;
}

export declare interface SerializedInventory {
  items?: [string, ItemDef][];
  max?: number;
}


export declare class Inventory extends Map<string, ItemDef | Item> {
  maxSize: number;
  readonly isFull: boolean;

  constructor(init: InventoryDef);

  setMax(size: number): void;

  getMax(): number;

  // Can throw InventoryFullError;
  addItem(item: Item): void | never;

  removeItem(item: Item): void;

  serialize(): SerializedInventory;
}
