import { NextRequest, NextResponse } from 'next/server'

const JUSTTCG_API_BASE = 'https://api.justtcg.com/v1'
const API_KEY = process.env.JUSTTCG_API_KEY || ''

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const pathString = path.filter(Boolean).join('/')
  const searchParams = request.nextUrl.searchParams.toString()
  const url = `${JUSTTCG_API_BASE}/${pathString}${searchParams ? `?${searchParams}` : ''}`

  console.log('JustTCG proxy - fetching:', url)

  try {
    const response = await fetch(url, {
      headers: {
        'x-api-key': API_KEY,
        'Accept': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('JustTCG API error:', data)
      return NextResponse.json(data, { status: response.status })
    }

    console.log('JustTCG proxy - success')
    return NextResponse.json(data)
  } catch (error) {
    console.error('JustTCG proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch from JustTCG API', details: String(error) },
      { status: 500 }
    )
  }
}
