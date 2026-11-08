# KineVida

Aplicación de gestión para una clínica de kinesiología. El backend es una API REST con **Express + MongoDB (Mongoose) + JWT** sobre **Node.js**; el frontend es **HTML, CSS y JavaScript puro**, sin frameworks ni paso de compilación. Se despliega en **Vercel** o en cualquier servidor con Node.js.

## Tecnologías y su papel

| Tecnología | Papel |
|---|---|
| Node.js 22 | Ejecuta el servidor Express y las funciones de Vercel. |
| Express 4 | Servidor HTTP: rutas, middlewares, controladores y archivos estáticos. |
| MongoDB Atlas + Mongoose | Base de datos (colecciones `pacientes`, `kinesios`, `admins`), esquemas y validaciones. |
| JWT (jsonwebtoken) | Autenticación sin sesiones en el servidor: token firmado de 8 horas con `id` y `rol`. |
| bcryptjs | Cifrado de contraseñas (hash con salt). |
| cors | Cabeceras CORS de la API. |
| HTML + CSS + JS (módulos ES) | Frontend en `public/`, sin dependencias. |
| Vercel | Hosting: `public/` por CDN y Express como función serverless. |

**¿Por qué JWT y no Passport?** JWT es *stateless*: el servidor solo verifica la firma, sin guardar sesiones. Eso encaja con serverless, donde cada petición puede caer en una instancia distinta. Passport es una librería de estrategias, no una alternativa a JWT, y sus sesiones necesitarían un almacén compartido.

## Estructura

```
KineVida/
├── api/index.js            Entrada de Vercel: exporta la app Express
├── servidor/
│   ├── app.js              App Express (middlewares, rutas, estáticos)
│   ├── index.js            Arranque con app.listen (Node tradicional)
│   ├── config/db.js        Conexión a MongoDB cacheada
│   ├── modelos/            Paciente, Kinesio, Admin
│   ├── controladores/      Auth, CRUD y búsqueda
│   ├── rutas/              Routers de /api
│   ├── middlewares/        verificarToken, permitirRoles, soloAdmin, errorHandler
│   ├── utilidades/         Helpers de usuarios
│   └── scripts/crearAdmin.js
├── public/                 Frontend estático
│   ├── index, login, registro, dashboard, turnos (.html)
│   ├── css/estilos.css
│   └── js/                 sesion.js (token y fetch) y un script por página
├── vercel.json
└── package.json
```

## Ejecutar en local

Requiere Node.js 20.6 o superior.

```bash
npm install
npm run crear-admin -- "Nombre Apellido" correo@ejemplo.com contraseña
npm run dev
```

Abrir http://localhost:3000. El archivo `.env` debe tener `MONGO_URI` y `JWT_SECRET` (ver `.env.example`). Un solo servidor atiende las páginas y la API.

El primer administrador se crea por consola porque `/registro` solo lo puede usar un admin con sesión iniciada.

## Probar que Express funciona

En PowerShell usar `curl.exe` en lugar de `curl`.

1. Abrir http://localhost:3000/api: debe responder `API REST KineVida ejecutándose correctamente`.
2. Abrir http://localhost:3000/api/inexistente: debe responder `Ruta no encontrada en la API` (esta petición también abre la conexión a MongoDB).
3. `curl.exe -i -X POST http://localhost:3000/api/auth/registro`: debe responder `401`.
4. Login con credenciales falsas: debe responder `401 Credenciales inválidas`.

```
curl.exe -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"x@x.com\",\"password\":\"mal\"}"
```

Si el paso 1 funciona y el 2 devuelve `500`, el problema es la conexión a MongoDB (`MONGO_URI` o el acceso de red de Atlas).

## Desplegar en Vercel

1. Subir el repositorio a GitHub (`.env` queda fuera por `.gitignore`).
2. En Vercel, importar el repositorio. No hace falta comando de build.
3. En *Settings → Environment Variables* cargar `MONGO_URI` y `JWT_SECRET`.
4. En MongoDB Atlas, *Network Access*: permitir `0.0.0.0/0`, porque Vercel no usa una IP fija.
5. Desplegar. Si algo falla, revisar *Deployments → Logs*.

Cómo funciona: `public/` se publica como archivos estáticos (`cleanUrls` sirve `/login` desde `login.html`). `api/index.js` exporta la app Express, que Vercel ejecuta como función serverless, y el rewrite de `vercel.json` envía todo `/api/*` a esa función. La conexión a MongoDB se cachea entre invocaciones.

## Desplegar con Node.js tradicional

```bash
npm install --omit=dev
npm start
```

Definir `MONGO_URI` y `JWT_SECRET` como variables de entorno del servidor (`PORT` es opcional, 3000 por defecto). Express sirve también el frontend de `public/`.

## API

Las rutas protegidas exigen `Authorization: Bearer <token>`. Sin token responden 401; con token inválido o rol sin permiso, 403.

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api` | Público |
| POST | `/api/auth/login` | Público |
| POST | `/api/auth/registro` | **Solo admin** |
| GET | `/api/pacientes`, `/api/pacientes/:id` | Admin y kinesio |
| POST, PUT, DELETE | `/api/pacientes`, `/api/pacientes/:id` | Solo admin |
| GET | `/api/kinesios`, `/api/kinesios/:id` | Admin y kinesio |
| POST, PUT, DELETE | `/api/kinesios`, `/api/kinesios/:id` | Solo admin |
| GET, POST, PUT, DELETE | `/api/admins`, `/api/admins/:id` | Solo admin |
| POST | `/api/respuesta` | Solo admin |

Notas: el `rol` no se puede modificar con PUT; un usuario no puede eliminar su propia cuenta; las contraseñas deben tener al menos 6 caracteres y nunca se devuelven.

## Páginas

| Ruta | Quién accede |
|---|---|
| `/` | Redirige según haya sesión |
| `/login` | Todos |
| `/registro` | Solo admin |
| `/dashboard` | Admin y kinesio |
| `/turnos` | Paciente |

## Consideraciones de seguridad

- El token se guarda en `localStorage`: ante una vulnerabilidad XSS podría robarse. Una mejora posible es usar cookies `httpOnly`.
- El rol viaja dentro del token: un cambio de rol se refleja recién cuando el token vence (8 horas).
- `cors()` acepta cualquier origen; conviene limitarlo si se usa la API desde otros dominios.
- No hay límite de intentos de login (por ejemplo, `express-rate-limit`).
- Las redirecciones del frontend son una comodidad, no seguridad: la validación real ocurre en la API.
