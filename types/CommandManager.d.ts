import { Command } from "./Command";

export declare class CommandManager {
  commands: Map<string, Command>;

  /**
   * Get command by name
   */
  get(command: string): Command | null;

  /**
   * Add the command and set up aliases
   */
  add(command: Command): void;

  remove(command: Command): void;

  /**
   * Find a command from a partial name
   */
  find(search: string): Command | null;

  /**
   * Find a command from a partial name
   */
  find(search: string, returnAlias: boolean): Command | { command: Command, alias: string } | null;
}
