import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {
  ArrowLeftRight, LayoutGrid, Landmark, Target,
  Trophy, Briefcase, LineChart, BarChart3,
  FileText, CalendarRange, User, Settings,
  type LucideIcon,
} from 'lucide-react'
import { AuthProvider } from '@/contexts/AuthContext'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { ProtectedRoute, PublicOnlyRoute } from '@/components/auth/ProtectedRoute'

// ── Lazy-loaded pages ───────────────────────────────────────────────────
const MainLayout    = lazy(() => import('@/components/layout/MainLayout').then(m => ({ default: m.MainLayout })))
const Dashboard     = lazy(() => import('@/pages/Dashboard').then(m => ({ default: m.Dashboard })))
const Receitas      = lazy(() => import('@/pages/Receitas').then(m => ({ default: m.Receitas })))
const Despesas      = lazy(() => import('@/pages/Despesas').then(m => ({ default: m.Despesas })))
const Assistente    = lazy(() => import('@/pages/Assistente').then(m => ({ default: m.Assistente })))
const PlaceholderPage = lazy(() => import('@/pages/PlaceholderPage').then(m => ({ default: m.PlaceholderPage })))
const NotFound      = lazy(() => import('@/pages/NotFound').then(m => ({ default: m.NotFound })))

// Auth pages
const Login         = lazy(() => import('@/pages/auth/Login').then(m => ({ default: m.Login })))
const Register      = lazy(() => import('@/pages/auth/Register').then(m => ({ default: m.Register })))
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword').then(m => ({ default: m.ForgotPassword })))
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword').then(m => ({ default: m.ResetPassword })))

// ── Full-screen loader shown during lazy chunk fetch ────────────────────
function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <span className="text-xs text-text-muted">Carregando...</span>
      </div>
    </div>
  )
}

// ── Placeholder routes (features coming soon) ───────────────────────────
interface PlaceholderRoute {
  path: string
  icon: LucideIcon
  title: string
  description: string
}

const PLACEHOLDER_ROUTES: PlaceholderRoute[] = [
  { path: '/transferencias', icon: ArrowLeftRight, title: 'Transferências',     description: 'Movimentações entre contas e carteiras aparecerão aqui.' },
  { path: '/categorias',     icon: LayoutGrid,     title: 'Categorias',         description: 'Organize receitas e despesas em categorias personalizadas.' },
  { path: '/dividas',        icon: Landmark,       title: 'Minhas Dívidas',     description: 'Acompanhe a evolução das suas dívidas em um só lugar.' },
  { path: '/plano-quitacao', icon: Target,         title: 'Plano de Quitação',  description: 'Estratégias guiadas para quitar suas dívidas mais rápido.' },
  { path: '/metas',          icon: Trophy,         title: 'Metas Financeiras',  description: 'Defina objetivos e acompanhe o progresso de cada um deles.' },
  { path: '/carteira',       icon: Briefcase,      title: 'Carteira',           description: 'Sua carteira de investimentos aparecerá aqui.' },
  { path: '/rentabilidade',  icon: LineChart,      title: 'Rentabilidade',      description: 'Acompanhe o desempenho dos seus investimentos ao longo do tempo.' },
  { path: '/analises',       icon: BarChart3,      title: 'Análises',           description: 'Relatórios detalhados sobre sua saúde financeira.' },
  { path: '/fluxo-de-caixa', icon: FileText,       title: 'Fluxo de Caixa',     description: 'Visão completa de entradas e saídas ao longo do tempo.' },
  { path: '/planejamento',   icon: CalendarRange,  title: 'Planejamento',       description: 'Planeje seu orçamento e antecipe seus próximos compromissos.' },
  { path: '/perfil',         icon: User,           title: 'Perfil',             description: 'Gerencie suas informações pessoais e preferências de conta.' },
  { path: '/configuracoes',  icon: Settings,       title: 'Configurações',      description: 'Ajustes gerais, segurança e integrações da conta.' },
]

// ── App ─────────────────────────────────────────────────────────────────
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* ── Rotas públicas (redireciona se autenticado) ── */}
              <Route element={<PublicOnlyRoute />}>
                <Route path="/login"           element={<Login />} />
                <Route path="/cadastro"        element={<Register />} />
                <Route path="/recuperar-senha" element={<ForgotPassword />} />
              </Route>

              {/* ── Rota de redefinição de senha (token na URL) ── */}
              <Route path="/redefinir-senha" element={<ResetPassword />} />

              {/* ── Rotas protegidas ── */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/"          element={<Dashboard />} />
                  <Route path="/receitas"  element={<Receitas />} />
                  <Route path="/despesas"  element={<Despesas />} />
                  <Route path="/assistente" element={<Assistente />} />

                  {PLACEHOLDER_ROUTES.map(({ path, icon, title, description }) => (
                    <Route
                      key={path}
                      path={path}
                      element={<PlaceholderPage icon={icon} title={title} description={description} />}
                    />
                  ))}
                </Route>
              </Route>

              {/* ── 404 ── */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
