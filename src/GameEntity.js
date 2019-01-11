'use strict';

const EventEmitter = require('events');
const Metadatable = require('./Metadatable');
const Scriptable = require('./Scriptable');

/**
 * @extends EventEmitter
 * @mixes Metadatable
 * @mixes Scriptable
 */
class GameEntity extends Scriptable(Metadatable(EventEmitter)) {}

module.exports = GameEntity;
