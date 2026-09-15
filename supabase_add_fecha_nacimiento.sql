-- ============================================================
-- SD Gernika — añadir el campo "fecha_nacimiento" a la tabla jugadores
-- Ejecuta esto en: Supabase → SQL Editor → New query → Run
-- ============================================================

alter table public.jugadores
  add column if not exists fecha_nacimiento date;
