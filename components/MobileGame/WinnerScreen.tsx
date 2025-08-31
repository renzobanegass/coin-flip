"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Share2, RotateCcw, DollarSign } from "lucide-react"
import type { CoinSide } from "@/lib/coin-flip-contract"

interface WinnerScreenProps {
  result: CoinSide
  isWinner: boolean
  payout: number
  playerChoice?: CoinSide | null
  totalPot: number
  winnersCount: number
  onPlayAgain: () => void
  onShare?: () => void
}

export function WinnerScreen({
  result,
  isWinner,
  payout,
  playerChoice,
  totalPot,
  winnersCount,
  onPlayAgain,
  onShare
}: WinnerScreenProps) {
  const handleShare = () => {
    const message = isWinner
      ? `I just won ${payout.toFixed(3)} ETH on Coin Flip! 🎉 The coin landed on ${result.toUpperCase()}!`
      : `The coin landed on ${result.toUpperCase()}! Better luck next time. Join the next round!`

    if (navigator.share) {
      navigator.share({
        title: "Coin Flip Game Result",
        text: message,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(message + " " + window.location.href)
      // You could add a toast notification here
    }
    
    onShare?.()
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4 text-slate-100 flex items-center justify-center">
      <div className="max-w-sm mx-auto space-y-6 text-center">
        
        {/* Result Coin */}
        <div className="space-y-4">
          <div 
            className="w-32 h-32 mx-auto rounded-full flex items-center justify-center text-6xl shadow-2xl"
            style={{
              background: result === 'heads' 
                ? 'linear-gradient(145deg, #fbbf24, #f59e0b)' 
                : 'linear-gradient(145deg, #06b6d4, #0891b2)',
              boxShadow: '0 12px 48px rgba(0,0,0,0.4), inset 0 3px 6px rgba(255,255,255,0.2)'
            }}
          >
            {result === 'heads' ? '👑' : '⚡'}
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">
              {result.toUpperCase()}
            </h1>
            <p className="text-slate-300">
              The coin landed on {result}
            </p>
          </div>
        </div>

        {/* Win/Loss Status */}
        <Card className={`border-2 ${
          isWinner 
            ? 'bg-green-900/30 border-green-500 animate-pulse' 
            : 'bg-red-900/30 border-red-600'
        }`}>
          <CardContent className="p-6">
            {isWinner ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <Trophy className="h-8 w-8" />
                  <h2 className="text-2xl font-bold">YOU WON!</h2>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-3xl font-bold text-green-300">
                    <DollarSign className="h-6 w-6" />
                    {payout.toFixed(3)} ETH
                  </div>
                  <p className="text-green-300 text-sm">
                    Split between {winnersCount} winner{winnersCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-red-400">Better Luck Next Time!</h2>
                {playerChoice && (
                  <p className="text-red-300">
                    You chose {playerChoice.toUpperCase()}, but it landed on {result.toUpperCase()}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Game Stats */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex justify-between items-center text-sm">
              <div>
                <p className="text-slate-400">Total Pot</p>
                <p className="font-bold">{totalPot.toFixed(3)} ETH</p>
              </div>
              <div>
                <p className="text-slate-400">Winners</p>
                <p className="font-bold">{winnersCount}</p>
              </div>
              <div>
                <p className="text-slate-400">Your Choice</p>
                <p className="font-bold">{playerChoice?.toUpperCase() || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onPlayAgain}
            className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-semibold"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Play Again
          </Button>
          
          <Button
            onClick={handleShare}
            variant="outline"
            className="w-full border-slate-600 text-slate-200 hover:bg-slate-700 h-12"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share Result
          </Button>
        </div>

        {isWinner && (
          <div className="text-center text-sm text-yellow-300 animate-bounce">
            🎉 Congratulations! Your winnings have been added to your balance! 🎉
          </div>
        )}
      </div>
    </div>
  )
}