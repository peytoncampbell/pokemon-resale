'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useBusinessSettings, useUpdateBusinessSettings } from '@/hooks/use-business-settings'
import { useCurrency } from '@/hooks/use-currency'
import {
  DollarSign,
  PiggyBank,
  TrendingUp,
  Calendar,
  Save,
  Loader2,
  AlertCircle,
  Info
} from 'lucide-react'

export default function SettingsPage() {
  const { data: settings, isLoading, error } = useBusinessSettings()
  const updateSettings = useUpdateBusinessSettings()
  const { currency, formatConverted } = useCurrency()

  // Form state
  const [initialInvestment, setInitialInvestment] = useState('')
  const [cashReserves, setCashReserves] = useState('')
  const [historicalInventoryCost, setHistoricalInventoryCost] = useState('')
  const [historicalRevenue, setHistoricalRevenue] = useState('')
  const [historicalProfit, setHistoricalProfit] = useState('')
  const [businessStartDate, setBusinessStartDate] = useState('')
  const [notes, setNotes] = useState('')

  // Load settings into form when data arrives
  useEffect(() => {
    if (settings) {
      setInitialInvestment(settings.initial_investment?.toString() || '')
      setCashReserves(settings.cash_reserves?.toString() || '')
      setHistoricalInventoryCost(settings.historical_inventory_cost?.toString() || '')
      setHistoricalRevenue(settings.historical_revenue?.toString() || '')
      setHistoricalProfit(settings.historical_profit?.toString() || '')
      setBusinessStartDate(settings.business_start_date || '')
      setNotes(settings.notes || '')
    }
  }, [settings])

  const handleSave = async () => {
    await updateSettings.mutateAsync({
      initial_investment: parseFloat(initialInvestment) || 0,
      cash_reserves: parseFloat(cashReserves) || 0,
      historical_inventory_cost: parseFloat(historicalInventoryCost) || 0,
      historical_revenue: parseFloat(historicalRevenue) || 0,
      historical_profit: parseFloat(historicalProfit) || 0,
      business_start_date: businessStartDate || null,
      notes: notes || null,
    })
  }

  const hasChanges = () => {
    if (!settings) return true // No settings yet, so any input is a change
    return (
      parseFloat(initialInvestment) !== (settings.initial_investment || 0) ||
      parseFloat(cashReserves) !== (settings.cash_reserves || 0) ||
      parseFloat(historicalInventoryCost) !== (settings.historical_inventory_cost || 0) ||
      parseFloat(historicalRevenue) !== (settings.historical_revenue || 0) ||
      parseFloat(historicalProfit) !== (settings.historical_profit || 0) ||
      businessStartDate !== (settings.business_start_date || '') ||
      notes !== (settings.notes || '')
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Business Settings"
          description="Configure your business financials and historical data"
          actions={
            <Button
              onClick={handleSave}
              disabled={updateSettings.isPending || !hasChanges()}
            >
              {updateSettings.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          }
        />

        {/* Info Banner */}
        <div className="rounded-xl border border-vision-blue/20 bg-vision-blue/10 p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-vision-blue flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-white">
              Use this page to enter historical business data that existed before you started tracking with this app.
              This helps provide accurate overall business metrics.
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-400">Database Setup Required</p>
              <p className="text-sm text-red-400/80 mt-1">
                The business_settings table needs to be created in your database.
                Run the migration to add this table.
              </p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-vision-blue" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Investment & Cash */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-vision-blue" />
                  Capital & Cash
                </CardTitle>
                <CardDescription className="text-white/60">
                  Track your initial investment and current cash reserves
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="initialInvestment">Initial Investment ({currency})</Label>
                  <Input
                    id="initialInvestment"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={initialInvestment}
                    onChange={(e) => setInitialInvestment(e.target.value)}
                  />
                  <p className="text-xs text-white/40">
                    Total money you put into the business before tracking
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cashReserves">Current Cash Reserves ({currency})</Label>
                  <Input
                    id="cashReserves"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={cashReserves}
                    onChange={(e) => setCashReserves(e.target.value)}
                  />
                  <p className="text-xs text-white/40">
                    Cash on hand available for the business
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Historical Inventory */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PiggyBank className="h-5 w-5 text-vision-green" />
                  Historical Inventory
                </CardTitle>
                <CardDescription className="text-white/60">
                  Value of inventory acquired before using this app
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="historicalInventoryCost">Historical Inventory Cost ({currency})</Label>
                  <Input
                    id="historicalInventoryCost"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={historicalInventoryCost}
                    onChange={(e) => setHistoricalInventoryCost(e.target.value)}
                  />
                  <p className="text-xs text-white/40">
                    What you paid for inventory you already had
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Historical Sales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-vision-cyan" />
                  Historical Sales
                </CardTitle>
                <CardDescription className="text-white/60">
                  Revenue and profit earned before using this app
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="historicalRevenue">Historical Revenue ({currency})</Label>
                  <Input
                    id="historicalRevenue"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={historicalRevenue}
                    onChange={(e) => setHistoricalRevenue(e.target.value)}
                  />
                  <p className="text-xs text-white/40">
                    Total sales revenue before tracking
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="historicalProfit">Historical Profit ({currency})</Label>
                  <Input
                    id="historicalProfit"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={historicalProfit}
                    onChange={(e) => setHistoricalProfit(e.target.value)}
                  />
                  <p className="text-xs text-white/40">
                    Net profit (revenue minus costs) before tracking
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Business Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-vision-purple" />
                  Business Info
                </CardTitle>
                <CardDescription className="text-white/60">
                  General business information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessStartDate">Business Start Date</Label>
                  <Input
                    id="businessStartDate"
                    type="date"
                    value={businessStartDate}
                    onChange={(e) => setBusinessStartDate(e.target.value)}
                  />
                  <p className="text-xs text-white/40">
                    When you started your resale business
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <textarea
                    id="notes"
                    rows={3}
                    placeholder="Any notes about your business..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-blue/50 focus-visible:border-vision-blue/50 transition-all resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Summary Card */}
        {settings && (
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-white/5 p-4 border border-white/10">
                  <p className="text-sm text-white/60">Total Capital Invested</p>
                  <p className="text-xl font-bold text-white mt-1">
                    {formatConverted(settings.initial_investment || 0)}
                  </p>
                </div>
                <div className="rounded-xl bg-white/5 p-4 border border-white/10">
                  <p className="text-sm text-white/60">Cash Reserves</p>
                  <p className="text-xl font-bold text-vision-green mt-1">
                    {formatConverted(settings.cash_reserves || 0)}
                  </p>
                </div>
                <div className="rounded-xl bg-white/5 p-4 border border-white/10">
                  <p className="text-sm text-white/60">Historical Revenue</p>
                  <p className="text-xl font-bold text-vision-cyan mt-1">
                    {formatConverted(settings.historical_revenue || 0)}
                  </p>
                </div>
                <div className="rounded-xl bg-white/5 p-4 border border-white/10">
                  <p className="text-sm text-white/60">Historical Profit</p>
                  <p className={`text-xl font-bold mt-1 ${(settings.historical_profit || 0) >= 0 ? 'text-vision-green' : 'text-red-400'}`}>
                    {formatConverted(settings.historical_profit || 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
