// https://developer.kyber.network/docs/Integrations-Web3Guide/
// https://medium.com/quiknode/building-with-kyber-network-be596863772d
const fs = require('fs');
let Web3 = require("web3");
const BigNumber = require('bignumber.js');
const Tx = require("ethereumjs-tx").Transaction;
let KyberUniArbContract = JSON.parse(fs.readFileSync("client/src/contracts/KyberUniArbContract.json"));

require('dotenv').config();

var ISLIVE = false;

// Token Details
const SRC_TOKEN = "ETH";
const SRC_TOKEN_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
const SRC_DECIMALS = 18;
const DST_DECIMALS = 12;
// Kyber Network Proxy Contract Address
// https://developer.kyber.network/docs/Environments-Rinkeby/#docsNav
let web3, DST_TOKEN, DST_TOKEN_ADDRESS, KYBER_NETWORK_PROXY_ADDRESS;
if(ISLIVE){
    web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURAMAIN));
    DST_TOKEN = "DAI";
    DST_TOKEN_ADDRESS = '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359' // DAI Mainnet
    KYBER_NETWORK_PROXY_ADDRESS = "0x818E6FECD516Ecc3849DAf6845e3EC868087B755"; // Mainnet
}else{
    web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURARINKEBY));
    DST_TOKEN = "OMG";
    DST_TOKEN_ADDRESS = '0x732fBA98dca813C3A630b53a8bFc1d6e87B1db65' // OMG Rinkeby
    KYBER_NETWORK_PROXY_ADDRESS = "0xF77eC7Ed5f5B9a5aee4cfa6FFCaC6A4C315BaC76"; // Rinkeby
}

// KyberNetworkProxy Contract ABI
const KYBER_NETWORK_PROXY_ABI = [{"constant":false,"inputs":[{"name":"alerter","type":"address"}],"name":"removeAlerter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"enabled","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"pendingAdmin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOperators","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"srcAmount","type":"uint256"},{"name":"dest","type":"address"},{"name":"destAddress","type":"address"},{"name":"maxDestAmount","type":"uint256"},{"name":"minConversionRate","type":"uint256"},{"name":"walletId","type":"address"},{"name":"hint","type":"bytes"}],"name":"tradeWithHint","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"srcAmount","type":"uint256"},{"name":"minConversionRate","type":"uint256"}],"name":"swapTokenToEther","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"amount","type":"uint256"},{"name":"sendTo","type":"address"}],"name":"withdrawToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"maxGasPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newAlerter","type":"address"}],"name":"addAlerter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"kyberNetworkContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"}],"name":"getUserCapInWei","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"srcAmount","type":"uint256"},{"name":"dest","type":"address"},{"name":"minConversionRate","type":"uint256"}],"name":"swapTokenToToken","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAdmin","type":"address"}],"name":"transferAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"claimAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"minConversionRate","type":"uint256"}],"name":"swapEtherToToken","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"newAdmin","type":"address"}],"name":"transferAdminQuickly","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getAlerters","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"src","type":"address"},{"name":"dest","type":"address"},{"name":"srcQty","type":"uint256"}],"name":"getExpectedRate","outputs":[{"name":"expectedRate","type":"uint256"},{"name":"slippageRate","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"},{"name":"token","type":"address"}],"name":"getUserCapInTokenWei","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOperator","type":"address"}],"name":"addOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_kyberNetworkContract","type":"address"}],"name":"setKyberNetworkContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"operator","type":"address"}],"name":"removeOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"field","type":"bytes32"}],"name":"info","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"srcAmount","type":"uint256"},{"name":"dest","type":"address"},{"name":"destAddress","type":"address"},{"name":"maxDestAmount","type":"uint256"},{"name":"minConversionRate","type":"uint256"},{"name":"walletId","type":"address"}],"name":"trade","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"},{"name":"sendTo","type":"address"}],"name":"withdrawEther","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"token","type":"address"},{"name":"user","type":"address"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_admin","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"trader","type":"address"},{"indexed":false,"name":"src","type":"address"},{"indexed":false,"name":"dest","type":"address"},{"indexed":false,"name":"actualSrcAmount","type":"uint256"},{"indexed":false,"name":"actualDestAmount","type":"uint256"}],"name":"ExecuteTrade","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newNetworkContract","type":"address"},{"indexed":false,"name":"oldNetworkContract","type":"address"}],"name":"KyberNetworkSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"token","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"sendTo","type":"address"}],"name":"TokenWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"sendTo","type":"address"}],"name":"EtherWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"pendingAdmin","type":"address"}],"name":"TransferAdminPending","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAdmin","type":"address"},{"indexed":false,"name":"previousAdmin","type":"address"}],"name":"AdminClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAlerter","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"AlerterAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newOperator","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"OperatorAdded","type":"event"}];

