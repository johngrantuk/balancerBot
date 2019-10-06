// javascript:  query the new exchange contract address for given token contract
let Web3 = require("web3");

var abi = '[{"name":"NewExchange","inputs":[{"type":"address","name":"token","indexed":true},{"type":"address","name":"exchange","indexed":true}],"anonymous":false,"type":"event"},{"name":"initializeFactory","outputs":[],"inputs":[{"type":"address","name":"template"}],"constant":false,"payable":false,"type":"function","gas":35725},{"name":"createExchange","outputs":[{"type":"address","name":"out"}],"inputs":[{"type":"address","name":"token"}],"constant":false,"payable":false,"type":"function","gas":187911},{"name":"getExchange","outputs":[{"type":"address","name":"out"}],"inputs":[{"type":"address","name":"token"}],"constant":true,"payable":false,"type":"function","gas":715},{"name":"getToken","outputs":[{"type":"address","name":"out"}],"inputs":[{"type":"address","name":"exchange"}],"constant":true,"payable":false,"type":"function","gas":745},{"name":"getTokenWithId","outputs":[{"type":"address","name":"out"}],"inputs":[{"type":"uint256","name":"token_id"}],"constant":true,"payable":false,"type":"function","gas":736},{"name":"exchangeTemplate","outputs":[{"type":"address","name":"out"}],"inputs":[],"constant":true,"payable":false,"type":"function","gas":633},{"name":"tokenCount","outputs":[{"type":"uint256","name":"out"}],"inputs":[],"constant":true,"payable":false,"type":"function","gas":663}]'

//var factoryAddress = '0xf5D915570BC477f9B8D6C0E980aA81757A3AaC36'; // rinkeby
const factoryAddress = '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95'; // Main net
const token = '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359'; // DAI Mainnet

const account = '0x0e364eb0ad6eb5a4fc30fc3d2c2ae8ebe75f245c';
//let web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/"));
let web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/d297d7eca15d45db82ea2df0ee0d4e1f"));
const uniswap = new web3.eth.Contract(JSON.parse(abi), factoryAddress);

async function call(transaction) {
    return await transaction.call({from: account});
}

async function getTokenExchange() {
    let exchange = await call(uniswap.methods.getExchange(token));
    console.log("the exchange address for ERC20 token is:" + exchange)
}
getTokenExchange()
