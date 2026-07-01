import {
  Sparkles, LayoutDashboard, PlusCircle, MinusCircle, ArrowLeftRight,
  LayoutGrid, Landmark, Target, Trophy, Briefcase, LineChart, BarChart3,
  FileText, CalendarRange, User, Settings, TrendingUp, Crown, X, type LucideIcon,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { NAV_GROUPS } from '@/lib/navigation'
import { cn } from '@/utils/cn'

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles, LayoutDashboard, PlusCircle, MinusCircle, ArrowLeftRight,
  LayoutGrid, Landmark, Target, Trophy, Briefcase, LineChart, BarChart3,
  FileText, CalendarRange, User, Settings,
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate()

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-surface',
          'border-r border-border',
          'transition-transform duration-250 ease-in-out',
          'lg:static lg:translate-x-0 lg:shrink-0',
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full',
        )}
        aria-label="Menu de navegação"
      >
        {/* ── Brand ── */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border-subtle shrink-0">
          <button
            onClick={() => { onClose(); navigate('/') }}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-base shrink-0">
              <TrendingUp size={16} strokeWidth={2.25} />
            </div>
            <div className="leading-tight text-left">
              <p className="font-display text-[14px] font-bold tracking-tight text-text-primary">
                Finance<span className="text-accent">Pro</span>
              </p>
              <p className="text-[10px] text-text-muted">Seu futuro, seu controle.</p>
            </div>
          </button>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-surface-elevated hover:text-text-primary lg:hidden"
            aria-label="Fechar menu"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Nav items ── */}
        <nav className="flex flex-1 flex-col overflow-y-auto py-4 gap-6 px-3" aria-label="Navegação principal">
          {NAV_GROUPS.map((group, gi) => (
            <div key={group.label ?? gi}>
              {group.label && (
                <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = ICON_MAP[item.icon]
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/'}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors select-none',
                          isActive
                            ? 'bg-accent-soft text-accent'
                            : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary',
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent" />
                          )}
                          {Icon && (
                            <Icon
                              size={16}
                              strokeWidth={2}
                              className={isActive ? 'text-accent' : 'text-text-muted group-hover:text-text-secondary'}
                            />
                          )}
                          <span>{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ── Premium card ── */}
        <div className="shrink-0 p-3 border-t border-border-subtle">
          <div className="rounded-xl bg-gradient-to-br from-[#1c1f25] to-[#16181d] border border-border p-4">
            <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-warning-soft text-warning">
              <Crown size={15} strokeWidth={2} />
            </div>
            <p className="font-display text-[13px] font-semibold text-text-primary">Seja Premium</p>
            <p className="mt-1 text-[11px] leading-relaxed text-text-muted">
              Acesso a recursos exclusivos e relatórios avançados.
            </p>
            <button className="mt-3 w-full rounded-lg bg-purple/20 border border-purple/30 py-1.5 text-xs font-semibold text-purple hover:bg-purple/30 transition-colors">
              Assinar agora
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
