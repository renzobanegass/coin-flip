"use client"

import { useState, useEffect } from "react"
import type { CoinSide } from "@/lib/coin-flip-contract"

interface CoinAnimationProps {
  isFlipping: boolean
  result?: CoinSide
  onAnimationComplete?: () => void
}

export function CoinAnimation({ isFlipping, result, onAnimationComplete }: CoinAnimationProps) {
  const [animationPhase, setAnimationPhase] = useState<"idle" | "flipping" | "result">("idle")
  const [showSide, setShowSide] = useState<CoinSide>(result || "heads")

  useEffect(() => {
    if (isFlipping) {
      setAnimationPhase("flipping")

      // Show result after flip animation
      const timer = setTimeout(() => {
        setShowSide(result || "heads")
        setAnimationPhase("result")
        onAnimationComplete?.()
      }, 2000) // 2 second flip animation

      return () => clearTimeout(timer)
    } else {
      setAnimationPhase("idle")
      if (result) {
        setShowSide(result)
      }
    }
  }, [isFlipping, result, onAnimationComplete])

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 sm:py-12">
      <div className="relative w-32 h-32 sm:w-40 sm:h-40">
        <div
          className={`
            w-full h-full rounded-full border-4 border-amber-400 shadow-lg
            flex items-center justify-center text-4xl sm:text-5xl font-bold
            transition-all duration-500 ease-in-out transform-gpu
            ${isFlipping ? "animate-spin-flip" : ""}
            ${showSide === "heads" ? "bg-gradient-to-br from-amber-300 to-amber-500 text-amber-800" : "bg-gradient-to-br from-cyan-300 to-cyan-500 text-cyan-800"}
          `}
          style={{
            animation: isFlipping ? "coinFlip 2s ease-in-out" : "none",
          }}
        >
          {showSide === "heads" ? "H" : "T"}
        </div>
      </div>

      {/* Status text */}
      <div className="mt-4 sm:mt-6 text-center max-w-xs">
        {animationPhase === "idle" && <p className="text-base sm:text-lg text-muted-foreground">Ready to flip...</p>}
        {animationPhase === "flipping" && (
          <p className="text-lg sm:text-xl font-bold text-primary animate-pulse">Flipping coin...</p>
        )}
        {animationPhase === "result" && result && (
          <div className="space-y-1 sm:space-y-2">
            <p className="text-xl sm:text-2xl font-bold text-primary">{result.toUpperCase()} WINS!</p>
            <p className="text-sm sm:text-base text-muted-foreground">The coin landed on {result}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes coinFlip {
          0% { transform: rotateY(0deg) scale(1); }
          25% { transform: rotateY(450deg) scale(1.1); }
          50% { transform: rotateY(900deg) scale(1.2); }
          75% { transform: rotateY(1350deg) scale(1.1); }
          100% { transform: rotateY(1800deg) scale(1); }
        }
      `}</style>
    </div>
  )
}
