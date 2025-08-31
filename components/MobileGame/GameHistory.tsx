"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Clock, DollarSign, Users } from "lucide-react"
import { coinFlipContract, type Round, type CoinSide } from "@/lib/coin-flip-contract"

interface GameHistoryProps {
  playerAddress?: string
}

export function GameHistory({ playerAddress }: GameHistoryProps) {
  const [pastRounds, setPastRounds] = useState<Round[]>([])
  const [playerStats, setPlayerStats] = useState({ wins: 0, losses: 0, totalStaked: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHistory = () => {
      const rounds = coinFlipContract.getPastRounds(20)
      setPastRounds(rounds)
      
      if (playerAddress) {
        const stats = coinFlipContract.getPlayerStats(playerAddress)
        setPlayerStats(stats)
      }
      
      setLoading(false)
    }

    loadHistory()

    // Refresh history every 10 seconds
    const interval = setInterval(loadHistory, 10000)
    return () => clearInterval(interval)
  }, [playerAddress])

  const totalGames = playerStats.wins + playerStats.losses
  const winRate = totalGames > 0 ? 
    ((playerStats.wins / totalGames) * 100).toFixed(1) : '0'

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-8">
      {/* Player Stats - only show if playerAddress is provided */}
      {playerAddress && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-white">
              <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
              Your Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-2 sm:gap-4 text-center">
              <div>
                <div className="text-lg sm:text-2xl font-bold text-green-400">{playerStats.wins}</div>
                <div className="text-xs sm:text-sm text-gray-400">Wins</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-red-400">{playerStats.losses}</div>
                <div className="text-xs sm:text-sm text-gray-400">Losses</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-orange-400">{winRate}%</div>
                <div className="text-xs sm:text-sm text-gray-400">Win Rate</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-white truncate">
                  ${playerStats.totalStaked.toFixed(2)}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">Total Staked</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Games */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-white">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
            Recent Rounds
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {pastRounds.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🪙</div>
              <p className="text-gray-400 text-sm sm:text-base">No completed rounds yet. Be the first to play!</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {pastRounds.map((round) => {
                const headsCount = round.players.filter((p) => p.choice === "heads").length
                const tailsCount = round.players.filter((p) => p.choice === "tails").length
                const winnersCount = round.winners?.length || 0
                const totalPlayers = round.players.length
                const playerInRound = playerAddress ? round.players.find(p => p.address === playerAddress) : null
                const playerWon = playerInRound && round.winners?.some(w => w.address === playerAddress)

                return (
                  <Card key={round.id} className="bg-slate-700 border-slate-600">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex flex-col gap-3 sm:gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                            <Badge 
                              variant={round.result === "heads" ? "default" : "secondary"}
                              className={`text-white border text-xs sm:text-sm ${round.result === "heads" ? "border-orange-400 bg-orange-500/20" : "border-cyan-400 bg-cyan-500/20"}`}
                            >
                              {round.result?.toUpperCase()} WON
                            </Badge>
                            <span className="text-xs sm:text-sm text-gray-400 break-words">
                              {formatDate(round.endTime)} at {formatTime(round.endTime)}
                            </span>
                            {playerInRound && (
                              <Badge 
                                variant={playerWon ? "default" : "outline"}
                                className={`text-xs sm:text-sm ${playerWon ? "border-green-400 bg-green-500/20 text-green-300" : "border-red-400 text-red-300"}`}
                              >
                                {playerWon ? "Won" : "Lost"}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-300 flex-wrap">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                              <span className="text-white">{totalPlayers} player{totalPlayers !== 1 ? "s" : ""}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                              <span className="text-white truncate">${round.pot} pot</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                              <span className="text-white">
                                {winnersCount} winner{winnersCount !== 1 ? "s" : ""}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                          <Badge variant="outline" className="border-orange-400 text-orange-400 bg-orange-400/10 text-xs sm:text-sm">
                            Heads: {headsCount}
                          </Badge>
                          <Badge variant="outline" className="border-cyan-400 text-cyan-400 bg-cyan-400/10 text-xs sm:text-sm">
                            Tails: {tailsCount}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}