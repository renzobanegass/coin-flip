"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Coins, BarChart3, User } from "lucide-react"

interface BottomNavProps {
  activeTab: 'game' | 'history' | 'profile'
  onTabChange: (tab: 'game' | 'history' | 'profile') => void
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'game' as const, label: 'Game', icon: Coins },
    { id: 'history' as const, label: 'History', icon: BarChart3 },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ]

  return (
    <Card className="fixed bottom-0 left-0 right-0 z-50 rounded-none border-t border-slate-700 bg-slate-800/95 backdrop-blur-lg">
      <div className="flex items-center justify-around py-2 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 mx-1 h-14 ${
                isActive 
                  ? 'text-slate-100 bg-slate-700' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <Icon className={`h-5 w-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className="text-xs font-medium">{tab.label}</span>
                {isActive && (
                  <div className="w-4 h-0.5 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </Button>
          )
        })}
      </div>
    </Card>
  )
}