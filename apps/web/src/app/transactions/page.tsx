'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  useTransactions,
  useTransactionStats,
  useDeleteTransaction,
  TransactionType,
} from '@/hooks/use-transactions'
import { ShoppingCart, DollarSign, ArrowLeftRight } from 'lucide-react'
import { TransactionStatsCards } from '@/components/transactions/transaction-stats'
import { TransactionFilters } from '@/components/transactions/transaction-filters'
import { SummaryBar } from '@/components/ui/summary-bar'
import { SkeletonTransactionCard } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { AnimatedList } from '@/components/ui/animated-list'
import { TransactionCard } from '@/components/transactions/transaction-card'
import { BuyTransactionModal } from '@/components/transactions/buy-transaction-modal'
import { SellTransactionModal } from '@/components/transactions/sell-transaction-modal'
import { TradeTransactionModal } from '@/components/transactions/trade-transaction-modal'

export default function TransactionsPage() {
  const [typeFilter, setTypeFilter] = useState<TransactionType | undefined>()
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false)
  const [isSellModalOpen, setIsSellModalOpen] = useState(false)
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false)

  const { data: transactions, isLoading, error } = useTransactions({ type: typeFilter })
  const { data: stats, isLoading: isLoadingStats } = useTransactionStats()
  const deleteTransaction = useDeleteTransaction()

  const handleDelete = async (id: string) => {
    await deleteTransaction.mutateAsync(id)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Transactions"
          description="Track all your buys, sales, and trades in one place"
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => setIsBuyModalOpen(true)}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Buy
              </Button>
              <Button
                onClick={() => setIsSellModalOpen(true)}
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Sell
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsTradeModalOpen(true)}
              >
                <ArrowLeftRight className="mr-2 h-4 w-4" />
                Trade
              </Button>
            </div>
          }
        />

        {/* Stats Cards */}
        <TransactionStatsCards stats={stats} isLoading={isLoadingStats} />

        {/* Filters */}
        <TransactionFilters activeType={typeFilter} onTypeChange={setTypeFilter} />

        {/* Transaction count */}
        <SummaryBar
          left={
            <p className="text-sm font-semibold text-white">
              {transactions?.length || 0} transaction{transactions?.length !== 1 ? 's' : ''}
            </p>
          }
        />

        {/* Loading state */}
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonTransactionCard key={i} />
            ))}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <p className="text-sm text-red-400">Failed to load transactions</p>
          </div>
        )}

        {/* Transactions list */}
        {!isLoading && !error && transactions && (
          <>
            {transactions.length > 0 ? (
              <AnimatedList className="space-y-4">
                {transactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    onDelete={handleDelete}
                    isDeleting={deleteTransaction.isPending}
                  />
                ))}
              </AnimatedList>
            ) : (
              <EmptyState
                variant={typeFilter ? 'search' : 'transactions'}
                title={typeFilter ? 'No transactions found' : 'No transactions yet'}
                description={
                  typeFilter
                    ? `No ${typeFilter.toLowerCase()} transactions found. Try a different filter or record a new transaction.`
                    : 'Start tracking your card transactions by recording a buy, sale, or trade.'
                }
                action={{
                  label: typeFilter ? 'Clear Filter' : 'Record Buy',
                  onClick: () => {
                    if (typeFilter) {
                      setTypeFilter(undefined)
                    } else {
                      setIsBuyModalOpen(true)
                    }
                  },
                  variant: typeFilter ? 'outline' : 'secondary',
                }}
                secondaryAction={{
                  label: 'Record Sale',
                  onClick: () => setIsSellModalOpen(true),
                }}
              />
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <BuyTransactionModal open={isBuyModalOpen} onClose={() => setIsBuyModalOpen(false)} />
      <SellTransactionModal open={isSellModalOpen} onClose={() => setIsSellModalOpen(false)} />
      <TradeTransactionModal open={isTradeModalOpen} onClose={() => setIsTradeModalOpen(false)} />
    </MainLayout>
  )
}
