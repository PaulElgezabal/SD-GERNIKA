-- ============================================================
-- SD Gernika — añadir el rol "jugador" (solo lectura, igual que "lector"
-- pero con nombre propio para saber quién es quién).
-- Ejecuta esto en: Supabase → SQL Editor → New query → Run
-- ============================================================

-- 1) Permitir "jugador" en la columna rol de perfiles.
alter table public.perfiles drop constraint if exists perfiles_rol_check;
alter table public.perfiles
  add constraint perfiles_rol_check check (rol in ('admin','editor','lector','jugador'));

-- 2) La función crear_usuario también debe aceptar "jugador".
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

-- 3) Cuenta de prueba con rol "jugador" (solo lectura).
delete from auth.users where email = 'jugador@sdgernika.com';
select public.crear_usuario('jugador@sdgernika.com', 'jugador123', 'jugador');

-- Comprueba que quedó bien:
select email, rol from public.perfiles order by created_at desc;
