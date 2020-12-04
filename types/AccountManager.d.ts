import { Account } from './Account';
import { EntityLoader} from './EntityLoader';

export declare class AccountManager {
    /** @property {Map<string,Account>} accounts */
    accounts: Map<string,Account>;
    /** @property {EntityLoader} loader */
    loader: EntityLoader;

    constructor();

    /**
     * Set the entity loader from which accounts are loaded
     * @param {EntityLoader}
     */
    setLoader(loader: EntityLoader): void;

    /**
     * @param {Account} acc
     */
    addAccount(acc: Account): void;

    /**
     * @param {string} username
     * @return {Account|undefined}
     */
    getAccount(username: string): Account|undefined;

    /**
     * @param {string} username
     * @param {boolean} force Force reload data from disk
     */
    loadAccount(username: string, force: boolean): Promise<any>;
}