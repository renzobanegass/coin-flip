"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Share2, RotateCcw, TrendingUp, Target } from "lucide-react"
import { ShareModal } from "./ShareModal"
import { generateVictoryMessage, type ShareData } from "@/lib/share-utils"
import type { CoinSide } from "@/lib/coin-flip-contract"

interface ResultsScreenProps {
  result: CoinSide
  playerChoice?: CoinSide
  isWinner: boolean
  payout?: number
  totalPot: number
  winnersCount: number
  playerStats: { wins: number; losses: number; totalStaked: number }
  username?: string
  onPlayAgain: () => void
  onShare: () => void
}

export function ResultsScreen({
  result,
  playerChoice,
  isWinner,
  payout,
  totalPot,
  winnersCount,
  playerStats,
  username,
  onPlayAgain,
  onShare,
}: ResultsScreenProps) {
  const [showShareModal, setShowShareModal] = useState(false)

  const shareData: ShareData = {
    isWinner,
    result,
    playerChoice: playerChoice || "heads",
    payout,
    totalPot,
    playerStats,
    username,
  }

  const victoryMessage = isWinner && payout ? generateVictoryMessage(payout, payout / 1) : ""

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 space-y-4 sm:max-w-2xl sm:space-y-6">
      {/* Confetti effect for winners */}
      {isWinner && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: Math.random() > 0.5 ? "hsl(var(--primary))" : "hsl(var(--accent))",
              }}
            />
          ))}
        </div>
      )}

      {/* Main Result Card */}
      <Card className={`text-center ${isWinner ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-3">
            {isWinner ? (
              <Trophy className="h-12 w-12 sm:h-16 sm:w-16 text-yellow-500" />
            ) : (
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gray-200 flex items-center justify-center text-xl sm:text-2xl">
                😔
              </div>
            )}
          </div>
          <CardTitle className="text-2xl sm:text-4xl font-bold text-balance">
            {isWinner ? victoryMessage || "YOU WON!" : "YOU LOST"}
          </CardTitle>
          <p className="text-lg sm:text-xl text-muted-foreground">
            The coin landed on <strong>{result.toUpperCase()}</strong>
          </p>
        </CardHeader>
        <CardContent className="space-y-4 px-4">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Your Choice</p>
              <Badge
                variant={playerChoice === result ? "default" : "secondary"}
                className="text-sm sm:text-lg px-3 py-1 sm:px-4 sm:py-2"
              >
                {playerChoice?.toUpperCase()}
              </Badge>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Result</p>
              <Badge variant="outline" className="text-sm sm:text-lg px-3 py-1 sm:px-4 sm:py-2 border-2">
                {result.toUpperCase()}
              </Badge>
            </div>
          </div>

          {isWinner && payout && (
            <div className="bg-green-100 rounded-lg p-3 sm:p-4">
              <p className="text-xl sm:text-2xl font-bold text-green-800">+{payout.toFixed(2)} ETH</p>
              <p className="text-xs sm:text-sm text-green-600">
                Split among {winnersCount} winner{winnersCount !== 1 ? "s" : ""}
              </p>
              <p className="text-xs text-green-500 mt-1">{((payout / 1) * 100).toFixed(0)}% return on investment</p>
            </div>
          )}

          <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
            <p>Total pot: {totalPot} ETH</p>
            <p>Winners: {winnersCount}</p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-2">
            <Badge variant="outline" className="flex items-center justify-center gap-1 text-xs sm:text-sm">
              <Target className="h-3 w-3" />
              {playerStats.wins}W-{playerStats.losses}L
            </Badge>
            <Badge variant="outline" className="flex items-center justify-center gap-1 text-xs sm:text-sm">
              <TrendingUp className="h-3 w-3" />
              {playerStats.totalStaked} ETH staked
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Button onClick={onPlayAgain} className="flex-1 h-12" size="lg">
          <RotateCcw className="h-4 w-4 mr-2" />
          Play Again
        </Button>
        <Button
          onClick={() => setShowShareModal(true)}
          variant="outline"
          className="flex-1 bg-transparent h-12"
          size="lg"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share {isWinner ? "Victory" : "Result"}
        </Button>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-3 sm:p-4 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground text-balance">
            {isWinner
              ? `Congratulations! You're ${playerStats.wins}-${playerStats.losses} overall. Share your win and invite friends to play!`
              : `You're ${playerStats.wins}-${playerStats.losses} overall. The next round is starting soon - will you get your revenge?`}
          </p>
        </CardContent>
      </Card>

      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} shareData={shareData} />
    </div>
  )
}
