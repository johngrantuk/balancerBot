## Contract

Can make contract super dumb. Basically just executes trading and returns Eth, etc to caller. Caller always pays Gas costs, etc so shouldn't be a problem?

Do we need to approve token in bot rather than contract?

Feels like the basics are starting to come together.
What's best way to test this on actual Uniswap?
Deploy my contract to Ropstein and test with Uniswap?
  Probably not much activity so really just want to check calls, etc work as expected and confirm token approval?
  Really need to check and understand what is going on with contract calling Uniswap and where do tokens go.
  The OceanProtocol demo has known addresses, etc that might make this easier.
  Take note of gas costs, etc for deploying/calling, etc and live addresses.

Once I'm happy with the above functions that's kind of the last bit of 'learning'. Then start to look at arbitraging between Uniswap and another contract based exchange?

Add some events/logs so we can see whats going on when deployed.

### ERC20 Approve
https://www.saturn.network/blog/erc20-approve-explained/

Arb contract approved.
  How to set approval in a safe way? - Could make only owner/deployer?
  UniSwap contract will be trusted but still not best practice?
  Deploy different contract for every token?

Meta-transactions?
  Would allow any user to approve themselves?
  Arb contract just functions as relayer.
  Would still need some kind of approval so no-one takes advantage of contract? Or make it so caller still spends gas, etc.
