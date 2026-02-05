import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyApiAuth } from '@/lib/api-auth'
import type { ImportRow } from '@/lib/pnl/types'

export const dynamic = 'force-dynamic'

interface ImportPreviewResponse {
  session_id: string
  total_rows: number
  valid_rows: number
  invalid_rows: number
  rows: ImportRow[]
}

/**
 * GET /api/inventory/import/preview
 * Get validation results for an import session
 * Query params: session_id (required)
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate
    const user = await verifyApiAuth()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Parse query params
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'session_id is required' },
        { status: 400 }
      )
    }

    // 3. Create Supabase clients
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: request.headers.get('Authorization') || '' } }
    })

    // 4. Get user's organization_id
    const { data: membership, error: membershipError } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', user.id)
      .single()

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: 'User not in an organization' },
        { status: 403 }
      )
    }

    const organization_id = membership.organization_id

    // 5. Use service role to query staging table
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey)

    const { data: rows, error: rowsError } = await supabaseService
      .from('import_staging')
      .select('*')
      .eq('session_id', sessionId)
      .eq('organization_id', organization_id)
      .order('row_number', { ascending: true })

    if (rowsError) {
      return NextResponse.json(
        { error: `Failed to fetch staging rows: ${rowsError.message}` },
        { status: 500 }
      )
    }

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: 'Session not found or no rows' },
        { status: 404 }
      )
    }

    // 6. Count valid and invalid rows
    const validRows = rows.filter(r => r.is_valid).length
    const invalidRows = rows.filter(r => !r.is_valid).length

    // 7. Return preview
    const response: ImportPreviewResponse = {
      session_id: sessionId,
      total_rows: rows.length,
      valid_rows: validRows,
      invalid_rows: invalidRows,
      rows: rows as ImportRow[],
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('[API] /api/inventory/import/preview error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
