# ADDV Landing Page — Notas Operativas para Claude

**Documento de contexto y decisiones arquitectónicas para future development**

---

## 🎯 Propósito de este documento

Este documento sirve como **handoff para futuros desarrollos**. Registra:
- Decisiones de diseño y arquitectura
- Convenciones de código
- Cómo agregar features nuevas
- Cómo mantener la calidad

---

## 🏗️ Arquitectura General

### Tech Stack

- **Frontend:** HTML5 + CSS3 + JavaScript ES6+ (vanilla)
- **Hosting:** GitHub Pages (estático)
- **Dependencies:** NINGUNA (sin frameworks, librerías externas, etc.)
- **Build:** Manual (no hay build process, los archivos se sirven como está)

### Razones de esta arquitectura

1. **Simplicidad:** Sin dependencias = sin actualizaciones, vulnerabilidades, o compatibilidad issues
2. **Performance:** Carga instantánea, cero overhead de framework
3. **Accesibilidad:** Control total sobre HTML/CSS/JS
4. **Mantenibilidad:** Código legible sin abstracciones

### Sacrificios

- No hay componentes reutilizables (CSS classes sí, pero sin JS)
- No hay state management
- No hay testing automatizado (manual o herramientas online)
- No hay minificación (readability > bytes)

---

## 📐 Sistema de Diseño

### CSS Architecture (ITCSS + BEM-light)

Estructura de archivos CSS en orden de **especificidad creciente**:

```
1. variables.css     → Tokens globales (nunca se sobrescriben)
2. base.css          → Reset + tipografía + elementos HTML base
3. components.css    → Componentes reutilizables (.btn, .card, .badge)
4. layout.css        → Macro layout (grids, secciones, header, footer)
5. responsive.css    → Media queries (sobrescriben anteriores)
```

**Reglas de CSS:**

1. ✅ **Usa custom properties** (`--color-navy`) para todo
2. ✅ **BEM light:** `.card`, `.card-header`, `.card-body` (sin __ profundo)
3. ✅ **Utility classes:** `.mt-md`, `.flex`, `.gap-lg` (para layouts rápidos)
4. ✅ **No hagas overrides:** Si necesitas override, agrega a responsive.css
5. ❌ **No uses !important**
6. ❌ **No uses IDs** (solo en HTML para semantic links)
7. ❌ **No copies estilos** (refactoriza a components.css)

### Color System

Todos los colores están en `css/variables.css`:

```css
:root {
  /* Primarios */
  --color-navy: #1a3a5e;
  --color-cyan: #00d4ff;
  
  /* Grises (escala WCAG AA) */
  --color-gray-50: #f9fafb;   /* backgrounds ligeros */
  --color-gray-900: #111827;  /* texto principal */
  
  /* Semánticos */
  --color-success: #10b981;   /* checkmarks, validaciones */
  --color-error: #ef4444;     /* errores */
}
```

**Nunca** uses hex hardcodeado. Siempre refiere a variable.

### Typography

- **Display/Headings:** `font-family: var(--font-display)` (Inter)
- **Body/UI:** `font-family: var(--font-body)` (Poppins)
- **Mono:** `font-family: var(--font-mono)` (SF Mono)

Usa la escala tipográfica:

```css
h1 { font-size: var(--font-size-3xl); }  /* 48px */
h2 { font-size: var(--font-size-2xl); }  /* 36px */
h3 { font-size: var(--font-size-xl); }   /* 24px */
p  { font-size: var(--font-size-base); } /* 16px */
```

### Spacing

Usa siempre la escala 8px:

```css
margin: var(--space-md);  /* 16px */
padding: var(--space-lg); /* 24px */
gap: var(--space-sm);     /* 8px */
```

---

## 🧩 Componentes

### Crear un componente nuevo

1. **Decide** si es en CSS (reutilizable) o HTML (one-off)
2. **Agrega CSS a `components.css`** si es reutilizable
3. **Agrupa related styles** (botón + variantes juntas)
4. **Incluye estados:** :hover, :active, :disabled, :focus
5. **Verifica contraste WCAG AA**

### Ejemplo: Nuevo tipo de botón

```css
/* Agregar a components.css */
.btn-custom {
  background-color: var(--color-navy);
  color: var(--color-white);
  /* ... estilos ... */
}

.btn-custom:hover:not(:disabled) {
  background-color: #0f2847;
}

.btn-custom:focus-visible {
  outline: 2px solid var(--color-cyan);
  outline-offset: 2px;
}
```

Luego usar en HTML:

```html
<button class="btn btn-custom">Mi botón</button>
```

---

## 🎨 Mobile-First Responsive

### Proceso

1. **Diseña para mobile** (375px) en base.css + components.css
2. **Agrega breakpoints en responsive.css** para tablets + desktop
3. **Respeta prefers-reduced-motion**
4. **Mínimo touch target:** 44x44px

### Breakpoints

```css
/* Mobile: 375px-767px (styles base, en otros archivos) */

@media (max-width: 1024px) {
  /* Tablet: 768px-1023px */
}

@media (max-width: 768px) {
  /* Mobile grande: 640px-767px */
}

@media (max-width: 480px) {
  /* Mobile pequeño: 375px-479px */
}

@media (min-width: 1280px) {
  /* Desktop grande: 1280px+ */
}
```

---

## 🔧 JavaScript

### Estructura

```
js/
  ├── cotizador.js    → Lógica de precios, validaciones
  ├── whatsapp.js     → Integración WhatsApp, botón flotante
  └── main.js         → Inicialización global, navegación
```

### Convenciones

