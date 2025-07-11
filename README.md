# Sui Remittance - Zero Fee Transfers

A decentralized remittance application built on the Sui blockchain that enables users to send stablecoins with zero platform fees, only paying Sui network gas fees.

## 🚀 Features

- **Zero Platform Fees**: Only Sui network gas fees apply
- **Wallet Integration**: Seamless connection with all major Sui wallets
- **Real-time Balance**: View your SUI balance and transaction history
- **Professional UI**: Clean, modern interface with responsive design
- **Transaction History**: Track all your remittance transactions
- **Event Emission**: On-chain events for transaction tracking

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/50d86a04-2a9b-471c-9b9c-75da3fe6ef7d" />




## 🏗️ Architecture

### Smart Contract (Move)
- **Package ID**: `0x2e366e507933e182ce9b758df6d0d24cd50702dd2081f9737d83e09b8232fdeb`
- **Module**: `remittance`
- **Function**: `send_remittance<CoinType>`
- **Network**: Sui Testnet

### Frontend (Next.js)
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Wallet**: Sui Wallet Kit
- **Blockchain**: Sui.js client

## 📁 Project Structure

```
Sui_Pay/
├── remittance/                 # Move smart contract
│   ├── Move.toml
│   ├── sources/
│   │   └── remittance.move
│   └── README.md
├── remittance-ui/             # Next.js frontend
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx       # Main UI
│   │       ├── layout.tsx     # App layout
│   │       └── globals.css    # Styles
│   ├── package.json
│   └── README.md
└── README.md                  # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- Sui CLI
- A Sui wallet (Sui Wallet, Ethos, Suiet, etc.)

### 1. Clone the Repository
```bash
git clone https://github.com/Joseph-DelGiorgio/Remittance_Move.git
cd Remittance_Move
```

### 2. Setup Smart Contract
```bash
cd remittance
sui move build
sui client publish --gas-budget 100000000
```

### 3. Setup Frontend
```bash
cd ../remittance-ui
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

## 🎯 Usage

### 1. Connect Wallet
- Click "Connect Wallet" button
- Choose your preferred Sui wallet
- Approve the connection

### 2. Send Remittance
- Enter recipient address (0x...)
- Enter amount in SUI
- Click "Send Remittance"
- Approve transaction in your wallet

### 3. View History
- Recent transactions are displayed below
- Shows sender, recipient, amount, and timestamp

## 🔧 Development

### Smart Contract Development
```bash
cd remittance
sui move build
sui move test
```

### Frontend Development
```bash
cd remittance-ui
npm run dev
npm run build
npm run lint
```

## 📊 Smart Contract Details

### Remittance Module
```move
module remittance::remittance {
    use sui::coin::Coin;
    use sui::event;
    use sui::tx_context::{TxContext, sender};
    use sui::transfer;

    struct RemittanceSentEvent has copy, drop, store {
        sender: address,
        recipient: address,
        amount: u64,
    }

    public entry fun send_remittance<CoinType>(
        coin: Coin<CoinType>,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let sender_addr = sender(ctx);
        let amount = sui::coin::value(&coin);

        transfer::public_transfer(coin, recipient);

        event::emit(RemittanceSentEvent {
            sender: sender_addr,
            recipient,
            amount,
        });
    }
}
```

## 🌐 Networks

- **Testnet**: Currently deployed and tested
- **Mainnet**: Ready for deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Sui Foundation](https://sui.io/) for the blockchain platform
- [Sui Wallet Kit](https://github.com/MystenLabs/sui/tree/main/sdk/wallet-kit) for wallet integration
- [Next.js](https://nextjs.org/) for the frontend framework

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ on Sui** 
