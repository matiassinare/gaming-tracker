-- Script SQL para configurar autenticación y políticas RLS en Supabase
-- Ejecutar este script en el SQL Editor de Supabase

-- Eliminar la policy vieja
drop policy if exists "Allow all operations for everyone" on games;

-- Agregar columna user_id
alter table games add column user_id uuid references auth.users(id) on delete cascade;

-- Políticas nuevas: cada usuario solo ve sus juegos
create policy "Users can view own games"
  on games for select
  using (auth.uid() = user_id);

create policy "Users can insert own games"
  on games for insert
  with check (auth.uid() = user_id);

create policy "Users can update own games"
  on games for update
  using (auth.uid() = user_id);

create policy "Users can delete own games"
  on games for delete
  using (auth.uid() = user_id);

