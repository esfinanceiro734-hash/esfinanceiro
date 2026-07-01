import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface DeleteConfirmModalProps {
  isOpen: boolean
  title?: string
  description?: string
  isDeleting: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmModal({
  isOpen,
  title = 'Excluir lançamento',
  description = 'Essa ação não pode ser desfeita. Deseja continuar?',
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-2xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-negative-soft text-negative">
          <AlertTriangle size={22} strokeWidth={2} />
        </div>
        <h2 className="font-display text-base font-semibold text-text-primary">{title}</h2>
        <p className="mt-1.5 text-sm text-text-secondary">{description}</p>
        <div className="mt-5 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            className="flex-1 bg-negative hover:bg-negative/90"
            isLoading={isDeleting}
            onClick={onConfirm}
          >
            Excluir
          </Button>
        </div>
      </div>
    </div>
  )
}
