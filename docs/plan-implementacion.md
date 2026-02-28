# Plan de Implementación por Fases

## Resumen Ejecutivo

Este documento describe el plan por fases para dos iniciativas clave en la plataforma Marcos Torres:

1. **Fase 1**: Configuración de Cursor Agents y Skills para desarrollo asistido por IA
2. **Fase 2**: Página de agendamiento del curso "Multiplica tu Productividad x10 con IA" con Calendly

---

## FASE 1: Cursor Agents y Skills

### Objetivo

Definir reglas, convenciones y contexto para que Cursor AI asista eficientemente en el desarrollo de la plataforma, manteniendo consistencia con la arquitectura y línea gráfica existentes.

### 1.1 Análisis de Requerimientos

| Requerimiento | Descripción |
|---------------|-------------|
| **Stack tecnológico** | Angular 19, Standalone Components, Tailwind CSS, SCSS |
| **Arquitectura** | Páginas en `src/app/pages/`, componentes compartidos en `src/app/shared/` |
| **Estilo visual** | Dark mode, colores neón (cian #00F3FF, violeta #BD00FF), tipografía Inter |
| **Patrones** | Signals para estado, ChangeDetectionStrategy.OnPush, formularios con FormsModule |
| **Rutas** | Configuradas en `app.routes.ts`, rutas descriptivas y SEO-friendly |

### 1.2 Implementación

**Archivo**: `.cursorrules`

Contenido principal:
- Convenciones de nombres (componentes, rutas, servicios)
- Estructura de carpetas y módulos
- Paleta de colores y clases Tailwind recomendadas
- Patrones de formularios y manejo de estado
- Referencia a documentación existente (`docs/linea-grafica.md`)

### 1.3 Skills Definidos

| Skill | Uso en Cursor |
|-------|---------------|
| **Crear landing page** | Seguir estructura Hero → Valor → Formulario/CTA, usar FooterComponent |
| **Añadir ruta** | Registrar en `app.routes.ts`, usar path descriptivo |
| **Formulario con backend** | Inyectar WorkshopService o servicio correspondiente, manejar errores |
| **Estilos** | Preferir Tailwind, variables `primary-neonCyan`, `primary-neonViolet` |
| **Responsive** | Mobile-first, breakpoints `md:`, `lg:`, `xl:` |

### 1.4 Criterios de Éxito

- [ ] Archivo `.cursorrules` creado y versionado
- [ ] Nuevas features generadas por Cursor siguen la línea gráfica
- [ ] Reducción de iteraciones al pedir cambios de estilo o estructura

---

## FASE 2: Página de Agendamiento del Curso con Calendly

### Objetivo

Crear una landing page para el curso **"Multiplica tu Productividad x10 con Inteligencia Artificial"** que permita a los usuarios agendar su fecha y hora mediante el widget embebido de Calendly.

### 2.1 Información del Curso (del flyer promocional)

| Campo | Valor |
|-------|-------|
| **Título** | Multiplica tu Productividad x10 con Inteligencia Artificial |
| **Duración** | 4 horas en 2 días |
| **Precio** | S/ 99 (antes S/ 900) |
| **Fechas** | A coordinar en Marzo |
| **Beneficio** | Se entregará la grabación de la clase |
| **Instructor** | Marcos Torres |
| **Contacto** | WhatsApp: 975760418 |
| **URL Calendly** | https://calendly.com/marcostor13/new-meeting |

### 2.2 Contenido de Valor (del flyer)

- Fábrica de Contenido Visual: imágenes y flyers profesionales
- Máquina de Videos: videos optimizados para redes
- Piloto Automático en Redes: publicar estratégicamente
- Gestión y Persuasión: documentos y presentaciones de impacto
- Potencia tu negocio: páginas web profesionales en minutos

### 2.3 Implementación Técnica

**Ruta**: `/curso-productividad-ia` o `/agendar-curso-ia`

**Componentes**:
- `CursoProductividadIaComponent` en `src/app/pages/curso-productividad-ia/`
- Header minimalista con logo
- Sección hero con imagen promocional y datos del curso
- Widget Calendly embebido
- CTA WhatsApp y footer

**Widget Calendly**:
```html
<div class="calendly-inline-widget" 
     data-url="https://calendly.com/marcostor13/new-meeting?hide_event_type_details=1&hide_gdpr_banner=1" 
     style="min-width:320px;height:700px;"></div>
<script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
```

**Consideraciones**:
- Cargar script de Calendly dinámicamente (Angular no ejecuta scripts inline por defecto)
- Usar `DomSanitizer` o cargar script en `index.html` / `ngOnInit`
- Diseño responsive: imagen y widget apilados en móvil, lado a lado en desktop

### 2.4 Estilo Visual

- Fondo con gradiente morado (alineado al flyer)
- Imagen promocional destacada
- Tipografía Inter, acentos en amarillo/dorado para precios y CTAs
- Botón WhatsApp con color #25D366

### 2.5 Criterios de Éxito

- [x] Página accesible en `/curso-productividad-ia`
- [x] Widget Calendly funcional y responsive
- [x] Imagen promocional visible
- [x] Información del curso clara y CTA a WhatsApp visible

### 2.6 Implementación Realizada

- **Componente**: `CursoProductividadIaComponent` en `src/app/pages/curso-productividad-ia/`
- **Rutas**: `/curso-productividad-ia` (principal), `/agendar-curso-ia` (redirect)
- **Imagen**: `public/Post de Instagram Promoción Celular Moderno Morado (5).png`
- **Calendly**: Script cargado dinámicamente en `ngOnInit`, widget con `data-url` configurado

---

## Cronograma Sugerido

| Fase | Tarea | Estimación |
|------|-------|------------|
| 1 | Crear y validar `.cursorrules` | 1 sesión |
| 2 | Crear componente CursoProductividadIa | 1 sesión |
| 2 | Integrar Calendly y estilizar | 1 sesión |
| 2 | Pruebas y ajustes responsive | 0.5 sesión |

---

## Referencias

- [Línea Gráfica](./linea-grafica.md)
- [Netlify Deploy](./netlify-deploy.md)
- [Calendly Embed Docs](https://help.calendly.com/hc/en-us/articles/223195488-Embed-options-overview)
