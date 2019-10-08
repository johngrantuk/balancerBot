pragma solidity ^0.5.0;

import "./GLDToken.sol";

/// @title Kyber Network interface
contract KyberNetworkProxy {
    function maxGasPrice() public view returns(uint);
    function getUserCapInWei(address user) public view returns(uint);
    function getUserCapInTokenWei(address user, GLDToken token) public view returns(uint);
    function enabled() public view returns(bool);
    function info(bytes32 id) public view returns(uint);

    function getExpectedRate(GLDToken src, GLDToken dest, uint srcQty) public view
        returns (uint expectedRate, uint slippageRate);

    function tradeWithHint(GLDToken src, uint srcAmount, GLDToken dest, address destAddress, uint maxDestAmount,
        uint minConversionRate, address walletId, bytes memory hint) public payable returns(uint);

    function swapEtherToToken(GLDToken token, uint minConversionRate) public payable returns(uint);
}
