import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getCurrentOrganizationId } from './use-organization'
import { getCurrentUserId } from '@/lib/auth-helpers'
import { generateReport } from '@/lib/reports/report-generator'
import type {
  SavedReport,
  CreateSavedReportInput,
  ReportConfig,
  ReportData,
} from '@/types/reports'

// Database row type
interface SavedReportRow {
  id: string
  organization_id: string
  user_id: string
  name: string
  report_type: string
  config: Record<string, unknown>
  schedule_frequency: string | null
  schedule_day_of_week: number | null
  schedule_day_of_month: number | null
  schedule_email: string | null
  last_run_at: string | null
  created_at: string
  updated_at: string
}

// Transform database row to frontend type
function transformSavedReport(row: SavedReportRow): SavedReport {
  return {
    id: row.id,
    organizationId: row.organization_id,
    userId: row.user_id,
    name: row.name,
    reportType: row.report_type as SavedReport['reportType'],
    config: row.config as ReportConfig,
    schedule: row.schedule_frequency
      ? {
          frequency: row.schedule_frequency as 'daily' | 'weekly' | 'monthly',
          dayOfWeek: row.schedule_day_of_week ?? undefined,
          dayOfMonth: row.schedule_day_of_month ?? undefined,
          email: row.schedule_email ?? undefined,
        }
      : null,
    lastRunAt: row.last_run_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// Hook to fetch saved reports
export function useSavedReports() {
  return useQuery({
    queryKey: ['saved-reports'],
    queryFn: async (): Promise<SavedReport[]> => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) return []

      const { data, error } = await supabase
        .from('saved_reports')
        .select('*')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return (data as SavedReportRow[]).map(transformSavedReport)
    },
  })
}

// Hook to create a saved report
export function useCreateSavedReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateSavedReportInput): Promise<SavedReport> => {
      const userId = await getCurrentUserId()
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')

      const { data, error } = await supabase
        .from('saved_reports')
        .insert({
          organization_id: orgId,
          user_id: userId,
          name: input.name,
          report_type: input.reportType,
          config: input.config,
          schedule_frequency: input.scheduleFrequency || null,
          schedule_day_of_week: input.scheduleDayOfWeek || null,
          schedule_day_of_month: input.scheduleDayOfMonth || null,
          schedule_email: input.scheduleEmail || null,
        })
        .select()
        .single()

      if (error) throw error

      return transformSavedReport(data as SavedReportRow)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-reports'] })
    },
  })
}

// Hook to delete a saved report
export function useDeleteSavedReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')

      const { error } = await supabase
        .from('saved_reports')
        .delete()
        .eq('id', id)
        .eq('organization_id', orgId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-reports'] })
    },
  })
}

// Hook to generate a report
export function useGenerateReport() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const generate = async (config: ReportConfig) => {
    setIsGenerating(true)
    setError(null)

    try {
      const orgId = await getCurrentOrganizationId()
      if (!orgId) throw new Error('No organization')

      const data = await generateReport(config, orgId)
      setReportData(data)
      return data
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setIsGenerating(false)
    }
  }

  const clear = () => {
    setReportData(null)
    setError(null)
  }

  return {
    generate,
    clear,
    reportData,
    isGenerating,
    error,
  }
}
