const assert = require('assert');
const Account = require('../../src/Account');

describe('Account',  function () {
    /** @param {AccountDef} account */
    let account = null;
    /** @param {AccountConfig} mockedAccountData */
    const mockedAccountData = {
        username: 'testusername',
        characters: ['testchar'],
        password: 'testpass',
        banned: false,
    }

    const originalDateNow = Date.now;

    beforeEach(function (done) {
        account = new Account(mockedAccountData);
        done();
    });

    afterEach(function (done) {
        Date.now = originalDateNow;
        done();
    });

    describe('#init', function () {
        it('should be an instance of account', function (done) {
            assert.equal('Account', account.constructor.name);
            done();
        });
    });


});
