import { EventEmitter } from 'events';
import { Socket } from 'net';

export declare class TransportStream extends EventEmitter {
  get readable(): boolean;

  get writable(): boolean;

  write(): void;

  /**
   * A subtype-safe way to execute commands on a specific type of stream that invalid types will ignore. For given input
   * for command (example, `"someCommand"` ill look for a method called `executeSomeCommand` on the `TransportStream`
   * @param {string} command
   * @param {...*} args
   * @return {*}
   */
  command(command: string, ...args: any[]);

  address(): undefined;

  end(): void;

  setEncoding(): void;

  pause(): void;

  resume(): void;

  destroy(): void;

  /**
   * Attach a socket to this stream
   * @param {*} socket
   */
  attach(socket: Socket): void;
}
