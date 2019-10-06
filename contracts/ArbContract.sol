pragma solidity ^0.5.0;

import "./UniswapExchange.sol";

contract ArbContract {

  event ethToToken(address trader, uint256 eth, uint256 tokens);

  function trade(
    address uniSwapExchangeAddr,
    uint256 min_buy_tokens,
    uint256 buy_deadline,
    uint256 buy_eth_value,
    uint256 max_sell_tokens,
    uint256 sell_deadline,
    uint256 sell_eth_value)
    public payable {
      require(msg.value >= buy_eth_value, "Not Enough Eth Sent");

      UniswapExchange uniSwapExchange = UniswapExchange(uniSwapExchangeAddr);

      uniSwapExchange.ethToTokenSwapInput.value(buy_eth_value)(min_buy_tokens, buy_deadline);                    // Swap Eth to token in UniSwap
      emit ethToToken(msg.sender, buy_eth_value, min_buy_tokens);

      uniSwapExchange.tokenToEthTransferOutput(sell_eth_value, max_sell_tokens, sell_deadline, msg.sender);
  }

  // Make Buy Uni/Sell Balancer
  // Make Buy Balancer/Sell Uni

  // Need to enable tokens?

  // Make a separate Uniswap only function. This will be used to test the Bot itself before Balancer is available.

  function getBalance() public view returns (uint256) {
    return address(this).balance;
  }
}
