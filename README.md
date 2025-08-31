# Flip the Coin 🪙

A decentralized coin flip game built as a Farcaster Mini App where players can join global rounds, pick heads or tails, and win ETH.

## Features

- **Global Rounds**: Join timed rounds with other players worldwide
- **Simple Gameplay**: Choose heads or tails with a 0.001 ETH buy-in per round
- **Winner Takes All**: Winners split the prize pool
- **Real-time Updates**: Live countdown timers and player statistics
- **Social Integration**: Built for Farcaster with sharing capabilities
- **Mobile-First**: Responsive design optimized for mobile devices with touch interactions
- **Blockchain Integration**: Smart contract deployment with Foundry framework

## How It Works

1. **Connect**: Sign in with your Farcaster account
2. **Choose**: Pick heads or tails before the timer runs out
3. **Wait**: Watch the coin flip animation
4. **Win**: If you chose correctly, you split the pot with other winners

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Radix UI primitives with shadcn/ui
- **Blockchain**: Solidity smart contracts with Foundry framework
- **Network**: Base network integration
- **Authentication**: Farcaster authentication via Frame SDK
- **Wallet**: Coinbase OnchainKit integration
- **State Management**: React hooks with Tanstack Query
- **Deployment**: Vercel

## Project Structure

```
├── app/                    # Next.js app router
│   ├── api/               # API routes for authentication and OG images
│   └── .well-known/       # Farcaster manifest
├── components/
│   ├── CoinFlip/          # Game components
│   ├── ui/                # Reusable UI components (shadcn/ui)
│   └── Home/              # Main game interface
├── contracts/             # Solidity smart contracts
│   ├── src/               # Contract source files
│   ├── test/              # Contract tests
│   └── script/            # Deployment scripts
├── contexts/              # React contexts (MiniApp)
├── hooks/                 # React hooks for game logic
├── lib/                   # Utilities and core logic
│   ├── coin-flip-contract.ts  # Mock contract for development
│   ├── env.ts             # Environment configuration
│   └── warpcast.ts        # Farcaster integration
├── public/                # Static assets
└── styles/                # Global styles
```

## Development

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd coin-flip
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Add your Farcaster app credentials and other config
```

4. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Available Scripts

**Frontend:**
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

**Smart Contracts (Foundry):**
- `forge build` - Compile contracts
- `forge test` - Run contract tests
- `forge deploy` - Deploy contracts

## Game Mechanics

- **Round Duration**: 60 seconds per round
- **Buy-in**: 0.001 ETH per player
- **Teams**: Players choose between heads (team 1) or tails (team 2)
- **Payout**: Winners split the entire pot equally
- **Resolution**: Rounds resolve automatically using block-based randomness
- **Auto-Resolution**: Rounds resolve automatically when timer expires

## Smart Contract

The game includes a Solidity smart contract (`contracts/src/Coinflip.sol`) deployed with Foundry framework. For development and testing, a mock implementation (`lib/coin-flip-contract.ts`) is used to simulate contract behavior without requiring blockchain transactions.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details