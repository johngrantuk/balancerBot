// https://developer.kyber.network/docs/Integrations-Web3Guide/
// https://medium.com/quiknode/building-with-kyber-network-be596863772d
const fs = require('fs');
let Web3 = require("web3");
const BigNumber = require('bignumber.js');
const Tx = require("ethereumjs-tx").Transaction;
let KyberUniArbContract = JSON.parse(fs.readFileSync("client/src/contracts/KyberUniArbContract.json"));
let TokenContract = JSON.parse(fs.readFileSync("client/src/contracts/GLDToken.json"));
const UniSwap = require('@uniswap/sdk');

require('dotenv').config();

var ISLIVE = false;

// Token Details
const SRC_TOKEN = "ETH";
const SRC_TOKEN_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
const SRC_DECIMALS = 18;
const DST_DECIMALS = 12;
// Kyber Network Proxy Contract Address
// https://developer.kyber.network/docs/Environments-Rinkeby/#docsNav
let web3, DST_TOKEN, DST_TOKEN_ADDRESS, KYBER_NETWORK_PROXY_ADDRESS, chainIdOrProvider;
if(ISLIVE){
    web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURAMAIN));
    DST_TOKEN = "DAI";
    DST_TOKEN_ADDRESS = '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359' // DAI Mainnet
    KYBER_NETWORK_PROXY_ADDRESS = "0x818E6FECD516Ecc3849DAf6845e3EC868087B755"; // Mainnet
    chainIdOrProvider = 1;
}else{
    web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURARINKEBY));
    DST_TOKEN = "OMG";
    DST_TOKEN_ADDRESS = '0x732fBA98dca813C3A630b53a8bFc1d6e87B1db65' // OMG Rinkeby
    KYBER_NETWORK_PROXY_ADDRESS = "0xF77eC7Ed5f5B9a5aee4cfa6FFCaC6A4C315BaC76"; // Rinkeby
    chainIdOrProvider = 4;
}

// KyberNetworkProxy Contract ABI
const KYBER_NETWORK_PROXY_ABI = [{"constant":false,"inputs":[{"name":"alerter","type":"address"}],"name":"removeAlerter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"enabled","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"pendingAdmin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOperators","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"srcAmount","type":"uint256"},{"name":"dest","type":"address"},{"name":"destAddress","type":"address"},{"name":"maxDestAmount","type":"uint256"},{"name":"minConversionRate","type":"uint256"},{"name":"walletId","type":"address"},{"name":"hint","type":"bytes"}],"name":"tradeWithHint","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"srcAmount","type":"uint256"},{"name":"minConversionRate","type":"uint256"}],"name":"swapTokenToEther","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"amount","type":"uint256"},{"name":"sendTo","type":"address"}],"name":"withdrawToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"maxGasPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newAlerter","type":"address"}],"name":"addAlerter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"kyberNetworkContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"}],"name":"getUserCapInWei","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"srcAmount","type":"uint256"},{"name":"dest","type":"address"},{"name":"minConversionRate","type":"uint256"}],"name":"swapTokenToToken","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAdmin","type":"address"}],"name":"transferAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"claimAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"minConversionRate","type":"uint256"}],"name":"swapEtherToToken","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"newAdmin","type":"address"}],"name":"transferAdminQuickly","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getAlerters","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"src","type":"address"},{"name":"dest","type":"address"},{"name":"srcQty","type":"uint256"}],"name":"getExpectedRate","outputs":[{"name":"expectedRate","type":"uint256"},{"name":"slippageRate","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"},{"name":"token","type":"address"}],"name":"getUserCapInTokenWei","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOperator","type":"address"}],"name":"addOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_kyberNetworkContract","type":"address"}],"name":"setKyberNetworkContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"operator","type":"address"}],"name":"removeOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"field","type":"bytes32"}],"name":"info","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"srcAmount","type":"uint256"},{"name":"dest","type":"address"},{"name":"destAddress","type":"address"},{"name":"maxDestAmount","type":"uint256"},{"name":"minConversionRate","type":"uint256"},{"name":"walletId","type":"address"}],"name":"trade","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"},{"name":"sendTo","type":"address"}],"name":"withdrawEther","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"token","type":"address"},{"name":"user","type":"address"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_admin","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"trader","type":"address"},{"indexed":false,"name":"src","type":"address"},{"indexed":false,"name":"dest","type":"address"},{"indexed":false,"name":"actualSrcAmount","type":"uint256"},{"indexed":false,"name":"actualDestAmount","type":"uint256"}],"name":"ExecuteTrade","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newNetworkContract","type":"address"},{"indexed":false,"name":"oldNetworkContract","type":"address"}],"name":"KyberNetworkSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"token","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"sendTo","type":"address"}],"name":"TokenWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"sendTo","type":"address"}],"name":"EtherWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"pendingAdmin","type":"address"}],"name":"TransferAdminPending","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAdmin","type":"address"},{"indexed":false,"name":"previousAdmin","type":"address"}],"name":"AdminClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAlerter","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"AlerterAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newOperator","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"OperatorAdded","type":"event"}];