// Trade Details
const SRC_QTY = "1";
const SRC_QTY_WEI = (SRC_QTY * 10 ** SRC_DECIMALS).toString();

// Get the KyberNetworkContract instances
const KYBER_NETWORK_PROXY_CONTRACT = new web3.eth.Contract(
  KYBER_NETWORK_PROXY_ABI,
  KYBER_NETWORK_PROXY_ADDRESS
);

// Function to obtain conversion rate between src token and dst token
async function getRates(SRC_TOKEN_ADDRESS, DST_TOKEN_ADDRESS, SRC_QTY_WEI) {
  return await KYBER_NETWORK_PROXY_CONTRACT.methods
    .getExpectedRate(SRC_TOKEN_ADDRESS, DST_TOKEN_ADDRESS, SRC_QTY_WEI)
    .call();
}

async function test(){
  console.log('Getting Kyber Rates...')
  let results = await getRates(SRC_TOKEN_ADDRESS, DST_TOKEN_ADDRESS, SRC_QTY_WEI);
  console.log(results);
  console.log(results.expectedRate)
}

async function checkEthToToken(){
  const account = '0xeE398666cA860DFb7390b5D73EE927e9Fb41a60A';
  const privateKey = Buffer.from(process.env.PRIVATEKEY, 'hex',);
  const arbContractAddress = '0xbaA1f8d938c064322C0D9c2DC68f0e516AE35678';  // Update with deployed address

  var accountBalance = await web3.eth.getBalance(account);
  console.log('Bot Account Balance: ' + accountBalance.toString());

  const arbContract = new web3.eth.Contract(KyberUniArbContract.abi, arbContractAddress);

  var contractBalance = await web3.eth.getBalance(arbContractAddress);
  console.log('Arb Contract Balance: ' + contractBalance);

  var rates = await KYBER_NETWORK_PROXY_CONTRACT.methods
    .getExpectedRate(SRC_TOKEN_ADDRESS, DST_TOKEN_ADDRESS, SRC_QTY_WEI)
    .call();

  console.log('Rates:');
  console.log(rates);

  var ethToSwap = web3.utils.toWei('0.01', 'ether');
  // const minConversionRate = new web3.utils.BN('55555');

  const tx = arbContract.methods.tradeEthToToken(KYBER_NETWORK_PROXY_ADDRESS, DST_TOKEN_ADDRESS, rates.expectedRate, ethToSwap);
  const encodedABI = tx.encodeABI();

  var txCount = await web3.eth.getTransactionCount(account);
  console.log('Tx Count: ' + txCount);
  console.log(encodedABI)

  // construct the transaction data
  const txData = {
    nonce: web3.utils.toHex(txCount),
    gasLimit: web3.utils.toHex(6000000),
    gasPrice: web3.utils.toHex(10000000000), // 10 Gwei
    to: arbContractAddress,
    from: account,
    data: encodedABI,
    value: web3.utils.toHex(ethToSwap)
  }
  var transaction = new Tx(txData, {'chain':'rinkeby'});
  if(ISLIVE){
    transaction = new Tx(txData, {'chain':'mainnet'});
  }
  transaction.sign(privateKey);
  console.log('Signed...')
  const serializedTx = transaction.serialize().toString('hex');
  console.log('Sending...')
  var receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx);
  console.log('\nReceipt:')
  console.log(receipt);

  accountBalance = await web3.eth.getBalance(account);
  console.log(accountBalance.toString());

  contractBalance = await web3.eth.getBalance(arbContractAddress);
  console.log(contractBalance.toString());
}

checkEthToToken();
// test();
