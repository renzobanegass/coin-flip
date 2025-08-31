# Flip the Coin 🪙

A decentralized coin flip game built as a Farcaster Mini App where players can join global rounds, pick heads or tails, and win ETH.

## Features

- **Global Rounds**: Join timed rounds with other players worldwide
- **Simple Gameplay**: Choose heads or tails with a $1 buy-in per round
- **Winner Takes All**: Winners split the prize pool (minus 5% protocol fee)
- **Real-time Updates**: Live countdown timers and player statistics
- **Social Integration**: Built for Farcaster with sharing capabilities
- **Mobile-First**: Optimized for mobile devices with touch interactions

## How It Works

1. **Connect**: Sign in with your Farcaster account
2. **Choose**: Pick heads or tails before the timer runs out
3. **Wait**: Watch the coin flip animation
4. **Win**: If you chose correctly, you split the pot with other winners

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Radix UI primitives with shadcn/ui
- **Blockchain**: Base network (currently mock implementation)
- **Authentication**: Farcaster authentication
- **Wallet**: Coinbase OnchainKit integration

## Project Structure

```
├── app/                    # Next.js app router
├── components/
│   ├── CoinFlip/          # Game components
│   ├── ui/                # Reusable UI components
│   └── Home/              # Main game interface
├── hooks/                 # React hooks for game logic
├── lib/                   # Utilities and core logic
│   ├── coin-flip-contract.ts  # Mock smart contract
│   └── env.ts             # Environment configuration
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

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Game Mechanics

- **Round Duration**: 60 seconds per round
- **Buy-in**: $1 ETH per player
- **Protocol Fee**: 5% of total pot
- **Payout**: Winners split remaining 95% of pot equally
- **Auto-Resolution**: Rounds resolve automatically when timer expires

## Mock Implementation

Currently uses a mock smart contract (`lib/coin-flip-contract.ts`) for development and testing. In production, this would be replaced with actual Web3 contract calls on Base network.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details