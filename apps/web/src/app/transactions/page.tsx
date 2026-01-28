'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  useTransactions,
  useTransactionStats,
  useDeleteTransaction,
  TransactionType,
} from '@/hooks/use-transactions'
import { ShoppingCart, DollarSign, ArrowLeftRight, Plus } from 'lucide-react'
import { TransactionStatsCards } from '@/components/transactions/transaction-stats'
import { TransactionFilters } from '@/components/transactions/transaction-filters'
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
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-white/40">Pages</span>
          <span className="text-white/40">/</span>
          <span className="text-white font-medium">Transactions</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Transactions</h1>
            <p className="text-white/60">
              Track all your buys, sales, and trades in one place
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsBuyModalOpen(true)}
              className="bg-vision-blue hover:bg-vision-blue/80"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Buy
            </Button>
            <Button
              onClick={() => setIsSellModalOpen(true)}
              className="bg-green-500 hover:bg-green-600"
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Sell
            </Button>
            <Button
              onClick={() => setIsTradeModalOpen(true)}
              className="bg-vision-purple hover:bg-vision-purple/80"
            >
              <ArrowLeftRight className="mr-2 h-4 w-4" />
              Trade
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <TransactionStatsCards stats={stats} isLoading={isLoadingStats} />

        {/* Filters */}
        <TransactionFilters activeType={typeFilter} onTypeChange={setTypeFilter} />

        {/* Transaction count */}
        <div className="flex items-center justify-between glass-card px-6 py-4">
          <p className="text-sm font-semibold text-white">
            {transactions?.length || 0} transaction{transactions?.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-vision-blue border-r-transparent" />
              <p className="mt-2 text-sm text-white/60">Loading transactions...</p>
            </div>
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
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    onDelete={handleDelete}
                    isDeleting={deleteTransaction.isPending}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="h-28 w-28 rounded-3xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                  <Plus className="h-14 w-14 text-white/40" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">No transactions yet</h3>
                <p className="text-white/60 mb-6 text-center max-w-md">
                  {typeFilter
                    ? `No ${typeFilter.toLowerCase()} transactions found. Try a different filter or record a new transaction.`
                    : 'Start tracking your card transactions by recording a buy, sale, or trade.'}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsBuyModalOpen(true)}
                    className="bg-vision-blue hover:bg-vision-blue/80"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Record Buy
                  </Button>
                  <Button
                    onClick={() => setIsSellModalOpen(true)}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    Record Sale
                  </Button>
                </div>
              </div>
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
