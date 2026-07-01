import { useState, useCallback } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { SessionTimeoutModal } from '@/components/ui/SessionTimeoutModal'
import { useIdleTimeout } from '@/hooks/useIdleTimeout'
import { useAuth } from '@/hooks/useAuth'

export function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false)
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleIdle = useCallback(async () => {
    setShowTimeoutWarning(false)
    await signOut()
    navigate('/login', {
      replace: true,
      state: { reason: 'idle' },
    })
  }, [signOut, navigate])

  const handleWarn = useCallback(() => {
    setShowTimeoutWarning(true)
  }, [])

  const handleStay = useCallback(() => {
    setShowTimeoutWarning(false)
    // Reinicia os timers ao fechar o modal (qualquer interação já faria isso)
  }, [])

  useIdleTimeout({ onIdle: handleIdle, onWarn: handleWarn })

  return (
    <>
      <div className="flex min-h-screen bg-base">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Header onMenuClick={() => setIsSidebarOpen(true)} />

          <main className="flex-1 overflow-y-auto px-4 pb-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[1440px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <SessionTimeoutModal
        isOpen={showTimeoutWarning}
        onStay={handleStay}
        onLeave={handleIdle}
      />
    </>
  )
}
