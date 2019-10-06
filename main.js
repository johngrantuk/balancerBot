let Web3 = require("web3");
const BigNumber = require('bignumber.js');
const UniSwap = require('@uniswap/sdk');

let web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/d297d7eca15d45db82ea2df0ee0d4e1f"));

const tokenAddress = '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359' // DAI Mainnet
const chainIdOrProvider = 1 // could be e.g. window.ethereum instead


let tokens = [];

const wait_time = 800

async function run() {
    console.log(" STARTING BOT ")
    tokens.unshift('DAI')
    console.log(JSON.stringify(tokens))
    await sleep(wait_time);

    var blockNo = 0;
    while(true){
      await trackData();
    }
}

async function trackData() {
    // console.log('----')
  	for (var i = 0, len = tokens.length; i < len; i++) {
      // console.log('--> ' + tokens[i])
      await checkToken(tokens[i])
  		await sleep(wait_time)
    }
    // console.log('----')
}

var ethReserve = new BigNumber(123.4567);
var rate = new BigNumber(123.4567);

async function checkToken(Token){
  // console.log(Token + ' Maybes aye, maybes naw...');
  const tokenReserves = await UniSwap.getTokenReserves(tokenAddress, chainIdOrProvider);

  //console.log(tokenReserves);
  const marketDetails = UniSwap.getMarketDetails(undefined, tokenReserves) // ETH<>ERC20

  var t = new BigNumber(1000000000000000000)
  // console.log(marketDetails)
  //console.log(marketDetails.outputReserves.ethReserve.token)

  if(marketDetails.outputReserves.ethReserve.amount.dividedBy(t).isEqualTo(ethReserve) && marketDetails.marketRate.rate.isEqualTo(rate)){
    return;
  }else{
    ethReserve = marketDetails.outputReserves.ethReserve.amount.dividedBy(t);
    rate = marketDetails.marketRate.rate;
    console.log('New !!!!!!!')
    var currentBlockNo = await web3.eth.getBlockNumber();
    console.log(currentBlockNo);
    console.log(marketDetails.outputReserves.ethReserve.amount.dividedBy(t).toString())
    console.log(marketDetails.marketRate.rate.toString())
    //console.log(marketDetails.marketRate.rateInverted.toString())
  }

  //console.log(marketDetails.outputReserves.ethReserve.amount.dividedBy(t).toString())
  //console.log(marketDetails.marketRate.rate.toString())
  //console.log(marketDetails.marketRate.rateInverted.toString())
}

sleep = (x) => {
	return new Promise(resolve => {
		setTimeout(() => { resolve(true) }, x )
	})
}

run()
