"use client"

import { useState, useEffect } from "react"

interface CoinFlipProps {
  isFlipping: boolean
  result?: 'heads' | 'tails'
  onComplete?: () => void
}

export function CoinFlip({ isFlipping, result, onComplete }: CoinFlipProps) {
  const [rotation, setRotation] = useState(0)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    if (isFlipping) {
      setShowResult(false)
      let currentRotation = 0
      
      const interval = setInterval(() => {
        currentRotation += 30
        setRotation(currentRotation)
      }, 50)

      setTimeout(() => {
        clearInterval(interval)
        setShowResult(true)
        onComplete?.()
      }, 2500)

      return () => clearInterval(interval)
    }
  }, [isFlipping, onComplete])

  return (
    <div className="flex items-center justify-center h-32">
      <div 
        className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-2xl transition-all duration-75 ease-linear"
        style={{
          transform: `rotateY(${rotation}deg)`,
          background: showResult && result 
            ? result === 'heads' 
              ? 'linear-gradient(145deg, #fbbf24, #f59e0b)' 
              : 'linear-gradient(145deg, #06b6d4, #0891b2)'
            : 'linear-gradient(145deg, #fbbf24, #06b6d4)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2)'
        }}
      >
        {showResult && result ? (
          result === 'heads' ? '👑' : '⚡'
        ) : (
          '🪙'
        )}
      </div>
    </div>
  )
}