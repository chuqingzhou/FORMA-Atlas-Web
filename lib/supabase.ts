import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://spb-xjxyazsru1q6t6c4.supabase.opentrust.net'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYW5vbiIsInJlZiI6InNwYi14anh5YXpzcnUxcTZ0NmM0IiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NjYxNTk4MDIsImV4cCI6MjA4MTczNTgwMn0.JLMyfKHZS_9uKzij37OlAAB36pBLuu_9IXkbfcXD6iE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Organoid {
  id: string
  organoid_id: string
  region_type: 'cerebral' | 'mge' | 'midbrain'
  genotype: 'healthy_control' | 'scz_patient'
  cell_line: string
  created_at: string
  updated_at: string
}

export interface MRIScan {
  id: string
  organoid_id: string
  scan_date: string
  age_weeks: number
  volume_path: string
  metadata: Record<string, any>
  created_at: string
}

export interface Region {
  id: string
  name: string
  description: string
  abbreviation: string
}

