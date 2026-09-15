-- ============================================================
-- SD Gernika — añadir el campo "localidad" a la tabla jugadores
-- Ejecuta esto en: Supabase → SQL Editor → New query → Run
-- ============================================================

alter table public.jugadores
  add column if not exists localidad text;
