import {
  AlertTriangle, TrendingUp, TrendingDown, PiggyBank, Tag, CreditCard,
  Landmark, Target, Trophy, Utensils, Info, type LucideIcon,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import type { Insight, InsightSeverity } from '@/lib/financialAnalysis'

const ICONS: Record<string, LucideIcon> = {
  AlertTriangle, TrendingUp, TrendingDown, PiggyBank, Tag, CreditCard,
  Landmark, Target, Trophy, Utensils, Info,
}

const SEVERITY_STYLES: Record<InsightSeverity, { border: string; bg: string; icon: string; badge: string }> = {
  danger:  { border: 'border-negative/30',  bg: 'bg-negative-soft',  icon: 'text-negative',  badge: 'bg-negative text-white' },
  warning: { border: 'border-warning/30',   bg: 'bg-warning-soft',   icon: 'text-warning',   badge: 'bg-warning text-base' },
  success: { border: 'border-positive/30',  bg: 'bg-positive-soft',  icon: 'text-positive',  badge: 'bg-positive text-white' },
  info:    { border: 'border-info/30',      bg: 'bg-info-soft',      icon: 'text-info',      badge: 'bg-info text-white' },
}

const SEVERITY_LABEL: Record<InsightSeverity, string> = {
  danger: 'Atenção urgente', warning: 'Atenção', success: 'Parabéns', info: 'Informação',
}

interface InsightCardProps {
  insight: Insight
}

export function InsightCard({ insight }: InsightCardProps) {
  const s = SEVERITY_STYLES[insight.severity]
  const Icon = ICONS[insight.icon] ?? Info

  return (
    <div className={cn('rounded-xl border p-4', s.border, 'bg-surface')}>
      <div className="flex items-start gap-3">
        <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', s.bg, s.icon)}>
          <Icon size={17} strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-text-primary">{insight.title}</h3>
            <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', s.badge)}>
              {SEVERITY_LABEL[insight.severity]}
            </span>
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-text-secondary">{insight.message}</p>
        </div>
      </div>
    </div>
  )
}
