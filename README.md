# KineVida – Sistema de Gestión Clínica

Frontend en **Next.js 14 (App Router)** + API REST en **Express** + **MongoDB (Mongoose)**.
Se despliega en **Vercel como un único proyecto**: Next.js sirve las páginas y la app
Express atiende todas las rutas `/api/*`.

## Estructura

```
├── app/                      # Frontend (páginas de Next.js)
│   ├── layout.js · page.js · globals.css · favicon.ico
│   ├── login/page.js
│   ├── registro/page.js
│   └── dashboard/page.js
├── pages/
│   └── api/[[...ruta]].js    # Puente: entrega /api/* a la app Express
├── servidor/                 # Backend Express (MVC)
│   ├── app.js                # Crea y exporta la app Express
│   ├── index.js              # Arranque local independiente (npm run api)
│   ├── config/db.js          # Conexión a MongoDB (cacheada para serverless)
│   ├── modelos/              # Esquemas Mongoose
│   ├── controladores/        # Lógica de cada recurso
│   ├── rutas/                # Routers de Express
│   ├── middlewares/          # errorHandler, verificarToken
│   └── data/                 # Datos de ejemplo (JSON)
├── public/                   # Archivos estáticos
├── next.config.mjs · tailwind.config.js · postcss.config.mjs · jsconfig.json
├── vercel.json               # Fuerza el preset "Next.js" en Vercel
└── .env.example              # Variables de entorno necesarias
```

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api` | Verificación de la API |
| POST | `/api/auth/registro` | Registro (paciente, kinesio o admin) |
| POST | `/api/auth/login` | Inicio de sesión (devuelve JWT) |
| GET/POST | `/api/pacientes` | Listar / crear pacientes |
| GET/PUT/DELETE | `/api/pacientes/:id` | Ver / actualizar / eliminar paciente |
| GET/POST | `/api/kinesios` | Listar / crear kinesiólogos |
| GET/PUT/DELETE | `/api/kinesios/:id` | Ver / actualizar / eliminar kinesiólogo |
| GET/POST | `/api/admins` | Listar / crear administradores |
| GET/PUT/DELETE | `/api/admins/:id` | Ver / actualizar / eliminar administrador |
| POST | `/api/respuesta` | Buscar usuario por tipo e id |

## Desarrollo local

```bash
npm install
cp .env.example .env      # completar MONGO_URI y JWT_SECRET
npm run dev               # http://localhost:3000 (frontend + API Express en /api)
```

Para levantar solo la API Express (sin Next.js): `npm run api` → http://localhost:4000
(requiere Node.js 20.6 o superior por el flag `--env-file`).

## Deploy en Vercel

1. Subir el repositorio a GitHub e importarlo en Vercel (el preset debe quedar en **Next.js**).
2. En *Settings → Environment Variables* cargar `MONGO_URI` y `JWT_SECRET`.
3. En MongoDB Atlas, *Network Access*: permitir `0.0.0.0/0` (Vercel no tiene IP fija).
4. Deploy. Las páginas y la API quedan en el mismo dominio.
