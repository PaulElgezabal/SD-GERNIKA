-- ============================================================
-- SD Gernika — crear usuarios del cuerpo técnico (contraseñas simples,
-- pensadas solo para pruebas — cámbialas antes de usar esto en serio).
-- Ejecuta esto en: Supabase → SQL Editor → New query → Run
--
-- Si ya habías creado alguno de estos usuarios antes (con la contraseña
-- larga que te di la primera vez), este script los borra y los vuelve
-- a crear con la contraseña simple, así que no importa si ya existían.
-- ============================================================

delete from auth.users where email in (
  'admin@sdgernika.com',
  'entrenador@sdgernika.com',
  'preparadorfisico@sdgernika.com',
  'fisioterapeuta@sdgernika.com',
  'analista@sdgernika.com',
  'delegado@sdgernika.com'
);

select public.crear_usuario('admin@sdgernika.com',            'admin123',      'admin');
select public.crear_usuario('entrenador@sdgernika.com',       'entrenador123', 'editor');
select public.crear_usuario('preparadorfisico@sdgernika.com', 'preparador123', 'editor');
select public.crear_usuario('fisioterapeuta@sdgernika.com',   'fisio123',      'lector');
select public.crear_usuario('analista@sdgernika.com',         'analista123',   'lector');
select public.crear_usuario('delegado@sdgernika.com',         'delegado123',   'editor');

-- Comprueba que se han creado bien:
select email, rol, created_at from public.perfiles order by created_at desc;
