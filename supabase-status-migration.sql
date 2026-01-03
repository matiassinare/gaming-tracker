-- Script SQL para migrar de 'completed' boolean a 'status' text
-- Ejecutar este script en el SQL Editor de Supabase

-- Agregar columna status
alter table games add column status text default 'pending';

-- Migrar datos existentes: completed=true -> status='completed', completed=false -> status='pending'
update games set status = case 
  when completed = true then 'completed'
  else 'pending'
end;

-- Hacer status NOT NULL después de migrar
alter table games alter column status set not null;
alter table games alter column status set default 'pending';

-- Agregar constraint para validar valores permitidos
alter table games add constraint games_status_check check (status in ('pending', 'playing', 'completed'));

-- Opcional: eliminar columna completed después de verificar que todo funciona
-- alter table games drop column completed;

