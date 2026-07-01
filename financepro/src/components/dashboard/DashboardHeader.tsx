import { Calendar, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface DashboardHeaderProps {
  userName: string
  onNewTransaction?: () => void
}

function currentMonthLabel(): string {
  return new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    .replace(/^\w/, c => c.toUpperCase())
}

export function DashboardHeader({ userName, onNewTransaction }: DashboardHeaderProps) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-display text-xl font-bold text-text-primary sm:text-2xl">
          {greeting}, {userName}! <span aria-hidden>👋</span>
        </h1>
        <p className="mt-0.5 text-sm text-text-secondary">
          Aqui está o resumo da sua vida financeira
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-secondary">
          <Calendar size={14} className="text-text-muted" />
          <span className="text-[13px]">{currentMonthLabel()}</span>
        </div>
        <Button size="md" onClick={onNewTransaction} className="whitespace-nowrap">
          <Plus size={15} />
          <span className="hidden xs:inline">Novo lançamento</span>
          <span className="xs:hidden">Novo</span>
        </Button>
      </div>
    </div>
  )
}
