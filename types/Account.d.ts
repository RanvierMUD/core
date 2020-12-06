export declare interface AccountConfig {
  /** @property {string} username */
  username: string;
  /** @property {Array<string>} characters List of character names in this account */
  characters?: string[];
  /** @property {string} password Hashed password */
  password: string;
  /** @property {boolean} banned Whether this account is banned or not */
  banned?: boolean;
  /** @property {boolean} deleted Whether this account is deleted or not */
  deleted?: boolean;
  // Arbitrary data bundles are free to shove whatever they want in
  // WARNING: values must be JSON.stringify-able
  metadata?: Record<string, any>;
}

export declare interface SerializedAccount {
  username: string;
  characters: string[];
  password: string;
  metadata: Record<string, any>;
}

export declare class Account {
  /** @property {string} username */
  username: string;
  /** @property {Array<string>} characters List of character names in this account */
  characters: string[];
  /** @property {string} password Hashed password */
  password: string;
  /** @property {boolean} banned Whether this account is banned or not */
  banned: boolean;

  /**
   * @param {AccountConfig} data Account save data
   */
  constructor(data: AccountConfig);

  /**
   * @return {string}
   */
  getUsername(): string;

  /**
   * @param {string} username
   */
  addCharacter(username: string): void;

  /**
   * @param {string} name
   * @return {boolean}
   */
  hasCharacter(name: string): boolean;

  /**
   * @param {string} name Delete one of the chars
   */
  deleteCharacter(name: string): void;

  /**
   * @param {string} name Removes the deletion of one of the chars
   */
  undeleteCharacter(name: string): void;

  /**
   * @param {string} password Unhashed password. Is hashed inside this function
   */
  setPassword(pass: string): void;

  /**
   * @param {string} pass Unhashed password to check against account's password
   * @return {boolean}
   */
  checkPassword(pass: string): boolean;

  /**
   * @param {?function} callback after-save callback
   */
  save(callback?: () => void): void;

  /**
     * Set this account to banned
        There is no unban because this can just be done by manually editing the account file
    */
  ban(): void;

  /**
     * Set this account to deleted
     There is no undelete because this can just be done by manually editing the account file
    */
  deleteAccount(): void;

  /**
   * Gather data from account object that will be persisted to disk
   *
   * @return {Object}
   */
  serialize(): SerializedAccount;
}
