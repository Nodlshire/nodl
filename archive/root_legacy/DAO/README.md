## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```

---

## Sepolia Deployment – May 2026

| Contract | Address |
|---------|---------|
| SoulToken | 0x027E6C7e5E31088C14Abc5BD6579B0E8A57eEc78 |
| WnodeToken | 0xa382506695f825fe807C3f4D47aEB986046bdc57 |
| WnodeDAO | 0xE475EA97930a49bBE4c1C699FB6A627119414772 |
| DAOExecutor | 0x31062940De5E102dBBB45b9A9fb27c5D976e676C |
| Treasury | 0xa0780575102C295937dC3Be373B9B2aC380743c1 |

All contracts deployed to Sepolia using deployer 0xA48f0B8B83fd2da7E5098F720853ddE745e65819.
