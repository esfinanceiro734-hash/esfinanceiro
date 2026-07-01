-- =====================================================================
-- FinancePro — Schema inicial
-- Tabelas: users_profile, categories, transactions, debts, goals, investments
-- Todas as tabelas (exceto users_profile) referenciam auth.users via user_id.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Extensões
-- ---------------------------------------------------------------------
create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ---------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------
create type transaction_type as enum ('receita', 'despesa');
create type debt_status as enum ('aberta', 'negociando', 'quitada');

-- ---------------------------------------------------------------------
-- users_profile
-- Perfil público do usuário, 1:1 com auth.users.
-- ---------------------------------------------------------------------
create table public.users_profile (
  id          uuid primary key references auth.users (id) on delete cascade,
  nome        text not null,
  email       text not null unique,
  avatar      text,
  created_at  timestamptz not null default now()
);

comment on table public.users_profile is 'Perfil público do usuário, espelha auth.users (1:1).';

-- ---------------------------------------------------------------------
-- categories
-- Categorias de receita/despesa criadas por cada usuário.
-- ---------------------------------------------------------------------
create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  nome        text not null,
  tipo        transaction_type not null,
  created_at  timestamptz not null default now(),

  constraint categories_user_nome_tipo_unique unique (user_id, nome, tipo)
);

create index categories_user_id_idx on public.categories (user_id);

-- ---------------------------------------------------------------------
-- transactions
-- Lançamentos de receita/despesa. "categoria" é implementada como
-- relacionamento (categoria_id) para garantir integridade referencial,
-- conforme solicitado em "Relacionamentos".
-- ---------------------------------------------------------------------
create table public.transactions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  tipo         transaction_type not null,
  categoria_id uuid references public.categories (id) on delete set null,
  descricao    text,
  valor        numeric(12, 2) not null check (valor > 0),
  data         date not null default current_date,
  created_at   timestamptz not null default now()
);

create index transactions_user_id_idx on public.transactions (user_id);
create index transactions_categoria_id_idx on public.transactions (categoria_id);
create index transactions_data_idx on public.transactions (data);

-- ---------------------------------------------------------------------
-- debts
-- Dívidas do usuário e seu plano de pagamento.
-- ---------------------------------------------------------------------
create table public.debts (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  nome_divida    text not null,
  instituicao    text,
  valor_total    numeric(12, 2) not null check (valor_total >= 0),
  juros          numeric(5, 2) not null default 0 check (juros >= 0), -- % ao mês
  parcelas       integer not null default 1 check (parcelas > 0),
  valor_parcela  numeric(12, 2) not null check (valor_parcela >= 0),
  status         debt_status not null default 'aberta',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index debts_user_id_idx on public.debts (user_id);

-- ---------------------------------------------------------------------
-- goals
-- Metas financeiras do usuário.
-- ---------------------------------------------------------------------
create table public.goals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  nome        text not null,
  valor_meta  numeric(12, 2) not null check (valor_meta > 0),
  valor_atual numeric(12, 2) not null default 0 check (valor_atual >= 0),
  prazo       date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index goals_user_id_idx on public.goals (user_id);

-- ---------------------------------------------------------------------
-- investments
-- Carteira de investimentos do usuário.
-- ---------------------------------------------------------------------
create table public.investments (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  nome           text not null,
  tipo           text not null, -- ex: Renda Fixa, Ações, Fundos, Cripto
  valor          numeric(12, 2) not null check (valor >= 0),
  rentabilidade  numeric(6, 2) not null default 0, -- % acumulada
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index investments_user_id_idx on public.investments (user_id);
