# Sui Remittance - Zero Fee Transfers & Marketplace

A decentralized remittance application built on the Sui blockchain that enables users to send stablecoins with zero platform fees, only paying Sui network gas fees. Now includes a fully functional marketplace for buying and selling items.

## 🚀 Features

- **Zero Platform Fees**: Only Sui network gas fees apply
- **Wallet Integration**: Seamless connection with all major Sui wallets
- **Real-time Balance**: View your SUI balance and transaction history
- **Professional UI**: Clean, modern interface with responsive design
- **Transaction History**: Track all your remittance transactions
- **Event Emission**: On-chain events for transaction tracking
- **Marketplace**: Buy and sell items with zero remittance fees
- **Category Filtering**: Browse items by category
- **Item Management**: List, buy, and remove items from the marketplace

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/50d86a04-2a9b-471c-9b9c-75da3fe6ef7d" />




## 🏗️ Architecture

### Smart Contracts (Move)
- **Remittance Package ID**: `0x2e366e507933e182ce9b758df6d0d24cd50702dd2081f9737d83e09b8232fdeb`
- **Remittance Module**: `remittance`
- **Remittance Function**: `send_remittance<CoinType>`
- **Marketplace Module**: `marketplace` (in development)
- **Network**: Sui Testnet

### Frontend (Next.js)
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Wallet**: Sui Wallet Kit
- **Blockchain**: Sui.js client

## 📁 Project Structure

```
Sui_Pay/
├── remittance/                 # Move smart contracts
│   ├── Move.toml
│   ├── sources/
│   │   ├── remittance.move    # Remittance contract
│   │   └── marketplace.move   # Marketplace contract
│   └── README.md
├── src/
│   ├── app/
│   │   ├── page.tsx           # Main remittance UI
│   │   ├── marketplace/       # Marketplace pages
│   │   │   └── page.tsx      # Marketplace UI
│   │   └── layout.tsx        # App layout
│   ├── components/
│   │   ├── remittance/        # Remittance components
│   │   └── marketplace/       # Marketplace components
│   └── globals.css           # Styles
└── README.md                 # This file
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

### 2. Setup Smart Contracts
```bash
cd remittance
sui move build
sui client publish --gas-budget 100000000
```

### 3. Setup Frontend
```bash
cd ..
npm install
npm run dev
```

The app will be available at `http://localhost:3000`

## 🎯 Usage

### Remittance Features
1. **Connect Wallet**
   - Click "Connect Wallet" button
   - Choose your preferred Sui wallet
   - Approve the connection

2. **Send Remittance**
   - Enter recipient address (0x...)
   - Enter amount in SUI
   - Click "Send Remittance"
   - Approve transaction in your wallet

3. **View History**
   - Recent transactions are displayed below
   - Shows sender, recipient, amount, and timestamp

### Marketplace Features
1. **Browse Items**
   - Navigate to `/marketplace`
   - Browse items by category
   - View item details and prices

2. **List Items**
   - Connect your wallet
   - Click "List Item"
   - Fill in item details (name, description, price, category)
   - Submit listing

3. **Buy Items**
   - Click "Buy Now" on any item
   - Approve transaction in your wallet
   - Item will be transferred to your wallet

4. **Manage Your Items**
   - View your listed items
   - Remove items from sale if needed

## 🔧 Development

### Smart Contract Development
```bash
cd remittance
sui move build
sui move test
```

### Frontend Development
```bash
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

### Marketplace Module (In Development)
The marketplace module provides:
- Item listing functionality
- Purchase transactions with fee collection
- Category-based browsing
- Seller management tools

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
