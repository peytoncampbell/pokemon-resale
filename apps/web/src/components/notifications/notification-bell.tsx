'use client'

import { useState, useRef, useEffect } from 'react'
import { useNotifications, useUnreadNotificationCount, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/use-notifications'
import { cn } from '@/lib/utils'
import {
  Bell,
  BellRing,
  CheckCheck,
  TrendingUp,
  FileText,
  Package,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import type { Notification } from '@/types/price-intelligence'

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { data: notifications, isLoading } = useNotifications(20)
  const { data: unreadCount } = useUnreadNotificationCount()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markRead.mutate(notification.id)
    }
    if (notification.link) {
      setIsOpen(false)
    }
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'price_alert':
        return TrendingUp
      case 'report':
        return FileText
      case 'inventory':
        return Package
      default:
        return AlertCircle
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative p-2 rounded-xl transition-colors',
          isOpen ? 'bg-white/10' : 'hover:bg-white/5',
          unreadCount && unreadCount > 0 && 'text-vision-blue'
        )}
      >
        {unreadCount && unreadCount > 0 ? (
          <BellRing className="h-5 w-5" />
        ) : (
          <Bell className="h-5 w-5 text-white/60" />
        )}
        {unreadCount && unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 glass-card rounded-xl shadow-xl border border-white/10 overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="font-medium text-white">Notifications</h3>
            {unreadCount && unreadCount > 0 && (
              <button
                onClick={() => markAllRead.mutate()}
                className="flex items-center gap-1 text-xs text-vision-blue hover:text-vision-blue/80 transition-colors"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-white/40">Loading...</div>
            ) : !notifications?.length ? (
              <div className="p-8 text-center">
                <Bell className="h-8 w-8 text-white/20 mx-auto mb-2" />
                <p className="text-sm text-white/40">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {notifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type)
                  const content = (
                    <div
                      className={cn(
                        'flex gap-3 p-4 hover:bg-white/5 transition-colors cursor-pointer',
                        !notification.isRead && 'bg-vision-blue/5'
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div
                        className={cn(
                          'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
                          notification.type === 'price_alert'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : notification.type === 'report'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-white/10 text-white/60'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            'text-sm truncate',
                            notification.isRead ? 'text-white/70' : 'text-white font-medium'
                          )}
                        >
                          {notification.title}
                        </p>
                        <p className="text-xs text-white/50 truncate">{notification.message}</p>
                        <p className="text-xs text-white/30 mt-1">
                          {formatTimeAgo(new Date(notification.createdAt))}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="flex-shrink-0 w-2 h-2 bg-vision-blue rounded-full mt-2" />
                      )}
                    </div>
                  )

                  if (notification.link) {
                    return (
                      <Link key={notification.id} href={notification.link}>
                        {content}
                      </Link>
                    )
                  }
                  return <div key={notification.id}>{content}</div>
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications && notifications.length > 0 && (
            <div className="p-3 border-t border-white/10">
              <Link
                href="/alerts"
                onClick={() => setIsOpen(false)}
                className="block text-center text-sm text-vision-blue hover:text-vision-blue/80 transition-colors"
              >
                View all alerts
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}
