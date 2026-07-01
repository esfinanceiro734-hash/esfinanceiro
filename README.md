# FinancePro — Guia de Deploy

Guia completo para subir o FinancePro em produção usando **Netlify** (frontend) + **Supabase** (backend/banco).

---

## Pré-requisitos

| Ferramenta | Versão mínima |
|-----------|--------------|
| Node.js | 20.x |
| npm | 10.x |
| Conta Netlify | gratuita |
| Conta Supabase | gratuita |

---

## 1. Supabase — Criar o projeto

1. Acesse [app.supabase.com](https://app.supabase.com) → **New project**.
2. Escolha nome, senha forte e região (**South America – São Paulo** recomendado).
3. Aguarde o provisionamento (~2 min).

### 1.1 Aplicar as migrations

Abra **SQL Editor → New query** e execute em ordem:

```
supabase/migrations/0001_initial_schema.sql
supabase/migrations/0002_rls_policies.sql
supabase/migrations/0003_functions_triggers.sql
```

Alternativa via CLI:
```bash
npm install -g supabase
supabase login
supabase link --project-ref <SEU_PROJECT_REF>
supabase db push
```

### 1.2 Configurar Auth

Em **Authentication → URL Configuration**:

| Campo | Valor |
|-------|-------|
| Site URL | `https://SEU-SITE.netlify.app` |
| Redirect URLs | `https://SEU-SITE.netlify.app/redefinir-senha` |

Em desenvolvimento adicione também `http://localhost:5173` e `http://localhost:5173/redefinir-senha`.

### 1.3 Copiar credenciais

Em **Project Settings → API**:
- `Project URL` → `VITE_SUPABASE_URL`
- `anon public` → `VITE_SUPABASE_ANON_KEY`

### 1.4 Deploy da Edge Function (chat IA)

```bash
supabase functions deploy financial-assistant
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

---

## 2. Netlify — Deploy do frontend

### Opção A — GitHub (CI/CD automático)

1. Push do projeto para GitHub.
2. Netlify → **Add new site → Import from Git**.
3. Netlify detecta o `netlify.toml` automaticamente.
4. Em **Environment variables** adicione:

| Chave | Valor |
|-------|-------|
| `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJh...` |

5. **Deploy site**. ✅

### Opção B — Manual

```bash
npm install
npm run build
# Arraste a pasta dist/ para netlify.com/drop
```

---

## 3. Desenvolvimento local

```bash
cp .env.example .env   # preencha as variáveis
npm install
npm run dev            # http://localhost:5173
npm run build          # build de produção
npm run preview        # pré-visualiza o build
```

---

## 4. Chunks do build (gzip)

| Chunk | Tamanho | Conteúdo |
|-------|---------|----------|
| vendor-react | ~71 KB | React, DOM, Router |
| vendor-charts | ~108 KB | Recharts + D3 |
| vendor-supabase | ~52 KB | Supabase JS |
| vendor-icons | ~5 KB | Lucide React |
| index | ~31 KB | App code |
| **Total** | **~267 KB** | |

---

## 5. Checklist pré-lançamento

- [ ] Migrations aplicadas no Supabase
- [ ] Site URL configurada no Supabase Auth
- [ ] `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no Netlify
- [ ] Edge Function `financial-assistant` publicada
- [ ] `ANTHROPIC_API_KEY` definida no Supabase
- [ ] `npm run build` passa sem erros
- [ ] Login, cadastro e recuperação de senha testados em produção
- [ ] Acesso direto a `/receitas` (e outras rotas) não retorna 404
