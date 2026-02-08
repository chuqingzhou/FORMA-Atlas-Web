import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://spb-bp106195q465mbtj.supabase.opentrust.net'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin = supabaseServiceKey
  ? createClient(SUPABASE_URL, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
  : null

export async function POST() {
  if (!supabaseAdmin) {
    return NextResponse.json({ total_visits: 0 }, { status: 200 })
  }

  try {
    const { data: row } = await supabaseAdmin
      .from('site_stats')
      .select('total_visits')
      .eq('id', 'default')
      .single()

    const current = Number(row?.total_visits ?? 0)
    const newCount = current + 1

    await supabaseAdmin
      .from('site_stats')
      .update({ total_visits: newCount, updated_at: new Date().toISOString() })
      .eq('id', 'default')

    return NextResponse.json(
      { total_visits: newCount },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch {
    return NextResponse.json({ total_visits: 0 }, { status: 200 })
  }
}
