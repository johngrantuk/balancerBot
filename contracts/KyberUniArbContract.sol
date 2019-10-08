pragma solidity ^0.5.0;

import "./UniswapExchange.sol";
import "./GLDToken.sol";
import "./KyberNetworkProxy.sol";

contract KyberUniArbContract {

  address public owner;

  event ethToToken(address trader, uint256 eth, uint256 tokens, uint256 token_bought);
  event tokenToEth(address trader, uint256 sell_eth_value, uint256 max_sell_tokens, uint256 tokens_sold);

  constructor() public {
    owner = msg.sender;
  }

  function approveToken(address tokenAddress, address exchangeAddress, uint amount) public {
    require(msg.sender == owner, "Only Owner Can Approve");

    GLDToken token = GLDToken(tokenAddress);

    token.approve(exchangeAddress, amount);
  }

  function trade(
    address kyberExchangeAddr,
    address tokenAddress,
    uint256 minConversionRate,
    address uniSwapExchangeAddr,
    uint256 min_buy_tokens,
    uint256 buy_eth_value,
    uint256 max_sell_tokens,
    uint256 sell_deadline,
    uint256 sell_eth_value)
    public payable {
      require(msg.value >= buy_eth_value, "Not Enough Eth Sent");

      KyberNetworkProxy kyberExchange = KyberNetworkProxy(kyberExchangeAddr);

      GLDToken token = GLDToken(tokenAddress);

      uint256 token_bought = kyberExchange.swapEtherToToken.value(buy_eth_value)(token, minConversionRate);
      emit ethToToken(msg.sender, buy_eth_value, min_buy_tokens, token_bought);

      UniswapExchange uniSwapExchange = UniswapExchange(uniSwapExchangeAddr);
      uint256 tokens_sold = uniSwapExchange.tokenToEthTransferOutput(sell_eth_value, max_sell_tokens, sell_deadline, msg.sender);
      emit tokenToEth(msg.sender, sell_eth_value, max_sell_tokens, tokens_sold);
  }

  function tradeEthToToken(
    address kyberExchangeAddr,
    address tokenAddress,
    uint256 minConversionRate,
    uint256 buy_eth_value)
    public payable {
      require(msg.value >= buy_eth_value, "Not Enough Eth Sent");

      KyberNetworkProxy kyberExchange = KyberNetworkProxy(kyberExchangeAddr);

      GLDToken token = GLDToken(tokenAddress);

      uint256 token_bought = kyberExchange.swapEtherToToken.value(buy_eth_value)(token, minConversionRate);                    // Swap Eth to token in UniSwap
      emit ethToToken(msg.sender, buy_eth_value, minConversionRate, token_bought);
  }

  function tradeTokenToEth(
    address uniSwapExchangeAddr,
    uint256 max_sell_tokens,
    uint256 sell_deadline,
    uint256 sell_eth_value)
    public {
      // Should check approval - see Kyber example?

      UniswapExchange uniSwapExchange = UniswapExchange(uniSwapExchangeAddr);

      uint256 tokens_sold = uniSwapExchange.tokenToEthTransferOutput(sell_eth_value, max_sell_tokens, sell_deadline, msg.sender);

      emit tokenToEth(msg.sender, sell_eth_value, max_sell_tokens, tokens_sold);
  }

  function getBalance() public view returns (uint256) {
    return address(this).balance;
  }
}
