import { RefreshCw } from 'lucide-react'
import { useFinancialAnalysis } from '@/hooks/useFinancialAnalysis'
import { HealthScore } from '@/components/assistant/HealthScore'
import { InsightCard } from '@/components/assistant/InsightCard'
import { RecommendationList } from '@/components/assistant/RecommendationList'
import { SpendingChart } from '@/components/assistant/SpendingChart'
import { AIChat } from '@/components/assistant/AIChat'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatCurrency } from '@/utils/format'

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface-elevated p-4 text-center">
      <p className="font-display text-lg font-bold text-text-primary">{value}</p>
      <p className="mt-0.5 text-xs text-text-muted">{label}</p>
    </div>
  )
}

export function Assistente() {
  const { result, isLoading, refresh } = useFinancialAnalysis()

  return (
    <div className="space-y-6 pt-2">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-text-primary">Assistente Financeiro</h2>
          <p className="text-sm text-text-muted">Análise personalizada com base nos seus dados do mês atual</p>
        </div>
        <button
          onClick={refresh}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-text-secondary hover:bg-surface-elevated disabled:opacity-50"
        >
          <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
          Atualizar análise
        </button>
      </div>

      {/* Top row: score + stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Score card */}
        <Card>
          <CardContent className="flex flex-col items-center py-6">
            <HealthScore
              score={result?.healthScore ?? 0}
              label={result?.healthLabel ?? ''}
              color={result?.healthColor ?? 'info'}
              isLoading={isLoading}
            />
            {!isLoading && result && (
              <p className="mt-4 max-w-[220px] text-center text-xs leading-relaxed text-text-muted">
                {result.healthScore >= 80
                  ? 'Suas finanças estão em excelente forma. Continue assim!'
                  : result.healthScore >= 60
                  ? 'Boa situação financeira com espaço para melhorar.'
                  : result.healthScore >= 40
                  ? 'Atenção: há pontos importantes a corrigir.'
                  : 'Sua saúde financeira precisa de ação imediata.'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Stats grid */}
        <div className="space-y-3 lg:col-span-2">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile
              label="Receitas (mês)"
              value={isLoading ? '...' : formatCurrency(result?.totalReceitas ?? 0)}
            />
            <StatTile
              label="Despesas (mês)"
              value={isLoading ? '...' : formatCurrency(result?.totalDespesas ?? 0)}
            />
            <StatTile
              label="Saldo (mês)"
              value={isLoading ? '...' : formatCurrency(result?.saldo ?? 0)}
            />
            <StatTile
              label="Taxa de poupança"
              value={isLoading ? '...' : `${result?.savingsRate?.toFixed(1) ?? 0}%`}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatTile
              label="Dívidas ativas"
              value={isLoading ? '...' : formatCurrency(result?.totalDividaAtiva ?? 0)}
            />
            <StatTile
              label="Dívida / Renda"
              value={isLoading ? '...' : `${result?.debtToIncomeRatio?.toFixed(1) ?? 0}x`}
            />
            <StatTile
              label="Metas em dia"
              value={isLoading ? '...' : `${result?.goalsOnTrack ?? 0} / ${(result?.goalsOnTrack ?? 0) + (result?.goalsAtRisk ?? 0)}`}
            />
          </div>

          {/* Maior custo callout */}
          {!isLoading && result?.topCategory && (
            <div className="flex items-center gap-3 rounded-xl border border-warning/25 bg-warning-soft px-4 py-3">
              <span className="text-lg">📊</span>
              <p className="text-[13px] text-text-secondary">
                <span className="font-semibold text-text-primary">Maior custo: {result?.topCategory?.name}</span>
                {' — '}{result?.topCategory?.percent}% das despesas ({formatCurrency(result?.topCategory?.total ?? 0)}).
                {(result?.topCategory?.percent ?? 0) > 35 && ' Está acima do recomendado.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Middle row: spending chart + insights */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SpendingChart data={result?.spendingByCategory ?? []} isLoading={isLoading} />

        <Card>
          <CardHeader>
            <CardTitle>Insights automáticos</CardTitle>
            <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
              {result?.insights.length ?? 0} detectados
            </span>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 animate-pulse rounded-xl bg-surface-elevated" />
                ))}
              </div>
            ) : result?.insights.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-2xl">🎉</p>
                <p className="mt-2 text-sm text-text-secondary">Nenhum alerta encontrado!</p>
                <p className="text-xs text-text-muted">Adicione mais lançamentos para análises detalhadas.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {result?.insights.map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom row: recommendations + AI chat */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recomendações</CardTitle>
            <span className="text-xs text-text-muted">Ordenadas por prioridade</span>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 animate-pulse rounded-xl bg-surface-elevated" />
                ))}
              </div>
            ) : (
              <RecommendationList recommendations={result?.recommendations ?? []} />
            )}
          </CardContent>
        </Card>

        <AIChat analysisResult={result} />
      </div>
    </div>
  )
}
