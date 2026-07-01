import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { FormAlert } from '@/components/auth/FormAlert'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { isValidPassword, PASSWORD_MIN_LENGTH } from '@/utils/validation'

export function ResetPassword() {
  const { updatePassword } = useAuth()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirmPassword?: string }>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  function validate(): boolean {
    const errors: typeof fieldErrors = {}
    if (!isValidPassword(password)) errors.password = `A senha precisa ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`
    if (confirmPassword !== password) errors.confirmPassword = 'As senhas não coincidem.'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    if (!validate()) return

    setIsLoading(true)
    const result = await updatePassword(password)
    setIsLoading(false)

    if (!result.success) {
      setFormError(
        result.message ?? 'Não foi possível redefinir sua senha. O link pode ter expirado — solicite um novo.',
      )
      return
    }

    navigate('/', { replace: true })
  }

  return (
    <AuthLayout title="Definir nova senha" subtitle="Escolha uma nova senha para sua conta.">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {formError && <FormAlert type="error" message={formError} />}

        <Input
          label="Nova senha"
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
          label="Confirmar nova senha"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Repita a nova senha"
          icon={<Lock size={16} />}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={fieldErrors.confirmPassword}
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Redefinir senha
        </Button>
      </form>
    </AuthLayout>
  )
}
