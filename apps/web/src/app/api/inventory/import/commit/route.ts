import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyApiAuth } from '@/lib/api-auth'
import type { ImportRowNormalized } from '@/lib/pnl/types'

export const dynamic = 'force-dynamic'

interface CommitImportRequest {
  session_id: string
}

interface CommitImportResponse {
  imported_count: number
  inventory_ids: string[]
}

/**
 * POST /api/inventory/import/commit
 * Bulk insert valid rows from staging to inventory + acquisition_lots
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate
    const user = await verifyApiAuth()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Parse request body
    const body: CommitImportRequest = await request.json()

    if (!body.session_id) {
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

    // 5. Use service role for transaction
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey)

    // 6. Get valid rows from staging
    const { data: validRows, error: fetchError } = await supabaseService
      .from('import_staging')
      .select('*')
      .eq('session_id', body.session_id)
      .eq('organization_id', organization_id)
      .eq('is_valid', true)

    if (fetchError) {
      return NextResponse.json(
        { error: `Failed to fetch valid rows: ${fetchError.message}` },
        { status: 500 }
      )
    }

    if (!validRows || validRows.length === 0) {
      return NextResponse.json(
        { error: 'No valid rows to import' },
        { status: 400 }
      )
    }

    // 7. Process each valid row: insert inventory + acquisition_lot
    const inventoryIds: string[] = []
    const errors: string[] = []

    for (const row of validRows) {
      const normalized = row.normalized_data as ImportRowNormalized

      if (!normalized) {
        errors.push(`Row ${row.row_number}: Missing normalized data`)
        continue
      }

      try {
        // Insert inventory item
        const { data: inventoryItem, error: inventoryError } = await supabaseService
          .from('inventory')
          .insert({
            user_id: user.id,
            organization_id,
            card_id: normalized.card_id || `import-${row.id}`,
            card_name: normalized.card_name,
            card_image: normalized.card_image || null,
            set_name: normalized.set_name || null,
            location: normalized.location || 'BIN-01',
            condition: normalized.condition || 'NM',
            acquisition_cost: normalized.acquisition_cost,
            quantity: normalized.quantity,
            status: 'IN_STOCK',
            notes: normalized.notes || `Imported from session ${body.session_id}`,
            game_type: normalized.game_type || 'pokemon',
            product_type: normalized.product_type || 'card',
          })
          .select('id')
          .single()

        if (inventoryError) {
          errors.push(`Row ${row.row_number}: ${inventoryError.message}`)
          continue
        }

        if (!inventoryItem) {
          errors.push(`Row ${row.row_number}: Failed to create inventory item`)
          continue
        }

        // Insert acquisition lot
        const acquisitionDate = normalized.acquisition_date || new Date().toISOString().split('T')[0]

        const { error: lotError } = await supabaseService
          .from('acquisition_lots')
          .insert({
            inventory_id: inventoryItem.id,
            organization_id,
            quantity_total: normalized.quantity,
            quantity_remaining: normalized.quantity,
            unit_cost: normalized.acquisition_cost,
            acquisition_date: acquisitionDate,
            grading_cost: 0,
            notes: `Imported from CSV`,
          })

        if (lotError) {
          // Rollback inventory insert
          await supabaseService
            .from('inventory')
            .delete()
            .eq('id', inventoryItem.id)

          errors.push(`Row ${row.row_number}: ${lotError.message}`)
          continue
        }

        inventoryIds.push(inventoryItem.id)

      } catch (error) {
        errors.push(`Row ${row.row_number}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    // 8. Delete staging rows for this session
    const { error: deleteError } = await supabaseService
      .from('import_staging')
      .delete()
      .eq('session_id', body.session_id)
      .eq('organization_id', organization_id)

    if (deleteError) {
      console.error('[API] Failed to delete staging rows:', deleteError)
      // Don't fail the request - data is already imported
    }

    // 9. Return results
    const response: CommitImportResponse = {
      imported_count: inventoryIds.length,
      inventory_ids: inventoryIds,
    }

    if (errors.length > 0) {
      console.error('[API] Import errors:', errors)
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('[API] /api/inventory/import/commit error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
