# Backlog 2026 - Gaming Tracker

Aplicación web para trackear tu backlog de juegos pendientes para 2026. Datos persistentes con Supabase, búsqueda con RAWG e imágenes HD con SteamGridDB.

## Stack Tecnológico

- **React 18** + **Vite**
- **Tailwind CSS**
- **Supabase** (base de datos + backend)
- **RAWG API** (búsqueda de juegos)
- **SteamGridDB** (imágenes HD)

## Setup Inicial

### 1. Clonar e instalar
```bash
git clone tu-repo
cd backlog-2026
npm install
```

### 2. Configurar APIs

#### Supabase
1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ejecutar los scripts SQL en este orden (en el SQL Editor de Supabase):
   - **Primero**: `supabase-setup.sql` - Crea la tabla básica
   - **Segundo**: `supabase-auth-setup.sql` - Configura autenticación y RLS
   - **Tercero**: `supabase-update.sql` - Agrega columna de imagen (si no existe)
   - **Cuarto**: `supabase-status-migration.sql` - Migra de `completed` a `status` (IMPORTANTE)
   
   **Nota**: Si ya tenés la base de datos configurada, solo necesitás ejecutar `supabase-status-migration.sql` para agregar la columna `status`.

#### RAWG API
1. Ir a [rawg.io/apidocs](https://rawg.io/apidocs)
2. Get API Key

#### SteamGridDB API
1. Ir a [steamgriddb.com/profile/preferences/api](https://www.steamgriddb.com/profile/preferences/api)
2. Generate API Key

### 3. Variables de entorno

Crear `.env` en la raíz:
```env
VITE_RAWG_API_KEY=tu-key-rawg
VITE_STEAMGRIDDB_API_KEY=tu-key-steamgriddb
VITE_SUPABASE_URL=tu-url-supabase
VITE_SUPABASE_ANON_KEY=tu-key-supabase
```

### 4. Desarrollo
```bash
npm run dev
```

## Deploy

### Vercel (recomendado)
```bash
npm i -g vercel
vercel
```

Agregar variables de entorno en el dashboard de Vercel.

### Netlify
```bash
npm run build
netlify deploy --prod
```

Agregar variables de entorno en Site Settings.

## Funcionalidades

- ✅ Búsqueda de juegos con RAWG
- ✅ Imágenes HD con SteamGridDB
- ✅ Agregar juegos manualmente
- ✅ Editar juegos (nombre, imagen, plataforma)
- ✅ Estados de juego: Por jugar, Jugando, Completado
- ✅ Modo invitado con LocalStorage (sin login)
- ✅ Migración automática a cuenta cuando te registrás
- ✅ Barra de progreso
- ✅ Límite de 100 juegos por usuario
- ✅ Persistencia con Supabase
- ✅ Sincronización multi-dispositivo
- ✅ Diseño responsive para mobile

## Licencia

MIT