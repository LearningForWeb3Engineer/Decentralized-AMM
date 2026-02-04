# Decentralized AMM (Automated Market Maker)

A full-stack decentralized exchange built on Ethereum, implementing an automated market maker protocol with complete liquidity management, swap functionality, and real-time analytics.

## 🌟 Live Demo

- **Smart Contracts (Sepolia)**: 
  - AMM: [0xf6081AAEBA01F421cB6E279010786bc25ea069CA](https://sepolia.etherscan.io/address/0xf6081AAEBA01F421cB6E279010786bc25ea069CA)
  - TokenA: [0xa03C1a9BdFf38B1b65761b484ee86a3F97B5d7A7](https://sepolia.etherscan.io/address/0xa03C1a9BdFf38B1b65761b484ee86a3F97B5d7A7)
  - TokenB: [0xB8bf69ba7F45dDf9FC1dD34b2112Fe66FAa7682e](https://sepolia.etherscan.io/address/0xB8bf69ba7F45dDf9FC1dD34b2112Fe66FAa7682e)

## ✨ Features

### Smart Contract Features
- ✅ **Constant Product AMM** - Implements x * y = k formula for automated market making
- ✅ **Liquidity Provision** - Add/remove liquidity with proportional LP token distribution
- ✅ **0.3% Trading Fee** - Industry-standard fee structure for liquidity providers
- ✅ **Security Mechanisms**:
  - ReentrancyGuard protection
  - Pausable emergency controls
  - Deadline-based transaction expiry
  - Slippage protection
- ✅ **Event Emissions** - Complete transaction history logging
- ✅ **Query Functions** - Real-time price, reserves, and user share calculations

### Frontend Features
- ✅ **Swap Interface** - Token swapping with real-time price calculation
- ✅ **Pool Dashboard** - Display TVL, current price, and fee analytics
- ✅ **Liquidity Management** - Add and remove liquidity with live balance updates
- ✅ **Transaction History** - Event-based transaction tracking
- ✅ **Smart Approve Flow** - Automatic allowance detection and approval prompts
- ✅ **Wallet Integration** - RainbowKit support for multiple wallet providers
- ✅ **Responsive Design** - Mobile-friendly interface
- ✅ **Loading States & Error Handling** - Comprehensive UX feedback

## 🛠️ Tech Stack

### Smart Contracts
- **Solidity ^0.8.0**
- **OpenZeppelin Contracts** - Security-audited base contracts
- **Remix IDE** - Development and deployment

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript/JavaScript**
- **Wagmi** - React hooks for Ethereum
- **Viem** - Lightweight Ethereum library
- **RainbowKit** - Wallet connection UI
- **Ethers.js v6** - Ethereum interactions
- **Tailwind CSS** - Utility-first styling

## 📐 Architecture
```
┌─────────────────┐
│   Next.js App   │
│   (Frontend)    │
└────────┬────────┘
         │
         │ Web3 Calls
         │
┌────────▼────────┐
│  Smart Contracts│
│   (Blockchain)  │
├─────────────────┤
│  AMM Contract   │
│  ├─ TokenA      │
│  ├─ TokenB      │
│  └─ LPToken     │
└─────────────────┘
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH ([Get from faucet](https://sepoliafaucet.com/))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/amm-dex.git
cd amm-dex
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
# The contract addresses are already configured in contracts/config.js
# No additional environment variables needed for Sepolia testnet
```

4. **Run development server**
```bash
npm run dev
```

5. **Open browser**
```
http://localhost:3000
```

## 📝 Smart Contract Details

### AMM Contract Functions

**Core Trading**
- `swap(address tokenIn, uint256 amountIn, uint256 minAmountGet, uint256 deadline)` - Execute token swap
- `getAmountOut(address tokenIn, uint256 amountIn)` - Calculate output amount (view)

**Liquidity Management**
- `addLiquidity(uint256 amountA, uint256 amountB, uint256 deadline)` - Add liquidity to pool
- `removeLiquidity(uint256 lpAmount, uint256 deadline)` - Remove liquidity from pool

**Query Functions**
- `getPrice()` - Current price ratio (view)
- `getReserves()` - Current reserve amounts (view)
- `getUserLiquidityShare(address user)` - User's pool ownership percentage (view)

**Admin Functions**
- `pause()` - Emergency pause (owner only)
- `unpause()` - Resume operations (owner only)

### Security Features

1. **ReentrancyGuard** - Prevents reentrancy attacks on all state-changing functions
2. **Pausable** - Emergency stop mechanism for critical situations
3. **Ownable** - Restricted admin functions
4. **Deadline Protection** - Time-based transaction validity
5. **Slippage Protection** - Minimum output amount requirements
6. **Input Validation** - Comprehensive parameter checking

## 🔐 AMM Formula

The protocol uses the constant product formula:
```
x * y = k

Where:
- x = Reserve of Token A
- y = Reserve of Token B  
- k = Constant product

Price = y / x

With 0.3% fee:
amountOut = (amountIn * 997 * reserveOut) / (reserveIn * 1000 + amountIn * 997)
```

## 📊 Usage Examples

### Swapping Tokens

1. Connect your wallet
2. Select token pair (TKA ↔ TKB)
3. Enter amount to swap
4. Review calculated output and price impact
5. Approve token spending (if needed)
6. Confirm swap transaction

### Adding Liquidity

1. Navigate to Liquidity page
2. Enter amounts for both tokens
3. Preview LP tokens to receive
4. Approve both tokens (if needed)
5. Confirm add liquidity transaction

### Removing Liquidity

1. Navigate to Liquidity page
2. Enter LP token amount to burn
3. Preview tokens to receive
4. Confirm remove liquidity transaction

## 🧪 Testing

The contracts have been deployed and tested on Sepolia testnet with:
- ✅ Token swaps with various amounts
- ✅ Liquidity addition and removal
- ✅ Price impact calculations
- ✅ Slippage protection mechanisms
- ✅ Emergency pause functionality
- ✅ Event emission verification

## 🙏 Acknowledgments

- Inspired by Uniswap V2
- Built with OpenZeppelin secure contracts
- UI design inspired by modern DeFi interfaces

---