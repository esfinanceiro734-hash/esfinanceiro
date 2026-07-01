# Banco de dados — FinancePro

Este diretório contém as migrations SQL do banco PostgreSQL usado pelo
FinancePro no Supabase.

```
supabase/migrations/
  0001_initial_schema.sql      tabelas, enums, índices e relacionamentos
  0002_rls_policies.sql        Row Level Security + policies por usuário
  0003_functions_triggers.sql  trigger de criação de perfil + updated_at
```

## Como aplicar

### Opção A — SQL Editor (mais rápido)

1. Acesse o seu projeto em [app.supabase.com](https://app.supabase.com).
2. Abra **SQL Editor → New query**.
3. Cole o conteúdo de `0001_initial_schema.sql`, rode.
4. Repita para `0002_rls_policies.sql` e `0003_functions_triggers.sql`, **nessa ordem**.

### Opção B — Supabase CLI

```bash
npm install -g supabase
supabase login
supabase link --project-ref <SEU_PROJECT_REF>
supabase db push
```

## Depois de aplicar

1. Em **Project Settings → API**, copie a `Project URL` e a `anon public key`.
2. No projeto frontend, crie um arquivo `.env` (use `.env.example` como base):

   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```

3. Reinicie `npm run dev`. Os serviços em `src/services/*.service.ts` já
   estão prontos para ler/gravar nas tabelas reais.

## Modelo de dados

| Tabela          | Relacionamento                                    |
|------------------|----------------------------------------------------|
| `users_profile`  | 1:1 com `auth.users` (criado automaticamente no cadastro) |
| `categories`     | N:1 com `auth.users`                                |
| `transactions`   | N:1 com `auth.users`; N:1 com `categories` (`categoria_id`) |
| `debts`          | N:1 com `auth.users`                                |
| `goals`          | N:1 com `auth.users`                                |
| `investments`    | N:1 com `auth.users`                                |

## Segurança (RLS)

Row Level Security está habilitado em **todas** as tabelas. Cada uma tem
4 policies (`select`, `insert`, `update`, `delete`) que comparam
`auth.uid()` com a coluna `user_id` (ou `id`, no caso de `users_profile`).
Isso garante, no nível do banco, que nenhum usuário autenticado consiga
ler ou alterar dados de outro usuário — mesmo que a regra seja
contornada no frontend.

## Regenerar tipos TypeScript (opcional)

Os tipos em `src/types/database.ts` foram escritos manualmente para
espelhar este schema. Depois de conectar o Supabase CLI, é possível
gerá-los automaticamente e manter 100% de paridade:

```bash
supabase gen types typescript --project-id <SEU_PROJECT_REF> > src/types/database.ts
```

## Configurando o Supabase Auth (login, cadastro, recuperação de senha)

O frontend já está pronto (`src/contexts/AuthContext.tsx`,
`src/pages/auth/*`), mas dois ajustes precisam ser feitos no painel do
Supabase:

1. **Authentication → URL Configuration**
   - `Site URL`: a URL do seu app em produção (ex.: `https://seu-app.netlify.app`).
     Em desenvolvimento, use `http://localhost:5173`.
   - `Redirect URLs`: adicione `http://localhost:5173/redefinir-senha` e a
     versão de produção (`https://seu-app.netlify.app/redefinir-senha`).
     É para essa rota que o e-mail de "recuperar senha" redireciona.

2. **Authentication → Providers → Email**
   - Mantenha **Email** habilitado (padrão).
   - "Confirm email" controla se o usuário precisa confirmar o e-mail
     antes de logar. Se estiver **ativado** (padrão), o cadastro não cria
     sessão imediata — a tela de Cadastro já trata esse caso mostrando
     uma mensagem para checar a caixa de entrada. Se preferir login
     imediato após o cadastro, desative essa opção (recomendado apenas
     em desenvolvimento/demo).
