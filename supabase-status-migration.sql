-- Script SQL para migrar de 'completed' boolean a 'status' text
-- Ejecutar este script en el SQL Editor de Supabase
-- IMPORTANTE: Ejecutar después de supabase-setup.sql y supabase-auth-setup.sql

-- Verificar y agregar columna status si no existe
do $$
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_name = 'games' and column_name = 'status'
  ) then
    alter table games add column status text default 'pending';
  end if;
end $$;

-- Migrar datos existentes: completed=true -> status='completed', completed=false -> status='pending'
-- Solo si la columna completed existe
do $$
begin
  if exists (
    select 1 from information_schema.columns 
    where table_name = 'games' and column_name = 'completed'
  ) then
    update games set status = case 
      when completed = true then 'completed'
      else 'pending'
    end
    where status is null or status = 'pending';
  end if;
end $$;

-- Hacer status NOT NULL después de migrar
alter table games alter column status set not null;
alter table games alter column status set default 'pending';

-- Agregar constraint para validar valores permitidos (si no existe)
do $$
begin
  if not exists (
    select 1 from pg_constraint 
    where conname = 'games_status_check'
  ) then
    alter table games add constraint games_status_check check (status in ('pending', 'playing', 'completed'));
  end if;
end $$;

-- Opcional: eliminar columna completed después de verificar que todo funciona
-- Descomentar cuando estés seguro de que todo funciona correctamente
-- alter table games drop column if exists completed;

