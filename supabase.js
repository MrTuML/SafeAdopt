import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Reemplaza con tus credenciales cuando el proyecto de Supabase esté reactivado
const supabaseUrl = 'https://TU_PROYECTO_ID.supabase.co'
const supabaseAnonKey = 'TU_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
