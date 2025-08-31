"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"

interface RulesPopupProps {
  onClose: () => void
}

export function RulesPopup({ onClose }: RulesPopupProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-sm bg-slate-800 border-slate-700 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X size={20} />
        </button>

        <CardHeader className="text-center space-y-4 pr-12">
          <div className="text-6xl mb-2">🪙</div>
          <CardTitle className="text-3xl font-bold text-blue-400">
            How to Play
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6 text-slate-100">
          {/* Game Rules */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="font-mono bg-blue-600 rounded px-2 py-1 text-xs mt-0.5 shrink-0 text-white">1</span>
                <span className="leading-relaxed">Choose <strong className="text-blue-400">heads</strong> or <strong className="text-blue-400">tails</strong> for the next round</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-mono bg-blue-600 rounded px-2 py-1 text-xs mt-0.5 shrink-0 text-white">2</span>
                <span className="leading-relaxed">Pay <strong className="text-blue-400">0.001 ETH</strong> to join the round</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-mono bg-blue-600 rounded px-2 py-1 text-xs mt-0.5 shrink-0 text-white">3</span>
                <span className="leading-relaxed">Wait for the <strong className="text-blue-400">60-second</strong> round to end</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-mono bg-blue-600 rounded px-2 py-1 text-xs mt-0.5 shrink-0 text-white">4</span>
                <span className="leading-relaxed">Winners split <strong className="text-blue-400">95%</strong> of the total pot</span>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <Card className="bg-slate-700 border-slate-600">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 text-center text-blue-400">Key Features</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="text-lg">⚡</div>
                  <span className="text-slate-200">Instant mobile gaming</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-lg">🏆</div>
                  <span className="text-slate-200">Fair and transparent results</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-lg">🔒</div>
                  <span className="text-slate-200">Secured by smart contracts</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-lg">💰</div>
                  <span className="text-slate-200">Automatic payouts to winners</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Start Playing Button */}
          <Button
            onClick={onClose}
            className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
            size="lg"
          >
            🚀 Start Playing
          </Button>

          <div className="text-center text-xs text-slate-400">
            <p>Good luck and have fun!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}