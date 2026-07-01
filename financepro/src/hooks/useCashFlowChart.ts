import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

const MONTH_LABELS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export interface CashFlowPoint {
  month: string
  receitas: number
  despesas: number
}

export interface CategoryPoint {
  name: string
  value: number
  percent: number
  color: string
}

const CATEGORY_COLORS = [
  '#3b82f6', '#22c55e', '#f59e0b', '#a855f7',
  '#ec4899', '#6b7280', '#ef4444', '#14b8a6',
]

export function useCashFlowChart(months = 6) {
  const { session } = useAuth()
  const [data, setData] = useState<CashFlowPoint[]>([])
  const [categoryData, setCategoryData] = useState<CategoryPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!session?.user.id) return
    setIsLoading(true)

    const now = new Date()
    const from = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1)
    const fromStr = from.toISOString().split('T')[0]
    const toStr = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]

    const { data: rows } = await supabase
      .from('transactions')
      .select('tipo,valor,data,categoria_id')
      .gte('data', fromStr)
      .lte('data', toStr)

    // Build month buckets
    const buckets: Record<string, { receitas: number; despesas: number }> = {}
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      buckets[key] = { receitas: 0, despesas: 0 }
    }

    const categoryTotals: Record<string, number> = {}

    for (const row of rows ?? []) {
      const key = row.data.slice(0, 7)
      if (!buckets[key]) continue
      const v = Number(row.valor)
      if (row.tipo === 'receita') buckets[key].receitas += v
      else {
        buckets[key].despesas += v
        const cat = row.categoria_id ?? 'Outros'
        categoryTotals[cat] = (categoryTotals[cat] ?? 0) + v
      }
    }

    const points: CashFlowPoint[] = Object.entries(buckets).map(([key, val]) => {
      const [, m] = key.split('-')
      return { month: MONTH_LABELS[parseInt(m) - 1], ...val }
    })

    const totalDespesas = Object.values(categoryTotals).reduce((a, v) => a + v, 0)
    const catPoints: CategoryPoint[] = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value], i) => ({
        name,
        value,
        percent: totalDespesas > 0 ? Math.round((value / totalDespesas) * 100) : 0,
        color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
      }))

    setData(points)
    setCategoryData(catPoints)
    setIsLoading(false)
  }, [session?.user.id, months])

  useEffect(() => { fetch() }, [fetch])

  return { data, categoryData, isLoading, refetch: fetch }
}
