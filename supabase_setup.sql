-- ============================================================
-- SD Gernika — creación de la tabla "jugadores" en Supabase
-- Ejecuta este script completo en: Supabase → SQL Editor → New query → Run
-- ============================================================

create table if not exists public.jugadores (
  id                        bigint generated always as identity primary key,
  dorsal                    integer not null unique,
  nombre                    text    not null,
  posicion                  text    not null,
  foto                      text,
  localidad                 text,
  fecha_nacimiento          date,
  partidos_convocados       integer not null default 0,
  partidos_titular          integer not null default 0,
  partidos_suplente         integer not null default 0,
  partidos_jugados          integer not null default 0,
  goles                     integer not null default 0,
  asistencias               integer not null default 0,
  tarjetas_amarillas        integer not null default 0,
  tarjetas_rojas            integer not null default 0,
  tarjetas_amarillas_dobles integer not null default 0
);

-- Por si la tabla ya existía de una ejecución anterior sin estas columnas
alter table public.jugadores
  add column if not exists localidad text;
alter table public.jugadores
  add column if not exists fecha_nacimiento date;
alter table public.jugadores
  add column if not exists partidos_convocados integer not null default 0,
  add column if not exists partidos_titular integer not null default 0,
  add column if not exists partidos_suplente integer not null default 0,
  add column if not exists partidos_jugados integer not null default 0,
  add column if not exists goles integer not null default 0,
  add column if not exists asistencias integer not null default 0,
  add column if not exists tarjetas_amarillas integer not null default 0,
  add column if not exists tarjetas_rojas integer not null default 0,
  add column if not exists tarjetas_amarillas_dobles integer not null default 0;

-- "Media de goles" = goles por partido jugado, calculada automáticamente.
alter table public.jugadores
  add column if not exists media_goles numeric(5,2)
  generated always as (
    case when partidos_jugados > 0
      then round(goles::numeric / partidos_jugados, 2)
      else 0
    end
  ) stored;

-- Row Level Security: la app usa la clave "anon" tanto para leer como
-- para añadir/editar/borrar jugadores (no hay login en esta app).
-- AVISO DE SEGURIDAD: como la clave anon viaja en el HTML del cliente,
-- cualquiera que tenga la URL de la app podrá crear, editar o borrar
-- jugadores. Si más adelante quieres restringir la escritura, sustituye
-- estas políticas "to anon" por "to authenticated" y añade login.
alter table public.jugadores enable row level security;

drop policy if exists "Lectura pública de jugadores" on public.jugadores;
create policy "Lectura pública de jugadores"
  on public.jugadores
  for select
  to anon
  using (true);

drop policy if exists "Alta pública de jugadores" on public.jugadores;
create policy "Alta pública de jugadores"
  on public.jugadores
  for insert
  to anon
  with check (true);

drop policy if exists "Edición pública de jugadores" on public.jugadores;
create policy "Edición pública de jugadores"
  on public.jugadores
  for update
  to anon
  using (true)
  with check (true);

drop policy if exists "Borrado público de jugadores" on public.jugadores;
create policy "Borrado público de jugadores"
  on public.jugadores
  for delete
  to anon
  using (true);

-- Datos de la plantilla (se puede volver a ejecutar sin duplicar filas)
insert into public.jugadores (dorsal, nombre, posicion, foto) values
  (1,  'Gurutz Toña',           'Portero',           'img/jugador_01.jpg'),
  (2,  'Alain Urrutia',         'Lateral derecho',   'img/jugador_02.jpg'),
  (3,  'Aretx Martitegi',       'Lateral izquierdo', 'img/jugador_03.jpg'),
  (4,  'Urko Martija',          'Central izquierdo', 'img/jugador_04.jpg'),
  (5,  'Haritz Atxalandabasoa', 'Central derecho',   'img/jugador_05.jpg'),
  (6,  'Luken Marmol',          'Medio centro',      'img/jugador_06.jpg'),
  (7,  'Dani Urrutia',          'Medio centro',      'img/jugador_07.jpg'),
  (8,  'Xabi López',            'Media punta',       'img/jugador_08.jpg'),
  (9,  'Ager Kortabitarte',     'Extremo derecho',   'img/jugador_09.jpg'),
  (10, 'Aimar Carvajal',        'Medio centro',      'img/jugador_10.jpg'),
  (11, 'Antton Urzelai',        'Extremo derecho',   'img/jugador_11.jpg'),
  (12, 'Oihan Fernández',       'Lateral izquierdo', 'img/jugador_12.jpg'),
  (13, 'Aratz Mendez',          'Portero',           'img/jugador_13.jpg'),
  (14, 'Ugaitz Urrutia',        'Central derecho',   'img/jugador_14.jpg'),
  (15, 'Enaitz Alberdi',        'Extremo izquierdo', 'img/jugador_15.jpg'),
  (16, 'Luken Aranguena',       'Medio centro',      'img/jugador_16.jpg'),
  (17, 'Enaitz Isasi',          'Extremo izquierdo', 'img/jugador_17.jpg'),
  (18, 'Markel Gorostiaga',     'Central izquierdo', 'img/jugador_18.jpg'),
  (19, 'Samuel Correa',         'Delantero punta',   'img/jugador_19.jpg'),
  (20, 'Ouissam Chkairi',       'Extremo derecho',   'img/jugador_20.jpg'),
  (21, 'Joaquín Vázquez',       'Central derecho',   'img/jugador_21.jpg'),
  (22, 'Iker Larruzea',         'Delantero punta',   'img/jugador_22.jpg'),
  (23, 'Aratz Areskurrinaga',   'Delantero punta',   'img/jugador_23.jpg'),
  (24, 'Aimar Zautua',          'Lateral derecho',   'img/jugador_24.jpg'),
  (25, 'Mikel Estévez',         'Portero',           'img/jugador_25.jpg'),
  (26, 'Urko Arriaga',          'Medio centro',      'img/jugador_26.jpg'),
  (27, 'Aimar Beraza',          'Lateral izquierdo', 'img/jugador_27.jpg')
on conflict (dorsal) do update set
  nombre   = excluded.nombre,
  posicion = excluded.posicion,
  foto     = excluded.foto;
