const assert = require('assert');
const Account = require('../../src/Account');

describe('Account', function () {
  /** @param {AccountDef} account */
  let account = null;
  /** @param {AccountConfig} mockedAccountData */
  const mockedAccountData = {
    username: 'testusername',
    characters: [],
    password: null,
  };
  const testChar = {
    deleted: false,
    username: 'testchar',
  };
  const testPass = 'testpass';

  const originalDateNow = Date.now;

  beforeEach(function (done) {
    account = new Account(mockedAccountData);
    done();
  });

  afterEach(function (done) {
    Date.now = originalDateNow;
    done();
  });

  describe('#base methods', function () {
    it('should be an instance of account', function (done) {
      assert.equal('Account', account.constructor.name);
      done();
    });
  });

  describe('#properties', function () {
    it('should get username', function (done) {
      assert.equal(mockedAccountData.username, account.getUsername());
      done();
    });

    it('should set a password', function (done) {
      /**
       * setPassword function also try to save file on disk,
       * but it don't find it and raise an exception
       */
      assert.throws(() => account.setPassword(testPass));
      done();
    });

    it('should check a password', function (done) {
      assert.throws(() => account.setPassword(testPass));
      assert.equal(true, account.checkPassword(testPass));
      done();
    });

    it('should save data', function (done) {
      /**
       * save function also try to save file on disk,
       * but it don't find it and raise an exception
       */
      assert.throws(() => account.save(() => {}));
      done();
    });

    it('should mark account as banned', function (done) {
      /**
       * ban function also try to save file on disk,
       * but it don't find it and raise an exception
       */
      assert.throws(() => account.ban(() => {}));
      assert.equal(true, account.banned);
      done();
    });

    it('should delete accont and its characters', function (done) {
      /**
       * save function also try to save file on disk,
       * but it don't find it and raise an exception
       */
      assert.throws(() => account.deleteAccount(() => {}));
      assert.equal(true, account.deleted);
      assert.deepEqual([], account.characters);
      done();
    });

    it('should serialize and return accont data', function (done) {
      assert.deepEqual(
        { ...mockedAccountData, metadata: {} },
        account.serialize()
      );
      done();
    });
  });

  describe('#characters', function () {
    it('should add a character to account', function (done) {
      assert.equal(undefined, account.hasCharacter(testChar.username));
      account.addCharacter(testChar.username);
      assert.deepEqual(testChar, account.hasCharacter(testChar.username));
      done();
    });

    it('should delete a character from account', function (done) {
      assert.deepEqual(testChar, account.hasCharacter(testChar.username));
      /**
       * deleteCaracter function also try to save file on disk,
       * but it don't find it and raise an exception
       */
      assert.throws(() => account.deleteCharacter(testChar.username));
      assert.deepEqual(
        { ...testChar, deleted: true },
        account.hasCharacter(testChar.username)
      );
      done();
    });

    it('should undelete a character from account', function (done) {
      assert.deepEqual(
        { ...testChar, deleted: true },
        account.hasCharacter(testChar.username)
      );
      /**
       * undeleteCaracter function also try to save file on disk,
       * but it don't find it and raise an exception
       */
      assert.throws(() => account.undeleteCharacter(testChar.username));
      assert.deepEqual(
        { ...testChar, deleted: false },
        account.hasCharacter(testChar.username)
      );
      done();
    });
  });
});
