-- Script SQL para configurar la base de datos en Supabase
-- Ejecutar este script en el SQL Editor de Supabase

create table games (
  id bigint primary key generated always as identity,
  name text not null,
  platform text not null,
  completed boolean default false,
  created_at timestamp with time zone default now()
);

alter table games enable row level security;

create policy "Allow all operations for everyone"
  on games
  for all
  using (true)
  with check (true);

