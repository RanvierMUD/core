import { EventEmitter } from 'events';

export declare class GameServer extends EventEmitter {
  /**
   * @param {commander} commander
   * @fires GameServer#startup
   */
  startup(commander: object): void;

  /**
   * @fires GameServer#shutdown
   */
  shutdown(): void;
}
