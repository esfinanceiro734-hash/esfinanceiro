-- =====================================================================
-- FinancePro — Row Level Security (RLS)
-- Garante que nenhum usuário possa ler, criar, alterar ou apagar dados
-- de outro usuário. Toda regra é baseada em auth.uid().
-- =====================================================================

-- ---------------------------------------------------------------------
-- users_profile
-- ---------------------------------------------------------------------
alter table public.users_profile enable row level security;

create policy "users_profile_select_own"
  on public.users_profile for select
  using (auth.uid() = id);

create policy "users_profile_insert_own"
  on public.users_profile for insert
  with check (auth.uid() = id);

create policy "users_profile_update_own"
  on public.users_profile for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "users_profile_delete_own"
  on public.users_profile for delete
  using (auth.uid() = id);

-- ---------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------
alter table public.categories enable row level security;

create policy "categories_select_own"
  on public.categories for select
  using (auth.uid() = user_id);

create policy "categories_insert_own"
  on public.categories for insert
  with check (auth.uid() = user_id);

create policy "categories_update_own"
  on public.categories for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "categories_delete_own"
  on public.categories for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- transactions
-- ---------------------------------------------------------------------
alter table public.transactions enable row level security;

create policy "transactions_select_own"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "transactions_insert_own"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "transactions_update_own"
  on public.transactions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "transactions_delete_own"
  on public.transactions for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- debts
-- ---------------------------------------------------------------------
alter table public.debts enable row level security;

create policy "debts_select_own"
  on public.debts for select
  using (auth.uid() = user_id);

create policy "debts_insert_own"
  on public.debts for insert
  with check (auth.uid() = user_id);

create policy "debts_update_own"
  on public.debts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "debts_delete_own"
  on public.debts for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- goals
-- ---------------------------------------------------------------------
alter table public.goals enable row level security;

create policy "goals_select_own"
  on public.goals for select
  using (auth.uid() = user_id);

create policy "goals_insert_own"
  on public.goals for insert
  with check (auth.uid() = user_id);

create policy "goals_update_own"
  on public.goals for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "goals_delete_own"
  on public.goals for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- investments
-- ---------------------------------------------------------------------
alter table public.investments enable row level security;

create policy "investments_select_own"
  on public.investments for select
  using (auth.uid() = user_id);

create policy "investments_insert_own"
  on public.investments for insert
  with check (auth.uid() = user_id);

create policy "investments_update_own"
  on public.investments for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "investments_delete_own"
  on public.investments for delete
  using (auth.uid() = user_id);
