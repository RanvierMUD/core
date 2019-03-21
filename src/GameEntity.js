'use strict';

const EffectableEntity = require('./EffectableEntity');
const Metadatable = require('./Metadatable');
const Scriptable = require('./Scriptable');

/**
 * @extends EventEmitter
 * @mixes Metadatable
 * @mixes Scriptable
 */
class GameEntity extends Scriptable(Metadatable(EffectableEntity)) {}

module.exports = GameEntity;
