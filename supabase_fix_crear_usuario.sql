-- ============================================================
-- Arreglo puntual de la función crear_usuario (pgcrypto en "extensions")
-- Ejecuta esto en una pestaña NUEVA del SQL Editor de Supabase.
-- ============================================================

-- 1) Diagnóstico: en qué esquema está instalado pgcrypto en tu proyecto.
--    Mira el resultado antes de seguir: debería decir "extensions".
select extname, extnamespace::regnamespace as esquema
from pg_extension
where extname = 'pgcrypto';

-- 2) Recrea la función usando ese esquema explícitamente.
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
    confirmation_token, recovery_token
  ) values (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated', 'authenticated',
    lower(p_email),
    extensions.crypt(p_password, extensions.gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}',
    '', ''
  )
  returning id into nuevo_id;

  insert into public.perfiles (id, email, rol)
  values (nuevo_id, lower(p_email), p_rol);

  return nuevo_id;
end;
$$;

-- 3) Ahora sí, crea el usuario de prueba:
select public.crear_usuario('prueba@gmail.com', 'prueba123', 'admin');
