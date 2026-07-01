import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { NAV_GROUPS } from '@/lib/navigation'

interface HeaderProps {
  onMenuClick: () => void
}

function getPageTitle(pathname: string): string {
  const allItems = NAV_GROUPS.flatMap(g => g.items)
  const match = allItems.find(item =>
    item.path === '/' ? pathname === '/' : pathname.startsWith(item.path)
  )
  return match?.label ?? 'FinancePro'
}

export function Header({ onMenuClick }: HeaderProps) {
  const { profile, session, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const displayName = profile?.nome ?? session?.user.email?.split('@')[0] ?? 'Usuário'
  const initials = displayName.split(' ').map((p: string) => p[0]).slice(0, 2).join('').toUpperCase()
  const pageTitle = getPageTitle(location.pathname)

  // Fecha o menu ao clicar fora
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSignOut = useCallback(async () => {
    setIsMenuOpen(false)
    await signOut()
    navigate('/login', { replace: true })
  }, [signOut, navigate])

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border-subtle bg-base/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted hover:bg-surface-elevated hover:text-text-primary transition-colors lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu size={20} />
      </button>

      {/* Page title */}
      <h1 className="truncate font-display text-[15px] font-semibold text-text-primary sm:text-base">
        {pageTitle}
      </h1>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-1">
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-text-muted hover:bg-surface-elevated hover:text-text-primary transition-colors"
          aria-label="Notificações"
        >
          <Bell size={17} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-negative" />
        </button>

        <div className="mx-1 h-5 w-px bg-border hidden sm:block" />

        {/* User menu */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setIsMenuOpen(o => !o)}
            className="flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-2.5 hover:bg-surface-elevated transition-colors"
            aria-expanded={isMenuOpen}
            aria-haspopup="true"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-base">
              {initials}
            </div>
            <span className="hidden text-[13px] font-medium text-text-primary sm:block max-w-[120px] truncate">
              {displayName}
            </span>
            <ChevronDown
              size={13}
              className={`hidden text-text-muted transition-transform sm:block ${isMenuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full z-50 mt-1.5 w-52 rounded-xl border border-border bg-surface-elevated shadow-2xl shadow-black/40 overflow-hidden">
              <div className="px-3 py-2.5 border-b border-border-subtle">
                <p className="text-[13px] font-semibold text-text-primary truncate">{displayName}</p>
                <p className="text-[11px] text-text-muted truncate">{session?.user.email}</p>
              </div>
              <div className="p-1">
                <button
                  onClick={() => { setIsMenuOpen(false); navigate('/perfil') }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
                >
                  <User size={14} /> Meu perfil
                </button>
                <button
                  onClick={() => { setIsMenuOpen(false); navigate('/configuracoes') }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
                >
                  <Settings size={14} /> Configurações
                </button>
                <div className="my-1 h-px bg-border-subtle" />
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-negative hover:bg-negative-soft transition-colors"
                >
                  <LogOut size={14} /> Sair da conta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
