import { cn } from '@/utils/cn'
import type { FilterPeriod } from '@/hooks/useTransactions'

const OPTIONS: { value: FilterPeriod; label: string }[] = [
  { value: 'today', label: 'Hoje' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mês' },
  { value: 'year', label: 'Ano' },
  { value: 'all', label: 'Todos' },
]

interface FilterBarProps {
  value: FilterPeriod
  onChange: (v: FilterPeriod) => void
}

export function FilterBar({ value, onChange }: FilterBarProps) {
  return (
    <div className="flex gap-1 rounded-lg border border-border bg-surface p-1">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
            value === opt.value
              ? 'bg-surface-elevated text-text-primary shadow-sm'
              : 'text-text-muted hover:text-text-secondary',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