var UNISWAP_ABI = '[{"name":"NewExchange","inputs":[{"type":"address","name":"token","indexed":true},{"type":"address","name":"exchange","indexed":true}],"anonymous":false,"type":"event"},{"name":"initializeFactory","outputs":[],"inputs":[{"type":"address","name":"template"}],"constant":false,"payable":false,"type":"function","gas":35725},{"name":"createExchange","outputs":[{"type":"address","name":"out"}],"inputs":[{"type":"address","name":"token"}],"constant":false,"payable":false,"type":"function","gas":187911},{"name":"getExchange","outputs":[{"type":"address","name":"out"}],"inputs":[{"type":"address","name":"token"}],"constant":true,"payable":false,"type":"function","gas":715},{"name":"getToken","outputs":[{"type":"address","name":"out"}],"inputs":[{"type":"address","name":"exchange"}],"constant":true,"payable":false,"type":"function","gas":745},{"name":"getTokenWithId","outputs":[{"type":"address","name":"out"}],"inputs":[{"type":"uint256","name":"token_id"}],"constant":true,"payable":false,"type":"function","gas":736},{"name":"exchangeTemplate","outputs":[{"type":"address","name":"out"}],"inputs":[],"constant":true,"payable":false,"type":"function","gas":633},{"name":"tokenCount","outputs":[{"type":"uint256","name":"out"}],"inputs":[],"constant":true,"payable":false,"type":"function","gas":663}]'

