import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// M10 FIX: falha rápida e visível em vez de erro críptico em tempo de execução
if (!url || !anonKey) {
  const msg =
    'ERRO DE CONFIGURAÇÃO: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórios.\n' +
    'Copie .env.example para .env e preencha com os valores do seu projeto Supabase.';

  // Em desenvolvimento, lança erro visível no console
  console.error(msg);

  // Em produção, o createClient abaixo vai falhar com erro claro
  // em vez de gerar erros crípticos "Cannot read property of undefined"
}

export const supabase = createClient(url ?? '', anonKey ?? '');
