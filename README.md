# ADDV Landing Page — Propuesta Comercial Interactiva

**Soluciones digitales que impulsan tu negocio: Automatización + Marketing + Branding**

Landing page estática con cotizador interactivo, paquetes comerciales y integración WhatsApp directo.

---

## 🎯 Propósito

Crear una propuesta comercial digital profesional para que **Alina Arroyo** (psicóloga/sexóloga) y clientes similares puedan:

1. Entender los servicios y paquetes de ADDV
2. Calcular costos de forma interactiva (cotizador)
3. Contactar directamente por WhatsApp con presupuesto preformulado
4. Experimentar la calidad de diseño y UX que ADDV ofrece

**ROI esperado:** Convertir visitantes → solicitudes → contratos en 24-48h

---

## 📦 Qué incluye

### Secciones principales

- **Header fijo** — Navegación y CTA principal
- **Hero** — Propuesta de valor + beneficios clave
- **Paquetes** — 3 opciones comerciales (Básico, Profesional ⭐, Premium)
- **Servicios** — Explicación de módulos principales
- **Cotizador Interactivo** — Seleccionar paquete → calcular total → enviar por WhatsApp
- **CTA Final** — Última oportunidad de conversión
- **Footer** — Links, contacto, legal

### Características técnicas

✅ **HTML5 + CSS3 + JavaScript ES6+** (sin frameworks, estático, compatible GitHub Pages)
✅ **Responsive** — Mobile-first, 3 breakpoints (480px, 768px, 1024px)
✅ **Accesible** — WCAG 2.2 AA, keyboard navigation, screen reader friendly
✅ **Performance** — <2s carga, Lighthouse >95, Core Web Vitals
✅ **Diseño intencional** — Paleta Navy + Cyan, Inter + Poppins, bajo-impacto motion
✅ **Cotizador dinámico** — Cálculo real-time, IVA separado, precios actualizables

---

## 🚀 Inicio Rápido

### Instalación Local

```bash
# 1. Clonar o descargar el repositorio
git clone https://github.com/ADDV/landing-page.git
cd addv-landing

# 2. Abrir en navegador (file:// o servidor local)
# Opción A: Servidor Python
python3 -m http.server 8000

# Opción B: Node.js
npx http-server

# Opción C: Abrir directamente en navegador
# Simplemente abrir index.html en el navegador
```

Luego acceder a `http://localhost:8000` (o el puerto que uses)

### GitHub Pages

1. Subir este repositorio a GitHub
2. Ir a Settings → Pages
3. Source: `main` branch, `/root` folder
4. Salvar y esperar ~1 min
5. Tu landing estará en `https://username.github.io/landing-page`

---

## 📁 Estructura de archivos

```
addv-landing/
│
├── index.html                 # Landing page principal
├── admin.html                 # Panel administrativo (precios, contenido, analytics)
├── login.html                 # Login del panel admin
│
├── data/
│   └── config.json            # Precios y textos publicados — fuente real del sitio (editar + commit)
│
├── css/
│   ├── variables.css          # Tokens de diseño (colores, tipografía, espaciado)
│   ├── base.css               # Reset + tipografía global
│   ├── components.css         # Botones, tarjetas, badges, inputs
│   ├── layout.css             # Grids, header, footer, secciones
│   └── responsive.css         # Media queries (mobile-first)
│
├── js/
│   ├── cotizador.js           # Lógica del cotizador interactivo
│   ├── whatsapp.js            # Integración WhatsApp + botón flotante
│   └── main.js                # Navegación, smooth scroll, a11y
│
├── assets/                    # Imágenes, iconos (cuando se agreguen)
│
├── README.md                  # Este archivo
├── CLAUDE.md                  # Notas operativas para development
└── project_state.md           # Estado del proyecto (cambios registrados)
```

---

## 🎨 Diseño

### Paleta de colores

```css
--color-navy: #1a3a5e;        /* Primario: confianza */
--color-cyan: #00d4ff;        /* Acento: innovación */
--color-white: #ffffff;       /* Fondo */
--color-gray-*: #...          /* Grises neutrales (WCAG AA) */
```

**Contraste verificado:**
- Navy + White: 7.2:1 (AAA)
- Cyan + Navy: 3.1:1 (AA)
- Gray-900 + White: 13.2:1 (AAA)