var UNISWAP_EXCHANGE_ABI = '[{"name": "TokenPurchase", "inputs": [{"type": "address", "name": "buyer", "indexed": true}, {"type": "uint256", "name": "eth_sold", "indexed": true}, {"type": "uint256", "name": "tokens_bought", "indexed": true}], "anonymous": false, "type": "event"}, {"name": "EthPurchase", "inputs": [{"type": "address", "name": "buyer", "indexed": true}, {"type": "uint256", "name": "tokens_sold", "indexed": true}, {"type": "uint256", "name": "eth_bought", "indexed": true}], "anonymous": false, "type": "event"}, {"name": "AddLiquidity", "inputs": [{"type": "address", "name": "provider", "indexed": true}, {"type": "uint256", "name": "eth_amount", "indexed": true}, {"type": "uint256", "name": "token_amount", "indexed": true}], "anonymous": false, "type": "event"}, {"name": "RemoveLiquidity", "inputs": [{"type": "address", "name": "provider", "indexed": true}, {"type": "uint256", "name": "eth_amount", "indexed": true}, {"type": "uint256", "name": "token_amount", "indexed": true}], "anonymous": false, "type": "event"}, {"name": "Transfer", "inputs": [{"type": "address", "name": "_from", "indexed": true}, {"type": "address", "name": "_to", "indexed": true}, {"type": "uint256", "name": "_value", "indexed": false}], "anonymous": false, "type": "event"}, {"name": "Approval", "inputs": [{"type": "address", "name": "_owner", "indexed": true}, {"type": "address", "name": "_spender", "indexed": true}, {"type": "uint256", "name": "_value", "indexed": false}], "anonymous": false, "type": "event"}, {"name": "setup", "outputs": [], "inputs": [{"type": "address", "name": "token_addr"}], "constant": false, "payable": false, "type": "function", "gas": 175875}, {"name": "addLiquidity", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "min_liquidity"}, {"type": "uint256", "name": "max_tokens"}, {"type": "uint256", "name": "deadline"}], "constant": false, "payable": true, "type": "function", "gas": 82605}, {"name": "removeLiquidity", "outputs": [{"type": "uint256", "name": "out"}, {"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "amount"}, {"type": "uint256", "name": "min_eth"}, {"type": "uint256", "name": "min_tokens"}, {"type": "uint256", "name": "deadline"}], "constant": false, "payable": false, "type": "function", "gas": 116814}, {"name": "__default__", "outputs": [], "inputs": [], "constant": false, "payable": true, "type": "function"}, {"name": "ethToTokenSwapInput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "min_tokens"}, {"type": "uint256", "name": "deadline"}], "constant": false, "payable": true, "type": "function", "gas": 12757}, {"name": "ethToTokenTransferInput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "min_tokens"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "recipient"}], "constant": false, "payable": true, "type": "function", "gas": 12965}, {"name": "ethToTokenSwapOutput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_bought"}, {"type": "uint256", "name": "deadline"}], "constant": false, "payable": true, "type": "function", "gas": 50463}, {"name": "ethToTokenTransferOutput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_bought"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "recipient"}], "constant": false, "payable": true, "type": "function", "gas": 50671}, {"name": "tokenToEthSwapInput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_sold"}, {"type": "uint256", "name": "min_eth"}, {"type": "uint256", "name": "deadline"}], "constant": false, "payable": false, "type": "function", "gas": 47503}, {"name": "tokenToEthTransferInput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_sold"}, {"type": "uint256", "name": "min_eth"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "recipient"}], "constant": false, "payable": false, "type": "function", "gas": 47712}, {"name": "tokenToEthSwapOutput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "eth_bought"}, {"type": "uint256", "name": "max_tokens"}, {"type": "uint256", "name": "deadline"}], "constant": false, "payable": false, "type": "function", "gas": 50175}, {"name": "tokenToEthTransferOutput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "eth_bought"}, {"type": "uint256", "name": "max_tokens"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "recipient"}], "constant": false, "payable": false, "type": "function", "gas": 50384}, {"name": "tokenToTokenSwapInput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_sold"}, {"type": "uint256", "name": "min_tokens_bought"}, {"type": "uint256", "name": "min_eth_bought"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "token_addr"}], "constant": false, "payable": false, "type": "function", "gas": 51007}, {"name": "tokenToTokenTransferInput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_sold"}, {"type": "uint256", "name": "min_tokens_bought"}, {"type": "uint256", "name": "min_eth_bought"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "recipient"}, {"type": "address", "name": "token_addr"}], "constant": false, "payable": false, "type": "function", "gas": 51098}, {"name": "tokenToTokenSwapOutput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_bought"}, {"type": "uint256", "name": "max_tokens_sold"}, {"type": "uint256", "name": "max_eth_sold"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "token_addr"}], "constant": false, "payable": false, "type": "function", "gas": 54928}, {"name": "tokenToTokenTransferOutput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_bought"}, {"type": "uint256", "name": "max_tokens_sold"}, {"type": "uint256", "name": "max_eth_sold"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "recipient"}, {"type": "address", "name": "token_addr"}], "constant": false, "payable": false, "type": "function", "gas": 55019}, {"name": "tokenToExchangeSwapInput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_sold"}, {"type": "uint256", "name": "min_tokens_bought"}, {"type": "uint256", "name": "min_eth_bought"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "exchange_addr"}], "constant": false, "payable": false, "type": "function", "gas": 49342}, {"name": "tokenToExchangeTransferInput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_sold"}, {"type": "uint256", "name": "min_tokens_bought"}, {"type": "uint256", "name": "min_eth_bought"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "recipient"}, {"type": "address", "name": "exchange_addr"}], "constant": false, "payable": false, "type": "function", "gas": 49532}, {"name": "tokenToExchangeSwapOutput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_bought"}, {"type": "uint256", "name": "max_tokens_sold"}, {"type": "uint256", "name": "max_eth_sold"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "exchange_addr"}], "constant": false, "payable": false, "type": "function", "gas": 53233}, {"name": "tokenToExchangeTransferOutput", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_bought"}, {"type": "uint256", "name": "max_tokens_sold"}, {"type": "uint256", "name": "max_eth_sold"}, {"type": "uint256", "name": "deadline"}, {"type": "address", "name": "recipient"}, {"type": "address", "name": "exchange_addr"}], "constant": false, "payable": false, "type": "function", "gas": 53423}, {"name": "getEthToTokenInputPrice", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "eth_sold"}], "constant": true, "payable": false, "type": "function", "gas": 5542}, {"name": "getEthToTokenOutputPrice", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_bought"}], "constant": true, "payable": false, "type": "function", "gas": 6872}, {"name": "getTokenToEthInputPrice", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "tokens_sold"}], "constant": true, "payable": false, "type": "function", "gas": 5637}, {"name": "getTokenToEthOutputPrice", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "uint256", "name": "eth_bought"}], "constant": true, "payable": false, "type": "function", "gas": 6897}, {"name": "tokenAddress", "outputs": [{"type": "address", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 1413}, {"name": "factoryAddress", "outputs": [{"type": "address", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 1443}, {"name": "balanceOf", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "address", "name": "_owner"}], "constant": true, "payable": false, "type": "function", "gas": 1645}, {"name": "transfer", "outputs": [{"type": "bool", "name": "out"}], "inputs": [{"type": "address", "name": "_to"}, {"type": "uint256", "name": "_value"}], "constant": false, "payable": false, "type": "function", "gas": 75034}, {"name": "transferFrom", "outputs": [{"type": "bool", "name": "out"}], "inputs": [{"type": "address", "name": "_from"}, {"type": "address", "name": "_to"}, {"type": "uint256", "name": "_value"}], "constant": false, "payable": false, "type": "function", "gas": 110907}, {"name": "approve", "outputs": [{"type": "bool", "name": "out"}], "inputs": [{"type": "address", "name": "_spender"}, {"type": "uint256", "name": "_value"}], "constant": false, "payable": false, "type": "function", "gas": 38769}, {"name": "allowance", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [{"type": "address", "name": "_owner"}, {"type": "address", "name": "_spender"}], "constant": true, "payable": false, "type": "function", "gas": 1925}, {"name": "name", "outputs": [{"type": "bytes32", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 1623}, {"name": "symbol", "outputs": [{"type": "bytes32", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 1653}, {"name": "decimals", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 1683}, {"name": "totalSupply", "outputs": [{"type": "uint256", "name": "out"}], "inputs": [], "constant": true, "payable": false, "type": "function", "gas": 1713}]'


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

