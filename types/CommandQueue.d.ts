/** @typedef {{ execute: function (), label: string, lag: number= }} */
export declare type CommandExecutable = {
    execute: Function;
    label: string;
    lag: number;
}

export declare class CommandQueue {
    constructor();

    /**
     * Safely add lag to the current queue. This method will not let you add a
     * negative amount as a safety measure. If you want to subtract lag you can
     * directly manipulate the `lag` property.
     * @param {number} amount milliseconds of lag
     */
    addLag(amount: number): void;

    /**
     * @param {CommandExecutable} executable Thing to run with an execute and a queue label
     * @param {number} lag Amount of lag to apply to the queue after the command is run
     * @returns {number}
     */
    enqueue(executable: CommandExecutable, lag: number): number;

    hasPending(): boolean;

    /**
     * Execute the currently pending command if it's ready
     * @return {boolean} whether the command was executed
     */
    execute(): boolean;

    /**
     * @type {Array<Object>}
     */
    queue(): Array<Object>;

    /**
     * Flush all pending commands. Does _not_ reset lastRun/lag. Meaning that if
     * the queue is flushed after a command was just run its lag will still have
     * to expire before another command can be run. To fully reset the queue use
     * the reset() method.
     */
    flush(): void;

    /**
     * Completely reset the queue and any lag. This is fairly dangerous as if the
     * player could reliably reset the queue they could negate any command lag. To
     * clear commands without altering lag use flush()
     */
    reset(): void;

    /**
     * Seconds until the next command can be executed
     * @type {number}
     */
    lagRemaining(): number;

    /**
     * Milliseconds til the next command can be executed
     * @type {number}
     */
    msTilNextRun(): number;

    /**
     * For a given command index find how many seconds until it will run
     * @param {number} commandIndex
     * @return {number}
     */
    getTimeTilRun(commandIndex: number): number;

    /**
     * Milliseconds until the command at the given index can be run
     * @param {number} commandIndex
     * @return {number}
     */
    getMsTilRun(commandIndex: number): number;
}