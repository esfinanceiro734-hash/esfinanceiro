import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { formatCurrency } from '@/utils/format'
import type { CashFlowPoint } from '@/hooks/useCashFlowChart'

interface ChartTooltipProps {
  active?: boolean
  label?: string
  payload?: { dataKey: string; name: string; value: number; color: string }[]
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-surface-elevated px-3 py-2 text-xs shadow-xl">
      <p className="mb-1.5 font-medium text-text-primary">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="flex items-center gap-1.5" style={{ color: entry.color }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
          {entry.name}: {formatCurrency(Number(entry.value))}
        </p>
      ))}
    </div>
  )
}

interface CashFlowChartProps {
  data: CashFlowPoint[]
  isLoading?: boolean
}

export function CashFlowChart({ data, isLoading }: CashFlowChartProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-5">
          <CardTitle className="text-[15px]">Fluxo de Caixa</CardTitle>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-text-secondary">
              <span className="h-2 w-2 rounded-full bg-positive" /> Receitas
            </span>
            <span className="flex items-center gap-1.5 text-text-secondary">
              <span className="h-2 w-2 rounded-full bg-negative" /> Despesas
            </span>
          </div>
        </div>
        <span className="text-xs text-text-muted">Últimos 6 meses</span>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="var(--color-text-muted)"
                  tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
                  axisLine={{ stroke: 'var(--color-border)' }}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v: number) => `R$${v / 1000}k`}
                  stroke="var(--color-text-muted)"
                  tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="receitas" name="Receitas" stroke="var(--color-positive)" strokeWidth={2.5}
                  dot={{ r: 4, fill: 'var(--color-positive)', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="despesas" name="Despesas" stroke="var(--color-negative)" strokeWidth={2.5}
                  dot={{ r: 4, fill: 'var(--color-negative)', strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
