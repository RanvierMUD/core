'use strict';

/** @typedef {{ execute: function (), label: string, lag: number= }} */
var CommandExecutable;

/**
 * Keeps track of the queue off commands to execute for a player
 */
class CommandQueue {
  constructor() {
    this.commands = [];
    this.lag = 0;
    this.lastRun = 0;
  }

  /**
   * Safely add lag to the current queue. This method will not let you add a
   * negative amount as a safety measure. If you want to subtract lag you can
   * directly manipulate the `lag` property.
   * @param {number} amount milliseconds of lag
   */
  addLag(amount) {
    this.lag += Math.max(0, amount);
  }

  /**
   * @param {CommandExecutable} executable Thing to run with an execute and a queue label
   * @param {number} lag Amount of lag to apply to the queue after the command is run
   */
  enqueue(executable, lag) {
    let newIndex = this.commands.push(Object.assign(executable, { lag })) - 1;
    return newIndex;
  }

  get hasPending() {
    return this.commands.length > 0;
  }

  /**
   * Execute the currently pending command if it's ready
   * @return {boolean} whether the command was executed
   */
  execute() {
    if (!this.commands.length || this.msTilNextRun > 0) {
      return false;
    }

    const command = this.commands.shift();

    this.lastRun = Date.now();
    this.lag = command.lag;
    command.execute();
    return true;
  }

  /**
   * @type {Array<Object>}
   */
  get queue() {
    return this.commands;
  }

  /**
   * Flush all pending commands. Does _not_ reset lastRun/lag. Meaning that if
   * the queue is flushed after a command was just run its lag will still have
   * to expire before another command can be run. To fully reset the queue use
   * the reset() method.
   */
  flush() {
    this.commands = [];
  }

  /**
   * Completely reset the queue and any lag. This is fairly dangerous as if the
   * player could reliably reset the queue they could negate any command lag. To
   * clear commands without altering lag use flush()
   */
  reset() {
    this.flush();
    this.lastRun = 0;
    this.lag = 0;
  }

  /**
   * Seconds until the next command can be executed
   * @type {number}
   */
  get lagRemaining() {
    return this.msTilNextRun / 1000;
  }

  /**
   * Milliseconds til the next command can be executed
   * @type {number}
   */
  get msTilNextRun() {
    return Math.max(0, (this.lastRun + this.lag) - Date.now());
  }

  /**
   * For a given command index find how many seconds until it will run
   * @param {number} commandIndex
   * @return {number}
   */
  getTimeTilRun(commandIndex) {
    return this.getMsTilRun(commandIndex) / 1000;
  }

  /**
   * Milliseconds until the command at the given index can be run
   * @param {number} commandIndex
   * @return {number}
   */
  getMsTilRun(commandIndex) {
    if (!this.commands[commandIndex]) {
      throw new RangeError("Invalid command index");
    }

    let lagTotal = this.msTilNextRun;
    for (let i = 0; i < this.commands.length; i++) {
      if (i === commandIndex) {
        return lagTotal;
      }

      lagTotal += this.commands[i].lag;
    }
  }
}

module.exports = CommandQueue;
