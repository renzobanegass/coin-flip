"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Coins, BarChart3 } from "lucide-react"

interface BottomNavbarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function BottomNavbar({ activeTab, onTabChange }: BottomNavbarProps) {
  return (
    <Card className="fixed bottom-0 left-0 right-0 z-50 rounded-none border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-around py-2 px-4">
        <Button
          variant={activeTab === "game" ? "default" : "ghost"}
          size="sm"
          onClick={() => onTabChange("game")}
          className="flex-1 mx-1"
        >
          <div className="flex flex-col items-center gap-1">
            <Coins className="h-5 w-5" />
            <span className="text-xs">Game</span>
          </div>
        </Button>

        <Button
          variant={activeTab === "history" ? "default" : "ghost"}
          size="sm"
          onClick={() => onTabChange("history")}
          className="flex-1 mx-1"
        >
          <div className="flex flex-col items-center gap-1">
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs">History</span>
          </div>
        </Button>
      </div>
    </Card>
  )
}
