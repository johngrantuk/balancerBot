const truffleAssert = require('truffle-assertions');
const TradingContract = artifacts.require("./TradingContract.sol");
const UniswapExchange = artifacts.require("./UniswapExchange.sol");

contract("TradingContract", accounts => {
  it("...should have 0 initial balance.", async () => {
    const TradingContractInstance = await TradingContract.deployed();

    // Set value of 89
    // await TradingContractInstance.set(89, { from: accounts[0] });

    // Get stored value
    const contractBalance = await TradingContractInstance.getBalance.call();

    assert.equal(contractBalance, 0, ">0 initial balance.");
  });

  it("...should send balance of 1Eth.", async () => {
    const TradingContractInstance = await TradingContract.deployed();

    var value = web3.utils.toWei('1', 'ether')

    await TradingContractInstance.topUp({ from: accounts[0], value: value });

    // Get stored value
    const contractBalance = await TradingContractInstance.getBalance.call();

    assert.equal(contractBalance, value, "Should have 1Eth balance.");
  });

  it("...should fail if trade not enough Eth.", async () => {
    const TradingContractInstance = await TradingContract.deployed();

    var min_buy_tokens = web3.utils.toWei('0.5', 'ether');
    var buy_deadline = 25;
    var buy_eth_value = web3.utils.toWei('2', 'ether');
    var value = web3.utils.toWei('1', 'ether');
    var sell_tokens = min_buy_tokens;
    var sell_deadline = buy_deadline;
    var min_sell_eth_value = web3.utils.toWei('1', 'ether');

    await truffleAssert.reverts(
      TradingContractInstance.trade(
        UniswapExchange.address,
        min_buy_tokens,
        buy_deadline,
        buy_eth_value,
        sell_tokens,
        sell_deadline,
        min_sell_eth_value,
        { from: accounts[0] }),
      "Not Enough Eth In Contract"
    );

    // Get stored value
    const contractBalance = await TradingContractInstance.getBalance.call();

    assert.equal(contractBalance, value, "Should have 1Eth balance.");
  });

  it("...should make trade.", async () => {
    const TradingContractInstance = await TradingContract.deployed();

    var min_buy_tokens = web3.utils.toWei('0.5', 'ether');
    var buy_deadline = 25;
    var buy_eth_value = web3.utils.toWei('0.5', 'ether');
    var value = web3.utils.toWei('1', 'ether');
    var sell_tokens = min_buy_tokens;
    var sell_deadline = buy_deadline;
    var min_sell_eth_value = web3.utils.toWei('1', 'ether');

    await TradingContractInstance.trade(
      UniswapExchange.address,
      min_buy_tokens,
      buy_deadline,
      buy_eth_value,
      sell_tokens,
      sell_deadline,
      min_sell_eth_value,
      { from: accounts[0] })

    // Get stored value
    const contractBalance = await TradingContractInstance.getBalance.call();

    assert.equal(contractBalance, min_buy_tokens, "Should have 0.5Eth balance.");
  });

  it("...should create a test Uniswap revert. THIS IS A TEST UNISWAP REVERT TO ENABLE FURTHER TESTS.", async () => {
    const TradingContractInstance = await TradingContract.deployed();

    var min_buy_tokens = web3.utils.toWei('0.1', 'ether');
    var buy_deadline = 19;
    var buy_eth_value = web3.utils.toWei('0.1', 'ether');
    var value = web3.utils.toWei('1', 'ether');
    var sell_tokens = min_buy_tokens;
    var sell_deadline = buy_deadline;
    var min_sell_eth_value = web3.utils.toWei('1', 'ether');

    await truffleAssert.reverts(
      TradingContractInstance.trade(
        UniswapExchange.address,
        min_buy_tokens,
        buy_deadline,
        buy_eth_value,
        sell_tokens,
        sell_deadline,
        min_sell_eth_value,
        { from: accounts[0] }),
      "Eth To Token Deadline Out"
    );
  });

  // TEST REVERT/ATOMIC
  it("...Testing Atomic. Should NOT exectute trade and deduct balance if one is a failure.", async () => {
    const TradingContractInstance = await TradingContract.deployed();

    var min_buy_tokens = web3.utils.toWei('0.1', 'ether');
    var buy_deadline = 25;
    var buy_eth_value = web3.utils.toWei('0.1', 'ether');
    var value = web3.utils.toWei('1', 'ether');
    var sell_tokens = min_buy_tokens;
    var sell_deadline = 19;                                                   // This should make 2nd transfer fail, i.e. AFTER first
    var min_sell_eth_value = web3.utils.toWei('1', 'ether');

    await truffleAssert.reverts(
      TradingContractInstance.trade(
        UniswapExchange.address,
        min_buy_tokens,
        buy_deadline,
        buy_eth_value,
        sell_tokens,
        sell_deadline,
        min_sell_eth_value,
        { from: accounts[0] }),
      "Token To Eth Deadline Out"
    );

    // CONFIRM BALANCE IS THE SAME
  });

  // TEST FAIL IF NOT OWNER
});
