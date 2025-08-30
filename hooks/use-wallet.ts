"use client"

// Enhanced wallet hook for coin flip payments using OnchainKit
import { useState, useCallback, useEffect } from "react"
import { useMiniKit } from "@coinbase/onchainkit/minikit"
import { parseEther, formatEther } from "viem"

export interface TransactionResult {
  hash: string
  success: boolean
  error?: string
}

export function useWallet() {
  const { context } = useMiniKit()
  const [isTransacting, setIsTransacting] = useState(false)
  const [balance, setBalance] = useState<string>("50.0")

  useEffect(() => {
    checkBalance()
  }, [])

  // Get user's wallet address from Farcaster custody address
  const getWalletAddress = useCallback(() => {
    return context?.user?.custody_address || "0x1234567890123456789012345678901234567890"
  }, [context])

  // Mock balance check (in production, use actual RPC calls)
  const checkBalance = useCallback(async (): Promise<string> => {
    try {
      const address = getWalletAddress()
      if (!address) {
        const mockBalance = "50.0"
        setBalance(mockBalance)
        return mockBalance
      }

      const mockBalance = "50.0" // ETH
      setBalance(mockBalance)
      console.log("[v0] Balance set to:", mockBalance)
      return mockBalance
    } catch (error) {
      console.error("Failed to check balance:", error)
      const mockBalance = "50.0"
      setBalance(mockBalance)
      return mockBalance
    }
  }, [getWalletAddress])

  // Send payment transaction (mock implementation for hackathon)
  const sendPayment = useCallback(
    async (amount: string, recipient?: string): Promise<TransactionResult> => {
      setIsTransacting(true)
      try {
        const address = getWalletAddress()
        console.log("[v0] Sending payment transaction...")
        console.log("[v0] Wallet address:", address)

        if (!address) {
          throw new Error("No wallet address found")
        }

        const amountWei = parseEther(amount)
        const currentBalance = parseEther(balance)

        if (amountWei > currentBalance) {
          throw new Error("Insufficient balance")
        }

        // Mock transaction for hackathon - simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Mock transaction hash
        const mockTxHash = `0x${Math.random().toString(16).substring(2).padStart(64, "0")}`

        // Update mock balance
        const newBalance = formatEther(currentBalance - amountWei)
        setBalance(newBalance)

        console.log("[v0] Transaction successful:", mockTxHash)
        return {
          hash: mockTxHash,
          success: true,
        }
      } catch (error) {
        console.error("[v0] Transaction failed:", error)
        const errorMessage = error instanceof Error ? error.message : "Transaction failed"
        return {
          hash: "",
          success: false,
          error: errorMessage,
        }
      } finally {
        setIsTransacting(false)
      }
    },
    [getWalletAddress, balance],
  )

  // Request payment approval (for future smart contract integration)
  const requestPaymentApproval = useCallback(async (amount: string): Promise<boolean> => {
    try {
      // Mock approval for hackathon
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return true
    } catch (error) {
      console.error("Payment approval failed:", error)
      return false
    }
  }, [])

  return {
    walletAddress: getWalletAddress(),
    balance,
    isTransacting,
    checkBalance,
    sendPayment,
    requestPaymentApproval,
  }
}
