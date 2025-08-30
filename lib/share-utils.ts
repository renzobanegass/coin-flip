// Utilities for generating shareable content and social media integration

export interface ShareData {
  isWinner: boolean
  result: string
  playerChoice: string
  payout?: number
  totalPot: number
  playerStats: { wins: number; losses: number; totalStaked: number }
  username?: string
}

export function generateShareText(data: ShareData): string {
  const { isWinner, result, playerChoice, payout, totalPot, playerStats, username } = data

  if (isWinner && payout) {
    const multiplier = (payout / 1).toFixed(1)
    return `I just flipped 1 ETH into ${payout.toFixed(2)} ETH on Flip the Coin! 🪙🔥 The coin landed on ${result.toUpperCase()} and I picked ${playerChoice.toUpperCase()}! Join the next round and test your luck!`
  } else {
    const sideRecord = getSideRecord(playerStats, playerChoice)
    return `Just played Flip the Coin! The coin landed on ${result.toUpperCase()} but I picked ${playerChoice.toUpperCase()}. ${sideRecord} Better luck next round! 🪙 Join the action!`
  }
}

export function generateShareImage(data: ShareData): string {
  // Generate a shareable image URL with game results
  // In production, this would create an actual image using canvas or external service
  const params = new URLSearchParams({
    winner: data.isWinner.toString(),
    result: data.result,
    choice: data.playerChoice,
    payout: data.payout?.toString() || "0",
    pot: data.totalPot.toString(),
    username: data.username || "Anonymous",
  })

  return `/api/og/coin-flip?${params.toString()}`
}

export function getSideRecord(playerStats: { wins: number; losses: number }, currentChoice: string): string {
  // This is simplified - in a real app, you'd track wins/losses per side
  const totalGames = playerStats.wins + playerStats.losses
  if (totalGames === 0) return "First game!"

  const winRate = ((playerStats.wins / totalGames) * 100).toFixed(0)
  return `You're ${playerStats.wins}-${playerStats.losses} overall (${winRate}% win rate)`
}

export async function shareToSocial(data: ShareData, platform: "twitter" | "farcaster" | "native" = "native") {
  const text = generateShareText(data)
  const imageUrl = generateShareImage(data)
  const gameUrl = window.location.origin

  switch (platform) {
    case "twitter":
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(gameUrl)}`
      window.open(twitterUrl, "_blank")
      break

    case "farcaster":
      // Farcaster sharing integration would go here
      const farcasterText = `${text}\n\n${gameUrl}`
      if (navigator.share) {
        await navigator.share({
          title: "Flip the Coin Game",
          text: farcasterText,
        })
      } else {
        await navigator.clipboard.writeText(farcasterText)
      }
      break

    case "native":
    default:
      if (navigator.share) {
        await navigator.share({
          title: "Flip the Coin Game",
          text: text,
          url: gameUrl,
        })
      } else {
        await navigator.clipboard.writeText(`${text}\n\n${gameUrl}`)
      }
      break
  }
}

export function generateVictoryMessage(payout: number, multiplier: number): string {
  if (multiplier >= 3) {
    return "INCREDIBLE WIN! 🚀"
  } else if (multiplier >= 2) {
    return "GREAT WIN! 🎉"
  } else if (multiplier >= 1.5) {
    return "NICE WIN! ✨"
  } else {
    return "YOU WON! 🎊"
  }
}
