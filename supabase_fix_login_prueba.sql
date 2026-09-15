-- ============================================================
-- Arreglo: el usuario de prueba se creó sin fila en auth.identities,
-- por eso el login daba "Database error querying schema".
-- Ejecuta esto en una pestaña NUEVA del SQL Editor, de una sola vez.
-- ============================================================

-- 1) Recrear la función crear_usuario, ahora también con auth.identities.
create or replace function public.crear_usuario(p_email text, p_password text, p_rol text default 'lector')
returns uuid
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  nuevo_id uuid;
begin
  if p_rol not in ('admin','editor','lector') then
    raise exception 'Rol no válido: %. Usa admin, editor o lector.', p_rol;
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

-- 2) Borrar el usuario de prueba incompleto que ya existía
--    (borra en cascada su perfil y cualquier identidad a medias).
delete from auth.users where email = 'prueba@gmail.com';

-- 3) Volver a crearlo, ya con todo lo necesario.
select public.crear_usuario('prueba@gmail.com', 'prueba123', 'admin');
