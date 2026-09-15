-- ============================================================
-- SD Gernika — login (Supabase Auth) + usuarios con roles y permisos
-- Ejecuta esto en: Supabase → SQL Editor → New query → Run
--
-- A partir de este script, la app deja de ser pública: hace falta
-- iniciar sesión para ver la plantilla, y solo ciertos roles pueden
-- añadir/editar/borrar jugadores o fotos.
-- ============================================================

-- pgcrypto suele venir ya activado en Supabase (normalmente en el esquema
-- "extensions", no en "public"); nos aseguramos de que exista.
create extension if not exists pgcrypto with schema extensions;

-- ============================================================
-- 1) PERFILES: guarda el rol de cada usuario
--    Roles disponibles: 'admin', 'editor', 'lector', 'jugador'
--    - admin / editor: pueden añadir, editar y borrar jugadores y fotos.
--    - lector / jugador: solo pueden ver la plantilla (sin edición).
-- ============================================================
-- Si ya existía una tabla "perfiles" creada a mano (p.ej. desde el Table
-- Editor, que por defecto usa "id bigint"), la eliminamos para recrearla
-- con el tipo correcto ("id uuid", enlazado a auth.users). Esta tabla
-- solo guarda roles, así que no hay datos reales que perder aquí.
drop table if exists public.perfiles cascade;

create table public.perfiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  rol        text not null default 'lector' check (rol in ('admin','editor','lector','jugador')),
  created_at timestamptz not null default now()
);

alter table public.perfiles enable row level security;

drop policy if exists "Cada usuario ve su propio perfil" on public.perfiles;
create policy "Cada usuario ve su propio perfil"
  on public.perfiles
  for select
  to authenticated
  using (id = auth.uid());

-- Devuelve el rol del usuario que ha iniciado sesión (para usarlo en
-- las políticas de abajo). "security definer" para poder leer la tabla
-- perfiles aunque la política de arriba solo deje ver el propio perfil.
create or replace function public.rol_actual()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select rol from public.perfiles where id = auth.uid();
$$;

-- ============================================================
-- 2) CREAR USUARIOS: una función para dar de alta usuarios con
--    email + contraseña + rol de un solo golpe, sin salir del SQL Editor.
--
--    Uso (cambia el correo, la contraseña y el rol):
--      select public.crear_usuario('nombre@sdgernika.com', 'UnaClaveSegura123!', 'editor');
--
--    Roles válidos: 'admin', 'editor', 'lector'.
-- ============================================================
create or replace function public.crear_usuario(p_email text, p_password text, p_rol text default 'lector')
returns uuid
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  nuevo_id uuid;
begin
  if p_rol not in ('admin','editor','lector','jugador') then
    raise exception 'Rol no válido: %. Usa admin, editor, lector o jugador.', p_rol;
  end if;

  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data,
    confirmation_token, recovery_token, email_change, email_change_token_new
  ) values (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated', 'authenticated',
    lower(p_email),
    extensions.crypt(p_password, extensions.gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}',
    '', '', '', ''
  )
  returning id into nuevo_id;

  -- El proveedor "email" necesita también una fila en auth.identities
  -- para poder iniciar sesión (si no, da "Database error querying schema").
  insert into auth.identities (
    id, user_id, provider_id, identity_data, provider,
    last_sign_in_at, created_at, updated_at
  ) values (
    gen_random_uuid(),
    nuevo_id,
    nuevo_id::text,
    jsonb_build_object('sub', nuevo_id::text, 'email', lower(p_email)),
    'email',
    now(), now(), now()
  );

  insert into public.perfiles (id, email, rol)
  values (nuevo_id, lower(p_email), p_rol);

  return nuevo_id;
end;
$$;

-- ---------- Crea aquí tu primer usuario administrador ----------
-- Descomenta la línea, cambia el correo y la contraseña, y ejecútala:
-- select public.crear_usuario('tu-correo@sdgernika.com', 'PonAquiUnaClaveSegura123!', 'admin');

-- ============================================================
-- 3) TABLA "jugadores": ahora exige estar logueado.
--    - Lectura: cualquier usuario logueado (cualquier rol).
--    - Alta / edición / borrado: solo 'admin' o 'editor'.
-- ============================================================
drop policy if exists "Lectura pública de jugadores" on public.jugadores;
drop policy if exists "Alta pública de jugadores" on public.jugadores;
drop policy if exists "Edición pública de jugadores" on public.jugadores;
drop policy if exists "Borrado público de jugadores" on public.jugadores;
drop policy if exists "Lectura para usuarios autenticados" on public.jugadores;
drop policy if exists "Alta para admin/editor" on public.jugadores;
drop policy if exists "Edición para admin/editor" on public.jugadores;
drop policy if exists "Borrado para admin/editor" on public.jugadores;

create policy "Lectura para usuarios autenticados"
  on public.jugadores
  for select
  to authenticated
  using (true);

create policy "Alta para admin/editor"
  on public.jugadores
  for insert
  to authenticated
  with check (public.rol_actual() in ('admin','editor'));

create policy "Edición para admin/editor"
  on public.jugadores
  for update
  to authenticated
  using (public.rol_actual() in ('admin','editor'))
  with check (public.rol_actual() in ('admin','editor'));

create policy "Borrado para admin/editor"
  on public.jugadores
  for delete
  to authenticated
  using (public.rol_actual() in ('admin','editor'));

-- ============================================================
-- 4) BUCKET DE FOTOS: mismo criterio (leer si estás logueado,
--    escribir solo admin/editor). El bucket sigue siendo "público"
--    a nivel de archivo (para que las <img> carguen sin token), pero
--    listar/subir/borrar por API exige sesión y rol.
-- ============================================================
drop policy if exists "Lectura pública de fotos de jugadores" on storage.objects;
drop policy if exists "Subida pública de fotos de jugadores" on storage.objects;
drop policy if exists "Edición pública de fotos de jugadores" on storage.objects;
drop policy if exists "Borrado público de fotos de jugadores" on storage.objects;
drop policy if exists "Lectura de fotos para usuarios autenticados" on storage.objects;
drop policy if exists "Subida de fotos para admin/editor" on storage.objects;
drop policy if exists "Edición de fotos para admin/editor" on storage.objects;
drop policy if exists "Borrado de fotos para admin/editor" on storage.objects;

create policy "Lectura de fotos para usuarios autenticados"
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'fotos-jugadores');

create policy "Subida de fotos para admin/editor"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'fotos-jugadores' and public.rol_actual() in ('admin','editor'));

create policy "Edición de fotos para admin/editor"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'fotos-jugadores' and public.rol_actual() in ('admin','editor'))
  with check (bucket_id = 'fotos-jugadores' and public.rol_actual() in ('admin','editor'));

create policy "Borrado de fotos para admin/editor"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'fotos-jugadores' and public.rol_actual() in ('admin','editor'));

-- ============================================================
-- Para crear más usuarios luego, repite esta línea con otro
-- correo/contraseña/rol:
--   select public.crear_usuario('otra-persona@sdgernika.com', 'OtraClave456!', 'lector');
-- ============================================================
