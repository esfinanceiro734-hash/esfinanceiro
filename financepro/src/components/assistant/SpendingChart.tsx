import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { formatCurrency } from '@/utils/format'
import type { SpendingByCategory } from '@/lib/financialAnalysis'
import { cn } from '@/utils/cn'

const BAR_COLORS = [
  'bg-negative', 'bg-warning', 'bg-info', 'bg-positive',
  'bg-purple', 'bg-accent', 'bg-negative/70', 'bg-warning/70',
]

interface SpendingChartProps {
  data: SpendingByCategory[]
  isLoading?: boolean
}

export function SpendingChart({ data, isLoading }: SpendingChartProps) {
  const maxVal = data[0]?.total ?? 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos por categoria</CardTitle>
        <span className="text-xs text-text-muted">Mês atual</span>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-3 w-24 animate-pulse rounded bg-surface-elevated" />
                <div className="h-3 animate-pulse rounded bg-surface-elevated" style={{ width: `${60 - i * 10}%` }} />
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <p className="py-6 text-center text-sm text-text-muted">Nenhuma despesa no mês atual</p>
        ) : (
          <div className="space-y-4">
            {data.map((cat, i) => (
              <div key={cat.name}>
                <div className="mb-1.5 flex items-center justify-between text-[13px]">
                  <span className="font-medium text-text-primary">{cat.name}</span>
                  <div className="flex items-center gap-3 text-right">
                    <span className="text-text-muted">{cat.percent}%</span>
                    <span className="font-semibold text-text-primary">{formatCurrency(cat.total)}</span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-elevated">
                  <div
                    className={cn('h-full rounded-full transition-all duration-700', BAR_COLORS[i % BAR_COLORS.length])}
                    style={{ width: maxVal > 0 ? `${(cat.total / maxVal) * 100}%` : '0%' }}
                  />
                </div>
                <p className="mt-0.5 text-right text-[11px] text-text-muted">
                  {cat.count} lançamento{cat.count > 1 ? 's' : ''} · média {formatCurrency(cat.avg)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
