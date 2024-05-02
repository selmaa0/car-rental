import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hrkgllcprnmbhhhzqztf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhya2dsbGNwcm5tYmhoaHpxenRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQwNDgxMTQsImV4cCI6MjAyOTYyNDExNH0.ewEQjf1QTCsyeQD1fbfRyaQbziNTJa-lXH_RKi1Krhk'
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})