'use strict';

const MerchantSubscription = artifacts.require('./MerchantSubscription.sol')
    , chai = require('chai')
    , chaiAsPromised = require('chai-as-promised')
    , assert = chai.assert;

chai.use(chaiAsPromised);

contract('MerchantSubscription:setMinDeposit', (accounts) => {
    const owner_address = accounts[0]
        , merchant_address = accounts[1]
        , customer_address = accounts[2]
        , min_deposit_to_set = web3.toWei(1, 'ether')
        , payment_amount = web3.toWei(0.1, 'ether')
    ;

    it(`min deposit (1 eth) is gt payment amount (0.1 eth)`, async () => {
        const instance = await MerchantSubscription.deployed();

        await instance.activate({from: merchant_address});

        await instance.setMinDeposit(min_deposit_to_set, {from: owner_address});

        return assert.isRejected(instance.sendTransaction({
            from: customer_address,
            value: payment_amount
        }), `VM Exception`);
    });
});
