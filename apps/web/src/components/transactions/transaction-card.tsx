'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { useCurrency } from '@/hooks/use-currency'
import {
  ShoppingCart,
  DollarSign,
  ArrowLeftRight,
  Trash2,
  ChevronDown,
  ChevronUp,
  Store,
  User,
  Globe,
  Package,
} from 'lucide-react'
import type { TransactionWithItems } from '@/hooks/use-transactions'
import { useState } from 'react'
import Image from 'next/image'

interface TransactionCardProps {
  transaction: TransactionWithItems
  onDelete: (id: string) => void
  isDeleting: boolean
}

const TYPE_CONFIG = {
  BUY: {
    label: 'Buy',
    icon: ShoppingCart,
    color: 'text-vision-blue',
    bgColor: 'bg-vision-blue/10',
    badgeVariant: 'info' as const,
  },
  SELL: {
    label: 'Sale',
    icon: DollarSign,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    badgeVariant: 'success' as const,
  },
  TRADE: {
    label: 'Trade',
    icon: ArrowLeftRight,
    color: 'text-vision-purple',
    bgColor: 'bg-vision-purple/10',
    badgeVariant: 'secondary' as const,
  },
}

const COUNTERPARTY_ICONS = {
  STORE: Store,
  PERSON: User,
  ONLINE: Globe,
  OTHER: Package,
}

export function TransactionCard({ transaction, onDelete, isDeleting }: TransactionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { currency } = useCurrency()
  const config = TYPE_CONFIG[transaction.type]
  const TypeIcon = config.icon
  const CounterpartyIcon = COUNTERPARTY_ICONS[transaction.counterparty_type || 'OTHER']

  const inItems = transaction.transaction_items.filter((i) => i.direction === 'IN')
  const outItems = transaction.transaction_items.filter((i) => i.direction === 'OUT')
  const totalItems = transaction.transaction_items.reduce((sum, i) => sum + i.quantity, 0)

  const netCash = Number(transaction.cash_in) - Number(transaction.cash_out) - Number(transaction.fees)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <Card className="hover:shadow-lg hover:shadow-vision-blue/10 transition-all">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${config.bgColor}`}>
            <TypeIcon className={`h-5 w-5 ${config.color}`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={config.badgeVariant}>{config.label}</Badge>
                  <span className="text-sm text-white/40">
                    {formatDate(transaction.transaction_date)}
                  </span>
                  {transaction.status !== 'COMPLETED' && (
                    <Badge variant="outline">{transaction.status}</Badge>
                  )}
                </div>
                <h3 className="font-semibold text-lg text-white mt-1">
                  {transaction.counterparty_name}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-white/60">
                  <CounterpartyIcon className="h-4 w-4" />
                  <span>{transaction.counterparty_type || 'Unknown'}</span>
                  {transaction.platform && (
                    <>
                      <span className="text-white/20">|</span>
                      <span>{transaction.platform}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="text-right">
                {transaction.type === 'BUY' && (
                  <p className="text-lg font-bold text-red-400">
                    -{formatCurrency(Number(transaction.cash_out), currency)}
                  </p>
                )}
                {transaction.type === 'SELL' && (
                  <p className="text-lg font-bold text-green-400">
                    +{formatCurrency(Number(transaction.cash_in) - Number(transaction.fees), currency)}
                  </p>
                )}
                {transaction.type === 'TRADE' && (
                  <p className={`text-lg font-bold ${netCash >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {netCash >= 0 ? '+' : ''}{formatCurrency(netCash, currency)}
                  </p>
                )}
                <p className="text-sm text-white/40">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
              </div>
            </div>

            {transaction.notes && (
              <p className="text-sm text-white/60 mt-2 line-clamp-2">{transaction.notes}</p>
            )}

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-white/60 hover:text-white"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Hide Items
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Show Items ({totalItems})
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this transaction? This will revert any inventory changes.')) {
                    onDelete(transaction.id)
                  }
                }}
                disabled={isDeleting}
                className="text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4">
            {outItems.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white/60 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  Items Out ({outItems.length})
                </h4>
                <div className="space-y-2">
                  {outItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
                    >
                      <div className="w-12 h-16 rounded-lg bg-white/5 flex-shrink-0 relative overflow-hidden">
                        {item.card_image ? (
                          <Image
                            src={item.card_image}
                            alt={item.card_name}
                            fill
                            className="object-contain"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-white/40">
                            No img
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{item.card_name}</p>
                        <p className="text-sm text-white/60 truncate">{item.set_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">
                          {item.quantity}x @ {formatCurrency(Number(item.unit_value), currency)}
                        </p>
                        <p className="text-sm text-white/60">{item.condition}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {inItems.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-white/60 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  Items In ({inItems.length})
                </h4>
                <div className="space-y-2">
                  {inItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
                    >
                      <div className="w-12 h-16 rounded-lg bg-white/5 flex-shrink-0 relative overflow-hidden">
                        {item.card_image ? (
                          <Image
                            src={item.card_image}
                            alt={item.card_name}
                            fill
                            className="object-contain"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-white/40">
                            No img
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{item.card_name}</p>
                        <p className="text-sm text-white/60 truncate">{item.set_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">
                          {item.quantity}x @ {formatCurrency(Number(item.unit_value), currency)}
                        </p>
                        <p className="text-sm text-white/60">{item.condition} | {item.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(Number(transaction.fees) > 0 || (transaction.type === 'TRADE' && (Number(transaction.cash_in) > 0 || Number(transaction.cash_out) > 0))) && (
              <div className="p-3 rounded-xl bg-white/5 text-sm">
                {transaction.type === 'TRADE' && Number(transaction.cash_out) > 0 && (
                  <div className="flex justify-between text-white/60">
                    <span>Cash Out:</span>
                    <span className="text-red-400">-{formatCurrency(Number(transaction.cash_out), currency)}</span>
                  </div>
                )}
                {transaction.type === 'TRADE' && Number(transaction.cash_in) > 0 && (
                  <div className="flex justify-between text-white/60">
                    <span>Cash In:</span>
                    <span className="text-green-400">+{formatCurrency(Number(transaction.cash_in), currency)}</span>
                  </div>
                )}
                {Number(transaction.fees) > 0 && (
                  <div className="flex justify-between text-white/60">
                    <span>Fees:</span>
                    <span className="text-red-400">-{formatCurrency(Number(transaction.fees), currency)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
