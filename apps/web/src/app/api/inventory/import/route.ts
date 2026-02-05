import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyApiAuth } from '@/lib/api-auth'
import * as XLSX from 'xlsx'
import { randomUUID } from 'crypto'

export const dynamic = 'force-dynamic'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const REQUIRED_COLUMNS = ['card_name', 'quantity', 'acquisition_cost']
const OPTIONAL_COLUMNS = [
  'card_id',
  'set_name',
  'condition',
  'game_type',
  'product_type',
  'acquisition_date',
  'notes',
  'location',
]

interface ImportResponse {
  session_id: string
  total_rows: number
}

/**
 * POST /api/inventory/import
 * Upload and parse CSV/XLSX file, insert into staging table for validation
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

    // 2. Get user's organization_id
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

    // 3. Parse form data and get file
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // 4. Validate file
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large (max ${MAX_FILE_SIZE / 1024 / 1024}MB)` },
        { status: 400 }
      )
    }

    const fileName = file.name.toLowerCase()
    if (!fileName.endsWith('.csv') && !fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
      return NextResponse.json(
        { error: 'File must be CSV or XLSX format' },
        { status: 400 }
      )
    }

    // 5. Read and parse file
    const buffer = Buffer.from(await file.arrayBuffer())
    let workbook: XLSX.WorkBook

    try {
      workbook = XLSX.read(buffer, { type: 'buffer' })
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to parse file - invalid format' },
        { status: 400 }
      )
    }

    // Get first sheet
    const sheetName = workbook.SheetNames[0]
    if (!sheetName) {
      return NextResponse.json(
        { error: 'File has no sheets' },
        { status: 400 }
      )
    }

    const worksheet = workbook.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

    if (rows.length < 2) {
      return NextResponse.json(
        { error: 'File must have at least a header row and one data row' },
        { status: 400 }
      )
    }

    // 6. Extract headers and validate
    const headers = rows[0].map((h: any) => String(h).toLowerCase().trim())
    const missingColumns = REQUIRED_COLUMNS.filter(col => !headers.includes(col))

    if (missingColumns.length > 0) {
      return NextResponse.json(
        { error: `Missing required columns: ${missingColumns.join(', ')}` },
        { status: 400 }
      )
    }

    // 7. Create session
    const sessionId = randomUUID()

    // 8. Map data rows to staging inserts
    const dataRows = rows.slice(1) // Skip header row
    const stagingInserts = dataRows
      .filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''))
      .map((row, index) => {
        const rawData: Record<string, unknown> = {}
        headers.forEach((header, colIndex) => {
          rawData[header] = row[colIndex]
        })

        return {
          session_id: sessionId,
          organization_id,
          row_number: index + 2, // +2 because: +1 for 0-index, +1 for header row
          raw_data: rawData,
          is_valid: false, // Will be set by validation function
          validation_errors: null,
          normalized_data: null,
        }
      })

    if (stagingInserts.length === 0) {
      return NextResponse.json(
        { error: 'No valid data rows found' },
        { status: 400 }
      )
    }

    // 9. Use service role client for staging table operations
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey)

    const { error: insertError } = await supabaseService
      .from('import_staging')
      .insert(stagingInserts)

    if (insertError) {
      return NextResponse.json(
        { error: `Failed to insert staging data: ${insertError.message}` },
        { status: 500 }
      )
    }

    // 10. Call validation function
    const { error: validationError } = await supabaseService.rpc('validate_inventory_import', {
      p_session_id: sessionId
    })

    if (validationError) {
      console.error('[API] Validation function error:', validationError)
      // Continue anyway - validation errors will be shown in preview
    }

    // 11. Return session info
    const response: ImportResponse = {
      session_id: sessionId,
      total_rows: stagingInserts.length,
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('[API] /api/inventory/import error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
