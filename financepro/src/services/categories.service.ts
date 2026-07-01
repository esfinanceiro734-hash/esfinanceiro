import { supabase } from '@/lib/supabase'
import type { CategoryRow, CategoryInsert } from '@/types/database'


export const categoriesService = {
  async list(): Promise<CategoryRow[]> {
    const { data, error } = await supabase.from('categories').select('*').order('nome', { ascending: true })
    if (error) {
      console.warn('[categoriesService.list]', error.message)
      return []
    }
    return data ?? []
  },

  async create(input: CategoryInsert): Promise<CategoryRow | null> {
    const { data, error } = await supabase.from('categories').insert(input).select().single()
    if (error) {
      console.warn('[categoriesService.create]', error.message)
      return null
    }
    return data
  },

  async remove(id: string): Promise<boolean> {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) {
      console.warn('[categoriesService.remove]', error.message)
      return false
    }
    return true
  },
}