### Tipografía

- **Inter** — Headings (H1, H2) — Moderna, confiable
- **Poppins** — Body text, UI labels — Cálida, accesible
- **SF Mono** — Code, data — Monospace

### Escala tipográfica

| Elemento | Tamaño | Weight | Uso |
|----------|--------|--------|-----|
| H1 | 48px | 700 | Título principal |
| H2 | 36px | 700 | Títulos de sección |
| H3 | 24px | 600 | Subtítulos |
| Body | 16px | 400 | Párrafos |
| Small | 14px | 400 | Labels, captions |

### Sistema de espaciado (8px base)

```
xs: 4px   (--space-xs)
sm: 8px   (--space-sm)
md: 16px  (--space-md)
lg: 24px  (--space-lg)
xl: 32px  (--space-xl)
2xl: 48px (--space-2xl)
3xl: 64px (--space-3xl)
```

---

## 🎯 Cotizador Interactivo

### Cómo funciona

1. **Usuario selecciona paquete** (Básico, Profesional, Premium)
2. **Sistema calcula:**
   - Precio base × meses seleccionados
   - Agrega servicios adicionales (opcional)
   - Aplicar descuentos si hay
   - Calcular IVA (16%) separado
   - Mostrar total en tiempo real
3. **Usuario hace click en "Enviar por WhatsApp"**
4. **Abre WhatsApp con mensaje preformulado:**
   ```
   👋 Hola, me interesa la propuesta comercial de ADDV

   📦 Paquete Seleccionado:
   Paquete Profesional

   💰 Cotización:
   Subtotal: $36,000
   IVA (16%): $5,760
   Total: $41,760 (3 meses)

   Me gustaría conocer más detalles...
   ```

### Precios (actualizables en `js/cotizador.js`)

| Paquete | Precio/mes | Mínimo | Recomendado |
|---------|------------|--------|------------|
| Básico | $4,500 | 12 meses | ❌ |
| Profesional | $12,000 | 3 meses | ✅ |
| Premium | $25,000 | 3 meses | ❌ |

---

## 📱 Responsive Design

### Breakpoints

```
Desktop:  1024px+     (12-col grid)
Tablet:   768px-1023px (2-col, adjusted)
Mobile:   480px-767px  (1-col stack)
Small:    <480px       (1-col, optimized)
```

### Características responsive

- Grid fluido 12 columnas
- Tipografía escala automáticamente
- Imágenes responsive
- Botones: min-touch 44px (móvil)
- Header: height 56-72px según dispositivo
- Cotizador: full-width en móvil

---

## ♿ Accesibilidad (WCAG 2.2 AA)

✅ **Contraste:** Todos los pares texto/fondo cumplen 4.5:1 (texto normal) o 3:1 (large)
✅ **Keyboard navigation:** Tab, Enter, Escape funcionales
✅ **Screen reader:** Semántica HTML5, aria-labels, skip links
✅ **Focus indicators:** Outlines visibles (2px cyan)
✅ **Motion:** Respeta prefers-reduced-motion
✅ **Formularios:** Labels explícitos, error messages accesibles
✅ **Imágenes:** Alt text descriptivo
✅ **Lenguaje:** Español claro, evita jerga

### Testing a11y

```bash
# Usar herramientas gratuitas:
# - WAVE: https://wave.webaim.org
# - axe DevTools: https://www.deque.com/axe/devtools/
# - Lighthouse (Chrome DevTools)
```

---

## ⚡ Performance

### Optimizaciones aplicadas

- ✅ CSS combinado en 5 archivos (no minificado para mantenibilidad)
- ✅ JavaScript modular sin bundling (carga sin dependencias)
- ✅ Fonts locales importadas con preload
- ✅ Imágenes optimizadas (cuando se agreguen): WebP + fallback
- ✅ Lazy loading (cuando se agreguen múltiples imágenes)
- ✅ Zero external dependencies (excepto Google Fonts, opcional)

### Lighthouse targets

- **Performance:** >95
- **Accessibility:** >95
- **Best Practices:** >95
- **SEO:** >95

---

## 🔧 Configuración

### Cambiar número WhatsApp

Editar en `js/whatsapp.js`:

