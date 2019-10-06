var ArbContract = artifacts.require("./ArbContract.sol");
var RinkebyArbContract = artifacts.require("./RinkebyArbContract.sol");
var TradingContract = artifacts.require("./TradingContract.sol");
var UniswapExchange = artifacts.require("./UniswapExchange.sol");

module.exports = function(deployer) {
  // deployer.deploy(ArbContract);
  deployer.deploy(RinkebyArbContract);
  // deployer.deploy(TradingContract);
  // deployer.deploy(UniswapExchange);
};
