# Línea Gráfica de la Plataforma

## 📋 Índice

1. [Paleta de Colores](#paleta-de-colores)
2. [Tipografía](#tipografía)
3. [Espaciado y Tamaños](#espaciado-y-tamaños)
4. [Componentes UI](#componentes-ui)
5. [Animaciones](#animaciones)
6. [Responsive Design](#responsive-design)
7. [Buenas Prácticas](#buenas-prácticas)

---

## 🎨 Paleta de Colores

### Colores Principales

La plataforma utiliza una paleta de colores oscura con acentos vibrantes que transmiten modernidad y tecnología.

#### Colores Base (SCSS Variables)

```scss
$color1: #0e0b16;  // Negro oscuro (Fondo principal)
$color2: #a239ca;  // Púrpura vibrante (Acento principal)
$color3: #4717f6;  // Azul eléctrico (Acento secundario)
$color4: #e7dfdd;  // Beige claro (Texto sobre fondos oscuros)
```

#### Colores en Tailwind Config

```javascript
primary: {
  dark: "#0e0b16",      // Fondo principal
  medium: "#1a1625",    // Fondo secundario (modales)
  purple: "#a239ca",    // Acento púrpura
  blue: "#4717f6",      // Acento azul
  light: "#e7dfdd",     // Texto claro
}
```

### Uso de Colores

#### Fondos
- **Fondo Principal**: `#0e0b16` (color1) - Usado en hero sections y áreas principales
- **Fondo Secundario**: `#1a1625` (primary.medium) - Usado en modales y overlays
- **Gradientes**: Combinación de `#a239ca` → `#4717f6` para secciones destacadas

#### Textos
- **Texto Principal**: `#ffffff` (blanco) - Sobre fondos oscuros
- **Texto Secundario**: `#e7dfdd` (color4) - Texto sobre fondos oscuros con menor contraste
- **Texto en Cards**: `#0e0b16` (color1) - Texto sobre fondos claros

#### Acentos
- **Botones Primarios**: `#a239ca` (color2) con hover a `#e7dfdd`
- **Botones Secundarios**: `#4717f6` (color3) con hover a `#e7dfdd`
- **Bordes**: `rgba(255, 255, 255, 0.1)` para elementos sutiles

### Colores de Estado

- **Éxito**: `#22c55e` (verde) - Mensajes de éxito
- **Error**: `#ef4444` (rojo) - Mensajes de error
- **Información**: `#3b82f6` (azul) - Mensajes informativos
- **WhatsApp**: `#25d366` - Botones de WhatsApp
- **Google Calendar**: `#4285f4` - Botones de Google Calendar
- **Outlook Calendar**: `#0078d4` - Botones de Outlook Calendar

---

## 📝 Tipografía

### Familias de Fuentes

#### Fuente Principal: Inter
```css
font-family: "Inter", system-ui, sans-serif;
```

**Uso**: Texto general, títulos, botones, formularios, navegación.

**Pesos disponibles**:
- 100-900 (variable font)

**Características**:
- Diseñada para interfaces digitales
- Excelente legibilidad en pantallas
- Soporte completo de caracteres latinos

#### Fuente Monospace: Source Code Pro
```css
font-family: "Source Code Pro", monospace;
```

**Uso**: Código, elementos técnicos, preformateados.

**Pesos disponibles**:
- 200-900 (variable font)

### Tamaños de Tipografía

#### Escala Tipográfica

| Elemento | Tamaño Desktop | Tamaño Mobile | Peso |
|----------|----------------|---------------|------|
| H1 Principal | `text-6xl` (3.75rem / 60px) | `text-3xl` (1.875rem / 30px) | `font-bold` (700) |
| H1 Secciones | `text-7xl` (4.5rem / 72px) | `text-3xl` (1.875rem / 30px) | `font-bold` (700) |
| H2 | `text-5xl` (3rem / 48px) | `text-xl` (1.25rem / 20px) | `font-bold` (700) |
| H3 | `text-2xl` (1.5rem / 24px) | `text-lg` (1.125rem / 18px) | `font-semibold` (600) |
| Párrafo | `text-lg` (1.125rem / 18px) | `text-base` (1rem / 16px) | `font-normal` (400) |
| Botones | `text-base` (1rem / 16px) | `text-base` (1rem / 16px) | `font-semibold` (600) |
| Labels | `text-sm` (0.875rem / 14px) | `text-sm` (0.875rem / 14px) | `font-semibold` (600) |
| Texto pequeño | `text-xs` (0.75rem / 12px) | `text-xs` (0.75rem / 12px) | `font-normal` (400) |

#### Clases Tailwind Utilizadas

- `text-3xl` - Títulos móviles
- `text-5xl` - Títulos de sección móviles
- `text-6xl` - Títulos principales desktop
- `text-7xl` - Títulos grandes desktop
- `text-2xl` - Subtítulos desktop
- `text-lg` - Párrafos destacados
- `text-base` - Texto normal
- `text-sm` - Texto pequeño
- `text-xs` - Texto muy pequeño

### Line Height

- **Títulos**: `line-height: 1.2` (120%)
- **Párrafos**: `line-height: 1.6` (160%)
- **Botones**: `line-height: 1.5` (150%)

---

## 📏 Espaciado y Tamaños

### Sistema de Espaciado (Tailwind)

La plataforma utiliza el sistema de espaciado estándar de Tailwind basado en múltiplos de 4px:

| Clase | Valor | Pixels |
|-------|-------|--------|
| `p-0` | 0 | 0px |
| `p-1` | 0.25rem | 4px |
| `p-2` | 0.5rem | 8px |
| `p-4` | 1rem | 16px |
| `p-5` | 1.25rem | 20px |
| `p-6` | 1.5rem | 24px |
| `p-7` | 1.75rem | 28px |
| `p-8` | 2rem | 32px |

### Padding y Margin

#### Padding Común
- **Cards**: `p-4` (mobile) / `p-6` (desktop)
- **Botones**: `px-5 py-2` / `px-7 py-2` / `px-5 py-2`
- **Contenedores**: `px-4` (mobile) / `px-7` o `px-8` (desktop)
- **Modales**: `p-5` / `p-2rem` (32px)

#### Margin Común
- **Secciones**: `mt-4`, `mt-8`, `mb-8`
- **Elementos**: `gap-2`, `gap-4`, `gap-5`, `gap-6`
- **Espaciado vertical**: `py-8`, `py-5`

### Border Radius

| Clase | Valor | Uso |
|-------|-------|-----|
| `border-round-3xl` | 1.5rem (24px) | Botones de navegación |
| `border-radius: 10px` | 10px | Botones principales, inputs |
| `border-radius: 12px` | 12px | Cards, modales |
| `border-radius: 16px` | 16px | Modales grandes |
| `border-radius: 20px` | 20px | Cards de servicios |
| `border-radius: 50%` | 50% | Botones circulares, avatares |

### Tamaños de Componentes

#### Botones
- **Altura estándar**: `padding: 10px 20px` (40px aprox)
- **Altura grande**: `padding: 1rem 2rem` (48px aprox)
- **Botones circulares**: `48px × 48px` (carousel controls)

#### Cards
- **Cards de servicios**: `300px × 270px` (desktop) / `170px × 170px` (tablet)
- **Cards de agentes**: `300px × 700px` (desktop) / `160px × 260px` (tablet)
- **Cards de carousel**: Altura fija `300px` (desktop) / `200px` (mobile)

#### Inputs
- **Altura estándar**: `padding: 0.875rem 1rem` (44px aprox)
- **Ancho**: `100%` del contenedor padre

#### Modales
- **Ancho máximo**: `500px`
- **Padding**: `2rem` (32px)
- **Border radius**: `16px`

---

## 🧩 Componentes UI

### Botones

#### Botón Primario (btn1)

```scss
.btn1 {
  background-color: #a239ca;        // color2
  color: #e7dfdd;                    // color4
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #e7dfdd;       // color4
    color: #0e0b16;                  // color1
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
}
```

**Uso**: Acciones principales, CTAs, envío de formularios.

#### Botón Secundario (btn2)

```scss
.btn2 {
  background-color: #4717f6;         // color3
  color: #e7dfdd;                    // color4
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  margin: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #e7dfdd;       // color4
    color: #0e0b16;                  // color1
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
}
```

**Uso**: Acciones secundarias, alternativas.

#### Botón de Gradiente (Modal)

```scss
.submit-button {
  background: linear-gradient(135deg, #a239ca 0%, #4717f6 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(162, 57, 202, 0.3);
  }
}
```

### Cards

#### Card de Servicio

```scss
.service {
  border: solid 1px white;
  border-radius: 20px;
  width: 300px;
  height: 270px;
  padding: 1.5rem; // p-6 desktop / p-4 mobile
}
```

**Características**:
- Borde blanco sólido de 1px
- Fondo transparente sobre gradiente
- Contenido centrado vertical y horizontalmente
- Responsive: se adapta a diferentes tamaños de pantalla

#### Card de Agente

```scss
.agent {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 300px;
  height: 700px;
  border-radius: 20px;
  border: solid 1px white;
}
```

**Características**:
- Imagen de fondo con overlay de texto
- Contenido alineado al final (bottom)
- Borde blanco para contraste

### Inputs

#### Input Estándar

```scss
input {
  width: 100%;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #a239ca;
    background: rgba(255, 255, 255, 0.08);
  }
}
```

**Características**:
- Fondo semi-transparente
- Borde sutil que se intensifica en focus
- Placeholder con opacidad reducida
- Focus con color de acento púrpura

### Modales

#### Modal Overlay

```scss
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 1000;
}
```

#### Modal Content

```scss
.modal-content {
  background: linear-gradient(135deg, #0e0b16 0%, #1a1625 100%);
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}
```

### Navegación

#### Header Navigation Items

```scss
.option {
  color: white;
  text-decoration: none;
  border: 1px solid white;
  border-radius: 3xl; // 24px
  padding: 0.5rem 1.25rem; // px-5 py-2
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #e7dfdd;  // color4
    color: #0e0b16;            // color1
  }
}
```

### Chat

#### Mensajes del Chat

```scss
.message-local {
  background-color: #a239ca;  // color2
  color: #e7dfdd;            // color4
  padding: 10px;
  border-radius: 10px;
  max-width: 70%;
}

.message-remote {
  background-color: #4717f6;  // color3
  color: #e7dfdd;            // color4
  padding: 10px;
  border-radius: 10px;
  max-width: 70%;
}
```

#### Contenedor de Chat

```scss
.chat {
  background-color: #e7dfdd;  // color4
  color: #0e0b16;            // color1
  border-radius: 10px;
  min-height: 400px;
  height: 400px;
  overflow-y: auto;
  padding: 1.25rem; // p-5
}
```

### Carousel

#### Controles del Carousel

```scss
.control-btn {
  background: transparent;
  border: 2px solid #e7dfdd;  // color4
  color: #e7dfdd;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #a239ca;  // color2
    color: #e7dfdd;      // color4
    transform: scale(1.1);
  }
}
```

#### Items del Carousel

```scss
.carousel-item {
  border: 2px solid #0e0b16;  // color1
  border-radius: 12px;
  background: #e7dfdd;        // color4
  padding: 2rem;
  height: 300px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

---

## ✨ Animaciones

### Animaciones de Entrada

#### Fade In

```scss
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  opacity: 0;
  animation: fadeIn 0.8s ease-in forwards;
}
```

#### Fade In Down

```scss
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-down {
  opacity: 0;
  animation: fadeInDown 0.8s ease-out forwards;
}
```

#### Fade In Up

```scss
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
  animation-delay: 0.3s;
}
```

#### Fade In Right

```scss
@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.fade-in-right {
  opacity: 0;
  animation: fadeInRight 0.8s ease-out forwards;
  animation-delay: 0.5s;
}
```

### Animaciones de Tailwind

#### Fade In Up con Delays

```javascript
animation: {
  "fade-in-up": "fadeInUp 0.8s ease-out forwards",
  "fade-in-up-delay-1": "fadeInUp 0.8s ease-out forwards 0.2s",
  "fade-in-up-delay-2": "fadeInUp 0.8s ease-out forwards 0.4s",
  "fade-in-up-delay-3": "fadeInUp 0.8s ease-out forwards 0.6s",
}
```

#### Glow Animation

```scss
@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(162, 57, 202, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(162, 57, 202, 0.6);
  }
}
```

### Transiciones

#### Transiciones Estándar

- **Duración**: `0.3s` para la mayoría de elementos
- **Easing**: `ease` o `ease-out` para animaciones suaves
- **Propiedades**: `all` para transiciones completas

**Ejemplos**:
```scss
transition: all 0.3s ease;        // Botones, hover
transition: opacity 0.3s ease;     // Overlays
transition: transform 0.3s ease;  // Transformaciones
```

### Efectos Hover

#### Botones
- `transform: translateY(-2px)` - Elevación sutil
- `box-shadow` - Sombra para profundidad
- Cambio de color de fondo

#### Cards
- `transform: scale(1.05)` - Escalado ligero (si aplica)
- Transiciones suaves de bordes y sombras

---

## 📱 Responsive Design

### Breakpoints (Tailwind Default)

| Breakpoint | Tamaño | Uso |
|------------|--------|-----|
| `sm` | 640px | Tablets pequeñas |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Desktop grandes |

### Estrategia Mobile First

La plataforma sigue un enfoque **Mobile First**, diseñando primero para móviles y luego expandiendo para pantallas más grandes.

#### Clases Responsive Comunes

```html
<!-- Ejemplo: Tamaños de texto -->
<h1 class="text-3xl lg:text-6xl">Título</h1>

<!-- Ejemplo: Padding -->
<div class="px-4 lg:px-8">Contenido</div>

<!-- Ejemplo: Flex direction -->
<div class="flex flex-column lg:flex-row">Contenido</div>

<!-- Ejemplo: Display -->
<div class="hidden lg:block">Solo desktop</div>
```

### Media Queries Personalizadas

#### Tablet (max-width: 1600px)

```scss
@media (max-width: 1600px) {
  .service {
    width: 170px;
    height: 170px;
  }
  
  .agent {
    width: 160px;
    height: 260px;
  }
}
```

#### Desktop Grande (min-width: 2300px)

```scss
@media (min-width: 2300px) {
  .service {
    width: 400px;
  }
}
```

#### Mobile (max-width: 640px)

```scss
@media (max-width: 640px) {
  .modal-content {
    padding: 1.5rem;
    margin: 1rem;
  }
  
  input {
    font-size: 16px; // Previene zoom en iOS
  }
}
```

### Patrones Responsive

#### Grid/Flex Responsive

```html
<!-- Grid que se convierte en columna en mobile -->
<div class="flex flex-wrap lg:flex-nowrap gap-4">
  <div class="w-full lg:w-6">Contenido 1</div>
  <div class="w-full lg:w-6">Contenido 2</div>
</div>
```

#### Altura de Secciones

```html
<!-- Altura completa en desktop, auto en mobile -->
<div class="h-auto xl:h-screen">
  Contenido
</div>
```

#### Alineación de Texto

```html
<!-- Centrado en mobile, izquierda en desktop -->
<h1 class="text-center lg:text-left">Título</h1>
```

---

## ✅ Buenas Prácticas

### Diseño

1. **Consistencia Visual**
   - Usar siempre la paleta de colores definida
   - Mantener espaciado consistente usando el sistema de Tailwind
   - Aplicar las mismas animaciones para elementos similares

2. **Jerarquía Visual**
   - Títulos grandes y contrastados para secciones principales
   - Uso de pesos de fuente para establecer jerarquía
   - Espaciado adecuado entre elementos relacionados

3. **Contraste y Legibilidad**
   - Texto blanco sobre fondos oscuros
   - Texto oscuro sobre fondos claros
   - Verificar contraste mínimo WCAG AA (4.5:1)

4. **Feedback Visual**
   - Todos los elementos interactivos deben tener estados hover
   - Transiciones suaves (0.3s) para cambios de estado
   - Indicadores visuales claros para acciones

### Código

1. **Uso de Variables SCSS**
   ```scss
   // ✅ Correcto
   background-color: vars.$color2;
   
   // ❌ Incorrecto
   background-color: #a239ca;
   ```

2. **Clases de Utilidad Tailwind**
   - Preferir clases de Tailwind sobre CSS personalizado cuando sea posible
   - Usar clases responsive con prefijos `lg:`, `xl:`, etc.

3. **Nomenclatura**
   - Usar nombres descriptivos: `.btn1`, `.service`, `.agent`
   - Evitar nombres genéricos: `.box`, `.container`, `.item`

4. **Organización de Estilos**
   - Agrupar estilos relacionados
   - Usar comentarios para secciones grandes
   - Mantener orden lógico: layout → tipografía → colores → efectos

### Accesibilidad

1. **Contraste de Colores**
   - Verificar que todos los textos cumplan con WCAG AA
   - Usar herramientas de verificación de contraste

2. **Estados Focus**
   - Todos los elementos interactivos deben tener estado focus visible
   - Usar `outline` o `border` para indicar focus

3. **Textos Alternativos**
   - Todas las imágenes deben tener `alt` descriptivo
   - Iconos decorativos pueden tener `alt=""`

4. **Navegación por Teclado**
   - Asegurar que todos los elementos sean navegables con teclado
   - Orden lógico de tabulación

### Performance

1. **Animaciones**
   - Usar `transform` y `opacity` para animaciones (GPU accelerated)
   - Evitar animar `width`, `height`, `top`, `left`

2. **Imágenes**
   - Usar formatos modernos (WebP) cuando sea posible
   - Optimizar tamaños de imagen
   - Usar `lazy loading` para imágenes fuera del viewport

3. **CSS**
   - Minimizar CSS personalizado
   - Usar clases de Tailwind para reducir CSS no utilizado

### Responsive

1. **Mobile First**
   - Diseñar primero para móviles
   - Expandir para pantallas más grandes

2. **Testing**
   - Probar en diferentes tamaños de pantalla
   - Verificar en dispositivos reales cuando sea posible

3. **Breakpoints Consistentes**
   - Usar los breakpoints estándar de Tailwind
   - Documentar breakpoints personalizados

---

## 🎯 Resumen de Estilos Clave

### Colores Principales
- **Fondo**: `#0e0b16` (Negro oscuro)
- **Acento 1**: `#a239ca` (Púrpura)
- **Acento 2**: `#4717f6` (Azul)
- **Texto claro**: `#e7dfdd` (Beige)

### Tipografía
- **Fuente**: Inter (principal), Source Code Pro (código)
- **Tamaños**: Escala responsive de `text-xs` a `text-7xl`
- **Pesos**: 400 (normal), 600 (semibold), 700 (bold)

### Espaciado
- **Sistema**: Múltiplos de 4px (Tailwind)
- **Padding común**: `p-4`, `p-6`, `p-8`
- **Gap común**: `gap-2`, `gap-4`, `gap-5`

### Componentes
- **Botones**: Border radius `10px`, padding `10px 20px`
- **Cards**: Border radius `20px`, borde blanco `1px`
- **Inputs**: Border radius `8px`, padding `0.875rem 1rem`
- **Modales**: Border radius `16px`, padding `2rem`

### Animaciones
- **Duración**: `0.3s` (transiciones), `0.8s` (entradas)
- **Easing**: `ease` o `ease-out`
- **Efectos**: `translateY(-2px)` en hover, fade in con delays

---

**Última actualización**: Enero 2025
**Versión del documento**: 1.0
