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

### Backend (API externa)

La API de registros está en `https://landings-back.marcostorresalarcon.com`.  
No forma parte de este despliegue; debe estar desplegada por separado.

### Comandos útiles

```bash
# Instalar Netlify CLI (opcional)
npm i -g netlify-cli

# Iniciar sesión
netlify login

# Desplegar manualmente (producción)
netlify deploy --prod --build

# Probar build localmente
npm run build
```
