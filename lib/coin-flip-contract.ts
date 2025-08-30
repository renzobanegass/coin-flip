// Mock smart contract for coin flip game - hackathon version
// In production, this would be replaced with actual Web3 contract calls

export type CoinSide = "heads" | "tails"

export interface Player {
  address: string
  choice: CoinSide
  amount: number
  username?: string
  pfp_url?: string
  txHash?: string
}

export interface Round {
  id: string
  players: Player[]
  pot: number
  startTime: number
  endTime: number
  status: "active" | "resolving" | "completed"
  result?: CoinSide
  winners?: Player[]
}

export interface GameState {
  currentRound: Round
  pastRounds: Round[]
  playerStats: Record<string, { wins: number; losses: number; totalStaked: number }>
}

class CoinFlipContract {
  private gameState: GameState
  private readonly ROUND_DURATION = 60000 // 1 minute in milliseconds
  private readonly BUY_IN = 1 // $1 fixed buy-in
  private readonly RAKE_PERCENTAGE = 0.05 // 5% protocol fee

  constructor() {
    this.gameState = {
      currentRound: this.createNewRound(),
      pastRounds: [],
      playerStats: {},
    }

    // Auto-resolve rounds when they expire
    this.startRoundTimer()
  }

  private createNewRound(): Round {
    const now = Date.now()
    return {
      id: `round_${now}`,
      players: [],
      pot: 0,
      startTime: now,
      endTime: now + this.ROUND_DURATION,
      status: "active",
    }
  }

  private startRoundTimer() {
    setInterval(() => {
      const now = Date.now()
      if (this.gameState.currentRound.status === "active" && now >= this.gameState.currentRound.endTime) {
        this.resolveRound()
      }
    }, 1000)
  }

  joinRound(
    playerAddress: string,
    choice: CoinSide,
    playerData?: { username?: string; pfp_url?: string },
    txHash?: string,
  ): { success: boolean; error?: string } {
    const currentRound = this.gameState.currentRound

    if (currentRound.status !== "active") {
      return { success: false, error: "Round is not active" }
    }

    if (Date.now() >= currentRound.endTime) {
      return { success: false, error: "Round has ended" }
    }

    // Check if player already joined this round
    const existingPlayer = currentRound.players.find((p) => p.address === playerAddress)
    if (existingPlayer) {
      return { success: false, error: "Already joined this round" }
    }

    if (txHash && !this.verifyPaymentTransaction(txHash, playerAddress, this.BUY_IN)) {
      return { success: false, error: "Payment verification failed" }
    }

    // Add player to round
    const player: Player = {
      address: playerAddress,
      choice,
      amount: this.BUY_IN,
      username: playerData?.username,
      pfp_url: playerData?.pfp_url,
      txHash,
    }

    currentRound.players.push(player)
    currentRound.pot += this.BUY_IN

    // Initialize player stats if first time
    if (!this.gameState.playerStats[playerAddress]) {
      this.gameState.playerStats[playerAddress] = { wins: 0, losses: 0, totalStaked: 0 }
    }
    this.gameState.playerStats[playerAddress].totalStaked += this.BUY_IN

    return { success: true }
  }

  private verifyPaymentTransaction(txHash: string, playerAddress: string, amount: number): boolean {
    // Mock verification - in production, verify on-chain transaction
    if (!txHash || txHash.length < 10) return false

    // Simulate verification delay
    console.log(`[v0] Verifying payment: ${txHash} from ${playerAddress} for $${amount}`)

    // Mock success (in production, check actual transaction on Base)
    return true
  }

  // Resolve current round (trigger coin flip)
  resolveRound(): { result: CoinSide; winners: Player[]; payouts: Record<string, number> } {
    const currentRound = this.gameState.currentRound

    if (currentRound.status !== "active") {
      throw new Error("Round is not active")
    }

    if (currentRound.players.length === 0) {
      // No players, start new round
      this.gameState.currentRound = this.createNewRound()
      return { result: "heads", winners: [], payouts: {} }
    }

    currentRound.status = "resolving"

    // Mock coin flip using pseudo-random (in production, use Chainlink VRF)
    const result: CoinSide = Math.random() < 0.5 ? "heads" : "tails"
    currentRound.result = result

    // Find winners
    const winners = currentRound.players.filter((player) => player.choice === result)
    currentRound.winners = winners

    // Calculate payouts
    const payouts: Record<string, number> = {}
    if (winners.length > 0) {
      const totalPot = currentRound.pot
      const rake = totalPot * this.RAKE_PERCENTAGE
      const prizePool = totalPot - rake
      const payoutPerWinner = prizePool / winners.length

      winners.forEach((winner) => {
        payouts[winner.address] = payoutPerWinner
        this.gameState.playerStats[winner.address].wins += 1
      })

      // Update losers' stats
      currentRound.players.forEach((player) => {
        if (player.choice !== result) {
          this.gameState.playerStats[player.address].losses += 1
        }
      })
    }

    currentRound.status = "completed"
    this.gameState.pastRounds.unshift(currentRound)

    // Keep only last 50 rounds in memory
    if (this.gameState.pastRounds.length > 50) {
      this.gameState.pastRounds = this.gameState.pastRounds.slice(0, 50)
    }

    // Start new round
    this.gameState.currentRound = this.createNewRound()

    return { result, winners, payouts }
  }

  // Get current round information
  getRoundInfo(): Round {
    return { ...this.gameState.currentRound }
  }

  // Get player statistics
  getPlayerStats(playerAddress: string) {
    return this.gameState.playerStats[playerAddress] || { wins: 0, losses: 0, totalStaked: 0 }
  }

  // Get past rounds
  getPastRounds(limit = 10): Round[] {
    return this.gameState.pastRounds.slice(0, limit)
  }

  // Get time remaining in current round
  getTimeRemaining(): number {
    const now = Date.now()
    const timeLeft = this.gameState.currentRound.endTime - now
    return Math.max(0, timeLeft)
  }

  // Get round summary for sharing
  getRoundSummary(roundId: string) {
    const round = this.gameState.pastRounds.find((r) => r.id === roundId)
    if (!round) return null

    const headsCount = round.players.filter((p) => p.choice === "heads").length
    const tailsCount = round.players.filter((p) => p.choice === "tails").length

    return {
      id: round.id,
      result: round.result,
      totalPlayers: round.players.length,
      headsCount,
      tailsCount,
      pot: round.pot,
      winnersCount: round.winners?.length || 0,
    }
  }

  getRequiredPayment(): number {
    return this.BUY_IN
  }

  startNewRound(): Round {
    // Complete current round if it's still active
    if (this.gameState.currentRound.status === "active") {
      this.gameState.pastRounds.unshift(this.gameState.currentRound)
    }

    // Create and set new round
    this.gameState.currentRound = this.createNewRound()
    return this.gameState.currentRound
  }
}

// Singleton instance for the mock contract
export const coinFlipContract = new CoinFlipContract()
