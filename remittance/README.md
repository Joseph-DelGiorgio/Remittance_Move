# Remittance Move Package

This package implements a simple remittance module for the Sui blockchain. It allows users to send stablecoins (or any Sui-based coin) directly to recipients, emitting an event for off-chain notification. No platform fees are charged—only Sui network fees apply.

## Features
- Send remittances (stablecoins) to any Sui address
- Emits an event for each remittance sent
- Supports any Sui-based coin type

## Usage
1. Build and publish the package to Sui testnet/mainnet.
2. Call the `send_remittance` entry function with the coin, recipient address, and transaction context.

## Example
```
move call --package <PACKAGE_ID> --module remittance --function send_remittance --type-args <COIN_TYPE> --args <COIN_OBJECT_ID> <RECIPIENT_ADDRESS>
```

## Development
- `Move.toml` defines dependencies
- `sources/remittance.move` contains the module implementation 