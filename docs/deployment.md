# Despliegue

## Requisitos

- Node.js 20+
- PostgreSQL 15+
- Cuenta en Vercel (o cualquier host Node.js)

## Variables de Entorno

Ver `.env.example` para la lista completa:

```bash
DATABASE_URL="postgresql://user:password@host:5432/hotel_management?schema=public"
AUTH_SECRET="generar-con-openssl-rand-hex-32"
AUTH_URL="https://tu-dominio.vercel.app"
```

## Despliegue en Vercel

1. Conectar repositorio de GitHub a Vercel
2. Configurar Framework Preset: Next.js
3. Añadir variables de entorno en Vercel Dashboard
4. Migrar BD: `npx prisma migrate deploy`
5. Seed inicial: `npm run seed`

### Build

El proyecto compila con:

```bash
npm run build
```

Build output esperado:

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Generating static pages (17/17)
```

### Notas de producción

- `AUTH_SECRET` debe ser único por entorno (generar con `openssl rand -hex 32`)
- La BD requiere SSL en producción (Vercel Postgres lo maneja automáticamente)
- Las imágenes y assets estáticos se sirven desde Vercel Edge Network
- El seed debe ejecutarse una sola vez; contiene datos demo

## Prisma en producción

```bash
# Aplicar migraciones (en el entorno de producción)
npx prisma migrate deploy

# Regenerar cliente (post-instalación automático en build)
npx prisma generate
```

## Cache y revalidación

- Las páginas de listado se revalidan con `revalidatePath()` tras mutaciones
- El middleware de auth se ejecuta en edge
- Las Server Actions se ejecutan en el servidor (no en edge)

## Monitoreo

- Logs de error en Vercel Dashboard
- Prisma client genera logs de consultas lentas en desarrollo
- Errores críticos se registran con `console.error` en producción
