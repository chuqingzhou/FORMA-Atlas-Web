import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://spb-bp106195q465mbtj.supabase.opentrust.net'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin = supabaseServiceKey
  ? createClient(SUPABASE_URL, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
  : null

export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json({ total_visits: 0 })
  }

  try {
    const { data } = await supabaseAdmin
      .from('site_stats')
      .select('total_visits')
      .eq('id', 'default')
      .single()

    return NextResponse.json({ total_visits: Number(data?.total_visits ?? 0) })
  } catch {
    return NextResponse.json({ total_visits: 0 })
  }
}
