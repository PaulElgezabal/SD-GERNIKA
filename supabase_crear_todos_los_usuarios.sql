-- ============================================================
-- SD Gernika — crear TODOS los usuarios de prueba de una vez
-- (staff + jugador). Contraseñas simples porque son solo para pruebas.
-- Ejecuta esto en: Supabase → SQL Editor → New query → Run
--
-- Es seguro volver a ejecutar este script: si alguno de estos
-- usuarios ya existía, lo borra y lo vuelve a crear igual.
-- ============================================================

-- Por si acaso el rol "jugador" todavía no estaba permitido:
alter table public.perfiles drop constraint if exists perfiles_rol_check;
alter table public.perfiles
  add constraint perfiles_rol_check check (rol in ('admin','editor','lector','jugador'));

delete from auth.users where email in (
  'admin@sdgernika.com',
  'entrenador@sdgernika.com',
  'preparadorfisico@sdgernika.com',
  'fisioterapeuta@sdgernika.com',
  'analista@sdgernika.com',
  'delegado@sdgernika.com',
  'jugador@sdgernika.com'
);

select public.crear_usuario('admin@sdgernika.com',            'admin123',      'admin');
select public.crear_usuario('entrenador@sdgernika.com',       'entrenador123', 'editor');
select public.crear_usuario('preparadorfisico@sdgernika.com', 'preparador123', 'editor');
select public.crear_usuario('fisioterapeuta@sdgernika.com',   'fisio123',      'lector');
select public.crear_usuario('analista@sdgernika.com',         'analista123',   'lector');
select public.crear_usuario('delegado@sdgernika.com',         'delegado123',   'editor');
select public.crear_usuario('jugador@sdgernika.com',          'jugador123',    'jugador');

-- Comprueba que han quedado los 7 (más el "prueba@gmail.com" de antes):
select email, rol, created_at from public.perfiles order by created_at desc;
