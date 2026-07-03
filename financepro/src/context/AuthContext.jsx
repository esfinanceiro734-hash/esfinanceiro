import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erroAuth, setErroAuth] = useState(null);

  const carregarPerfil = useCallback(async (sessao) => {
    if (!sessao) {
      setPerfil(null);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', sessao.user.id)
        .single();

      if (error) {
        // AUDITORIA: não silenciar — registra o erro e deixa perfil null
        // em vez de atribuir papel 'vendedor' por padrão (poderia rebaixar um admin)
        console.error('[AuthContext] Falha ao carregar perfil:', error.message);
        setErroAuth('Não foi possível carregar seu perfil. Tente recarregar a página.');
        setPerfil(null);
        return;
      }

      setPerfil({ ...data, email: sessao.user.email });
      setErroAuth(null);
    } catch (e) {
      console.error('[AuthContext] Exceção ao carregar perfil:', e);
      setErroAuth('Erro inesperado ao carregar perfil.');
      setPerfil(null);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      carregarPerfil(s).finally(() => setCarregando(false));
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      carregarPerfil(s);
    });

    return () => subscription.unsubscribe();
  }, [carregarPerfil]);

  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
    setPerfil(null);
    setErroAuth(null);
  }

  return (
    <AuthContext.Provider value={{
      session,
      perfil,
      carregando,
      erroAuth,
      autenticado: !!session,
      // AUDITORIA: isAdmin só é true se o perfil foi carregado com sucesso
      // e o papel é explicitamente 'admin' — nunca por padrão
      isAdmin: perfil?.papel === 'admin',
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de AuthProvider');
  return ctx;
}
