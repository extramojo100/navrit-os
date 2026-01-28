import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lgvvgulathqhcluzvqcc.supabase.co'
const supabaseAnonKey = 'sb_publishable__q9qEq-lBrRaZDOwJ-gm1A_NyzSnSCV'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
