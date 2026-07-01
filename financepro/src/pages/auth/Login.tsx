import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { FormAlert } from '@/components/auth/FormAlert'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { isValidEmail } from '@/utils/validation'

interface LocationState {
  from?: { pathname: string }
  reason?: 'idle'
}

export function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const state = location.state as LocationState | null
  const idleMessage = state?.reason === 'idle'
    ? 'Sua sessão expirou por inatividade. Faça login novamente.'
    : null

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  function validate(): boolean {
    const errors: typeof fieldErrors = {}
    if (!isValidEmail(email)) errors.email = 'Informe um e-mail válido.'
    if (!password) errors.password = 'Informe sua senha.'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    if (!validate()) return

    setIsLoading(true)
    const result = await signIn(email, password)
    setIsLoading(false)

    if (!result.success) {
      setFormError(result.message ?? 'Não foi possível entrar. Verifique suas credenciais.')
      return
    }

    const redirectTo = (location.state as LocationState | null)?.from?.pathname ?? '/'
    navigate(redirectTo, { replace: true })
  }

  return (
    <AuthLayout title="Bem-vindo de volta" subtitle="Entre com sua conta para acessar seu painel financeiro.">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {idleMessage && <FormAlert type="error" message={idleMessage} />}
        {formError && <FormAlert type="error" message={formError} />}

        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="voce@email.com"
          icon={<Mail size={16} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
        />

        <Input
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="••••••••"
          icon={<Lock size={16} />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-text-muted hover:text-text-secondary"
              tabIndex={-1}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        <div className="flex justify-end">
          <Link to="/recuperar-senha" className="text-xs font-medium text-accent hover:underline">
            Esqueceu sua senha?
          </Link>
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Entrar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Não tem uma conta?{' '}
        <Link to="/cadastro" className="font-medium text-accent hover:underline">
          Criar conta
        </Link>
      </p>
    </AuthLayout>
  )
}
