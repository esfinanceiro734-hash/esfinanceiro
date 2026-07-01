import { supabase } from '@/lib/supabase'
import type { DebtRow, DebtInsert, DebtUpdate } from '@/types/database'


export const debtsService = {
  async list(): Promise<DebtRow[]> {
    const { data, error } = await supabase.from('debts').select('*').order('valor_total', { ascending: false })
    if (error) {
      console.warn('[debtsService.list]', error.message)
      return []
    }
    return data ?? []
  },

  async create(input: DebtInsert): Promise<DebtRow | null> {
    const { data, error } = await supabase.from('debts').insert(input).select().single()
    if (error) {
      console.warn('[debtsService.create]', error.message)
      return null
    }
    return data
  },

  async update(id: string, input: DebtUpdate): Promise<DebtRow | null> {
    const { data, error } = await supabase.from('debts').update(input).eq('id', id).select().single()
    if (error) {
      console.warn('[debtsService.update]', error.message)
      return null
    }
    return data
  },

  async remove(id: string): Promise<boolean> {
    const { error } = await supabase.from('debts').delete().eq('id', id)
    if (error) {
      console.warn('[debtsService.remove]', error.message)
      return false
    }
    return true
  },
}
