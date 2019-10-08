## Explanation

Developed using Truffle, easy to write, test and deploy contracts, etc.

### KyberUniArbContract
Main contract.
By default the address that deploys the contract is the owner.
Only the owner can approve tokens - !!!!Need more explanation. Done via approveToken. This approves the UniSwap exchange contract for a token (via token address). Has to be an ERC20 token!

Approve - UniSwap contract will be trusted but still not best practice?

## To Do

Comments.
Make contract ownable OpenZeppelin.
Add some events/logs so we can see whats going on when deployed.

Meta-transactions?
  Would allow any user to approve themselves?
  Arb contract just functions as relayer.
  Would still need some kind of approval so no-one takes advantage of contract? Or make it so caller still spends gas, etc.

## Learnings

Caller always pays gas - for everything.

Approve - interesting in general. ERC20 related.
  https://www.saturn.network/blog/erc20-approve-explained/

Testing is hard! Is this an opportunity??
  Deploying on Rinkeby & using Uniswap and Kyber implementations there. Hard to find info. Process is fairly complicated.

## Kyber Swaps:

Bot Account Balance: 18529721928254917095
Arb Contract Balance: 0
the exchange address for ERC20 token is:0x160190Ff19176ab27E0c59C8282bdB8078f1AE59
Allowance: 21000000000000000000000000
Total supply: 21000000000000000000000000
Kyber Rates (Eth -> OMG):
61.0794391069944
Uniswap (OMG -> Eth):
Eth Reserve: 0.519438939664670585
Token Reserve: 0.466671271325477088
Market Rate (OMG -> ETH): 1.113072459312351804

Kyber: 0.001Eth swapped for: 0.0610794391069944OMG
Uniswap: Sell: 0.0610794391069944 for Eth: 0.058758779581605507

Bot Account Balance: 18585016917836522602
Arb Contract Balance: 0
the exchange address for ERC20 token is:0x160190Ff19176ab27E0c59C8282bdB8078f1AE59
Allowance: 20999999940297960739325411
Total supply: 21000000000000000000000000
Kyber Rates (Eth -> OMG):
61.0794391069944
Uniswap (OMG -> Eth):
Eth Reserve: 0.460680160083065078
Token Reserve: 0.526373310586151677
Market Rate (OMG -> ETH): 0.875196653816028574

Kyber: 0.001Eth swapped for: 0.0610794391069944OMG
Uniswap: Sell: 0.0610794391069944 for Eth: 0.046814277882848405
