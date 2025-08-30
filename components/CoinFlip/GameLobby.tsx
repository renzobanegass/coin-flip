"use client"

import { useCoinFlip } from "@/hooks/use-coin-flip"
import { useWallet } from "@/hooks/use-wallet"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Users, DollarSign, Wallet } from "lucide-react"
import type { CoinSide } from "@/lib/coin-flip-contract"
import { useEffect } from "react"

interface GameLobbyProps {
  playerAddress?: string
  playerData?: { username?: string; pfp_url?: string }
  onJoinRound: (choice: CoinSide) => void
}

export function GameLobby({ playerAddress, playerData, onJoinRound }: GameLobbyProps) {
  const { currentRound, timeRemaining, isJoining, hasJoinedRound, getPlayerChoice, getRoundStats } =
    useCoinFlip(playerAddress)

  const { balance, checkBalance, walletAddress } = useWallet()

  const roundStats = getRoundStats()
  const playerChoice = getPlayerChoice()
  const hasJoined = hasJoinedRound()

  useEffect(() => {
    if (walletAddress) {
      checkBalance()
    }
  }, [walletAddress, checkBalance])

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`
  }

  const timeProgress = currentRound ? ((60000 - timeRemaining) / 60000) * 100 : 0
  const hasSufficientBalance = Number.parseFloat(balance) >= 1

  if (!currentRound) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading game...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 space-y-4 sm:max-w-2xl sm:space-y-6">
      {/* Round Header */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardHeader className="text-center py-4 px-4">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-balance">Flip the Coin</CardTitle>
          <p className="text-sm sm:text-base text-muted-foreground">Join the global round and pick your side!</p>
        </CardHeader>
      </Card>

      {/* Game Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Card>
          <CardContent className="flex flex-col items-center space-y-1 p-3 sm:flex-row sm:space-y-0 sm:space-x-2 sm:p-4">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm text-muted-foreground">Time Left</p>
              <p className="text-lg sm:text-xl font-bold">{formatTime(timeRemaining)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center space-y-1 p-3 sm:flex-row sm:space-y-0 sm:space-x-2 sm:p-4">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm text-muted-foreground">Players</p>
              <p className="text-lg sm:text-xl font-bold">{currentRound.players.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center space-y-1 p-3 sm:flex-row sm:space-y-0 sm:space-x-2 sm:p-4">
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm text-muted-foreground">Prize Pool</p>
              <p className="text-lg sm:text-xl font-bold">${roundStats.totalPot}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center space-y-1 p-3 sm:flex-row sm:space-y-0 sm:space-x-2 sm:p-4">
            <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm text-muted-foreground">Balance</p>
              <p className={`text-lg sm:text-xl font-bold ${hasSufficientBalance ? "text-green-600" : "text-red-600"}`}>
                {Number.parseFloat(balance).toFixed(2)} ETH
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {!hasSufficientBalance && !hasJoined && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-3 sm:p-4 text-center">
            <p className="text-red-800 font-medium text-sm sm:text-base">Insufficient Balance</p>
            <p className="text-xs sm:text-sm text-red-600 mt-1">
              You need at least 1 ETH to join the round. Please add funds to your wallet.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Time Progress */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-muted-foreground">Round Progress</span>
            <span className="text-xs sm:text-sm font-medium">{Math.round(timeProgress)}%</span>
          </div>
          <Progress value={timeProgress} className="h-2" />
        </CardContent>
      </Card>

      {/* Player Choices */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="text-3xl sm:text-4xl mb-2">🪙</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2">HEADS</h3>
            <Badge variant="secondary" className="mb-3 sm:mb-4">
              {roundStats.headsCount} players
            </Badge>
            {!hasJoined ? (
              <Button
                onClick={() => onJoinRound("heads")}
                disabled={isJoining || timeRemaining < 5000 || !hasSufficientBalance}
                className="w-full bg-orange-600 hover:bg-orange-700 h-12 text-sm sm:text-base"
                size="lg"
              >
                {isJoining ? "Processing..." : "Pick Heads (1 ETH)"}
              </Button>
            ) : playerChoice === "heads" ? (
              <Badge variant="default" className="bg-orange-600 text-sm">
                Your Choice ✓
              </Badge>
            ) : (
              <Button disabled className="w-full bg-transparent h-12" variant="outline">
                Pick Heads (1 ETH)
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 border-cyan-200 bg-cyan-50">
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="text-3xl sm:text-4xl mb-2">🪙</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2">TAILS</h3>
            <Badge variant="secondary" className="mb-3 sm:mb-4">
              {roundStats.tailsCount} players
            </Badge>
            {!hasJoined ? (
              <Button
                onClick={() => onJoinRound("tails")}
                disabled={isJoining || timeRemaining < 5000 || !hasSufficientBalance}
                className="w-full bg-cyan-600 hover:bg-cyan-700 h-12 text-sm sm:text-base"
                size="lg"
              >
                {isJoining ? "Processing..." : "Pick Tails (1 ETH)"}
              </Button>
            ) : playerChoice === "tails" ? (
              <Badge variant="default" className="bg-cyan-600 text-sm">
                Your Choice ✓
              </Badge>
            ) : (
              <Button disabled className="w-full bg-transparent h-12" variant="outline">
                Pick Tails (1 ETH)
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Player Status */}
      {hasJoined && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-3 sm:p-4 text-center">
            <p className="text-green-800 font-medium text-sm sm:text-base">
              You're in! You chose <strong>{playerChoice?.toUpperCase()}</strong>
            </p>
            <p className="text-xs sm:text-sm text-green-600 mt-1">
              {timeRemaining < 5000 ? "Round ending soon..." : "Good luck!"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {!hasJoined && (
        <Card className="bg-muted/50">
          <CardContent className="p-3 sm:p-4 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Join with 1 ETH • Pick heads or tails • Winners split the pot • 5% goes to protocol
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
