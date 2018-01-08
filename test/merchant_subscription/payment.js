'use strict';

const MerchantSubscription = artifacts.require('./MerchantSubscription.sol')
    , chai = require('chai')
    , chaiAsPromised = require('chai-as-promised')
    , assert = chai.assert;

chai.use(chaiAsPromised);

contract('MerchantSubscription:payment', (accounts) => {
    const owner_address = accounts[0]
        , merchant_address = accounts[1]
        , customer_address = accounts[2]
        , payment_amount = web3.toWei(0.1, 'ether')
    ;

    it(`withdrawal not activated`, async () => {
        const instance = await MerchantSubscription.deployed();

        return assert.isRejected(instance.sendTransaction({
            from: customer_address,
            value: payment_amount
        }), `VM Exception`);
    });

    it(`withdrawal activated`, async () => {
        const instance = await MerchantSubscription.deployed();

        await instance.activate({from: merchant_address});

        await instance.sendTransaction({from: customer_address, value: payment_amount});

        const contract_balance = await instance.getBalance.call();

        return assert.equal(contract_balance.toNumber(), payment_amount);
    });

    it(`withdrawal paused`, async () => {
        const instance = await MerchantSubscription.deployed();

        await instance.pause({from: owner_address});

        return assert.isRejected(instance.sendTransaction({from: customer_address, value: payment_amount}), `VM Exception`);
    });

    it(`withdrawal resumed`, async () => {
        const instance = await MerchantSubscription.deployed();

        await instance.unpause({from: owner_address});

        await instance.sendTransaction({from: customer_address, value: payment_amount});

        const contract_balance = await instance.getBalance.call();

        return assert.equal(contract_balance.toNumber(), payment_amount * 2);
    });
});
