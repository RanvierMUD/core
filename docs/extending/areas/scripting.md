All entities in Ranvier can be scripted: Items, NPCs, and Rooms. There are two ways to script an entity: a unique
script, or a behavior.  A unique script is a non-configurable script attached directly to that entity. Each entity can
only have one unique script.  Behaviors, on the other hand, are configurable, reusable, and an entity may have many
behaviors.

[TOC]

## Unique Script

Unique scripts are stored under the `scripts/` folder for a given area with a subfolder for each entity type, like so:

```
bundles/my-area/areas/limbo/
  scripts/
    npcs/
      rat.js
    items/
      sword.js
    rooms/
      test.js
```

As a matter of convention scripts are named, `<entity id>.js`. It's not _required_ but it will help a
lot when trying to figure out what script goes to what entity.

See the relevant entity's guide section on how to set this in the yaml file.

### File Structure

```javascript
'use strict';

module.exports = {
  listeners: {
    someEvent: state => (/* event args: see the docs for said event to see its args */) {
      // do stuff here
    },
  },
};
```


## Behaviors

Behaviors are created inside the `behaviors/` directory inside your bundle _outside_ of your `areas/` directory. Another
key difference is that they are configurable in the entity's .yaml definition (see each entity type's documentation for
some examples).

```
bundles/my-bundle/
  areas/
    limbo/
    ...
  behaviors/
    npcs/
      aggro.js
    items/
    rooms/
```

### File Structure

The first argument to a behavior listener is always the config object defined in the entity yaml file

```javascript
'use strict';

module.exports = {
  listeners: {
    someEvent: state => (config, /* event args */) => {
      /* given the example items.yml below `config` would be equal to
      { hello: "World" }
      */
    }
  }
};
```

Example behavior configuration for an item:
```yaml
- id: 9
  name: 'My Item'
  behaviors:
    test:
      hello: "World"
```
## Triggering a script/behavior

You may have something like the following in your code. It could be in a command or skill or even another script

```javascript
// trigger the 'foo' listener attached to `myItem`
myItem.emit('foo', player, 'baz');
```

**NOTE**: When writing an `emit` call to activate a behavior you DO NOT have to manually pass the `config` argument,
the engine automatically prepends it for behaviors.

## Default events

This is a list of events that are emitted by default in Ranvier, from one of two sources:

***Engine*** - Events that come from the engine itself (from core) and will _always_ be available.

***Default Bundles*** - Events that come from one of the `ranvier-*` bundles and may not be available if you have disabled them.

Events are shown as:
`eventName` _`(ArgumentType arguments)`_
:    Details of event

### NPCs

#### Engine

`combatEnd`
:    Combat has ended, emitted when an NPC's list of combatants becomes empty

`combatStart` _`(Character target)`_
:    Combat has started against `target`, emitted when NPC was not in combat and now is. Event is _not_ fired if the NPC
was already in combat when new combatants are added

`damaged` _`(Damage damage)`_
:    Something has decreased one of the NPC's attributes. This emits when any attribute is damaged, not just health. See `src/Damage.js`
for details of information available from `damage` argument.

`healed` _`(Heal heal)`_
:    Same as `damaged` but increased attribute instead of decreased.

`hit` _`(Damage damage, Character target)`_
:    This NPC caused damage to the target. Target may be itself.

`heal` _`(Heal heal, Character target)`_
:    Same as `hit` but increased attribute instead of decreased.

`spawn`
:    NPC is initially created; this event emits immediately after NPC is placed in its target room.

`updateTick`
:    This event is special in that it automatically fires every tenth of a second on Rooms, Items, NPCs, and Players.
This event should be used for any event that is based on time, e.g., NPC should wander around every N seconds.

#### Core Bundles

`deathblow` _`(Character target)`_
:    NPC just killed `target`.

`killed`
:    NPC died.

`playerDropItem` _`(Player player, Item item)`_
:    `player` just dropped `item` in the room with the NPC.

`playerEnter` _`(Player player)`_
:    `player` just entered the room with the NPC.

`playerLeave`_`(Player player)`_
:    `player` just left the room. **NOTE**: `playerLeave` is actually fired _before_ the player is removed from the room.

### Items

#### Engine

`updateTick`
:    See `updateTick` under NPCs.

#### Core Bundles

`drop` _`(Player player)`_
:    `player` just dropped this item.

`equip` _`(Player player)`_
:    `player` just equipped this item.

`get` _`(Player player)`_
:    `player` just picked up this item.

`put` _`(Player player, Item container)`_
:    `player` just put this item into `container`.

### Rooms

#### Engine

`updateTick`
:    See `updateTick` for NPCs.

#### Core Bundles

`playerEnter` _`(Player player)`_
:    `player` just entered this room.

`playerLeave`_`(Player player)`_
:    `player` just left this room. **NOTE**: `playerLeave` is actually fired _before_ the player is removed from the room.
