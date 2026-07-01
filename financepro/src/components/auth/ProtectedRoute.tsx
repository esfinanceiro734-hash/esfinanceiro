import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-base">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
        <TrendingUp size={22} strokeWidth={2} />
      </div>
      <div className="flex gap-1">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  )
}

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <FullScreenLoader />
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <Outlet />
}

export function PublicOnlyRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <FullScreenLoader />
  if (isAuthenticated) return <Navigate to="/" replace />
  return <Outlet />
}
