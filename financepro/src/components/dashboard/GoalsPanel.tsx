import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/utils/format'
import type { GoalRow } from '@/types/database'

export function GoalsPanel() {
  const [goals, setGoals] = useState<GoalRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(4)
      .then(({ data }) => { setGoals(data ?? []); setIsLoading(false) })
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[15px]">Metas Financeiras</CardTitle>
        <a href="/metas" className="text-xs font-medium text-accent hover:underline">Ver todas</a>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="py-4 text-center text-sm text-text-muted">Carregando metas...</div>
        ) : goals.length === 0 ? (
          <p className="text-sm text-text-muted">Nenhuma meta criada ainda.</p>
        ) : (
          goals.map((goal) => {
            const pct = goal.valor_meta > 0 ? Math.min(100, Math.round((goal.valor_atual / goal.valor_meta) * 100)) : 0
            return (
              <div key={goal.id}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-text-primary">{goal.nome}</span>
                  <span className="text-xs font-medium text-text-secondary">{pct}%</span>
                </div>
                <p className="mb-1.5 text-xs text-text-muted">
                  {formatCurrency(goal.valor_atual)} de {formatCurrency(goal.valor_meta)}
                </p>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-elevated">
                  <div className="h-full rounded-full bg-positive" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })
        )}

        <Button
          variant="ghost"
          size="sm"
          className="w-full border border-dashed border-border text-accent hover:bg-accent-soft"
          onClick={() => navigate('/metas')}
        >
          <Plus size={15} />
          Nova Meta
        </Button>
      </CardContent>
    </Card>
  )
}
