"use client"

import { useState, useEffect } from "react"
import { useSignIn } from "@/hooks/use-sign-in"
import { useFirstVisit } from "@/hooks/use-first-visit"
import { useAccount } from "wagmi"
import { RulesPopup } from "./RulesPopup"
import { GameScreen } from "./GameScreen"
import { GameHistory } from "./GameHistory"
import { ProfileScreen } from "./ProfileScreen"
import { BottomNav } from "./BottomNav"
import type { CoinSide } from "@/lib/coin-flip-contract"

export function MobileApp() {
  const { signIn, isLoading, isSignedIn, user } = useSignIn({ autoSignIn: true })
  const { address } = useAccount()
  const { isFirstVisit, isLoading: isFirstVisitLoading, markAsVisited } = useFirstVisit()
  const [activeTab, setActiveTab] = useState<'game' | 'history' | 'profile'>('game')
  const [balance, setBalance] = useState('0.000')
  const [showRulesPopup, setShowRulesPopup] = useState(false)

  const playerAddress = address || user?.address

  // Show rules popup on first visit
  useEffect(() => {
    if (!isFirstVisitLoading && isFirstVisit && isSignedIn) {
      setShowRulesPopup(true)
    }
  }, [isFirstVisit, isFirstVisitLoading, isSignedIn])

  // Mock balance for demo - in production this would come from actual wallet/contract
  useEffect(() => {
    if (isSignedIn) {
      // Simulate checking balance
      setBalance((Math.random() * 0.1 + 0.001).toFixed(3))
    }
  }, [isSignedIn])

  const handleJoinRound = async (choice: CoinSide): Promise<void> => {
    // In production, this would interact with the smart contract
    console.log(`Player ${playerAddress} joined with choice: ${choice}`)
    
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Deduct bet amount from balance (mock)
    const newBalance = Math.max(0, parseFloat(balance) - 0.001)
    setBalance(newBalance.toFixed(3))
  }

  const handleRefreshBalance = () => {
    // Simulate balance refresh
    setBalance((Math.random() * 0.1 + 0.001).toFixed(3))
  }

  const handleDisconnect = () => {
    // In a real app, you'd implement proper logout functionality
    console.log('Disconnect requested')
    setBalance('0.000')
    setActiveTab('game')
  }

  const handleCloseRulesPopup = () => {
    setShowRulesPopup(false)
    markAsVisited()
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center text-slate-200">
          <div className="w-8 h-8 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Connecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {activeTab === 'game' && (
        <GameScreen
          playerAddress={playerAddress}
          playerName={user?.display_name || user?.username}
          balance={balance}
          onJoinRound={handleJoinRound}
          onRefreshBalance={handleRefreshBalance}
        />
      )}

      {activeTab === 'history' && (
        <div className="p-3 sm:p-4 pb-20 pt-6 sm:pt-8">
          <div className="w-full max-w-sm mx-auto">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 mb-4 sm:mb-6">Game History</h1>
            <GameHistory playerAddress={isSignedIn ? playerAddress : undefined} />
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <ProfileScreen
          playerName={user?.display_name || user?.username}
          playerAddress={playerAddress}
          balance={balance}
          onDisconnect={handleDisconnect}
          onRefreshBalance={handleRefreshBalance}
        />
      )}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {showRulesPopup && <RulesPopup onClose={handleCloseRulesPopup} />}
    </div>
  )
}