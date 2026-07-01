import { supabase } from '@/lib/supabase'
import type { GoalRow, GoalInsert, GoalUpdate } from '@/types/database'


export const goalsService = {
  async list(): Promise<GoalRow[]> {
    const { data, error } = await supabase.from('goals').select('*').order('created_at', { ascending: false })
    if (error) {
      console.warn('[goalsService.list]', error.message)
      return []
    }
    return data ?? []
  },

  async create(input: GoalInsert): Promise<GoalRow | null> {
    const { data, error } = await supabase.from('goals').insert(input).select().single()
    if (error) {
      console.warn('[goalsService.create]', error.message)
      return null
    }
    return data
  },

  async update(id: string, input: GoalUpdate): Promise<GoalRow | null> {
    const { data, error } = await supabase.from('goals').update(input).eq('id', id).select().single()
    if (error) {
      console.warn('[goalsService.update]', error.message)
      return null
    }
    return data
  },

  async remove(id: string): Promise<boolean> {
    const { error } = await supabase.from('goals').delete().eq('id', id)
    if (error) {
      console.warn('[goalsService.remove]', error.message)
      return false
    }
    return true
  },
}
