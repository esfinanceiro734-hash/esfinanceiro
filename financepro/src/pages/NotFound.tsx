import { useNavigate } from 'react-router-dom'
import { Compass } from 'lucide-react'

export function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base px-4 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft text-accent">
        <Compass size={30} strokeWidth={1.75} />
      </div>
      <p className="font-mono text-5xl font-bold text-border">404</p>
      <h1 className="mt-3 font-display text-2xl font-bold text-text-primary">
        Página não encontrada
      </h1>
      <p className="mt-2 max-w-sm text-sm text-text-secondary">
        O endereço que você acessou não existe ou foi removido.
      </p>
      <div className="mt-8 flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-elevated transition-colors"
        >
          ← Voltar
        </button>
        <button
          onClick={() => navigate('/')}
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-base hover:bg-accent-hover transition-colors"
        >
          Ir para o Dashboard
        </button>
      </div>
    </div>
  )
}
