export namespace Account {
    let username: string;
    let characters: Array<string>;
    let password: string;
    let banned: boolean;

    /**
     * @param {Object} data Account save data
     */
    function constructor(data: Object);

    /**
     * @return {string}
     */
    function getUsername(): string;

    /**
     * @param {string} username
     */
    function addCharacter(username: string): void;

    /**
     * @param {string} name
     * @return {boolean}
     */
    function hasCharacter(name: string): boolean;

    /**
     * @param {string} name Delete one of the chars
     */
    function deleteCharacter(name: string): void;

    /**
     * @param {string} name Removes the deletion of one of the chars
     */
    function undeleteCharacter(name: string): void;

    /**
     * @param {string} password Unhashed password. Is hashed inside this function
     */
    function setPassword(pass: string): void;

    /**
     * @param {string} pass Unhashed password to check against account's password
     * @return {boolean}
     */
    function checkPassword(pass: string): boolean;

    /**
     * @param {function} callback after-save callback
     */
    function save(callback: Function): void;

    /**
     * Set this account to banned
        There is no unban because this can just be done by manually editing the account file
    */
    function ban(): void;

    /**
     * Set this account to deleted
     There is no undelete because this can just be done by manually editing the account file
    */
    function deleteAccount()

    /**
     * Gather data from account object that will be persisted to disk
     *
     * @return {Object}
     */
    function serialize(): Object;
}