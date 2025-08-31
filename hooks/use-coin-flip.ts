"use client"

// React hook for interacting with the coin flip contract
import { useState, useEffect, useCallback } from "react"
import { coinFlipContract, type CoinSide, type Round } from "@/lib/coin-flip-contract"
import { useWallet } from "./use-wallet"

export function useCoinFlip(playerAddress?: string) {
  const [currentRound, setCurrentRound] = useState<Round | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [isJoining, setIsJoining] = useState(false)
  const [playerStats, setPlayerStats] = useState({ wins: 0, losses: 0, totalStaked: 0 })
  const [gamePhase, setGamePhase] = useState<"betting" | "flipping" | "results">("betting")

  const { sendPayment, isTransacting, checkBalance } = useWallet()

  // Update round info and timer
  const updateRoundInfo = useCallback(() => {
    const round = coinFlipContract.getRoundInfo()
    const remaining = coinFlipContract.getTimeRemaining()

    setCurrentRound(round)
    setTimeRemaining(remaining)

    // Handle phase transitions
    if (remaining > 0) {
      setGamePhase("betting")
    } else if (remaining === 0 && gamePhase === "betting") {
      // Timer hit 0, start flipping phase
      setGamePhase("flipping")
      
      // Resolve the round and get results
      const roundResult = coinFlipContract.resolveRound()
      
      // Show flipping animation for 3 seconds, then show results
      setTimeout(() => {
        setGamePhase("results")
        
        // Show results for 5 seconds, then start new round
        setTimeout(() => {
          setGamePhase("betting")
        }, 5000) // 5 seconds to show results and rewards
      }, 3000) // 3 seconds for flip animation
    }

    if (playerAddress) {
      const stats = coinFlipContract.getPlayerStats(playerAddress)
      setPlayerStats(stats)
    }
  }, [playerAddress, gamePhase])

  const joinRound = useCallback(
    async (choice: CoinSide, playerData?: { username?: string; pfp_url?: string }) => {
      if (!playerAddress) {
        throw new Error("Player address required")
      }

      setIsJoining(true)
      try {
        const balance = await checkBalance()
        const requiredAmount = coinFlipContract.getRequiredPayment()

        console.log("[v0] Balance check:", { balance, requiredAmount })

        if (Number.parseFloat(balance) < requiredAmount) {
          throw new Error(`Insufficient balance. Need $${requiredAmount} ETH`)
        }

        // Send payment transaction
        console.log("[v0] Sending payment transaction...")
        const paymentResult = await sendPayment(requiredAmount.toString())

        if (!paymentResult.success) {
          throw new Error(paymentResult.error || "Payment failed")
        }

        console.log("[v0] Payment successful, joining round...")

        // Join round with transaction hash
        const result = coinFlipContract.joinRound(playerAddress, choice, playerData, paymentResult.hash)

        if (!result.success) {
          throw new Error(result.error)
        }

        updateRoundInfo()
        return result
      } finally {
        setIsJoining(false)
      }
    },
    [playerAddress, updateRoundInfo, sendPayment, checkBalance],
  )

  // Check if player has joined current round
  const hasJoinedRound = useCallback(() => {
    if (!playerAddress || !currentRound) return false
    return currentRound.players.some((p) => p.address === playerAddress)
  }, [playerAddress, currentRound])

  // Get player's choice in current round
  const getPlayerChoice = useCallback(() => {
    if (!playerAddress || !currentRound) return null
    const player = currentRound.players.find((p) => p.address === playerAddress)
    return player?.choice || null
  }, [playerAddress, currentRound])

  // Get round statistics
  const getRoundStats = useCallback(() => {
    if (!currentRound) return { headsCount: 0, tailsCount: 0, totalPot: 0 }

    const headsCount = currentRound.players.filter((p) => p.choice === "heads").length
    const tailsCount = currentRound.players.filter((p) => p.choice === "tails").length

    return {
      headsCount,
      tailsCount,
      totalPot: currentRound.pot,
    }
  }, [currentRound])

  // Set up polling for round updates
  useEffect(() => {
    updateRoundInfo()

    const interval = setInterval(updateRoundInfo, 1000)
    return () => clearInterval(interval)
  }, [updateRoundInfo])

  return {
    currentRound,
    timeRemaining,
    isJoining: isJoining || isTransacting,
    playerStats,
    gamePhase,
    joinRound,
    hasJoinedRound,
    getPlayerChoice,
    getRoundStats,
    updateRoundInfo,
  }
}
