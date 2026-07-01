import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { formatCurrency } from '@/utils/format'
import type { CategoryPoint } from '@/hooks/useCashFlowChart'

interface CategoryDonutChartProps {
  data: CategoryPoint[]
  isLoading?: boolean
}

export function CategoryDonutChart({ data, isLoading }: CategoryDonutChartProps) {
  const total = data.reduce((s, c) => s + c.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[15px]">Despesas por categoria</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-44 items-center justify-center">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-44 items-center justify-center text-sm text-text-muted">
            Sem despesas no período
          </div>
        ) : (
          <>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie dataKey="value" data={data} innerRadius="64%" outerRadius="100%"
                    paddingAngle={2} stroke="var(--color-surface)" strokeWidth={3}>
                    {data.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 space-y-2.5">
              {data.map((c) => (
                <li key={c.name} className="flex items-center justify-between text-[13px]">
                  <span className="flex items-center gap-2 text-text-secondary">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                    {c.name}
                  </span>
                  <span className="font-medium text-text-primary">
                    {formatCurrency(c.value)} <span className="text-text-muted">({c.percent}%)</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3.5">
              <span className="text-[13px] text-text-secondary">Total:</span>
              <span className="font-display text-base font-bold text-text-primary">{formatCurrency(total)}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
