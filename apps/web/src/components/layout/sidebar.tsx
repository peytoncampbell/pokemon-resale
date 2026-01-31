"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  LogOut,
  X,
  Building2,
  Settings,
  Bell,
  FileText
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/components/providers/auth-provider"
import { useOrganization } from "@/hooks/use-organization"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { name: "Alerts", href: "/alerts", icon: Bell },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Organization", href: "/organization", icon: Building2 },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { signOut, user } = useAuthContext()
  const { data: organization } = useOrganization()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-vision-navy/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-[280px] transition-transform duration-300 md:hidden p-4",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col glass-card rounded-2xl overflow-hidden">
          {/* Logo */}
          <div className="flex items-center gap-3 p-6 pb-4">
            <div className="h-10 w-10 rounded-xl icon-bg-blue flex items-center justify-center text-white font-bold shadow-lg shadow-vision-blue/30">
              P
            </div>
            <span className="font-bold text-lg text-white">Pokemon Resale</span>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto md:hidden text-white/60 hover:text-white hover:bg-white/10"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Organization Name */}
          {organization && (
            <div className="mx-6 mb-2">
              <Link
                href="/organization"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Building2 className="h-4 w-4 text-vision-cyan" />
                <span className="text-sm font-medium text-white truncate">
                  {organization.name}
                </span>
              </Link>
            </div>
          )}

          {/* Divider */}
          <div className="mx-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Main Navigation */}
          <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => onClose()}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                    isActive
                      ? "bg-gradient-to-r from-vision-blue to-vision-cyan text-white shadow-lg shadow-vision-blue/25"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-xl transition-all",
                    isActive
                      ? "bg-white/20"
                      : "bg-vision-navy-light"
                  )}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="border-t border-white/10 p-4 space-y-3">
            {user && (
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-vision-purple to-vision-pink flex items-center justify-center text-white text-sm font-semibold">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-white/60 truncate flex-1">
                  {user.email}
                </span>
              </div>
            )}
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl"
              onClick={handleSignOut}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-vision-navy-light">
                <LogOut className="h-4 w-4" />
              </div>
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