async function checkCompleteTrade(){
  const account = '0xeE398666cA860DFb7390b5D73EE927e9Fb41a60A';
  var uniswapAddress = '0xf5D915570BC477f9B8D6C0E980aA81757A3AaC36';        // rinkeby
  const privateKey = Buffer.from(process.env.PRIVATEKEY, 'hex',);
  const arbContractAddress = '0xbaA1f8d938c064322C0D9c2DC68f0e516AE35678';  // Update with deployed address

  var accountBalance = await web3.eth.getBalance(account);
  console.log('Bot Account Balance: ' + accountBalance.toString());

  const arbContract = new web3.eth.Contract(KyberUniArbContract.abi, arbContractAddress);
  const uniswapContract = new web3.eth.Contract(JSON.parse(UNISWAP_ABI), uniswapAddress);

  var contractBalance = await web3.eth.getBalance(arbContractAddress);
  console.log('Arb Contract Balance: ' + contractBalance);

  let exchange = await uniswapContract.methods.getExchange(DST_TOKEN_ADDRESS).call();
  console.log("the exchange address for ERC20 token is:" + exchange);

  let exchangeContract = new web3.eth.Contract(JSON.parse(UNISWAP_EXCHANGE_ABI), exchange);

  const tokenContract = new web3.eth.Contract(TokenContract.abi, DST_TOKEN_ADDRESS);
  var allowance = await tokenContract.methods.allowance(arbContractAddress, exchange).call();
  console.log('Allowance: ' + allowance.toString());

  var totalSupply = await tokenContract.methods.totalSupply().call();
  console.log('Total supply: ' + totalSupply.toString());

  if(allowance == '0'){
    console.log('Approving token...');
    var tx = await arbContract.methods.approveToken(DST_TOKEN_ADDRESS, exchange, totalSupply);
    var encodedABI = tx.encodeABI();
    var txCount = await web3.eth.getTransactionCount(account);
    console.log('Tx Count: ' + txCount);

    var txData = {
      nonce: web3.utils.toHex(txCount),
      gasLimit: web3.utils.toHex(6000000),
      gasPrice: web3.utils.toHex(10000000000), // 10 Gwei
      to: arbContractAddress,
      from: account,
      data: encodedABI
    }
    var transaction = new Tx(txData, {'chain':'rinkeby'});
    transaction.sign(privateKey);
    console.log('Signed...')
    var serializedTx = transaction.serialize().toString('hex');
    console.log('Sending...')
    var receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx);
    console.log('Sent...')
    // console.log(receipt);
    allowance = await tokenContract.methods.allowance(arbContractAddress, exchange).call();
    console.log('Allowance: ' + allowance.toString());
  }

  var rates = await KYBER_NETWORK_PROXY_CONTRACT.methods
    .getExpectedRate(SRC_TOKEN_ADDRESS, DST_TOKEN_ADDRESS, SRC_QTY_WEI)
    .call();

  console.log('Kyber Rates (Eth -> OMG):');
  // console.log(rates);
  var ethErc20 = web3.utils.fromWei(rates.expectedRate, 'ether');
  console.log(ethErc20);

  const tokenReserves = await UniSwap.getTokenReserves(DST_TOKEN_ADDRESS, chainIdOrProvider);
  // const marketDetails = UniSwap.getMarketDetails(undefined, tokenReserves) // ETH<>ERC20
  const marketDetails = UniSwap.getMarketDetails(tokenReserves, undefined); // ERC20<>ETH

  console.log('Uniswap (OMG -> Eth): ');
  // console.log(marketDetails)
  // console.log(marketDetails.inputReserves.ethReserve.token)
  console.log('Eth Reserve: ' + web3.utils.fromWei(marketDetails.inputReserves.ethReserve.amount.toString(), 'ether'))
  // console.log(marketDetails.inputReserves.tokenReserve.token)
  console.log('Token Reserve: ' + web3.utils.fromWei(marketDetails.inputReserves.tokenReserve.amount.toString(), 'ether'))
  var rate = marketDetails.marketRate.rate;
  var rateInverted = marketDetails.marketRate.rateInverted;
  console.log('Market Rate (OMG -> ETH): ' + marketDetails.marketRate.rate.toString());
  // console.log('Market Rate Inverted: ' + marketDetails.marketRate.rateInverted.toString());

  // DECISION TO TRADE OR NOT IS MADE HERE

  var tradeAmountEth = 0.001;
  var tokenTrade = tradeAmountEth * parseFloat(ethErc20);
  var tokenTradeWei = web3.utils.toWei(tokenTrade.toString(), 'ether');

  var tokensToSwapBnWei = web3.utils.toBN(tokenTradeWei);
  console.log('\nKyber: ' + tradeAmountEth.toString() + 'Eth swapped for: ' + tokenTrade + 'OMG');
  // console.log('Tokens To Swap Wei BN: ' + tokensToSwapBnWei.toString())
  // console.log(web3.utils.fromWei(tokensToSwapBnWei, 'ether'))

  const tradeDetails = await UniSwap.tradeExactTokensForEthWithData(tokenReserves, tokensToSwapBnWei.toString());
  const executionDetails = await UniSwap.getExecutionDetails(tradeDetails);

  var max_sell_tokens = web3.utils.toWei(executionDetails.methodArguments[0].toString(), 'wei');
  var eth = web3.utils.toWei(executionDetails.methodArguments[1].toString(), 'wei');
  var value = web3.utils.toWei(executionDetails.value.toString(), 'wei');

  // console.log(executionDetails);
  console.log('Uniswap: Sell: ' + web3.utils.fromWei(max_sell_tokens, 'ether') + ' for Eth: ' + web3.utils.fromWei(eth, 'ether'))
  // console.log('Eth Value: ' + web3.utils.fromWei(eth, 'ether'))
  // console.log('Eth value to Send: ' + web3.utils.fromWei(value, 'ether'))
  return;
  var tx = arbContract.methods.trade(
    KYBER_NETWORK_PROXY_ADDRESS,
    DST_TOKEN_ADDRESS,
    rates.expectedRate,
    executionDetails.exchangeAddress,
    0,
    web3.utils.toWei(tradeAmountEth.toString(), 'ether'),
    max_sell_tokens,
    executionDetails.methodArguments[2],
    eth);
  var encodedABI = tx.encodeABI();

  var txCount = await web3.eth.getTransactionCount(account);
  console.log('Tx Count: ' + txCount);
  console.log(encodedABI)

  // construct the transaction data
  var txData = {
    nonce: web3.utils.toHex(txCount),
    gasLimit: web3.utils.toHex(6000000),
    gasPrice: web3.utils.toHex(10000000000), // 10 Gwei
    to: arbContractAddress,
    from: account,
    data: encodedABI,
    value: web3.utils.toHex(web3.utils.toWei(tradeAmountEth.toString(), 'ether'))
  }
  var transaction = new Tx(txData, {'chain':'rinkeby'});
  if(ISLIVE){
    transaction = new Tx(txData, {'chain':'mainnet'});
  }
  transaction.sign(privateKey);
  console.log('Signed...')
  var serializedTx = transaction.serialize().toString('hex');
  console.log('Sending...')
  var receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx);
  console.log('\nReceipt:')
  // console.log(receipt);

  accountBalance = await web3.eth.getBalance(account);
  console.log(accountBalance.toString());

  contractBalance = await web3.eth.getBalance(arbContractAddress);
  console.log(contractBalance.toString());
}

// checkEthToToken();
// test();
checkCompleteTrade()
