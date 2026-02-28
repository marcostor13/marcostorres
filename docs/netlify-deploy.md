# Despliegue en Netlify

## Configuración implementada

El proyecto está listo para desplegarse en Netlify con un solo `git push`.

### Archivos de configuración

- **`netlify.toml`**: Define el comando de build, directorio de publicación, redirects SPA y headers.
- **`.nvmrc`**: Fija Node.js 20 para builds consistentes.

### Pasos para conectar el repositorio

1. **Crear cuenta en Netlify** (si no la tienes): [netlify.com](https://netlify.com)

2. **Conectar el repositorio Git**
   - En Netlify: *Add new site* → *Import an existing project*
   - Conecta GitHub/GitLab/Bitbucket y selecciona este repositorio

3. **Configuración automática**
   Netlify detectará el `netlify.toml` y usará:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/marcostorres/browser`
   - **Node version**: 20 (via `.nvmrc`)

4. **Desplegar**
   - Cada `git push` a la rama principal dispara un nuevo despliegue
   - Las ramas secundarias generan *Deploy Previews*

### Backend (Netlify Functions + MongoDB)

- **Registro del curso** (`/api/course-registration`): Persiste en MongoDB Atlas.
- **Auth JWT** (`/api/auth/*`): Login, registro y verificación de token.
- **WhatsApp Cloud API** (`/api/whatsapp-*`): Cuentas, templates, envío y webhook de mensajes.

**Variables de entorno en Netlify** (*Site settings* → *Environment variables*):
- `MONGODB_URI`: URI de MongoDB Atlas
- `JWT_SECRET`: Cadena secreta para firmar tokens (usa una segura en producción)

**Desarrollo local**: 
- **`npm start`** o **`bun start`**: Solo Angular. Abre **`http://localhost:4200`**. Para API en local, usa `apiBaseUrl` apuntando a tu sitio en Netlify.
- **`npm run dev:netlify`**: Angular + funciones API. **IMPORTANTE: abre siempre `http://localhost:4200`** (nunca 8888). El puerto 8888 solo sirve para las funciones; si abres 8888 verás el error "Failed to parse source for import analysis".

**Windows + pnpm**: Si ves `EPERM: operation not permitted, symlink` al ejecutar `netlify dev`, es una limitación de Windows con symlinks. Solución:
1. **Recomendado**: Activa el **Modo desarrollador** en Windows (Configuración → Privacidad y seguridad → Para desarrolladores → Modo de desarrollador). Así se permiten symlinks sin ser administrador.
2. **Alternativa**: Ejecuta PowerShell o CMD **como administrador** y lanza `bun start` desde ahí.
3. **Solo frontend**: Si no necesitas el backend en local, usa `bun run serve` (solo Angular en `http://localhost:4200`). El registro y el login funcionarán en producción (Netlify).
4. **Evitar "Could not proxy request"**: Si al usar `ng serve` o `bun run serve` ves ese error al hacer login/registro, es porque el proxy intenta conectar con `localhost:8888` y no hay nada ahí. **Solución**: En `src/environments/environment.development.ts` asigna tu URL de Netlify a `apiBaseUrl`, por ejemplo: `apiBaseUrl: 'https://tu-sitio.netlify.app'`. Reinicia `ng serve`. Las peticiones irán directas a tu API en Netlify (sin proxy).

**Panel admin**: `/admin` (requiere login). Rutas: `/login`, `/register`.

**Webhook WhatsApp**: Configura en Meta `https://tu-dominio.netlify.app/api/whatsapp-webhook` con el `verify_token` de cada cuenta.

### Comandos útiles

```bash
# Desarrollo: Angular + backend (ya incluido en bun start)
bun start
# o: npm start

# Iniciar sesión
netlify login

# Desplegar manualmente (producción)
netlify deploy --prod --build

# Probar build localmente
npm run build
```
