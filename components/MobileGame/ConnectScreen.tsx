"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ConnectScreenProps {
  onConnect: () => void
  isConnecting: boolean
}

export function ConnectScreen({ onConnect, isConnecting }: ConnectScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 text-white">
      <Card className="w-full max-w-sm bg-black/20 backdrop-blur border-white/10">
        <CardHeader className="text-center space-y-4">
          <div className="text-8xl mb-4">🪙</div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-cyan-400 bg-clip-text text-transparent">
            Coin Flip
          </CardTitle>
          <p className="text-white/80 text-lg leading-relaxed">
            The ultimate mobile coin flip betting game
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Features */}
          <div className="space-y-4 text-center">
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center justify-center gap-2">
                <div className="text-lg">⚡</div>
                <span>0.001 ETH buy-in</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="text-lg">🏆</div>
                <span>Winners split 95% of pot</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="text-lg">⏱️</div>
                <span>60 second rounds</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="text-lg">📱</div>
                <span>Instant mobile gaming</span>
              </div>
            </div>
          </div>

          {/* How to Play */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 text-center">How to Play</h3>
              <div className="space-y-2 text-sm text-white/80">
                <div className="flex gap-3">
                  <span className="font-mono bg-white/10 rounded px-2 py-1 text-xs">1</span>
                  <span>Connect your wallet</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-mono bg-white/10 rounded px-2 py-1 text-xs">2</span>
                  <span>Choose heads or tails</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-mono bg-white/10 rounded px-2 py-1 text-xs">3</span>
                  <span>Wait for the flip</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-mono bg-white/10 rounded px-2 py-1 text-xs">4</span>
                  <span>Win and get paid!</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Connect Button */}
          <Button
            onClick={onConnect}
            disabled={isConnecting}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 active:scale-95"
            size="lg"
          >
            {isConnecting ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Connecting...
              </div>
            ) : (
              "🚀 Connect & Play"
            )}
          </Button>

          <div className="text-center text-xs text-white/50">
            <p>Powered by smart contracts</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}