'use strict';

const MerchantSubscription = artifacts.require('./MerchantSubscription.sol')
    , chai = require('chai')
    , chaiAsPromised = require('chai-as-promised')
    , assert = chai.assert;

chai.use(chaiAsPromised);

contract('MerchantSubscription:close', (accounts) => {
    const
        owner_address = accounts[0]
        , customer_address = accounts[2]
        , bob_address = accounts[3]
        , amount = web3.toWei(0.01, 'ether')
        , data = '0x' + new Buffer('789c475f-e7a4-4fa4-bf4f-00a00932fc75').toString('hex')
    ;

    it('call close by !owner', async () => {
        const instance = await MerchantSubscription.deployed();

        return assert.isRejected(instance.close({from: bob_address}));
    });

    it('close contract and reject payment', async () => {
        const instance = await MerchantSubscription.deployed();

        await instance.close({from: owner_address});

        return assert.isRejected(instance.sendTransaction({
            from: customer_address,
            value: amount,
            data
        }), `VM Exception`);
    });
});
