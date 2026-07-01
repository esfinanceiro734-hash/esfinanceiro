import { cn } from '@/utils/cn'

interface HealthScoreProps {
  score: number
  label: string
  color: string
  isLoading?: boolean
}

const colorMap: Record<string, { stroke: string; text: string; bg: string }> = {
  positive: { stroke: '#22c55e', text: 'text-positive', bg: 'bg-positive-soft' },
  info:     { stroke: '#3b82f6', text: 'text-info',     bg: 'bg-info-soft' },
  warning:  { stroke: '#f59e0b', text: 'text-warning',  bg: 'bg-warning-soft' },
  negative: { stroke: '#ef4444', text: 'text-negative', bg: 'bg-negative-soft' },
}

export function HealthScore({ score, label, color, isLoading }: HealthScoreProps) {
  const c = colorMap[color] ?? colorMap.info

  // SVG arc params
  const R = 54
  const cx = 64
  const cy = 72
  const startAngle = -210   // degrees
  const endAngle   =  30
  const totalAngle = endAngle - startAngle        // 240°
  const scorePct   = Math.min(1, Math.max(0, score / 100))
  const sweepAngle = totalAngle * scorePct

  function polar(angle: number) {
    const rad = (angle * Math.PI) / 180
    return {
      x: cx + R * Math.cos(rad),
      y: cy + R * Math.sin(rad),
    }
  }

  function arcPath(from: number, to: number) {
    const p1 = polar(from)
    const p2 = polar(to)
    const large = to - from > 180 ? 1 : 0
    return `M ${p1.x} ${p1.y} A ${R} ${R} 0 ${large} 1 ${p2.x} ${p2.y}`
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={128} height={96} viewBox="0 0 128 96">
          {/* Track */}
          <path
            d={arcPath(startAngle, endAngle)}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={10}
            strokeLinecap="round"
          />
          {/* Score arc */}
          {!isLoading && score > 0 && (
            <path
              d={arcPath(startAngle, startAngle + sweepAngle)}
              fill="none"
              stroke={c.stroke}
              strokeWidth={10}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          )}
          {/* Loading pulse */}
          {isLoading && (
            <path
              d={arcPath(startAngle, endAngle)}
              fill="none"
              stroke="var(--color-surface-elevated)"
              strokeWidth={10}
              strokeLinecap="round"
              className="animate-pulse"
            />
          )}
        </svg>

        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
          {isLoading ? (
            <div className="h-8 w-14 animate-pulse rounded-lg bg-surface-elevated" />
          ) : (
            <>
              <span className={cn('font-display text-3xl font-bold leading-none', c.text)}>{score}</span>
              <span className="mt-0.5 text-[10px] font-medium text-text-muted">/ 100</span>
            </>
          )}
        </div>
      </div>

      <div className={cn('mt-2 rounded-full px-3 py-1 text-xs font-semibold', c.bg, c.text)}>
        {isLoading ? 'Calculando...' : `Saúde ${label}`}
      </div>
    </div>
  )
}
