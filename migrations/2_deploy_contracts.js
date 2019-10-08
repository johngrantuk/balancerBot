var ArbContract = artifacts.require("./ArbContract.sol");
var RinkebyArbContract = artifacts.require("./RinkebyArbContract.sol");
var TradingContract = artifacts.require("./TradingContract.sol");
var UniswapExchange = artifacts.require("./UniswapExchange.sol");
var GLDToken = artifacts.require("./GLDToken.sol");
var KyberUniArbContract = artifacts.require("./KyberUniArbContract.sol");

const _total_supply = 1000000;

module.exports = function(deployer) {
  // deployer.deploy(ArbContract);
  // deployer.deploy(RinkebyArbContract);
  // deployer.deploy(TradingContract);
  // deployer.deploy(UniswapExchange);
  // deployer.deploy(GLDToken, _total_supply);
  deployer.deploy(KyberUniArbContract);
};
