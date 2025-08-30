"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { coinFlipContract, type Round } from "@/lib/coin-flip-contract"
import { Clock, Users, DollarSign } from "lucide-react"

export function GameHistory() {
  const [pastRounds, setPastRounds] = useState<Round[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHistory = () => {
      const rounds = coinFlipContract.getPastRounds(20)
      setPastRounds(rounds)
      setLoading(false)
    }

    loadHistory()

    // Refresh history every 10 seconds
    const interval = setInterval(loadHistory, 10000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Rounds
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pastRounds.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No completed rounds yet. Be the first to play!</p>
          ) : (
            <div className="space-y-4">
              {pastRounds.map((round) => {
                const headsCount = round.players.filter((p) => p.choice === "heads").length
                const tailsCount = round.players.filter((p) => p.choice === "tails").length
                const winnersCount = round.winners?.length || 0

                return (
                  <Card key={round.id} className="border-l-4 border-l-primary/20">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={round.result === "heads" ? "default" : "secondary"}>
                              {round.result?.toUpperCase()} WON
                            </Badge>
                            <span className="text-sm text-muted-foreground">{formatTime(round.endTime)}</span>
                          </div>

                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{round.players.length} players</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              <span>${round.pot} pot</span>
                            </div>
                            <div>
                              <span>
                                {winnersCount} winner{winnersCount !== 1 ? "s" : ""}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Badge variant="outline" className="bg-orange-50">
                            H: {headsCount}
                          </Badge>
                          <Badge variant="outline" className="bg-cyan-50">
                            T: {tailsCount}
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
