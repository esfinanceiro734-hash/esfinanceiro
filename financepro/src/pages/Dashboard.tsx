import { useState } from 'react'
import { DollarSign, Wallet, BarChart3, CreditCard } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useSummary } from '@/hooks/useSummary'
import { useCashFlowChart } from '@/hooks/useCashFlowChart'
import { useTransactions } from '@/hooks/useTransactions'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { SummaryCard } from '@/components/dashboard/SummaryCard'
import { AssistantPanel } from '@/components/dashboard/AssistantPanel'
import { GoalsPanel } from '@/components/dashboard/GoalsPanel'
import { QuickActionsPanel } from '@/components/dashboard/QuickActionsPanel'
import { DebtsTable } from '@/components/dashboard/DebtsTable'
import { CashFlowChart } from '@/components/dashboard/CashFlowChart'
import { CategoryDonutChart } from '@/components/dashboard/CategoryDonutChart'
import { TransactionModal } from '@/components/transactions/TransactionModal'
import type { TransactionType } from '@/types/database'

function pct(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(Math.abs(((current - previous) / previous) * 100))
}

export function Dashboard() {
  const { profile, session } = useAuth()
  const firstName = (profile?.nome ?? session?.user.email?.split('@')[0] ?? 'visitante').split(' ')[0]

  const { summary, isLoading: summaryLoading } = useSummary()
  const { data: chartData, categoryData, isLoading: chartLoading } = useCashFlowChart()

  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<TransactionType>('despesa')
  const { createTransaction } = useTransactions()
  const navigate = useNavigate()

  function openModal(tipo: TransactionType) {
    setModalType(tipo)
    setModalOpen(true)
  }

  return (
    <div className="space-y-6 pt-2">
      <DashboardHeader userName={firstName} onNewTransaction={() => openModal('despesa')} />

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Receitas do mês"
          value={summary?.receitas ?? 0}
          icon={DollarSign}
          tone="positive"
          changePct={pct(summary?.receitas ?? 0, summary?.receitasAnterior ?? 0)}
          direction={(summary?.receitas ?? 0) >= (summary?.receitasAnterior ?? 0) ? 'up' : 'down'}
          isLoading={summaryLoading}
        />
        <SummaryCard
          label="Despesas do mês"
          value={summary?.despesas ?? 0}
          icon={Wallet}
          tone="negative"
          changePct={pct(summary?.despesas ?? 0, summary?.despesasAnterior ?? 0)}
          direction={(summary?.despesas ?? 0) <= (summary?.despesasAnterior ?? 0) ? 'up' : 'down'}
          isLoading={summaryLoading}
        />
        <SummaryCard
          label="Saldo do mês"
          value={summary?.saldo ?? 0}
          icon={BarChart3}
          tone="info"
          changePct={pct(summary?.saldo ?? 0, summary?.saldoAnterior ?? 0)}
          direction={(summary?.saldo ?? 0) >= (summary?.saldoAnterior ?? 0) ? 'up' : 'down'}
          isLoading={summaryLoading}
        />
        <SummaryCard
          label="Dívidas totais"
          value={summary?.dividasTotais ?? 0}
          icon={CreditCard}
          tone="warning"
          changePct={0}
          direction="down"
          isLoading={summaryLoading}
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <CashFlowChart data={chartData} isLoading={chartLoading} />
            </div>
            <CategoryDonutChart data={categoryData} isLoading={chartLoading} />
          </div>
          <DebtsTable />
        </div>

        <div className="space-y-6 xl:col-span-4">
          <AssistantPanel summary={summary} />
          <GoalsPanel />
          <QuickActionsPanel
            onReceita={() => openModal('receita')}
            onDespesa={() => openModal('despesa')}
            onMeta={() => navigate('/metas')}
            onDivida={() => navigate('/dividas')}
          />
        </div>
      </div>

      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(data) => createTransaction(data)}
        initialType={modalType}
        editing={null}
      />
    </div>
  )
}
