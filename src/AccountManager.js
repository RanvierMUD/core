'use strict';

const Account = require('./Account');

/**
 * Creates/loads {@linkplain Account|Accounts}
 * @property {Map<string,Account>} accounts
 * @property {EntityLoader} loader
 */
class AccountManager {
  constructor() {
    this.accounts = new Map();
    this.loader = null;
  }

  /**
   * Set the entity loader from which accounts are loaded
   * @param {EntityLoader}
   */
  setLoader(loader) {
    this.loader = loader;
  }

  /**
   * @param {Account} acc
   */
  addAccount(acc) {
    this.accounts.set(acc.username, acc);
  }

  /**
   * @param {string} username
   * @return {Account|undefined}
   */
  getAccount(username) {
    return this.accounts.get(username);
  }

  /**
   * @param {string} username
   * @param {boolean} force Force reload data from disk
   */
  async loadAccount(username, force) {
    if (this.accounts.has(username) && !force) {
      return this.getAccount(username);
    }

    if (!this.loader) {
      throw new Error('No entity loader configured for accounts');
    }

    const data = await this.loader.fetch(username);

    let account = new Account(data);
    this.addAccount(account);

    return account;
  }
}

module.exports = AccountManager;
