import { CommandType } from './CommandType';
import { Player } from './Player';
import { PlayerRoles } from './PlayerRoles';

export interface CommandDef {
  name: string;
  func: Function;
  type?: CommandType;
  aliases?: string[];
  usage?: string;
  requiredRole?: PlayerRoles;
  metadata?: Record<string, any>;
}

export declare class Command {
  /** @property {string} bundle Bundle this command came from */
  bundle: string;
  /** @property {CommandType} type */
  type: CommandType;
  /** @property {string} name */
  name: string;
  /** @property {Function} func Actual function that gets run when the command is executed */
  func: Function;
  /** @property {string[]} aliases */
  aliases?: string[];
  /** @property {string} usage */
  usage: string;
  /** @property {PlayerRoles} requiredRole */
  requiredRole: PlayerRoles;
  /** @property {string} file File the command comes from */
  file: string;
  /** @property {Record<string, any>} metadata General use configuration object */
  metadata: Record<string, any>;

  constructor(bundle: string, name: string, def: CommandDef, file: string);

  execute(args: string, player: Player, arg0?: string): any;
}
