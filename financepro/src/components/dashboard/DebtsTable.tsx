import { useEffect, useState } from 'react'
import { CreditCard, Landmark, Store, Lightbulb } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { DebtRow } from '@/types/database'

const PROGRESS_COLORS = ['bg-negative', 'bg-warning', 'bg-info', 'bg-positive', 'bg-purple']

type IconType = 'card' | 'bank' | 'store'
const ICONS: Record<IconType, typeof CreditCard> = { card: CreditCard, bank: Landmark, store: Store }
const ICON_TONES: Record<IconType, string> = {
  card: 'bg-purple-soft text-purple',
  bank: 'bg-info-soft text-info',
  store: 'bg-info-soft text-info',
}

function guessIcon(nome: string): IconType {
  const lower = nome.toLowerCase()
  if (lower.includes('cartão') || lower.includes('cartao') || lower.includes('crédito') || lower.includes('credito')) return 'card'
  if (lower.includes('banco') || lower.includes('empréstimo') || lower.includes('emprestimo') || lower.includes('financiamento')) return 'bank'
  return 'store'
}

export function DebtsTable() {
  const [debts, setDebts] = useState<DebtRow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('debts')
      .select('*')
      .neq('status', 'quitada')
      .order('valor_total', { ascending: false })
      .limit(4)
      .then(({ data }) => {
        setDebts(data ?? [])
        setIsLoading(false)
      })
  }, [])

  const topDebt = debts.sort((a, b) => b.juros - a.juros)[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[15px]">Minhas Dívidas</CardTitle>
        <a href="/dividas" className="text-xs font-medium text-accent hover:underline">Ver todas</a>
      </CardHeader>
      <CardContent className="space-y-1">
        {isLoading ? (
          <div className="py-8 text-center text-sm text-text-muted">Carregando dívidas...</div>
        ) : debts.length === 0 ? (
          <div className="py-8 text-center text-sm text-text-muted">Nenhuma dívida ativa 🎉</div>
        ) : (
          <>
            <div className="hidden grid-cols-[1.8fr_1fr_1fr_1.4fr] gap-4 px-1 pb-2 text-[11px] font-medium uppercase tracking-wide text-text-muted lg:grid">
              <span /><span>Total Devido</span><span>Juros ao mês</span><span>Parcela mínima / Progresso</span>
            </div>

            {debts.map((debt, i) => {
              const icon = guessIcon(debt.nome_divida)
              const Icon = ICONS[icon]
              const totalPago = debt.valor_total - (debt.valor_parcela * (debt.parcelas))
              const progresso = Math.max(0, Math.min(100, totalPago > 0 ? Math.round((totalPago / debt.valor_total) * 100) : 0))

              return (
                <div key={debt.id} className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border-subtle py-3.5 first:border-t-0 lg:grid-cols-[1.8fr_1fr_1fr_1.4fr] lg:items-center">
                  <div className="col-span-2 flex items-center gap-3 lg:col-span-1">
                    <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', ICON_TONES[icon])}>
                      <Icon size={16} strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{debt.nome_divida}</p>
                      <p className="text-xs text-text-muted">{debt.instituicao ?? '—'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] text-text-muted lg:hidden">Total Devido</p>
                    <p className="text-sm font-medium text-text-primary">{formatCurrency(debt.valor_total)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-text-muted lg:hidden">Juros ao mês</p>
                    <p className="text-sm font-medium text-text-primary">{Number(debt.juros).toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="mb-1 flex items-center justify-between text-[11px] text-text-muted">
                      <span className="lg:hidden">Progresso</span>
                      <span className="hidden lg:inline">Progresso</span>
                      <span className="font-medium text-text-secondary">{progresso}%</span>
                    </p>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-elevated">
                      <div className={cn('h-full rounded-full', PROGRESS_COLORS[i % PROGRESS_COLORS.length])} style={{ width: `${progresso}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-text-muted lg:hidden">
                      Parcela: <span className="text-text-primary">{formatCurrency(debt.valor_parcela)}</span>
                    </p>
                  </div>
                </div>
              )
            })}

            {topDebt && (
              <div className="mt-4 flex flex-col gap-3 rounded-xl border border-warning/25 bg-warning-soft p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warning/20 text-warning">
                    <Lightbulb size={16} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-warning">Estratégia recomendada: Método Avalanche</p>
                    <p className="mt-0.5 text-[13px] text-text-secondary">
                      Priorize quitar <strong>{topDebt.nome_divida}</strong> primeiro — maior juros ({Number(topDebt.juros).toFixed(2)}% ao mês).
                    </p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" className="shrink-0 border-warning/40 text-warning hover:bg-warning/10">
                  Ver plano completo
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
