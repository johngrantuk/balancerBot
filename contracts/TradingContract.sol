pragma solidity ^0.5.0;

import "./UniswapExchange.sol";

contract TradingContract {

  function trade(address uniSwapExchangeAddr, uint256 min_buy_tokens, uint256 buy_deadline, uint256 buy_eth_value, uint256 sell_tokens, uint256 sell_deadline, uint256 min_sell_eth_value) public {
    require(address(this).balance > buy_eth_value, "Not Enough Eth In Contract");

    UniswapExchange uniSwapExchange = UniswapExchange(uniSwapExchangeAddr);

    uniSwapExchange.ethToTokenSwapInput.value(buy_eth_value)(min_buy_tokens, buy_deadline);                    // Swap Eth to token in UniSwap
    // uniSwapExchange.ethToTokenSwapInput.value(eth_value)(min_tokens, deadline);                    // Swap Eth to token in UniSwap
    uniSwapExchange.tokenToEthSwapInput(sell_tokens, min_sell_eth_value, sell_deadline);
  }

  // Make Buy Uni/Sell Balancer
  // Make Buy Balancer/Sell Uni

  // Need to enable tokens?

  // Make call to claim Eth amount

  // Make this address/owner callable only

  // Make a separate Uniswap only function. This will be used to test the Bot itself before Balancer is available.

  function getBalance() public view returns (uint256) {
    return address(this).balance;
  }

  function topUp() public payable {

  }
}
