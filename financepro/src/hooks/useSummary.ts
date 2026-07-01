import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export interface FinancialSummary {
  receitas: number
  despesas: number
  saldo: number
  dividasTotais: number
  receitasAnterior: number
  despesasAnterior: number
  saldoAnterior: number
}

function currentMonthRange() {
  const now = new Date()
  const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
  return { from, to }
}

function prevMonthRange() {
  const now = new Date()
  const from = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0]
  const to = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0]
  return { from, to }
}

export function useSummary() {
  const { session } = useAuth()
  const [summary, setSummary] = useState<FinancialSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!session?.user.id) return
    setIsLoading(true)

    const curr = currentMonthRange()
    const prev = prevMonthRange()

    const [currRows, prevRows, debtRows] = await Promise.all([
      supabase.from('transactions').select('tipo,valor').gte('data', curr.from).lte('data', curr.to),
      supabase.from('transactions').select('tipo,valor').gte('data', prev.from).lte('data', prev.to),
      supabase.from('debts').select('valor_total').neq('status', 'quitada'),
    ])

    const sum = (rows: { tipo: string; valor: number }[], tipo: string) =>
      (rows ?? []).filter((r) => r.tipo === tipo).reduce((a, r) => a + Number(r.valor), 0)

    const r = currRows.data ?? []
    const p = prevRows.data ?? []
    const receitas = sum(r as { tipo: string; valor: number }[], 'receita')
    const despesas = sum(r as { tipo: string; valor: number }[], 'despesa')
    const receitasAnterior = sum(p as { tipo: string; valor: number }[], 'receita')
    const despesasAnterior = sum(p as { tipo: string; valor: number }[], 'despesa')
    const dividasTotais = (debtRows.data ?? []).reduce((a, d) => a + Number(d.valor_total), 0)

    setSummary({
      receitas,
      despesas,
      saldo: receitas - despesas,
      dividasTotais,
      receitasAnterior,
      despesasAnterior,
      saldoAnterior: receitasAnterior - despesasAnterior,
    })
    setIsLoading(false)
  }, [session?.user.id])

  useEffect(() => { fetch() }, [fetch])

  return { summary, isLoading, refetch: fetch }
}
