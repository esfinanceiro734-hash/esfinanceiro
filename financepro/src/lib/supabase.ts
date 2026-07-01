import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * Em desenvolvimento: avisa no console se as variáveis não estão configuradas.
 * Em produção (Netlify): o build falha se as variáveis forem exigidas pelo código
 * mas não definidas — ver netlify.toml e a seção de Environment variables.
 */
if (!supabaseUrl || supabaseUrl === '') {
  console.warn(
    '[FinancePro] VITE_SUPABASE_URL não configurada.\n' +
    'Copie .env.example para .env e preencha as variáveis do Supabase.',
  )
}

if (!supabaseAnonKey || supabaseAnonKey === '') {
  console.warn(
    '[FinancePro] VITE_SUPABASE_ANON_KEY não configurada.\n' +
    'Copie .env.example para .env e preencha as variáveis do Supabase.',
  )
}

export const supabase = createClient<Database>(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-anon-key',
  {
    auth: {
      // Persiste sessão no localStorage (padrão) para que o usuário
      // continue logado após fechar e reabrir o browser.
      persistSession: true,
      // URL base para redirecionar após login com OAuth ou magic link.
      // Em produção esta URL deve coincidir com a configurada no Supabase.
      detectSessionInUrl: true,
    },
  },
)