1. **camelCase** para funciones: `selectPackage()`, `openWhatsApp()`
2. **UPPER_SNAKE_CASE** para constantes: `PRICING_CONFIG`, `WHATSAPP_CONFIG`
3. **DOMContentLoaded** para inicialización
4. **Exporta a window** funciones usadas desde HTML: `window.selectPackage = selectPackage`
5. **Evita global state** — usa objetos si necesitas (ej. `cotizador_state`)
6. **Comenta funciones públicas** con JSDoc

### Agregar función nueva

```javascript
/**
 * Mi nueva función
 * @param {string} parametro - Descripción
 * @returns {boolean}
 */
function miNuevaFuncion(parametro) {
  // Implementación
}

// Exportar
window.miNuevaFuncion = miNuevaFuncion;
```

### Evitar

- ❌ jQuery (no lo necesitas)
- ❌ console.log en producción (usa Logger.log)
- ❌ async/await sin catch (usa try-catch)
- ❌ Modificar el DOM en loops (batch updates)

---

## 🚀 Cómo agregar features nuevas

### Agregar nueva sección

1. **Crear HTML** en index.html:
   ```html
   <section class="section" id="mi-seccion" aria-labelledby="titulo">
     <div class="container">
       <h2 id="titulo">Mi Sección</h2>
       <!-- contenido -->
     </div>
   </section>
   ```

2. **Agregar CSS** en `layout.css` o `components.css`

3. **Agregar responsive** en `responsive.css` si needed

4. **Test:** Mobile + tablet + desktop

### Cambiar precios o textos publicados

El sitio no tiene backend (GitHub Pages estático) — lo publicado vive en `data/config.json`, no en localStorage.

1. Editar `data/config.json` a mano, **o** usar `admin.html` → editar → "Descargar config.json" → reemplazar el archivo del repo
2. Commit + push de `data/config.json`
3. Re-probar el cotizador y el panel admin manualmente (`aplicarConfigPublicado()` en `js/cotizador.js` es quien lo carga)
4. Actualizar README.md si es importante

`PRICING_CONFIG` en `js/cotizador.js` queda solo como fallback de fábrica si `data/config.json` no carga.

### Cambiar paleta de colores

1. Editar variables en `css/variables.css`
2. Verificar contraste WCAG AA (usar [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/))
3. Test en Lighthouse
4. Actualizar README.md con nuevos valores

### Agregar Google Analytics

1. Agregar script en `<head>` de index.html
2. El tracking ya está implementado en `main.js` (revisa `rastrearEvento()`)

---

## ✅ Checklist antes de publicar

### Funcionalidad

- [ ] Cotizador calcula correctamente
- [ ] Botón WhatsApp abre con mensaje formateado
- [ ] Todos los links internos funcionan
- [ ] Formularios (si hay) validan

### Diseño

- [ ] Logo/imágenes cargadas correctamente
- [ ] Tipografía consistente
- [ ] Espaciado uniforme
- [ ] Colores cumplen WCAG AA

### Performance

- [ ] Lighthouse >95 (todos los metrics)
- [ ] Carga <2s en conexión 4G simulada
- [ ] Mobile rinde bien (DevTools throttled)

### Accesibilidad

- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Screen reader (NVDA/JAWS): semantics OK
- [ ] Focus indicators visibles
- [ ] No hay errores en axe DevTools

### Seguridad

- [ ] HTTPS (automático en GitHub Pages)
- [ ] No hay API keys/secrets en código
- [ ] CSP headers OK (si aplicable)

### SEO

- [ ] Title tag único y descriptivo
- [ ] Meta description presente
- [ ] H1 único por página
- [ ] Headings en orden (H1 → H2 → H3)
- [ ] Alt text en imágenes

---

## 🐛 Debugging

### Verificar problemas

```javascript
// En console
Logger.log('Mensaje'); // Usa Logger, no console.log
Storage.get('key');     // Revisar localStorage
window.cotizador_state; // Estado del cotizador
detectarDispositivo();  // Qué device está usando
```

### Herramientas

- **Chrome DevTools:** F12, Elements, Console, Network, Performance
- **Lighthouse:** Chrome DevTools → Lighthouse tab
- **Wave:** https://wave.webaim.org (Accessibility)
- **axe DevTools:** Chrome extension

---

## 📖 Recursos útiles para mantener

- **Web.dev:** https://web.dev (performance, a11y)
- **MDN:** https://developer.mozilla.org (referencias)
- **WCAG 2.2:** https://www.w3.org/WAI/WCAG22/quickref/
- **Can I Use:** https://caniuse.com (compatibilidad browser)

---

## 🎯 Próximas prioridades (Fase 5+)

1. **Panel Administrativo** (admin.html + login.html)
   - Editar precios
   - Editar contenido
   - Ver analytics

2. **Más servicios en la lista**
   - Agregar descripciones más detalladas
   - Incluir casos de éxito

3. **Video testimonials**
   - Integrar videos de clientes
   - Optimizar carga (lazy loading)

4. **Email capture**
   - Formulario para newsletter
   - Integración con Mailchimp/Klaviyo

5. **Chatbot**
   - Pre-qualification antes de contactar
   - FAQs automatizadas

---

## 📝 Convención de commits

```
feat: Agregar nueva sección de paquetes
fix: Corregir cálculo de IVA en cotizador
style: Actualizar paleta de colores
perf: Optimizar imágenes para carga más rápida
docs: Actualizar README con instrucciones
a11y: Mejorar contraste de texto en botones
```

---

## 👤 Autor & Mantenedor

- **Desarrollado por:** Claude (Anthropic) + Tony (ADDV)
- **Última actualización:** Agosto 2026
- **Versión actual:** 1.0.0

---

**Nota:** Este documento debe actualizarse cuando se introduzcan cambios arquitectónicos o patrones nuevos.
