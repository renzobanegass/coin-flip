"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Users, DollarSign, Wallet } from "lucide-react"
import { CoinFlip } from "./CoinFlip"
import { WinnerScreen } from "./WinnerScreen"
import type { CoinSide } from "@/lib/coin-flip-contract"

interface Player {
  address: string
  choice: CoinSide
  amount: number
}

interface GameScreenProps {
  playerAddress?: string
  playerName?: string
  balance: string
  onJoinRound: (choice: CoinSide) => Promise<void>
  onRefreshBalance: () => void
}

export function GameScreen({ 
  playerAddress, 
  playerName, 
  balance, 
  onJoinRound, 
  onRefreshBalance 
}: GameScreenProps) {
  const [gamePhase, setGamePhase] = useState<'betting' | 'flipping' | 'result'>('betting')
  const [timeLeft, setTimeLeft] = useState(60)
  const [players, setPlayers] = useState<Player[]>([])
  const [playerChoice, setPlayerChoice] = useState<CoinSide | null>(null)
  const [isJoining, setIsJoining] = useState(false)
  const [lastResult, setLastResult] = useState<{
    result: CoinSide
    isWinner: boolean
    payout: number
  } | null>(null)

  const BET_AMOUNT = 0.001
  const hasEnoughBalance = parseFloat(balance) >= BET_AMOUNT
  const hasJoined = playerChoice !== null
  const headsCount = players.filter(p => p.choice === 'heads').length
  const tailsCount = players.filter(p => p.choice === 'tails').length
  const totalPot = players.length * BET_AMOUNT

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (gamePhase === 'betting' && players.length > 0) {
            setGamePhase('flipping')
            setTimeout(() => {
              const result: CoinSide = Math.random() < 0.5 ? 'heads' : 'tails'
              const winners = players.filter(p => p.choice === result)
              const isWinner = playerChoice === result
              const payout = winners.length > 0 && isWinner ? 
                (totalPot * 0.95) / winners.length : 0

              setLastResult({
                result,
                isWinner,
                payout
              })
              setGamePhase('result')
            }, 3000)
          }
          return 60
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gamePhase, players.length, playerChoice, totalPot])

  const handleJoin = async (choice: CoinSide) => {
    if (hasJoined || !hasEnoughBalance || isJoining) return
    
    setIsJoining(true)
    try {
      await onJoinRound(choice)
      setPlayerChoice(choice)
      setPlayers(prev => [...prev, {
        address: playerAddress || '',
        choice,
        amount: BET_AMOUNT
      }])
    } catch (error) {
      console.error('Failed to join:', error)
    } finally {
      setIsJoining(false)
    }
  }

  const resetGame = () => {
    setGamePhase('betting')
    setTimeLeft(60)
    setPlayers([])
    setPlayerChoice(null)
    setLastResult(null)
    onRefreshBalance()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (gamePhase === 'result' && lastResult) {
    return (
      <WinnerScreen
        result={lastResult.result}
        isWinner={lastResult.isWinner}
        payout={lastResult.payout}
        playerChoice={playerChoice}
        totalPot={totalPot}
        winnersCount={players.filter(p => p.choice === lastResult.result).length}
        onPlayAgain={resetGame}
      />
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4 text-slate-100">
      <div className="max-w-sm mx-auto space-y-6 pt-8">
        
        {/* Header with Balance */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                <span className="text-sm">Balance</span>
              </div>
              <div className="text-lg font-bold">{balance} ETH</div>
            </div>
          </CardContent>
        </Card>

        {/* Game Status */}
        <div className="text-center space-y-4">
          <div className="text-6xl">🪙</div>
          <h1 className="text-3xl font-bold">Coin Flip</h1>
          
          {gamePhase === 'betting' && (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-4 text-2xl font-bold">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6" />
                  {totalPot.toFixed(3)} ETH
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-400" />
                  <span className="text-xl font-mono">{formatTime(timeLeft)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  <span className="text-xl">{players.length}</span>
                </div>
              </div>
              
              <Progress value={((60 - timeLeft) / 60) * 100} className="h-2" />
            </div>
          )}

          {gamePhase === 'flipping' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Flipping...</h2>
              <CoinFlip isFlipping={true} />
            </div>
          )}
        </div>

        {/* Betting Interface */}
        {gamePhase === 'betting' && (
          <div className="space-y-4">
            {!hasEnoughBalance && (
              <Card className="bg-red-900/30 border-red-700">
                <CardContent className="p-4 text-center">
                  <p className="text-red-300 font-medium">Insufficient Balance</p>
                  <p className="text-red-400 text-sm mt-1">
                    Need {BET_AMOUNT} ETH to play
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Card className={`relative overflow-hidden border-2 transition-all ${
                playerChoice === 'heads' 
                  ? 'border-green-500 bg-green-900/30' 
                  : 'border-slate-600 hover:border-blue-500 bg-slate-800'
              }`}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-2">🪙</div>
                  <h3 className="text-xl font-bold mb-2">HEADS</h3>
                  <Badge variant="secondary" className="mb-3">
                    {headsCount} players
                  </Badge>
                  <Button
                    onClick={() => handleJoin('heads')}
                    disabled={hasJoined || !hasEnoughBalance || isJoining || timeLeft < 5}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    size="sm"
                  >
                    {hasJoined && playerChoice === 'heads' ? '✓ Joined' : 
                     isJoining ? 'Joining...' : 
                     `Join (${BET_AMOUNT} ETH)`}
                  </Button>
                </CardContent>
              </Card>

              <Card className={`relative overflow-hidden border-2 transition-all ${
                playerChoice === 'tails' 
                  ? 'border-green-500 bg-green-900/30' 
                  : 'border-slate-600 hover:border-blue-500 bg-slate-800'
              }`}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-2">🪙</div>
                  <h3 className="text-xl font-bold mb-2">TAILS</h3>
                  <Badge variant="secondary" className="mb-3">
                    {tailsCount} players
                  </Badge>
                  <Button
                    onClick={() => handleJoin('tails')}
                    disabled={hasJoined || !hasEnoughBalance || isJoining || timeLeft < 5}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    size="sm"
                  >
                    {hasJoined && playerChoice === 'tails' ? '✓ Joined' : 
                     isJoining ? 'Joining...' : 
                     `Join (${BET_AMOUNT} ETH)`}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {hasJoined && (
              <Card className="bg-green-900/30 border-green-700">
                <CardContent className="p-4 text-center">
                  <p className="text-green-300 font-medium">
                    You chose {playerChoice?.toUpperCase()}! Good luck! 🍀
                  </p>
                </CardContent>
              </Card>
            )}

            {timeLeft < 10 && timeLeft > 0 && (
              <Card className="bg-yellow-900/30 border-yellow-700">
                <CardContent className="p-4 text-center">
                  <p className="text-yellow-300 font-medium animate-pulse">
                    Betting closes in {timeLeft}s!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Game Rules */}
        {gamePhase === 'betting' && !hasJoined && (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center text-sm text-slate-400">
              <p>Pick heads or tails • Winners split 95% of pot • 5% protocol fee</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}