export declare class EventManager {
    constructor();

    /**
     * Fetch all listeners for a given event
     * @param {string} name
     * @return {Set}
     */
    get(name: string): Set;

    /**
     * @param {string}   eventName
     * @param {Function} listener
     */
    add(eventName: string, listener: Function): void;

    /**
     * Attach all currently added events to the given emitter
     * @param {EventEmitter} emitter
     * @param {Object} config
     */
    attach(emitter: EventEmitter, config: Object);

    /**
     * Remove all listeners for a given emitter or only those for the given events
     * If no events are given it will remove all listeners from all events defined
     * in this manager.
     *
     * Warning: This will remove _all_ listeners for a given event list, this includes
     * listeners not in this manager but attached to the same event
     *
     * @param {EventEmitter}  emitter
     * @param {?string|iterable} events Optional name or list of event names to remove listeners from
     */
    detach(emitter: EventEmitter, events: ?string|iterable): void;
}