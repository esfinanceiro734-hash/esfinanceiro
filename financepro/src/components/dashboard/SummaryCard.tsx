import type { LucideIcon } from 'lucide-react'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatCurrency } from '@/utils/format'
import { cn } from '@/utils/cn'

type Tone = 'positive' | 'negative' | 'info' | 'warning'

interface SummaryCardProps {
  label: string
  value: number
  icon: LucideIcon
  tone: Tone
  changePct: number
  direction: 'up' | 'down'
  isLoading?: boolean
}

const toneClasses: Record<Tone, string> = {
  positive: 'bg-positive text-white',
  negative: 'bg-negative text-white',
  info: 'bg-info text-white',
  warning: 'bg-warning text-white',
}

export function SummaryCard({ label, value, icon: Icon, tone, changePct, direction, isLoading }: SummaryCardProps) {
  const isUp = direction === 'up'

  return (
    <Card className="p-5">
      <div className="flex items-start gap-3.5">
        <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', toneClasses[tone])}>
          <Icon size={20} strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] text-text-secondary">{label}</p>
          {isLoading ? (
            <div className="mt-2 h-6 w-28 animate-pulse rounded-md bg-surface-elevated" />
          ) : (
            <p className="mt-1 truncate font-display text-xl font-bold text-text-primary">{formatCurrency(value)}</p>
          )}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1 text-xs font-medium">
        {isLoading ? (
          <div className="h-3.5 w-24 animate-pulse rounded bg-surface-elevated" />
        ) : (
          <>
            <span className={cn('flex items-center gap-0.5', isUp ? 'text-positive' : 'text-negative')}>
              {isUp ? <ArrowUp size={12} strokeWidth={2.5} /> : <ArrowDown size={12} strokeWidth={2.5} />}
              {changePct}%
            </span>
            <span className="text-text-muted">vs mês anterior</span>
          </>
        )}
      </div>
    </Card>
  )
}
