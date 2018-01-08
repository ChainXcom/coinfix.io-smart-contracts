'use strict';

const MerchantSubscription = artifacts.require('./MerchantSubscription.sol')
    , chai = require('chai')
    , chaiAsPromised = require('chai-as-promised')
    , assert = chai.assert;

chai.use(chaiAsPromised);

contract('MerchantSubscription:init', (accounts) => {
    const owner_address = accounts[0]
        , merchant_address = accounts[1];

    it('init smart contract', async () => {
        const instance = await MerchantSubscription.deployed()
            , merchant = await instance.merchant.call({from: owner_address})
            , owner = await instance.owner.call({from: owner_address})
        ;

        assert.notEqual(merchant, '0x0');
        assert.equal(merchant, merchant_address);
        return assert.equal(owner, owner_address);
    });

    it('init smart contract with null merchant address', () => {
        return assert.isRejected(MerchantSubscription.new(null, 'invalid merchant address', {from: owner_address}), `VM Exception`)
    });
});
