-- =====================================================================
-- FinancePro — Funções e triggers auxiliares
-- =====================================================================

-- ---------------------------------------------------------------------
-- Cria automaticamente uma linha em users_profile sempre que um novo
-- usuário se cadastra no Supabase Auth.
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users_profile (id, nome, email, avatar)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- Mantém updated_at sincronizado em updates (debts, goals, investments).
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at_debts
  before update on public.debts
  for each row execute function public.set_updated_at();

create trigger set_updated_at_goals
  before update on public.goals
  for each row execute function public.set_updated_at();

create trigger set_updated_at_investments
  before update on public.investments
  for each row execute function public.set_updated_at();
