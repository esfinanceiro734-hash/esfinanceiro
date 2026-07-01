import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { analyzeFinances, type FinancialAnalysisResult } from '@/lib/financialAnalysis'
import { useAuth } from '@/hooks/useAuth'

function currentMonthRange() {
  const now = new Date()
  const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
  return { from, to }
}

export function useFinancialAnalysis() {
  const { session } = useAuth()
  const [result, setResult] = useState<FinancialAnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(async () => {
    if (!session?.user.id) return
    setIsLoading(true)
    setError(null)

    const range = currentMonthRange()

    const [txRes, debtRes, goalRes] = await Promise.all([
      supabase.from('transactions').select('*').gte('data', range.from).lte('data', range.to),
      supabase.from('debts').select('*').neq('status', 'quitada'),
      supabase.from('goals').select('*'),
    ])

    if (txRes.error || debtRes.error || goalRes.error) {
      setError('Não foi possível carregar os dados para análise.')
      setIsLoading(false)
      return
    }

    const analysis = analyzeFinances(
      txRes.data ?? [],
      debtRes.data ?? [],
      goalRes.data ?? [],
    )

    setResult(analysis)
    setIsLoading(false)
  }, [session?.user.id])

  useEffect(() => { run() }, [run])

  return { result, isLoading, error, refresh: run }
}
