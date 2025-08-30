"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Twitter, Share2, Trophy, TrendingUp } from "lucide-react"
import { shareToSocial, generateShareText, generateVictoryMessage, type ShareData } from "@/lib/share-utils"
import { useToast } from "@/hooks/use-toast"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  shareData: ShareData
}

export function ShareModal({ isOpen, onClose, shareData }: ShareModalProps) {
  const [isSharing, setIsSharing] = useState(false)
  const { toast } = useToast()

  const shareText = generateShareText(shareData)
  const victoryMessage =
    shareData.isWinner && shareData.payout
      ? generateVictoryMessage(shareData.payout, shareData.payout / 1)
      : "Game Result"

  const handleShare = async (platform: "twitter" | "farcaster" | "native") => {
    setIsSharing(true)
    try {
      await shareToSocial(shareData, platform)
      toast({
        title: "Shared successfully!",
        description: "Your result has been shared.",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Could not share your result. Text copied to clipboard instead.",
        variant: "destructive",
      })
      // Fallback to clipboard
      await navigator.clipboard.writeText(shareText)
    } finally {
      setIsSharing(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      toast({
        title: "Copied!",
        description: "Share text copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {shareData.isWinner ? (
              <Trophy className="h-5 w-5 text-yellow-500" />
            ) : (
              <TrendingUp className="h-5 w-5 text-blue-500" />
            )}
            {victoryMessage}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview Card */}
          <Card className={shareData.isWinner ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}>
            <CardContent className="p-4">
              <div className="text-center space-y-3">
                <div className="text-4xl">{shareData.isWinner ? "🏆" : "🪙"}</div>

                <div>
                  <p className="font-bold text-lg">{shareData.result.toUpperCase()} Won!</p>
                  <p className="text-sm text-muted-foreground">You picked {shareData.playerChoice.toUpperCase()}</p>
                </div>

                {shareData.isWinner && shareData.payout && (
                  <div className="bg-white rounded-lg p-3 border">
                    <p className="text-2xl font-bold text-green-600">+{shareData.payout.toFixed(2)} ETH</p>
                    <p className="text-xs text-muted-foreground">{((shareData.payout / 1) * 100).toFixed(0)}% return</p>
                  </div>
                )}

                <div className="flex justify-center gap-2">
                  <Badge variant="outline">
                    {shareData.playerStats.wins}W-{shareData.playerStats.losses}L
                  </Badge>
                  <Badge variant="outline">${shareData.playerStats.totalStaked} staked</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Share Text Preview */}
          <Card>
            <CardContent className="p-3">
              <p className="text-sm text-muted-foreground mb-2">Share text:</p>
              <p className="text-sm bg-muted p-2 rounded text-balance">{shareText}</p>
            </CardContent>
          </Card>

          {/* Share Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleShare("twitter")}
              disabled={isSharing}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </Button>

            <Button onClick={() => handleShare("farcaster")} disabled={isSharing} variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Farcaster
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button onClick={() => handleShare("native")} disabled={isSharing} variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>

            <Button onClick={copyToClipboard} variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>

          {/* Motivational Message */}
          <Card className="bg-muted/50">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">
                {shareData.isWinner
                  ? "Share your victory and invite friends to play!"
                  : "Challenge your friends to beat your record!"}
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
