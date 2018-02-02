pragma solidity ^0.4.18;


import "node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "node_modules/zeppelin-solidity/contracts/ownership/Claimable.sol";
import "node_modules/zeppelin-solidity/contracts/lifecycle/Pausable.sol";


contract MerchantSubscription is Claimable, Pausable {
	struct Status {
	bool isActive;
	bool isClosed;
	}

	/* DATA */

	address public merchant;

	Status public status = Status(false, false);

	string public name;

	string public constant version = '1.0.5';

	/* uuid example: 789c475f-e7a4-4fa4-bf4f-10a00932fc76 */
	uint8 public constant dataLength = 36;

	uint minDeposit;


	/* EVENTS */

	event SubscriptionPaymentMade(address indexed customer, uint amount);

	event WithdrawalMade(address indexed merchant, address indexed owner, uint amount);

	event SubscriptionClosed();

	event SubscriptionActivated();

	/* MODIFIERS */

	modifier onlyMerchant {
		require(msg.sender == merchant);
		_;
	}

	modifier allowDeposit {
		require(!status.isClosed && status.isActive && !paused);
		require(msg.value >= minDeposit);
		require(msg.data.length == dataLength);
		_;
	}

	/* FUNCTIONS */

	/* constructor - setup merchant address */
	function MerchantSubscription(address _merchant, string _name, uint _minDeposit) public {
		require(_merchant != 0x0);

		merchant = _merchant;
		owner = msg.sender;
		name = _name;
		minDeposit = _minDeposit;
	}

	/* function that is called whenever anyone sends funds to a contract */
	function() allowDeposit payable public {
		SubscriptionPaymentMade(msg.sender, msg.value);
	}

	function setMinDeposit(uint _minDeposit) onlyOwner public {
		require(_minDeposit > 0);

		minDeposit = _minDeposit;
	}

	function withdrawal(uint withdrawalAmount) onlyOwner public {
		require(withdrawalAmount <= this.balance);

		merchant.transfer(withdrawalAmount);

		WithdrawalMade(merchant, owner, withdrawalAmount);
	}

	function getBalance() public view returns (uint)  {
		return this.balance;
	}

	function activate() onlyMerchant public {
		require(!status.isActive);

		status.isActive = true;

		SubscriptionActivated();
	}

	function close() onlyOwner public {
		require(!status.isClosed);

		status.isClosed = true;

		SubscriptionClosed();
	}
}
