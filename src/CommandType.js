'use strict';

/**
 * @enum {Symbol}
 */
const CommandType = {
  COMMAND: Symbol("COMMAND"),
  SKILL: Symbol("SKILL"),
  CHANNEL: Symbol("CHANNEL"),
  MOVEMENT: Symbol("MOVEMENT"),
};

module.exports = CommandType;
