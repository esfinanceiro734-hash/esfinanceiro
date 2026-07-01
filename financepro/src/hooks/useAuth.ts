import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'

/**
 * Acesso à sessão, perfil e ações de autenticação (login, cadastro,
 * logout, recuperação de senha). Deve ser usado dentro de <AuthProvider>.
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um <AuthProvider>')
  }
  return context
}
