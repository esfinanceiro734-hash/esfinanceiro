import { supabase } from '@/lib/supabase'
import type { TransactionRow, TransactionInsert } from '@/types/database'


/**
 * Serviço de transações (receitas/despesas).
 * RLS garante que cada usuário só leia/escreva suas próprias linhas
 * (policies em supabase/migrations/0002_rls_policies.sql).
 */
export const transactionsService = {
  async list(): Promise<TransactionRow[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('data', { ascending: false })

    if (error) {
      console.warn('[transactionsService.list]', error.message)
      return []
    }
    return data ?? []
  },

  async create(input: TransactionInsert): Promise<TransactionRow | null> {
    const { data, error } = await supabase.from('transactions').insert(input).select().single()

    if (error) {
      console.warn('[transactionsService.create]', error.message)
      return null
    }
    return data
  },

  async remove(id: string): Promise<boolean> {
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (error) {
      console.warn('[transactionsService.remove]', error.message)
      return false
    }
    return true
  },
}
