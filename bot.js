console.log('Hi');

const BigNumber = require('bignumber.js');
const UniSwap = require('@uniswap/sdk');
var utils = require('ethers').utils;

const tokenAddress = '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359' // DAI Mainnet
const chainIdOrProvider = 1 // could be e.g. window.ethereum instead

test();

async function test(){

  const tokenReserves = await UniSwap.getTokenReserves(tokenAddress, chainIdOrProvider);

  console.log(tokenReserves);

  const marketDetails = UniSwap.getMarketDetails(undefined, tokenReserves) // ETH<>ERC20

  console.log('!!!!!!!!!!!!!!!!')
  var wei = utils.bigNumberify("1000000000000000000000");
  console.log(wei)
  // console.log(marketDetails)
  console.log(marketDetails.outputReserves.ethReserve.token)

  var t = new BigNumber(1000000000000000000)

  console.log(marketDetails.outputReserves.ethReserve.amount.dividedBy(t).toString())
  console.log(marketDetails.marketRate.rate.toString())
  console.log(marketDetails.marketRate.rateInverted.toString())
}
