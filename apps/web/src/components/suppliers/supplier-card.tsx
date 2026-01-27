'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StarRating } from '@/components/ui/star-rating'
import { formatCurrency } from '@/lib/utils'
import { Store, Mail, Phone, Globe, MapPin, Trash2, Pencil, Package } from 'lucide-react'
import type { Supplier } from '@/lib/supabase'

interface SupplierCardProps {
  supplier: Supplier
  stats?: {
    totalOrders: number
    totalSpent: number
    pendingOrders: number
  }
  onEdit?: () => void
  onDelete?: () => void
  onClick?: () => void
}

export function SupplierCard({ supplier, stats, onEdit, onDelete, onClick }: SupplierCardProps) {
  return (
    <Card
      className={`hover:shadow-lg hover:shadow-vision-blue/10 transition-all ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-vision-blue/20 to-vision-cyan/20 flex items-center justify-center">
                <Store className="h-6 w-6 text-vision-cyan" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">{supplier.name}</h3>
                {supplier.contact_name && (
                  <p className="text-sm text-white/60">{supplier.contact_name}</p>
                )}
              </div>
            </div>

            {supplier.rating && (
              <div className="mb-3">
                <StarRating value={supplier.rating} readonly size="sm" />
              </div>
            )}

            <div className="space-y-1.5 mb-4">
              {supplier.email && (
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Mail className="h-4 w-4" />
                  <a
                    href={`mailto:${supplier.email}`}
                    className="hover:text-vision-cyan transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {supplier.email}
                  </a>
                </div>
              )}
              {supplier.phone && (
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Phone className="h-4 w-4" />
                  <a
                    href={`tel:${supplier.phone}`}
                    className="hover:text-vision-cyan transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {supplier.phone}
                  </a>
                </div>
              )}
              {supplier.website && (
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Globe className="h-4 w-4" />
                  <a
                    href={supplier.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-vision-cyan transition-colors truncate"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {supplier.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              {supplier.address && (
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{supplier.address}</span>
                </div>
              )}
            </div>

            {stats && (
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                <div>
                  <p className="text-xs text-white/60">Orders</p>
                  <p className="font-semibold text-white">{stats.totalOrders}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60">Total Spent</p>
                  <p className="font-semibold text-vision-cyan">{formatCurrency(stats.totalSpent)}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60">Pending</p>
                  <div className="flex items-center gap-1">
                    <Package className="h-3.5 w-3.5 text-yellow-400" />
                    <span className="font-semibold text-white">{stats.pendingOrders}</span>
                  </div>
                </div>
              </div>
            )}

            {supplier.notes && (
              <p className="mt-3 text-sm text-white/60 bg-white/5 rounded-xl p-3 border border-white/5">
                {supplier.notes}
              </p>
            )}
          </div>

          {(onEdit || onDelete) && (
            <div className="flex flex-col gap-2">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit()
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete()
                  }}
                  className="hover:bg-red-500/10 text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
