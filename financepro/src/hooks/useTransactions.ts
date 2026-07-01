import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { TransactionRow, TransactionInsert, TransactionUpdate, TransactionType } from '@/types/database'
import { useAuth } from '@/hooks/useAuth'

export type FilterPeriod = 'today' | 'week' | 'month' | 'year' | 'all'

function getDateRange(period: FilterPeriod): { from: string; to: string } | null {
  if (period === 'all') return null
  const now = new Date()
  const to = now.toISOString().split('T')[0]

  const from = new Date(now)
  if (period === 'today') {
    // same day
  } else if (period === 'week') {
    from.setDate(now.getDate() - 7)
  } else if (period === 'month') {
    from.setDate(1)
  } else if (period === 'year') {
    from.setMonth(0, 1)
  }

  return { from: from.toISOString().split('T')[0], to }
}

interface UseTransactionsOptions {
  tipo?: TransactionType
  period?: FilterPeriod
}

export function useTransactions(options: UseTransactionsOptions = {}) {
  const { session } = useAuth()
  const { tipo, period = 'month' } = options

  const [transactions, setTransactions] = useState<TransactionRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  const fetch = useCallback(async () => {
    if (!session?.user.id) return
    setIsLoading(true)
    setError(null)

    let query = supabase
      .from('transactions')
      .select('*')
      .order('data', { ascending: false })

    if (tipo) query = query.eq('tipo', tipo)

    const range = getDateRange(period)
    if (range) {
      query = query.gte('data', range.from).lte('data', range.to)
    }

    const { data, error: err } = await query
    if (err) { setError(err.message); setIsLoading(false); return }
    setTransactions(data ?? [])
    setIsLoading(false)
  }, [session?.user.id, tipo, period])

  useEffect(() => {
    fetch()
  }, [fetch])

  // Realtime: any INSERT / UPDATE / DELETE in transactions refreshes the list
  useEffect(() => {
    if (!session?.user.id) return

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
    }

    const channel = supabase
      .channel(`transactions:${session.user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${session.user.id}` },
        () => { fetch() },
      )
      .subscribe()

    channelRef.current = channel
    return () => { supabase.removeChannel(channel) }
  }, [session?.user.id, fetch])

  // ---- CRUD ----
  async function createTransaction(input: Omit<TransactionInsert, 'user_id'>): Promise<boolean> {
    if (!session?.user.id) return false
    const { error: err } = await supabase.from('transactions').insert({
      ...input,
      user_id: session.user.id,
    })
    if (err) { setError(err.message); return false }
    return true
  }

  async function updateTransaction(id: string, input: TransactionUpdate): Promise<boolean> {
    const { error: err } = await supabase.from('transactions').update(input).eq('id', id)
    if (err) { setError(err.message); return false }
    return true
  }

  async function deleteTransaction(id: string): Promise<boolean> {
    const { error: err } = await supabase.from('transactions').delete().eq('id', id)
    if (err) { setError(err.message); return false }
    return true
  }

  return { transactions, isLoading, error, refetch: fetch, createTransaction, updateTransaction, deleteTransaction }
}
