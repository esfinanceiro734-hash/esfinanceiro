import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { FormAlert } from '@/components/auth/FormAlert'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { isValidEmail, isValidPassword, PASSWORD_MIN_LENGTH } from '@/utils/validation'

interface FieldErrors {
  nome?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  function validate(): boolean {
    const errors: FieldErrors = {}
    if (nome.trim().length < 2) errors.nome = 'Informe seu nome completo.'
    if (!isValidEmail(email)) errors.email = 'Informe um e-mail válido.'
    if (!isValidPassword(password)) errors.password = `A senha precisa ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`
    if (confirmPassword !== password) errors.confirmPassword = 'As senhas não coincidem.'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    setSuccessMessage(null)
    if (!validate()) return

    setIsLoading(true)
    const result = await signUp(nome.trim(), email, password)
    setIsLoading(false)

    if (!result.success) {
      setFormError(result.message ?? 'Não foi possível criar sua conta. Tente novamente.')
      return
    }

    // Se a confirmação de e-mail estiver habilitada no projeto Supabase,
    // ainda não há sessão ativa neste ponto — orientamos o usuário a
    // checar a caixa de entrada. Caso contrário, o onAuthStateChange já
    // populou a sessão e podemos seguir direto para o dashboard.
    setSuccessMessage('Conta criada! Verifique seu e-mail para confirmar o cadastro, se solicitado.')
    setTimeout(() => navigate('/', { replace: true }), 1200)
  }

  return (
    <AuthLayout title="Crie sua conta" subtitle="Comece a organizar suas finanças em poucos minutos.">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {formError && <FormAlert type="error" message={formError} />}
        {successMessage && <FormAlert type="success" message={successMessage} />}

        <Input
          label="Nome completo"
          type="text"
          autoComplete="name"
          placeholder="Seu nome"
          icon={<User size={16} />}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          error={fieldErrors.nome}
        />

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
          autoComplete="new-password"
          placeholder="Mínimo de 6 caracteres"
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

        <Input
          label="Confirmar senha"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Repita sua senha"
          icon={<Lock size={16} />}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={fieldErrors.confirmPassword}
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Criar conta
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Já tem uma conta?{' '}
        <Link to="/login" className="font-medium text-accent hover:underline">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  )
}
