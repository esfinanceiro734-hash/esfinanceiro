import { Pencil, Trash2, Tag, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatCurrency, formatDate } from '@/utils/format'
import type { TransactionRow } from '@/types/database'

interface TransactionTableProps {
  transactions: TransactionRow[]
  onEdit: (tx: TransactionRow) => void
  onDelete: (tx: TransactionRow) => void
}

export function TransactionTable({ transactions, onEdit, onDelete }: TransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface/40 py-14 text-center">
        <p className="text-sm font-medium text-text-secondary">Nenhum lançamento encontrado</p>
        <p className="mt-1 text-xs text-text-muted">Mude o filtro ou adicione uma nova transação</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border-subtle">
            {['Descrição', 'Categoria', 'Data', 'Valor', ''].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-text-muted first:pl-0"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const isReceita = tx.tipo === 'receita'
            return (
              <tr key={tx.id} className="group border-b border-border-subtle last:border-0 hover:bg-surface-elevated/40">
                <td className="py-3.5 pl-0 pr-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                        isReceita ? 'bg-positive-soft text-positive' : 'bg-negative-soft text-negative',
                      )}
                    >
                      {isReceita ? <ArrowUp size={14} strokeWidth={2.5} /> : <ArrowDown size={14} strokeWidth={2.5} />}
                    </div>
                    <span className="text-sm font-medium text-text-primary">
                      {tx.descricao ?? '—'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                    <Tag size={12} />
                    {tx.categoria_id ?? '—'}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-sm text-text-secondary">{formatDate(tx.data)}</td>
                <td className="px-4 py-3.5">
                  <span
                    className={cn(
                      'font-display text-sm font-semibold',
                      isReceita ? 'text-positive' : 'text-negative',
                    )}
                  >
                    {isReceita ? '+' : '-'} {formatCurrency(tx.valor)}
                  </span>
                </td>
                <td className="py-3.5 pl-4 pr-0">
                  <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => onEdit(tx)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-text-muted hover:bg-surface-hover hover:text-text-primary"
                      title="Editar"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(tx)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-text-muted hover:bg-negative-soft hover:text-negative"
                      title="Excluir"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
