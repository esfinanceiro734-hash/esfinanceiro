import type { ReactNode } from 'react'
import { TrendingUp, ShieldCheck, PieChart, Target } from 'lucide-react'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
}

const HIGHLIGHTS = [
  { icon: PieChart, text: 'Visão completa de receitas, despesas e dívidas em um só lugar' },
  { icon: Target, text: 'Metas com progresso visual para te manter no caminho' },
  { icon: ShieldCheck, text: 'Seus dados protegidos por Row Level Security no banco' },
]

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-base">
      {/* Brand panel — hidden on mobile */}
      <div className="relative hidden w-[44%] flex-col justify-between overflow-hidden bg-surface p-10 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_0%,rgba(34,197,94,0.12),transparent)]" />

        <div className="relative flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <TrendingUp size={20} strokeWidth={2.25} />
          </div>
          <div className="leading-tight">
            <p className="font-display text-[15px] font-bold tracking-tight text-text-primary">FinancePro</p>
            <p className="text-[11px] text-text-muted">Seu futuro, seu controle.</p>
          </div>
        </div>

        <div className="relative">
          <h2 className="font-display text-3xl font-bold leading-tight text-text-primary">
            Organize sua vida financeira com clareza.
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-text-secondary">
            Controle de receitas e despesas, plano de quitação de dívidas e metas — tudo em um painel premium.
          </p>

          <ul className="mt-8 space-y-4">
            {HIGHLIGHTS.map((item) => (
              <li key={item.text} className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <item.icon size={15} strokeWidth={2} />
                </div>
                <p className="pt-1 text-sm text-text-secondary">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-text-muted">© {new Date().getFullYear()} FinancePro. Todos os direitos reservados.</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <TrendingUp size={18} strokeWidth={2.25} />
            </div>
            <span className="font-display text-[15px] font-bold tracking-tight text-text-primary">FinancePro</span>
          </div>

          <h1 className="font-display text-2xl font-bold text-text-primary">{title}</h1>
          <p className="mt-1.5 text-sm text-text-secondary">{subtitle}</p>

          <div className="mt-7">{children}</div>
        </div>
      </div>
    </div>
  )
}
