import { Room } from './Room';

export namespace Player {
    function constructor(data);

    /**
     * @see CommandQueue::enqueue
     */
    function queueCommand(executable, lag);

    /**
     * Proxy all events on the player to the quest tracker
     * @param {string} event
     * @param {...*}   args
     */
    function emit(event, ...args);

    /**
     * Convert prompt tokens into actual data
     * @param {string} promptStr
     * @param {object} extraData Any extra data to give the prompt access to
     */
    function interpolatePrompt(promptStr: string, extraData: object);

    /**
     * Add a line of text to be displayed immediately after the prompt when the prompt is displayed
     * @param {string}      id       Unique prompt id
     * @param {function ()} renderer Function to call to render the prompt string
     * @param {?boolean}    removeOnRender When true prompt will remove itself once rendered
     *    otherwise prompt will continue to be rendered until removed.
     */
    function addPrompt(id: string, renderer: Function, removeOnRender: boolean);

    /**
     * @param {string} id
     */
    function removePrompt(id: string);

    /**
     * @param {string} id
     * @return {boolean}
     */
    function hasPrompt(id: string): boolean;

    /**
     * Move the player to the given room, emitting events appropriately
     * @param {Room} nextRoom
     * @param {function} onMoved Function to run after the player is moved to the next room but before enter events are fired
     * @fires Room#playerLeave
     * @fires Room#playerEnter
     * @fires Player#enterRoom
     */
    function moveTo(nextRoom: Room, onMoved: Function);

    /**
     * @param {function} callback
     */
    function save(callback: Function): void;
    function hydrate(state: Object);
    function serialize(): Object;
}
