import { useState } from 'react'
import { Plus, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FilterBar } from '@/components/transactions/FilterBar'
import { TransactionTable } from '@/components/transactions/TransactionTable'
import { TransactionModal } from '@/components/transactions/TransactionModal'
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal'
import { useTransactions, type FilterPeriod } from '@/hooks/useTransactions'
import { formatCurrency } from '@/utils/format'
import type { TransactionRow } from '@/types/database'

export function Despesas() {
  const [period, setPeriod] = useState<FilterPeriod>('month')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTx, setEditingTx] = useState<TransactionRow | null>(null)
  const [deletingTx, setDeletingTx] = useState<TransactionRow | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { transactions, isLoading, createTransaction, updateTransaction, deleteTransaction } =
    useTransactions({ tipo: 'despesa', period })

  const total = transactions.reduce((s, t) => s + Number(t.valor), 0)
  const maior = transactions.length ? Math.max(...transactions.map((t) => Number(t.valor))) : 0
  const media = transactions.length ? total / transactions.length : 0

  // Category breakdown
  const byCategory = transactions.reduce<Record<string, number>>((acc, t) => {
    const cat = t.categoria_id ?? 'Outros'
    acc[cat] = (acc[cat] ?? 0) + Number(t.valor)
    return acc
  }, {})
  const topCategories = Object.entries(byCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  async function handleSave(data: Parameters<typeof createTransaction>[0]) {
    if (editingTx) return updateTransaction(editingTx.id, data)
    return createTransaction(data)
  }

  async function handleDelete() {
    if (!deletingTx) return
    setIsDeleting(true)
    await deleteTransaction(deletingTx.id)
    setIsDeleting(false)
    setDeletingTx(null)
  }

  return (
    <div className="space-y-6 pt-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-text-primary">Despesas</h2>
          <p className="text-sm text-text-muted">Controle seus gastos e identifique onde economizar</p>
        </div>
        <div className="flex items-center gap-3">
          <FilterBar value={period} onChange={setPeriod} />
          <Button size="sm" className="bg-negative hover:bg-negative/90" onClick={() => { setEditingTx(null); setIsModalOpen(true) }}>
            <Plus size={15} />
            Nova despesa
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Total do período', value: total, color: 'text-negative' },
          { label: 'Maior despesa', value: maior, color: 'text-text-primary' },
          { label: 'Média por lançamento', value: media, color: 'text-text-primary' },
        ].map((c) => (
          <Card key={c.label} className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-negative-soft text-negative">
              <TrendingDown size={18} strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs text-text-muted">{c.label}</p>
              <p className={`font-display text-lg font-bold ${c.color}`}>{formatCurrency(c.value)}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Lançamentos</CardTitle>
            <span className="text-xs text-text-muted">
              {isLoading ? 'Carregando...' : `${transactions.length} resultado(s)`}
            </span>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-10 text-center text-sm text-text-muted">Carregando transações...</div>
            ) : (
              <TransactionTable
                transactions={transactions}
                onEdit={(tx) => { setEditingTx(tx); setIsModalOpen(true) }}
                onDelete={(tx) => setDeletingTx(tx)}
              />
            )}
          </CardContent>
        </Card>

        {/* Category breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Por categoria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topCategories.length === 0 ? (
              <p className="text-sm text-text-muted">Nenhuma despesa no período</p>
            ) : (
              topCategories.map(([cat, val]) => (
                <div key={cat}>
                  <div className="mb-1 flex justify-between text-[13px]">
                    <span className="text-text-secondary">{cat}</span>
                    <span className="font-medium text-text-primary">{formatCurrency(val)}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-elevated">
                    <div
                      className="h-full rounded-full bg-negative"
                      style={{ width: `${total > 0 ? (val / total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTx(null) }}
        onSave={handleSave}
        initialType="despesa"
        editing={editingTx}
      />

      <DeleteConfirmModal
        isOpen={!!deletingTx}
        title="Excluir despesa"
        description={`Deseja excluir "${deletingTx?.descricao}"? Esta ação não pode ser desfeita.`}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingTx(null)}
      />
    </div>
  )
}
