'use strict';

const EventEmitter = require('events');
const Data = require('./Data');
const Player = require('./Player');
const EventManager = require('./EventManager');

/**
 * Keeps track of all active players in game
 * @extends EventEmitter
 * @property {Map} players
 * @property {EventManager} events Player events
 * @property {EntityLoader} loader
 * @listens PlayerManager#save
 * @listens PlayerManager#updateTick
 */
class PlayerManager extends EventEmitter {
  constructor() {
    super();
    this.players = new Map();
    this.events = new EventManager();
    this.loader = null;
    this.on('updateTick', this.tickAll);
  }

  /**
   * Set the entity loader from which players are loaded
   * @param {EntityLoader}
   */
  setLoader(loader) {
    this.loader = loader;
  }

  /**
   * @param {string} name
   * @return {Player}
   */
  getPlayer(name) {
    return this.players.get(name.toLowerCase());
  }

  /**
   * @param {Player} player
   */
  addPlayer(player) {
    this.players.set(this.keyify(player), player);
  }

  /**
   * Remove the player from the game. WARNING: You must manually save the player first
   * as this will modify serializable properties
   * @param {Player} player
   * @param {boolean} killSocket true to also force close the player's socket
   */
  removePlayer(player, killSocket = false) {
    if (killSocket) {
      player.socket.end();
    }

    player.removeAllListeners();
    player.removeFromCombat();
    player.effects.clear();
    if (player.room) {
      player.room.removePlayer(player);
    }
    player.__pruned = true;
    this.players.delete(this.keyify(player));
  }

  /**
   * @return {array}
   */
  getPlayersAsArray() {
    return Array.from(this.players.values());
  }

  /**
   * @param {string}   behaviorName
   * @param {Function} listener
   */
  addListener(event, listener) {
    this.events.add(event, listener);
  }

  /**
   * @param {Function} fn Filter function
   * @return {array}
   */
  filter(fn) {
    return this.getPlayersAsArray().filter(fn);
  }

  /**
   * Load a player for an account
   * @param {GameState} state
   * @param {Account} account
   * @param {string} username
   * @param {boolean} force true to force reload from storage
   * @return {Player}
   */
  async loadPlayer(state, account, username, force) {
    if (this.players.has(username) && !force) {
      return this.getPlayer(username);
    }

    if (!this.loader) {
      throw new Error('No entity loader configured for players');
    }

    const data = await this.loader.fetch(username);
    data.name = username;

    let player = new Player(data);
    player.account = account;

    this.events.attach(player);

    this.addPlayer(player);
    return player;
  }

  /**
   * Turn player into a key used by this class's map
   * @param {Player} player
   * @return {string}
   */
  keyify(player) {
    return player.name.toLowerCase();
  }

  /**
   * @param {string} name
   * @return {boolean}
   */
  exists(name) {
    return Data.exists('player', name);
  }

  /**
   * Save a player
   * @fires Player#save
   */
  async save(player) {
    if (!this.loader) {
      throw new Error('No entity loader configured for players');
    }

    await this.loader.update(player.name, player.serialize());

    /**
     * @event Player#saved
     */
    player.emit('saved');
  }

  /**
   * @fires Player#saved
   */
  async saveAll() {
    for (const [ name, player ] of this.players.entries()) {
      await this.save(player);
      /**
       * @event Player#save
       */
      player.emit('saved', playerCallback);
    }
  }

  /**
   * @fires Player#updateTick
   */
  tickAll() {
    for (const [ name, player ] of this.players.entries()) {
      /**
       * @event Player#updateTick
       */
      player.emit('updateTick');
    }
  }

  /**
   * Used by Broadcaster
   * @return {Array<Character>}
   */
  getBroadcastTargets() {
    return this.players;
  }
}

module.exports = PlayerManager;
