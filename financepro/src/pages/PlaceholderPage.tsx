import type { LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

interface PlaceholderPageProps {
  icon: LucideIcon
  title: string
  description: string
}

export function PlaceholderPage({ icon: Icon, title, description }: PlaceholderPageProps) {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface-elevated text-accent mb-5">
        <Icon size={28} strokeWidth={1.5} />
      </div>

      <span className="mb-3 rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-accent">
        Em breve
      </span>

      <h1 className="font-display text-2xl font-bold text-text-primary">{title}</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-text-secondary">{description}</p>

      <button
        onClick={() => navigate('/')}
        className="mt-8 flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-elevated hover:text-text-primary transition-colors"
      >
        <ArrowLeft size={15} />
        Voltar ao Dashboard
      </button>
    </div>
  )
}
