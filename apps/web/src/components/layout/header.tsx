"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-6 gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </Button>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#DC143C] to-[#FF1744] flex items-center justify-center text-white font-bold shadow-lg shadow-[#DC143C]/20">
            P
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-[#DC143C] to-[#FF1744] bg-clip-text text-transparent hidden sm:inline-block">Pokemon Resale</span>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center ring-2 ring-background shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <span className="text-sm font-semibold">U</span>
          </div>
        </div>
      </div>
    </header>
  )
}
