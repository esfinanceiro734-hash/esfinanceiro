import { useState, useEffect, type FormEvent } from 'react'
import { X, DollarSign, Tag, FileText, Calendar, TrendingUp, TrendingDown } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { FormAlert } from '@/components/auth/FormAlert'
import { cn } from '@/utils/cn'
import type { TransactionRow, TransactionType } from '@/types/database'

const RECEITA_CATEGORIES = ['Salário', 'Freelance', 'Aluguel', 'Investimentos', 'Presente', 'Outros']
const DESPESA_CATEGORIES = ['Moradia', 'Alimentação', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Vestuário', 'Assinaturas', 'Outros']

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: {
    tipo: TransactionType
    descricao: string
    valor: number
    data: string
    categoria_id: string
  }) => Promise<boolean>
  initialType?: TransactionType
  editing?: TransactionRow | null
}

export function TransactionModal({ isOpen, onClose, onSave, initialType = 'despesa', editing }: TransactionModalProps) {
  const [tipo, setTipo] = useState<TransactionType>(initialType)
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [data, setData] = useState(new Date().toISOString().split('T')[0])
  const [categoria, setCategoria] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const categories = tipo === 'receita' ? RECEITA_CATEGORIES : DESPESA_CATEGORIES

  // Populate form when editing
  useEffect(() => {
    if (editing) {
      setTipo(editing.tipo)
      setDescricao(editing.descricao ?? '')
      setValor(String(editing.valor))
      setData(editing.data)
      setCategoria(editing.categoria_id ?? '')
    } else {
      setTipo(initialType)
      setDescricao('')
      setValor('')
      setData(new Date().toISOString().split('T')[0])
      setCategoria('')
    }
    setError(null)
  }, [editing, initialType, isOpen])

  if (!isOpen) return null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const v = parseFloat(valor.replace(',', '.'))
    if (!descricao.trim()) { setError('Informe uma descrição.'); return }
    if (isNaN(v) || v <= 0) { setError('Informe um valor válido maior que zero.'); return }
    if (!categoria) { setError('Selecione uma categoria.'); return }

    setIsSaving(true)
    const ok = await onSave({ tipo, descricao: descricao.trim(), valor: v, data, categoria_id: categoria })
    setIsSaving(false)

    if (!ok) { setError('Não foi possível salvar. Tente novamente.'); return }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-surface shadow-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
          <div>
            <h2 className="font-display text-base font-semibold text-text-primary">
              {editing ? 'Editar lançamento' : 'Novo lançamento'}
            </h2>
            <p className="text-xs text-text-muted">Preencha os dados da transação</p>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {error && <FormAlert type="error" message={error} />}

          {/* Type toggle */}
          {!editing && (
            <div className="grid grid-cols-2 gap-2">
              {(['receita', 'despesa'] as TransactionType[]).map((t) => {
                const isActive = tipo === t
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { setTipo(t); setCategoria('') }}
                    className={cn(
                      'flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-colors',
                      isActive && t === 'receita' && 'border-positive/40 bg-positive-soft text-positive',
                      isActive && t === 'despesa' && 'border-negative/40 bg-negative-soft text-negative',
                      !isActive && 'border-border bg-surface-elevated text-text-muted hover:bg-surface-hover',
                    )}
                  >
                    {t === 'receita' ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
                    {t === 'receita' ? 'Receita' : 'Despesa'}
                  </button>
                )
              })}
            </div>
          )}

          <Input
            label="Descrição"
            type="text"
            placeholder="Ex.: Salário de maio"
            icon={<FileText size={16} />}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label="Valor (R$)"
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              icon={<DollarSign size={16} />}
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
            <Input
              label="Data"
              type="date"
              icon={<Calendar size={16} />}
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </div>

          {/* Category select */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">Categoria</label>
            <div className="relative">
              <Tag size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="h-11 w-full appearance-none rounded-lg border border-border bg-surface-elevated pl-10 pr-4 text-sm text-text-primary outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
              >
                <option value="">Selecione a categoria</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={isSaving}
              className={cn(
                'flex-1',
                tipo === 'receita' && 'bg-positive hover:bg-positive/90',
                tipo === 'despesa' && 'bg-negative hover:bg-negative/90',
              )}
            >
              {editing ? 'Salvar alterações' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
