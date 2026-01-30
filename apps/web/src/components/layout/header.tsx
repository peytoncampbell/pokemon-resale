"use client"

import { Menu, Bell, Search, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/components/providers/auth-provider"
import { useCurrency } from "@/hooks/use-currency"

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuthContext()
  const { currency, toggleCurrency } = useCurrency()

  return (
    <header className="sticky top-0 z-30 w-full bg-vision-navy/80 backdrop-blur-md border-b border-white/5">
      <div className="flex h-16 items-center px-6 gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white/60 hover:text-white hover:bg-white/10"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Spacer for desktop - breadcrumb moved to PageHeader */}
        <div className="hidden md:block flex-1" />

        {/* Right side */}
        <div className="flex items-center gap-3 ml-auto">
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
          <Button
            variant="ghost"
            size="icon"
            className="text-white/60 hover:text-white hover:bg-white/10 relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-vision-cyan" />
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <Settings className="h-5 w-5" />
          </Button>

          {/* Profile */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-vision-purple to-vision-pink flex items-center justify-center text-white font-semibold shadow-lg shadow-vision-purple/20 cursor-pointer hover:shadow-xl transition-shadow">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
