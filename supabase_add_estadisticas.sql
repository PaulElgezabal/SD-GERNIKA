-- ============================================================
-- SD Gernika — añadir estadísticas de jugador a la tabla jugadores
-- Ejecuta esto en: Supabase → SQL Editor → New query → Run
-- ============================================================

alter table public.jugadores
  add column if not exists partidos_convocados     integer not null default 0,
  add column if not exists partidos_titular         integer not null default 0,
  add column if not exists partidos_suplente        integer not null default 0,
  add column if not exists partidos_jugados         integer not null default 0,
  add column if not exists goles                    integer not null default 0,
  add column if not exists asistencias               integer not null default 0,
  add column if not exists tarjetas_amarillas        integer not null default 0,
  add column if not exists tarjetas_rojas            integer not null default 0,
  add column if not exists tarjetas_amarillas_dobles integer not null default 0;

-- "Media de goles" = goles por partido jugado. Se calcula sola a partir de
-- goles y partidos_jugados, así que no hace falta (ni se puede) editarla
-- a mano: siempre queda consistente con esos dos valores.
alter table public.jugadores
  add column if not exists media_goles numeric(5,2)
  generated always as (
    case when partidos_jugados > 0
      then round(goles::numeric / partidos_jugados, 2)
      else 0
    end
  ) stored;
