'use strict';

const MerchantSubscription = artifacts.require('./MerchantSubscription.sol')
    , chai = require('chai')
    , chaiAsPromised = require('chai-as-promised')
    , assert = chai.assert;

chai.use(chaiAsPromised);

contract('MerchantSubscription:paymentData', (accounts) => {
    const merchant_address = accounts[1]
        , customer_address = accounts[2]
        , payment_amount = web3.toWei(0.1, 'ether')
        , data = '0x' + new Buffer('789c475f-e7a4-4fa4-bf4f-00a00932fc75').toString('hex')
    ;

    it(`contract activated / send transaction with data`, async () => {
        const instance = await MerchantSubscription.deployed();

        await instance.activate({from: merchant_address});

        // const event = instance['SubscriptionPaymentMade']();
        // event.watch();
        // event.get((error, logs) => {
        //     console.log('event:', JSON.stringify(logs));
        // });
        // event.stopWatching();

        await instance.sendTransaction({from: customer_address, value: payment_amount, data});
    });


    it(`send transaction without data`, async () => {
        const instance = await MerchantSubscription.deployed();
        
        return assert.isRejected(instance.sendTransaction({
            from: customer_address,
            value: payment_amount
        }), `VM Exception`);
    });

    it(`send transaction with invalid data`, async () => {
        const instance = await MerchantSubscription.deployed();

        return assert.isRejected(instance.sendTransaction({
            from: customer_address,
            value: payment_amount,
            data: '0x' + new Buffer('789c475f-e7a4-4fa4-bf4f').toString('hex')
        }), `VM Exception`);
    });
});

