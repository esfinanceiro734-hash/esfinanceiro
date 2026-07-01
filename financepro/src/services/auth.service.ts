import { supabase } from '@/lib/supabase'

export interface AuthResult {
  success: boolean
  message?: string
}

/**
 * Camada fina sobre supabase.auth. Mantida separada do AuthContext para
 * que a lógica de chamada à API fique isolada e fácil de testar.
 */
export const authService = {
  async signUp(nome: string, email: string, password: string): Promise<AuthResult> {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Usado pelo trigger handle_new_user() (supabase/migrations/0003)
        // para popular a tabela users_profile automaticamente.
        data: { full_name: nome },
      },
    })

    if (error) return { success: false, message: error.message }
    return { success: true }
  },

  async signIn(email: string, password: string): Promise<AuthResult> {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { success: false, message: error.message }
    return { success: true }
  },

  async signOut(): Promise<AuthResult> {
    const { error } = await supabase.auth.signOut()
    if (error) return { success: false, message: error.message }
    return { success: true }
  },

  async requestPasswordReset(email: string): Promise<AuthResult> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    })
    if (error) return { success: false, message: error.message }
    return { success: true }
  },

  async updatePassword(newPassword: string): Promise<AuthResult> {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) return { success: false, message: error.message }
    return { success: true }
  },
}
