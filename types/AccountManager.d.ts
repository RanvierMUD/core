import { Account } from '../src/Account';
import { EntityLoader} from '../src/EntityLoader';

export namespace AccountManager {
    let accounts: Map<string,Account>;
    let loader: prova;

    function constructor();

    /**
     * Set the entity loader from which accounts are loaded
     * @param {EntityLoader}
     */
    function setLoader(loader: EntityLoader): void;

    /**
     * @param {Account} acc
     */
    function addAccount(acc: Account): void;

    /**
     * @param {string} username
     * @return {Account|undefined}
     */
    function getAccount(username: string): Account|undefined;

    /**
     * @param {string} username
     * @param {boolean} force Force reload data from disk
     */
    function loadAccount(username: string, force: boolean): void;
}