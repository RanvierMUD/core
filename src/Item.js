'use strict';

const uuid = require('uuid/v4');

const GameEntity = require('./GameEntity');
const ItemType = require('./ItemType');
const Logger = require('./Logger');
const Metadatable = require('./Metadatable');
const Player = require('./Player');
const { Inventory, InventoryFullError } = require('./Inventory');

/**
 * @property {Area}    area        Area the item belongs to (warning: this is not the area is currently in but the
 *                                 area it belongs to on a fresh load)
 * @property {object}  metadata    Essentially a blob of whatever attrs the item designer wanted to add
 * @property {Array}   behaviors   list of behaviors this object uses
 * @property {string}  description Long description seen when looking at it
 * @property {number}  id          vnum
 * @property {boolean} isEquipped  Whether or not item is currently equipped
 * @property {?Character} equippedBy Entity that has this equipped
 * @property {Map}     inventory   Current items this item contains
 * @property {string}  name        Name shown in inventory and when equipped
 * @property {?Room}   room        Room the item is currently in
 * @property {string}  roomDesc    Description shown when item is seen in a room
 * @property {string}  script      A custom script for this item
 * @property {ItemType|string} type
 * @property {string}  uuid        UUID differentiating all instances of this item
 * @property {boolean} closeable   Whether this item can be closed (Default: false, true if closed or locked is true)
 * @property {boolean} closed      Whether this item is closed
 * @property {boolean} locked      Whether this item is locked
 * @property {?entityReference} lockedBy Item that locks/unlocks this item
 * @property {?(Character|Item)} carriedBy Entity that has this in its Inventory
 *
 * @extends GameEntity
 */
class Item extends GameEntity {
  constructor (area, item) {
    super();
    const validate = ['keywords', 'name', 'id'];

    for (const prop of validate) {
      if (!(prop in item)) {
        throw new ReferenceError(`Item in area [${area.name}] missing required property [${prop}]`);
      }
    }

    this.area = area;
    this.metadata  = item.metadata || {};
    this.behaviors = new Map(Object.entries(item.behaviors || {}));
    this.defaultItems = item.items || [];
    this.description = item.description || 'Nothing special.';
    this.entityReference = item.entityReference; // EntityFactory key
    this.id          = item.id;

    this.maxItems    = item.maxItems || Infinity;
    this.initializeInventory(item.inventory, this.maxItems);

    this.isEquipped  = item.isEquipped || false;
    this.keywords    = item.keywords;
    this.name        = item.name;
    this.room        = item.room || null;
    this.roomDesc    = item.roomDesc || '';
    this.script      = item.script || null;

    if (typeof item.type === 'string') {
      this.type = ItemType[item.type] || item.type;
    } else {
      this.type = item.type || ItemType.OBJECT;
    }

    this.uuid        = item.uuid || uuid();
    this.closeable   = item.closeable || item.closed || item.locked || false;
    this.closed      = item.closed || false;
    this.locked      = item.locked || false;
    this.lockedBy    = item.lockedBy || null;

    this.carriedBy = null;
    this.equippedBy = null;
  }

  /**
   * Create an Inventory object from a serialized inventory
   * @param {object} inventory Serialized inventory
   */
  initializeInventory(inventory) {
    if (inventory) {
      this.inventory = new Inventory(inventory);
      this.inventory.setMax(this.maxItems);
    } else {
      this.inventory = null;
    }
  }

  hasKeyword(keyword) {
    return this.keywords.indexOf(keyword) !== -1;
  }

  /**
   * Add an item to this item's inventory
   * @param {Item} item
   */
  addItem(item) {
    this._setupInventory();
    this.inventory.addItem(item);
    item.carriedBy = this;
  }

  /**
   * Remove an item from this item's inventory
   * @param {Item} item
   */
  removeItem(item) {
    this.inventory.removeItem(item);

    // if we removed the last item unset the inventory
    // This ensures that when it's reloaded it won't try to set
    // its default inventory. Instead it will persist the fact
    // that all the items were removed from it
    if (!this.inventory.size) {
      this.inventory = null;
    }
    item.carriedBy = null;
  }

  /**
   * @return {boolean}
   */
  isInventoryFull() {
    this._setupInventory();
    return this.inventory.isFull;
  }

  _setupInventory() {
    if (!this.inventory) {
      this.inventory = new Inventory({
        items: [],
        max: this.maxItems
      });
    }
  }

  /**
   * Helper to find the game entity that ultimately has this item in their
   * Inventory in the case of nested containers. Could be an item, player, or
   * @return {Character|Item|null} owner
   */
  findCarrier() {
    let owner = this.carriedBy;

    while (owner) {
      if (!owner.carriedBy) {
        return owner;
      }

      owner = owner.carriedBy;
    }

    return null;
  }

  /**
   * Open a container-like object
   */
  open() {
    if (!this.closed) {
      return;
    }

    this.closed = false;
  }

  /**
   * Close a container-like object
   */
  close() {
    if (this.closed || !this.closeable) {
      return;
    }

    this.closed = true;
  }

  /**
   * Lock a container-like object
   */
  lock() {
    if (this.locked || !this.closeable) {
      return;
    }

    this.close();
    this.locked = true;
  }

  /**
   * Unlock a container-like object
   */
  unlock() {
    if (!this.locked) {
      return;
    }

    this.locked = false;
  }

  hydrate(state, serialized = {}) {
    if (this.__hydrated) {
      Logger.warn('Attempted to hydrate already hydrated item.');
      return false;
    }

    // perform deep copy if behaviors is set to prevent sharing of the object between
    // item instances
    if (serialized.behaviors) {
      const behaviors = JSON.parse(JSON.stringify(serialized.behaviors));
      this.behaviors = new Map(Object.entries(behaviors));
    }

    this.setupBehaviors(state.ItemBehaviorManager);

    this.description = serialized.description || this.description;
    this.keywords    = serialized.keywords || this.keywords;
    this.name        = serialized.name || this.name;
    this.roomDesc    = serialized.roomDesc || this.roomDesc;
    this.metadata = JSON.parse(JSON.stringify(serialized.metadata || this.metadata));
    this.closed = 'closed' in serialized ? serialized.closed : this.closed;
    this.locked = 'locked' in serialized ? serialized.locked : this.locked;

    if (typeof this.area === 'string') {
      this.area = state.AreaManager.getArea(this.area);
    }

    // if the item was saved with a custom inventory hydrate it
    if (this.inventory) {
      this.inventory.hydrate(state, this);
    } else {
    // otherwise load its default inv
      this.defaultItems.forEach(defaultItemId => {
        Logger.verbose(`\tDIST: Adding item [${defaultItemId}] to item [${this.name}]`);
        const newItem = state.ItemFactory.create(this.area, defaultItemId);
        newItem.hydrate(state);
        state.ItemManager.add(newItem);
        this.addItem(newItem);
      });
    }

    this.__hydrated = true;
  }

  serialize() {
    let behaviors = {};
    for (const [key, val] of this.behaviors) {
      behaviors[key] = val;
    }

    return {
      entityReference: this.entityReference,
      inventory: this.inventory && this.inventory.serialize(),

      // metadata is serialized/hydrated to save the state of the item during gameplay
      // example: the players a food that is poisoned, or a sword that is enchanted
      metadata: this.metadata,

      description: this.description,
      keywords: this.keywords,
      name: this.name,
      roomDesc: this.roomDesc,

      closed: this.closed,
      locked: this.locked,

      // behaviors are serialized in case their config was modified during gameplay
      // and that state needs to persist (charges of a scroll remaining, etc)
      behaviors,
    };
  }
}

module.exports = Item;
