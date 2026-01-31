"use client"

import { Menu, Search, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/components/providers/auth-provider"
import { useCurrency } from "@/hooks/use-currency"
import { NotificationBell } from "@/components/notifications"
import Link from "next/link"

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuthContext()
  const { currency, toggleCurrency } = useCurrency()

  return (
    <header className="flex items-center justify-end gap-3 py-2">
      {/* Currency Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleCurrency}
        className="text-white/60 hover:text-white hover:bg-white/10 font-semibold px-3"
      >
        {currency}
      </Button>

      {/* Search */}
      <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
        <Search className="h-4 w-4 text-white/40" />
        <input
          type="text"
          placeholder="Type here..."
          className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white/40 w-40"
        />
      </div>

      {/* Notifications */}
      <NotificationBell />

      {/* Settings */}
      <Link href="/settings">
        <Button
          variant="ghost"
          size="icon"
          className="text-white/60 hover:text-white hover:bg-white/10"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </Link>

      {/* Profile */}
      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-vision-purple to-vision-pink flex items-center justify-center text-white font-semibold shadow-lg shadow-vision-purple/20 cursor-pointer hover:shadow-xl transition-shadow">
        {user?.email?.charAt(0).toUpperCase() || 'U'}
      </div>
    </header>
  )
}
