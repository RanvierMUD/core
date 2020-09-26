import { Area } from './Area';

import { GameEntity } from './GameEntity';
import { GameState } from './GameState';
import { SerializedInventory } from './Inventory';
import { ItemType } from './ItemType';

export declare interface ItemDef {
  name: string;
  id: string;

  description?: string;
  inventory?: any;
  metadata?: Record<string, any>;
  behaviors?: Record<string, any>;
  items?: ItemDef[];
  maxItems?: number;
  isEquipped?: boolean;
  entityReference: string;
  room?: string | Room | null;
  roomDesc?: string;
  script?: string;
  type?: ItemType | string;
  uuid?: string;
  closeable?: boolean;
  closed?: boolean;
  locked?: boolean;
  lockedBy?: string | null;

  keywords: string[];
}

export declare class Item extends GameEntity {
  name: string;
  id: string;
  
  description: string;
  metadata: Record<string, any>;
  behaviors: Map<string, any>;
  defaultItems: Item[] | ItemDef[];
  entityReference: string;
  maxItems: number;
  isEquipped: boolean;
  room: string | Room | null;
  roomDesc: string;
  script: string | null;
  type: ItemType | string;
  uuid: string;
  closeable: boolean;
  closed: boolean;
  locked: boolean;
  lockedBy: string | null;
  
  carriedBy: string | null;
  equippedBy: string | null;

  keywords: string[];


  constructor(area: Area, item: ItemDef);

  initializeInventory(inventory: SerializedInventory): void;

  hasKeyword(keyword: string): boolean;

  addItem(item: Item): void;

  removeItem(item: Item): void;

  isInventoryFull(): boolean;

  _setupInventory(): void;

  findCarrier(): Character | Item | null;

  open(): void;

  close(): void;

  lock(): void;
  
  unlock(): void;

  hydrate(state: GameState, serialized?: ItemDef): void;

  serialize(): ItemDef;
}
