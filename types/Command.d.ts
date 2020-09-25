import { CommandType } from './CommandType';
import { Player } from './Player';
import { PlayerRoles } from './PlayerRoles';

export interface CommandDef {
  name: string;
  func: function;
  type?: CommandType;
  aliases?: string[];
  usage?: string;
  requiredRole?: PlayerRoles;
  metadata?: Record<string, any>;
}

export declare class Command {
  bundle: string;
  type: CommandType;
  name: string;
  func: function;
  aliases?: string[];
  usage: string;
  requiredRole: PlayerRoles;
  file: string;
  metadata: Record<string, any>;

  constructor(bundle: string, name: string, def: CommandDef, file: string);

  execute(args: string, player: Player, arg0?: string): any;
}