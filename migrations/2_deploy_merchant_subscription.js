'use strict';

const MerchantSubscription = artifacts.require("./MerchantSubscription.sol");

module.exports = function (deployer, network, accounts) {
    const owner = accounts[0]
        , merchant = accounts[1]
    ;

    deployer.deploy(MerchantSubscription, merchant, 'merchant_subscription_test_contract', {from: owner});


    // deployer.deploy(SafeMath);
    //
    // deployer.link(SafeMath, Investment);
    // deployer.deploy(Investment, 'XINV1', 'XINV1', 100, {from: accounts[0]});
    //
    // deployer.link(SafeMath, PlatformCoin);
    // deployer.deploy(
    //     PlatformCoin,
    //     'XEUR', // symbol
    //     1, // symbolId
    //     'XEUR', // name
    //     2, // decimals
    //     accounts[1], // approval
    //     10000 * 100, // maxDeposit
    //     10000 * 100, // maxWithdrawal
    //     100 * 100, // minDeposit
    //     100 * 100, // minWithdrawal
    //     2, // feePc
    //     {from: accounts[0]} // opts
    // );
};
