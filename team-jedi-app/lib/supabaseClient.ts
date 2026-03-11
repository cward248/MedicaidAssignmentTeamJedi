import { createClient } from '@supabase/supabase-js'

// Created by David Huling
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {

  throw new Error( 'missing Supabase configuration.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)