'use strict';

const MerchantSubscription = artifacts.require('./MerchantSubscription.sol')
    , chai = require('chai')
    , chaiAsPromised = require('chai-as-promised')
    , assert = chai.assert;

chai.use(chaiAsPromised);

contract('MerchantSubscription:activate', (accounts) => {
    const merchant_address = accounts[1]
        , customer_address = accounts[2]
        , bob_address = accounts[3]
        , amount = web3.toWei(0.01, 'ether')
    ;

    it(`send eth when contract is not active`, async () => {
        const instance = await MerchantSubscription.deployed();

        return assert.isRejected(instance.sendTransaction({from: customer_address, value: amount}), `VM Exception`);
    });

    it(`activate failed when called by !merchant address`, async () => {
        const instance = await MerchantSubscription.deployed();

        return assert.isRejected(instance.activate({from: bob_address}), `VM Exception`);
    });

    it('activate and transfer success', async () => {
        const instance = await MerchantSubscription.deployed()
            , balance = await instance.getBalance.call();

        assert.equal(balance, 0);

        // activate and check status
        await instance.activate({from: merchant_address});
        const status = await instance.status.call();
        assert.equal(status[0], true);

        // send eth and check status
        await instance.sendTransaction({from: customer_address, value: amount});
        const balance_after = await instance.getBalance.call();
        return assert.equal(balance_after, amount);
    });

    it(`call when contract is already activated`, async () => {
        const instance = await MerchantSubscription.deployed();

        return assert.isRejected(instance.activate({from: merchant_address}), `VM Exception`);
    });
});
