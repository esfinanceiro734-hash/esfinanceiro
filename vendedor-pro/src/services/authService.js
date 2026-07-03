import { supabase } from './supabaseClient';

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * A2 FIX: redirectTo usa a URL atual do site em produção.
 * Sem isso, o link de redefinição pode apontar para localhost.
 */
export async function resetPasswordForEmail(email) {
  const redirectTo = `${window.location.origin}/login`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw error;
}
