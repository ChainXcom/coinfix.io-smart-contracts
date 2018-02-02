'use strict';

const MerchantSubscription = artifacts.require('./MerchantSubscription.sol')
    , chai = require('chai')
    , chaiAsPromised = require('chai-as-promised')
    , BigNumber = require('bignumber.js')
    , assert = chai.assert;

chai.use(chaiAsPromised);

contract('MerchantSubscription:withdrawal', (accounts) => {
    const owner_address = accounts[0]
        , merchant_address = accounts[1]
        , customer_address = accounts[2]
        , bob_address = accounts[3]
        , deposit_amount = web3.toWei(1, 'ether')
        , withdrawal_amount = web3.toWei(0.5, 'ether')
        , data = '0x' + new Buffer('789c475f-e7a4-4fa4-bf4f-00a00932fc75').toString('hex')
    ;

    it(`withdrawal on empty contract`, async () => {
        const instance = await MerchantSubscription.deployed();

        return assert.isRejected(instance.withdrawal(withdrawal_amount, {from: owner_address}), `VM Exception`);
    });

    it(`withdrawal success`, async () => {
        const instance = await MerchantSubscription.deployed();

        await instance.activate({from: merchant_address});

        const merchant_balance = web3.eth.getBalance(merchant_address);

        await instance.sendTransaction({from: customer_address, value: deposit_amount, data});

        await instance.withdrawal(withdrawal_amount, {from: owner_address});

        const expected_merchant_balance = new BigNumber(merchant_balance).add(withdrawal_amount)
            , final_merchant_balance = web3.eth.getBalance(merchant_address);

        return assert.equal(expected_merchant_balance.toNumber(), final_merchant_balance.toNumber());
    });

    it(`withdrawal amount greater then contract's balance`, async () => {
        const instance = await MerchantSubscription.deployed()
            , contract_balance = await instance.getBalance.call()
            , withdrawal_amount = contract_balance.add(web3.toWei(0.01, 'ether'))
        ;

        return assert.isRejected(instance.withdrawal(withdrawal_amount, {from: owner_address}), `VM Exception`);
    });

    it(`withdrawal called by !owner`, async () => {
        const instance = await MerchantSubscription.deployed()
            , contract_balance = await instance.getBalance.call()
        ;

        assert.isRejected(instance.withdrawal(contract_balance, {from: merchant_address}), `VM Exception`);
        assert.isRejected(instance.withdrawal(contract_balance, {from: customer_address}), `VM Exception`);
        return assert.isRejected(instance.withdrawal(contract_balance, {from: bob_address}), `VM Exception`);
    });
});
