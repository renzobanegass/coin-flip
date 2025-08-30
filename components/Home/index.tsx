"use client"

import { useSignIn } from "@/hooks/use-sign-in"
import { useState, useEffect } from "react"
import { CoinAnimation } from "@/components/CoinFlip/CoinAnimation"
import { ResultsScreen } from "@/components/CoinFlip/ResultsScreen"
import { GameHistory } from "@/components/CoinFlip/GameHistory"
import { BottomNavbar } from "@/components/BottomNavbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCoinFlip } from "@/hooks/use-coin-flip"
import { useWallet } from "@/hooks/use-wallet"
import { Clock, DollarSign, Users, Wallet } from "lucide-react"
import type { CoinSide } from "@/lib/coin-flip-contract"

export default function Home() {
  const { signIn, isLoading, isSignedIn, user } = useSignIn({
    autoSignIn: true,
  })

  const [activeTab, setActiveTab] = useState("game")
  const [lastResult, setLastResult] = useState<{
    result: CoinSide
    playerChoice?: CoinSide
    isWinner: boolean
    payout?: number
    totalPot: number
    winnersCount: number
  } | null>(null)

  const playerAddress = user?.fid?.toString()
  const {
    joinRound,
    currentRound,
    playerStats,
    timeRemaining,
    hasJoinedRound,
    getPlayerChoice,
    getRoundStats,
    gamePhase,
  } = useCoinFlip(playerAddress)
  const { balance, checkBalance } = useWallet()

  const roundStats = getRoundStats()
  const playerChoice = getPlayerChoice()
  const hasJoined = hasJoinedRound()

  useEffect(() => {
    if (isSignedIn) {
      checkBalance()
    }
  }, [isSignedIn])

  const handleJoinRound = async (choice: CoinSide) => {
    if (!user || hasJoined || gamePhase !== "betting") return

    try {
      await joinRound(choice, {
        username: user.username,
        pfp_url: user.pfp_url,
      })
    } catch (error) {
      console.error("Failed to join round:", error)
    }
  }

  const handleTestFlip = () => {
    const mockResult: CoinSide = Math.random() < 0.5 ? "heads" : "tails"
    const isWinner = playerChoice === mockResult
    const mockPayout = isWinner ? 1.9 : 0

    setLastResult({
      result: mockResult,
      playerChoice,
      isWinner,
      payout: mockPayout,
      totalPot: currentRound?.pot || 0,
      winnersCount: isWinner ? 1 : 0,
    })
  }

  useEffect(() => {
    if (gamePhase === "results" && currentRound && !lastResult) {
      const mockResult: CoinSide = Math.random() < 0.5 ? "heads" : "tails"
      const isWinner = playerChoice === mockResult
      const mockPayout = isWinner ? 1.9 : 0

      setLastResult({
        result: mockResult,
        playerChoice,
        isWinner,
        payout: mockPayout,
        totalPot: currentRound?.pot || 0,
        winnersCount: isWinner ? 1 : 0,
      })
    } else if (gamePhase === "betting") {
      setLastResult(null)
    }
  }, [gamePhase, currentRound, playerChoice, lastResult])

  const handlePlayAgain = () => {
    setLastResult(null)
  }

  const handleShare = () => {
    if (!lastResult) return

    const message = lastResult.isWinner
      ? `I just flipped 1 ETH into ${lastResult.payout?.toFixed(2)} ETH on Flip the Coin! 🪙🔥 Join the next round!`
      : `Just played Flip the Coin! The coin landed on ${lastResult.result.toUpperCase()}. Join the next round! 🪙`

    if (navigator.share) {
      navigator.share({
        title: "Flip the Coin Game",
        text: message,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(message + " " + window.location.href)
      alert("Result copied to clipboard!")
    }
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">🪙</div>
            <CardTitle className="text-3xl font-bold text-balance">Flip the Coin</CardTitle>
            <p className="text-muted-foreground">Join global rounds, pick heads or tails, and win big!</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2 text-sm text-muted-foreground">
              <p>• $1 buy-in per round</p>
              <p>• Winners split the pot</p>
              <p>• Instant payouts</p>
            </div>
            <Button onClick={signIn} disabled={isLoading} className="w-full" size="lg">
              {isLoading ? "Connecting..." : "Connect & Play"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {activeTab === "game" && gamePhase === "betting" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-muted/30 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Balance</span>
              </div>
              <div className="font-bold text-lg">{balance} ETH</div>
            </div>

            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <DollarSign className="h-6 w-6 text-primary" />
                <div className="text-4xl font-bold text-primary">{roundStats.totalPot} ETH</div>
              </div>
              <p className="text-base text-muted-foreground">Prize Pool</p>
            </div>

            <div className="flex justify-center py-4">
              <div className="w-24 h-24">
                <CoinAnimation isFlipping={false} />
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                <div className="text-2xl font-bold text-amber-500">
                  {Math.floor((timeRemaining || 0) / 1000 / 60)}:
                  {String(Math.floor(((timeRemaining || 0) / 1000) % 60)).padStart(2, "0")}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Time Left</p>
            </div>

            {process.env.NODE_ENV === "development" && (
              <div className="text-center">
                <Button onClick={handleTestFlip} variant="outline" size="sm" className="text-xs bg-transparent">
                  Test Flip
                </Button>
              </div>
            )}

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-center">Choose Your Side</h2>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => handleJoinRound("heads")}
                  disabled={hasJoined}
                  size="lg"
                  className="h-36 relative overflow-hidden group transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{
                    background:
                      hasJoined && playerChoice === "heads"
                        ? "linear-gradient(135deg, #16a34a 0%, #15803d 50%, #166534 100%)"
                        : "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)",
                    boxShadow: "0 8px 32px rgba(251, 191, 36, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                    border: "2px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <div className="text-center relative z-10">
                    <div className="w-12 h-12 mx-auto mb-2 relative">
                      <div
                        className="w-full h-full rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg"
                        style={{
                          background: "linear-gradient(145deg, #fcd34d, #f59e0b)",
                          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.2)",
                        }}
                      >
                        H
                      </div>
                    </div>
                    <div className="text-lg font-black text-white drop-shadow-lg">HEADS</div>
                    <div className="text-xs text-white/90 mt-1">
                      {roundStats.headsCount} players • ${roundStats.headsCount} ETH
                    </div>
                    {hasJoined && playerChoice === "heads" && (
                      <div className="text-xs text-white/80 mt-1">✓ You're in!</div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>

                <Button
                  onClick={() => handleJoinRound("tails")}
                  disabled={hasJoined}
                  size="lg"
                  className="h-36 relative overflow-hidden group transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{
                    background:
                      hasJoined && playerChoice === "tails"
                        ? "linear-gradient(135deg, #16a34a 0%, #15803d 50%, #166534 100%)"
                        : "linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%)",
                    boxShadow: "0 8px 32px rgba(6, 182, 212, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                    border: "2px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <div className="text-center relative z-10">
                    <div className="w-12 h-12 mx-auto mb-2 relative">
                      <div
                        className="w-full h-full rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg"
                        style={{
                          background: "linear-gradient(145deg, #22d3ee, #0891b2)",
                          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.2)",
                        }}
                      >
                        T
                      </div>
                    </div>
                    <div className="text-lg font-black text-white drop-shadow-lg">TAILS</div>
                    <div className="text-xs text-white/90 mt-1">
                      {roundStats.tailsCount} players • ${roundStats.tailsCount} ETH
                    </div>
                    {hasJoined && playerChoice === "tails" && (
                      <div className="text-xs text-white/80 mt-1">✓ You're in!</div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm text-muted-foreground bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <div>
                  <div className="font-medium">{user.display_name}</div>
                  <div className="text-xs">
                    {playerStats.wins}W - {playerStats.losses}L
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Total Staked</div>
                <div className="font-bold flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {playerStats.totalStaked}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "game" && gamePhase === "flipping" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Flipping...</h2>
              <p className="text-muted-foreground">The coin is in the air!</p>
            </div>
            <div className="w-32 h-32">
              <CoinAnimation
                isFlipping={true}
                result={lastResult?.result}
                onAnimationComplete={() => {
                  // Animation complete, results will show automatically via gamePhase
                }}
              />
            </div>
          </div>
        )}

        {activeTab === "game" && gamePhase === "results" && lastResult && (
          <div className="mt-6">
            <ResultsScreen
              result={lastResult.result}
              playerChoice={lastResult.playerChoice}
              isWinner={lastResult.isWinner}
              payout={lastResult.payout}
              totalPot={lastResult.totalPot}
              winnersCount={lastResult.winnersCount}
              playerStats={playerStats}
              username={user?.username}
              onPlayAgain={handlePlayAgain}
              onShare={handleShare}
            />
          </div>
        )}

        {activeTab === "history" && (
          <div className="mt-6">
            <GameHistory />
          </div>
        )}
      </div>

      <BottomNavbar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
