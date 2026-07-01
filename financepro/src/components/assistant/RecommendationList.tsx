import { ArrowRight, Flame, CircleDot, Minus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn'
import type { Recommendation } from '@/lib/financialAnalysis'

const PRIORITY = {
  high:   { icon: Flame,     color: 'text-negative',  bg: 'bg-negative-soft',  label: 'Alta prioridade' },
  medium: { icon: CircleDot, color: 'text-warning',   bg: 'bg-warning-soft',   label: 'Média prioridade' },
  low:    { icon: Minus,     color: 'text-info',      bg: 'bg-info-soft',      label: 'Baixa prioridade' },
}

interface RecommendationListProps {
  recommendations: Recommendation[]
}

export function RecommendationList({ recommendations }: RecommendationListProps) {
  const navigate = useNavigate()

  return (
    <div className="space-y-3">
      {recommendations.map((rec) => {
        const p = PRIORITY[rec.priority]
        const PIcon = p.icon
        return (
          <div key={rec.id} className="flex gap-4 rounded-xl border border-border bg-surface p-4">
            <div className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', p.bg, p.color)}>
              <PIcon size={16} strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-text-primary">{rec.title}</h3>
                <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', p.bg, p.color)}>
                  {p.label}
                </span>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-text-secondary">{rec.description}</p>
              {rec.estimatedImpact && (
                <p className="mt-1.5 text-[11px] font-medium text-accent">💡 Impacto: {rec.estimatedImpact}</p>
              )}
            </div>
            {rec.action && rec.actionPath && (
              <button
                onClick={() => navigate(rec.actionPath!)}
                className="mt-1 flex h-8 shrink-0 items-center gap-1 self-start rounded-lg border border-border px-2.5 text-xs font-medium text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
              >
                {rec.action}
                <ArrowRight size={12} />
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
