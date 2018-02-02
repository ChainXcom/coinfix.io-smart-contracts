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
        , amount_below_minimum = web3.toWei(0.001, 'ether')
        , data = '0x' + new Buffer('789c475f-e7a4-4fa4-bf4f-00a00932fc75').toString('hex')
    ;

    it(`contract not activated`, async () => {
        const instance = await MerchantSubscription.deployed();

        return assert.isRejected(instance.sendTransaction({
            from: customer_address,
            value: payment_amount,
            data
        }), `VM Exception`);
    });

    it(`contract activated`, async () => {
        const instance = await MerchantSubscription.deployed();

        await instance.activate({from: merchant_address});

        await instance.sendTransaction({from: customer_address, value: payment_amount, data});

        const contract_balance = await instance.getBalance.call();

        return assert.equal(contract_balance.toNumber(), payment_amount);
    });

    it(`contract paused`, async () => {
        const instance = await MerchantSubscription.deployed();

        await instance.pause({from: owner_address});

        return assert.isRejected(instance.sendTransaction({
            from: customer_address,
            value: payment_amount,
            data
        }), `VM Exception`);
    });

    it(`contract resumed`, async () => {
        const instance = await MerchantSubscription.deployed();

        await instance.unpause({from: owner_address});

        await instance.sendTransaction({from: customer_address, value: payment_amount, data});

        const contract_balance = await instance.getBalance.call();

        return assert.equal(contract_balance.toNumber(), payment_amount * 2);
    });

    it(`amount to low`, async () => {
        const instance = await MerchantSubscription.deployed();

        return assert.isRejected(instance.sendTransaction({
            from: customer_address,
            value: amount_below_minimum,
            data
        }), `VM Exception`);
    });
});
