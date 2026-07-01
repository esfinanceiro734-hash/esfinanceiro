import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { FormAlert } from '@/components/auth/FormAlert'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { isValidEmail } from '@/utils/validation'

export function ForgotPassword() {
  const { requestPasswordReset } = useAuth()

  const [email, setEmail] = useState('')
  const [fieldError, setFieldError] = useState<string | undefined>()
  const [formError, setFormError] = useState<string | null>(null)
  const [isSent, setIsSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)

    if (!isValidEmail(email)) {
      setFieldError('Informe um e-mail válido.')
      return
    }
    setFieldError(undefined)

    setIsLoading(true)
    const result = await requestPasswordReset(email)
    setIsLoading(false)

    if (!result.success) {
      setFormError(result.message ?? 'Não foi possível enviar o e-mail de recuperação.')
      return
    }

    setIsSent(true)
  }

  return (
    <AuthLayout
      title="Recuperar senha"
      subtitle="Informe seu e-mail e enviaremos um link para redefinir sua senha."
    >
      {isSent ? (
        <FormAlert
          type="success"
          message={`Se houver uma conta para ${email}, você receberá um e-mail com instruções em instantes.`}
        />
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {formError && <FormAlert type="error" message={formError} />}

          <Input
            label="E-mail"
            type="email"
            autoComplete="email"
            placeholder="voce@email.com"
            icon={<Mail size={16} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldError}
          />

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Enviar link de recuperação
          </Button>
        </form>
      )}

      <Link
        to="/login"
        className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft size={14} />
        Voltar para o login
      </Link>
    </AuthLayout>
  )
}
