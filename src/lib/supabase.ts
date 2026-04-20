import { createClient } from '@supabase/supabase-js'

/**
 * Cliente Supabase singleton.
 *
 * Lê URL e anon key das variáveis de ambiente do Vite (prefixo VITE_).
 * Em dev: vem de .env.local
 * Em prod: configurar no painel do Vercel (Settings → Environment Variables)
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não encontradas. ' +
    'Copie .env.local.example para .env.local e preencha com suas credenciais.'
  )
}

export const supabase = createClient(
  supabaseUrl ?? '',
  supabaseAnonKey ?? ''
)
