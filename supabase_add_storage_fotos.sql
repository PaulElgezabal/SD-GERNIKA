-- ============================================================
-- SD Gernika — bucket de almacenamiento para fotos de jugadores
-- Ejecuta esto en: Supabase → SQL Editor → New query → Run
-- ============================================================

-- Bucket público llamado "fotos-jugadores" (si no existe ya)
insert into storage.buckets (id, name, public)
values ('fotos-jugadores', 'fotos-jugadores', true)
on conflict (id) do nothing;

-- Políticas de acceso sobre los archivos de ese bucket.
-- AVISO DE SEGURIDAD (igual que con la tabla jugadores): la app no tiene
-- login, así que estas políticas permiten a cualquiera con la URL subir,
-- reemplazar o borrar fotos en este bucket. Si más adelante añades
-- autenticación, cambia "to anon" por "to authenticated".
drop policy if exists "Lectura pública de fotos de jugadores" on storage.objects;
create policy "Lectura pública de fotos de jugadores"
  on storage.objects
  for select
  to anon
  using (bucket_id = 'fotos-jugadores');

drop policy if exists "Subida pública de fotos de jugadores" on storage.objects;
create policy "Subida pública de fotos de jugadores"
  on storage.objects
  for insert
  to anon
  with check (bucket_id = 'fotos-jugadores');

drop policy if exists "Edición pública de fotos de jugadores" on storage.objects;
create policy "Edición pública de fotos de jugadores"
  on storage.objects
  for update
  to anon
  using (bucket_id = 'fotos-jugadores')
  with check (bucket_id = 'fotos-jugadores');

drop policy if exists "Borrado público de fotos de jugadores" on storage.objects;
create policy "Borrado público de fotos de jugadores"
  on storage.objects
  for delete
  to anon
  using (bucket_id = 'fotos-jugadores');
