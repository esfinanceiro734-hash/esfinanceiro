-- =====================================================================
-- Migração 005 — Corrigir constraint do fechamento_diario
-- O unique(data) permite que apenas 1 usuário registre por dia.
-- Correto: unique(data, usuario_id) — cada usuário tem seu fechamento diário.
-- =====================================================================
alter table public.fechamento_diario drop constraint if exists fechamento_diario_data_key;
alter table public.fechamento_diario add constraint fechamento_diario_data_usuario_key unique (data, usuario_id);
