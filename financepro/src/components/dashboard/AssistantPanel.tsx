import { Sparkles, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/utils/format'
import type { FinancialSummary } from '@/hooks/useSummary'

interface AssistantPanelProps {
  summary: FinancialSummary | null
}

function generateTip(summary: FinancialSummary | null) {
  if (!summary) return null

  const savingRate = summary.receitas > 0 ? ((summary.receitas - summary.despesas) / summary.receitas) * 100 : 0

  if (summary.saldo < 0) {
    return {
      icon: AlertCircle,
      iconClass: 'bg-negative-soft text-negative',
      message: 'Suas despesas superaram as receitas este mês.',
      suggestion: `Você está ${formatCurrency(Math.abs(summary.saldo))} no negativo. Revise seus gastos com urgência.`,
    }
  }
  if (savingRate < 10) {
    return {
      icon: TrendingDown,
      iconClass: 'bg-warning-soft text-warning',
      message: `Você poupou apenas ${savingRate.toFixed(0)}% da renda este mês.`,
      suggestion: 'O ideal é guardar pelo menos 10% das receitas. Tente reduzir despesas variáveis.',
    }
  }
  return {
    icon: TrendingUp,
    iconClass: 'bg-positive-soft text-positive',
    message: `Ótimo! Você poupou ${savingRate.toFixed(0)}% da renda este mês.`,
    suggestion: `Você economizou ${formatCurrency(summary.saldo)}. Considere alocar parte em metas ou investimentos.`,
  }
}

export function AssistantPanel({ summary }: AssistantPanelProps) {
  const tip = generateTip(summary)

  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-soft text-purple">
            <Sparkles size={16} strokeWidth={2} />
          </div>
          <h3 className="font-display text-[15px] font-semibold text-text-primary">Assistente Financeiro</h3>
        </div>

        <p className="mt-3 text-[13px] leading-relaxed text-text-secondary">
          Com base nos seus dados, aqui vão algumas dicas para você:
        </p>

        {tip ? (
          <div className="mt-3 flex gap-3 rounded-xl bg-surface-elevated p-3.5">
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${tip.iconClass}`}>
              <tip.icon size={14} strokeWidth={2.25} />
            </div>
            <p className="text-[13px] leading-relaxed text-text-secondary">
              <span className="font-medium text-text-primary">{tip.message}</span>
              <br />
              {tip.suggestion}
            </p>
          </div>
        ) : (
          <div className="mt-3 rounded-xl bg-surface-elevated p-3.5 text-[13px] text-text-muted">
            Adicione receitas e despesas para receber dicas personalizadas.
          </div>
        )}

        <Button variant="secondary" size="sm" className="mt-4 w-full">
          Ver mais dicas
        </Button>
      </CardContent>
    </Card>
  )
}
