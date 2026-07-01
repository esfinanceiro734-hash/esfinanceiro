import { Component, type ReactNode, type ErrorInfo } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Em produção, envie o erro para um serviço de monitoramento
    // ex: Sentry.captureException(error, { extra: info })
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-base px-4 text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-negative-soft text-negative">
            <AlertTriangle size={26} strokeWidth={2} />
          </div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Algo deu errado
          </h1>
          <p className="mt-2 max-w-sm text-sm text-text-secondary">
            Ocorreu um erro inesperado. Tente recarregar a página. Se o problema persistir, entre em contato com o suporte.
          </p>
          <p className="mt-4 rounded-lg bg-surface px-4 py-2 font-mono text-xs text-text-muted">
            {this.state.error.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-base hover:bg-accent-hover transition-colors"
          >
            Recarregar página
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
