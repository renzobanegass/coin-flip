"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Trophy, TrendingUp, User, LogOut, Copy } from "lucide-react"

interface ProfileScreenProps {
  playerName?: string
  playerAddress?: string
  balance: string
  stats?: {
    totalGames: number
    wins: number
    losses: number
    totalStaked: number
    totalWinnings: number
  }
  onDisconnect: () => void
  onRefreshBalance: () => void
}

export function ProfileScreen({ 
  playerName = "Anonymous Player",
  playerAddress,
  balance,
  stats,
  onDisconnect,
  onRefreshBalance
}: ProfileScreenProps) {
  const mockStats = {
    totalGames: 25,
    wins: 12,
    losses: 13,
    totalStaked: 0.025,
    totalWinnings: 0.0284
  }
  
  const displayStats = stats || mockStats
  const winRate = displayStats.totalGames > 0 ? 
    ((displayStats.wins / displayStats.totalGames) * 100).toFixed(1) : '0'
  const profitLoss = displayStats.totalWinnings - displayStats.totalStaked
  const isProfit = profitLoss >= 0

  const copyAddress = () => {
    if (playerAddress && navigator.clipboard) {
      navigator.clipboard.writeText(playerAddress)
      // You could add a toast notification here
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4 text-slate-100 pb-20">
      <div className="max-w-sm mx-auto space-y-6 pt-8">
        
        {/* Profile Header */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{playerName}</h2>
            {playerAddress && (
              <Button
                variant="ghost"
                size="sm"
                onClick={copyAddress}
                className="text-slate-400 hover:text-slate-200 hover:bg-slate-700"
              >
                <span className="font-mono text-sm mr-2">
                  {formatAddress(playerAddress)}
                </span>
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Balance Card */}
        <Card className="bg-green-900/20 border-green-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-700/30 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-slate-300 text-sm">Balance</p>
                  <p className="text-2xl font-bold text-green-400">{balance} ETH</p>
                </div>
              </div>
              <Button
                onClick={onRefreshBalance}
                variant="outline"
                size="sm"
                className="border-green-600 text-green-400 hover:bg-green-900/30"
              >
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Game Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-slate-700">
                <div className="text-2xl font-bold text-green-400">{displayStats.wins}</div>
                <div className="text-sm text-slate-400">Wins</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-slate-700">
                <div className="text-2xl font-bold text-red-400">{displayStats.losses}</div>
                <div className="text-sm text-slate-400">Losses</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-slate-700">
                <div className="text-2xl font-bold text-blue-400">{winRate}%</div>
                <div className="text-sm text-slate-400">Win Rate</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-slate-700">
                <div className="text-2xl font-bold text-purple-400">{displayStats.totalGames}</div>
                <div className="text-sm text-slate-400">Total Games</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Stats */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Total Staked</span>
              <span className="font-bold">{displayStats.totalStaked.toFixed(3)} ETH</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Total Winnings</span>
              <span className="font-bold text-green-400">{displayStats.totalWinnings.toFixed(3)} ETH</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-700">
              <span className="text-slate-300">Net Profit/Loss</span>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={isProfit ? "default" : "destructive"}
                  className={isProfit ? "bg-green-500" : "bg-red-500"}
                >
                  {isProfit ? "+" : ""}{profitLoss.toFixed(3)} ETH
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievement Badges */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg">Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {displayStats.totalGames >= 1 && (
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                  🎯 First Game
                </Badge>
              )}
              {displayStats.wins >= 5 && (
                <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                  🏆 5 Wins
                </Badge>
              )}
              {displayStats.totalGames >= 10 && (
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                  🎮 Game Veteran
                </Badge>
              )}
              {parseFloat(winRate) >= 60 && displayStats.totalGames >= 5 && (
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
                  🔥 Hot Streak
                </Badge>
              )}
              {displayStats.totalGames < 1 && (
                <div className="text-slate-400 text-sm">Play your first game to earn achievements!</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Disconnect Button */}
        <Button
          onClick={onDisconnect}
          variant="outline"
          className="w-full border-red-600 text-red-400 hover:bg-red-900/30 h-12"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Disconnect Wallet
        </Button>

        <div className="text-center text-xs text-slate-500 pb-4">
          <p>Game responsibly • Only bet what you can afford to lose</p>
        </div>
      </div>
    </div>
  )
}