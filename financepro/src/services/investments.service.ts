import { supabase } from '@/lib/supabase'
import type { InvestmentRow, InvestmentInsert, InvestmentUpdate } from '@/types/database'


export const investmentsService = {
  async list(): Promise<InvestmentRow[]> {
    const { data, error } = await supabase.from('investments').select('*').order('created_at', { ascending: false })
    if (error) {
      console.warn('[investmentsService.list]', error.message)
      return []
    }
    return data ?? []
  },

  async create(input: InvestmentInsert): Promise<InvestmentRow | null> {
    const { data, error } = await supabase.from('investments').insert(input).select().single()
    if (error) {
      console.warn('[investmentsService.create]', error.message)
      return null
    }
    return data
  },

  async update(id: string, input: InvestmentUpdate): Promise<InvestmentRow | null> {
    const { data, error } = await supabase.from('investments').update(input).eq('id', id).select().single()
    if (error) {
      console.warn('[investmentsService.update]', error.message)
      return null
    }
    return data
  },

  async remove(id: string): Promise<boolean> {
    const { error } = await supabase.from('investments').delete().eq('id', id)
    if (error) {
      console.warn('[investmentsService.remove]', error.message)
      return false
    }
    return true
  },
}
