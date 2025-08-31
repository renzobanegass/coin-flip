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
  const [flipText, setFlipText] = useState<string>("HEADS")

  useEffect(() => {
    if (isFlipping) {
      setAnimationPhase("flipping")

      // During flipping, alternate between HEADS and TAILS rapidly
      const flipInterval = setInterval(() => {
        setFlipText(prev => prev === "HEADS" ? "TAILS" : "HEADS")
      }, 150)

      // Show final result after flip animation
      const timer = setTimeout(() => {
        clearInterval(flipInterval)
        setShowSide(result || "heads")
        setFlipText((result || "heads").toUpperCase())
        setAnimationPhase("result")
        onAnimationComplete?.()
      }, 3000) // 3 second flip animation

      return () => {
        clearInterval(flipInterval)
        clearTimeout(timer)
      }
    } else {
      setAnimationPhase("idle")
      if (result) {
        setShowSide(result)
        setFlipText(result.toUpperCase())
      }
    }
  }, [isFlipping, result, onAnimationComplete])

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 w-full">
      {/* Main display area */}
      <div className="relative w-full max-w-sm">
        <div
          className={`
            w-full h-32 sm:h-40 md:h-48
            flex items-center justify-center
            rounded-2xl border-4 shadow-2xl
            transition-all duration-300 ease-in-out
            ${animationPhase === "flipping" ? "animate-bounce" : ""}
            ${showSide === "heads" ? 
              "bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border-amber-500 text-amber-900" : 
              "bg-gradient-to-br from-cyan-300 via-cyan-400 to-cyan-600 border-cyan-500 text-cyan-900"
            }
          `}
        >
          <div className={`
            text-4xl sm:text-5xl md:text-6xl lg:text-7xl 
            font-black tracking-wider drop-shadow-lg
            ${animationPhase === "flipping" ? "animate-pulse scale-110" : ""}
            transition-all duration-300
          `}>
            {animationPhase === "flipping" ? flipText : (showSide || "heads").toUpperCase()}
          </div>
        </div>
      </div>

      {/* Status text */}
      <div className="mt-6 text-center max-w-xs">
        {animationPhase === "idle" && (
          <p className="text-lg sm:text-xl text-muted-foreground font-medium">
            Ready to flip...
          </p>
        )}
        {animationPhase === "flipping" && (
          <div className="space-y-2">
            <p className="text-xl sm:text-2xl font-bold text-primary animate-pulse">
              Flipping...
            </p>
            <div className="flex justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        {animationPhase === "result" && result && (
          <div className="space-y-2">
            <p className="text-2xl sm:text-3xl font-bold text-primary">
              {result.toUpperCase()}!
            </p>
            <p className="text-base sm:text-lg text-muted-foreground">
              The coin landed on {result}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