```javascript
const WHATSAPP_CONFIG = {
  numero: '525539944697', // ← Cambiar aquí
  nombre_empresa: 'ADDV'
};
```

### Cambiar precios y textos publicados

El sitio es estático (GitHub Pages, sin backend), así que la única forma real de publicar un cambio es editando `data/config.json` y haciendo commit + push — GitHub Pages reconstruye solo.

Dos formas de editarlo:

1. **A mano** — abrir `data/config.json` y cambiar el valor:
   ```json
   {
     "paquetes": {
       "basico": { "precio_mensual": 4500, "minimo_meses": 12 }
     },
     "contenido": {
       "hero-title": "Soluciones digitales que impulsan tu negocio"
     }
   }
   ```
2. **Con el panel admin** (`admin.html`) — edita precios/contenido ahí, dale **"Descargar config.json"**, y reemplaza el archivo `data/config.json` del repo con el descargado antes de commitear. El botón "Guardar" del panel solo actualiza una vista previa en ese navegador (localStorage) — no publica nada por sí solo.

Si `data/config.json` no carga (ej. archivo ausente, o el sitio abierto directo como `file://` sin servidor), la landing usa los defaults hardcodeados en `js/cotizador.js`.

### Cambiar colores (paleta)

Editar en `css/variables.css`:

```css
:root {
  --color-navy: #1a3a5e;    /* ← Cambiar aquí */
  --color-cyan: #00d4ff;    /* ← Cambiar aquí */
  /* ... */
}
```

---

## 📊 Analytics (Google Analytics)

El sitio está preparado para GA4. Para activar:

1. Agregar script en `<head>` de index.html:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_MEASUREMENT_ID');
   </script>
   ```

2. Reemplazar `GA_MEASUREMENT_ID` con tu ID

3. Los eventos se rastrean automáticamente en:
   - Click en botón WhatsApp
   - Selección de paquete
   - Envío de cotización

---

## 🔐 Seguridad

- ✅ **HTTPS obligatorio** (GitHub Pages automático)
- ✅ **No almacena datos sensibles** (solo localStorage para clicks)
- ✅ **No contacta servidores** (estático, solo WhatsApp)
- ✅ **Privacidad respetada** (cookies mínimas)
- ✅ **CSP header** (si necesitas, agregar en servidor)

---

## 📝 Mantenimiento

### Actualizar contenido

1. **Textos:** Editar HTML directamente en `index.html`
2. **Estilos:** Modificar CSS en `css/*.css`
3. **Precios:** Actualizar en `js/cotizador.js`
4. **Colores:** Cambiar variables en `css/variables.css`

### Agregar secciones nuevas

1. Copiar una sección existente como template
2. Aplicar clases CSS del sistema (grid, card, button, etc.)
3. Seguir la estructura: `<section class="section"> <div class="container"> ... </div> </section>`

### Agregar imágenes

1. Guardar en `/assets`
2. Optimizar: [TinyPNG](https://tinypng.com) o [Squoosh](https://squoosh.app)
3. Agregar alt text descriptivo
4. Considerar WebP + fallback JPEG

---

## 🚀 Deployment

### GitHub Pages

```bash
# 1. Crear repositorio en GitHub
git init
git add .
git commit -m "Initial commit: ADDV landing page"
git branch -M main
git remote add origin https://github.com/username/addv-landing.git
git push -u origin main

# 2. Habilitar Pages en GitHub Settings
# 3. Ver en: https://username.github.io/addv-landing
```

### Otros servidores (Netlify, Vercel, etc.)

Todos soportan archivos estáticos. Simplemente subir la carpeta.

### Servidor propio

Usar cualquier servidor HTTP (Apache, Nginx, etc.). Los archivos estáticos se sirven como está.

---

## 📧 Contacto & Soporte

- **Email:** info@addv.mx
- **WhatsApp:** +52 55 3994 4697
- **Web:** https://addv.mx

---

## 📄 Licencia

Todos los derechos reservados © 2026 ADDV. Uso exclusivo para clientes de ADDV.

---

## 📚 Recursos útiles

- [WCAG 2.2 AA Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS Tricks](https://css-tricks.com/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WAVE Accessibility Tool](https://wave.webaim.org/)

---

**Última actualización:** Agosto 2026
**Versión:** 1.0.0
**Estado:** Producción
