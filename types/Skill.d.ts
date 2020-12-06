import { Attribute } from './Attribute';
import { Character } from './Character';
import { Effect } from './Effect';
import { GameState } from './GameState';
import { Player } from './Player';
import { SkillType } from './SkillType';

export declare type SkillResource = {
  attribute: string;
  cost: number;
};

export declare type SkillConfig = {
  configureEffect: Function;
  cooldown:
    | number
    | {
        group: string;
        length: number;
      };
  effect: Effect;
  flags: string[];
  info: Function;
  initiatesCombat?: boolean;
  name: string;
  requiresTarget?: boolean;
  resource: null | SkillResource;
  run: Function;
  targetSelf?: boolean;
  type: SkillType;
  options?: object;
};

export declare type CooldownConfig = {
  config: {
    name: string;
    description: string;
    unique: boolean;
    type: string;
  };
  state: {
    cooldownId: null | string;
  };
  listeners: {
    effectDeactivated: Function;
  };
};

/**
 * @property {function (Effect)} configureEffect modify the skill's effect before adding to player
 * @property {null|number}      cooldownLength When a number > 0 apply a cooldown effect to disallow usage
 *                                       until the cooldown has ended
 * @property {string}           effect Id of the passive effect for this skill
 * @property {Array<SkillFlag>} flags
 * @property {function ()}      info Function to run to display extra info about this skill
 * @property {function ()}      run  Function to run when skill is executed/activated
 * @property {GameState}        state
 * @property {SkillType}        type
 */
export declare class Skill {
  /**
   * @param {string} id
   * @param {object} config
   * @param {GameState} state
   */
  constructor(id: string, config: SkillConfig, state: GameState);

  /**
   * perform an active skill
   * @param {string} args
   * @param {Player} player
   * @param {Character} target
   */
  execute(args: string, player: Player, target: Character): boolean;

  /**
   * @param {Player} player
   * @return {boolean} If the player has paid the resource cost(s).
   */
  payResourceCosts(player: Player): boolean;

  // Helper to pay a single resource cost.
  payResourceCost(player: Player, resource: SkillResource): Boolean;

  activate(player: Player): void;

  /**
   * @param {Character} character
   * @return {boolean|Effect} If on cooldown returns the cooldown effect
   */
  onCooldown(character: Character): boolean | Effect;

  /**
   * Put this skill on cooldown
   * @param {Character} character
   */
  cooldown(character: Character): void;

  getCooldownId(): string;

  /**
   * Create an instance of the cooldown effect for use by cooldown()
   *
   * @private
   * @return {Effect}
   */
  createCooldownEffect(): Effect;

  getDefaultCooldownConfig(): CooldownConfig;

  /**
   * @param {Character} character
   * @return {boolean}
   */
  hasEnoughResources(character: Character): boolean;

  /**
   * @param {Character} character
   * @param {{ attribute: string, cost: number}} resource
   * @return {boolean}
   */
  hasEnoughResource(character: Character, resource: SkillResource): boolean;
}
