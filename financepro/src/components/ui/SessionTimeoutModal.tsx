import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface SessionTimeoutModalProps {
  isOpen: boolean
  onStay: () => void
  onLeave: () => void
}

export function SessionTimeoutModal({ isOpen, onStay, onLeave }: SessionTimeoutModalProps) {
  const [secondsLeft, setSecondsLeft] = useState(300) // 5 min

  useEffect(() => {
    if (!isOpen) { setSecondsLeft(300); return }
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) { clearInterval(interval); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isOpen])

  if (!isOpen) return null

  const min = Math.floor(secondsLeft / 60)
  const sec = String(secondsLeft % 60).padStart(2, '0')

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-2xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-warning-soft text-warning">
          <Clock size={22} strokeWidth={2} />
        </div>
        <h2 className="font-display text-base font-semibold text-text-primary">
          Sua sessão está prestes a expirar
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Por segurança, você será desconectado automaticamente em:
        </p>
        <div className="my-5 flex items-center justify-center">
          <span className="font-display text-4xl font-bold tabular-nums text-warning">
            {min}:{sec}
          </span>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onLeave}>
            Sair agora
          </Button>
          <Button className="flex-1" onClick={onStay}>
            Continuar conectado
          </Button>
        </div>
      </div>
    </div>
  )
}
