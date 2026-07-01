import { DollarSign, Wallet, Target, CreditCard, type LucideIcon } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

interface QuickAction {
  label: string
  icon: LucideIcon
  tone: 'positive' | 'negative' | 'info' | 'purple'
  onClick: () => void
}

const toneClasses: Record<QuickAction['tone'], string> = {
  positive: 'bg-positive-soft text-positive',
  negative: 'bg-negative-soft text-negative',
  info: 'bg-info-soft text-info',
  purple: 'bg-purple-soft text-purple',
}

interface QuickActionsPanelProps {
  onReceita: () => void
  onDespesa: () => void
  onMeta: () => void
  onDivida: () => void
}

export function QuickActionsPanel({ onReceita, onDespesa, onMeta, onDivida }: QuickActionsPanelProps) {
  const actions: QuickAction[] = [
    { label: 'Nova Receita', icon: DollarSign, tone: 'positive', onClick: onReceita },
    { label: 'Nova Despesa', icon: Wallet, tone: 'negative', onClick: onDespesa },
    { label: 'Nova Meta', icon: Target, tone: 'info', onClick: onMeta },
    { label: 'Nova Dívida', icon: CreditCard, tone: 'purple', onClick: onDivida },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[15px]">Ações rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className="flex flex-col items-center gap-2 rounded-lg p-2 text-center transition-colors hover:bg-surface-elevated"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClasses[action.tone]}`}>
                <action.icon size={18} strokeWidth={2} />
              </div>
              <span className="text-[11px] leading-tight text-text-secondary">{action.label}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
