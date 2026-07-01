import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/utils/cn'

interface FormAlertProps {
  type: 'error' | 'success'
  message: string
}

export function FormAlert({ type, message }: FormAlertProps) {
  const isError = type === 'error'
  const Icon = isError ? AlertCircle : CheckCircle2

  return (
    <div
      className={cn(
        'flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm',
        isError ? 'border-negative/25 bg-negative-soft text-negative' : 'border-positive/25 bg-positive-soft text-positive',
      )}
    >
      <Icon size={16} strokeWidth={2} className="mt-0.5 shrink-0" />
      <p>{message}</p>
    </div>
  )
}
