/**
 * ADDV Admin Panel — Lógica de tabs, precios, contenido y analytics
 * Requiere: js/cotizador.js (PRICING_CONFIG), js/main.js (Storage, content/log helpers)
 */

// Defaults de contenido — deben coincidir con el texto original de index.html
const CONTENT_DEFAULTS = {
  'hero-title': 'Soluciones digitales que impulsan tu negocio',
  'hero-desc': 'Desarrollamos plataformas, aplicaciones y soluciones tecnológicas que generan valor real para tu empresa. Automatización inteligente + Marketing estratégico + Identidad visual premium.',
  'cta-title': '¿Listo para transformar tu negocio?',
  'cta-desc': 'Solicita una propuesta personalizada sin compromiso. Analizamos tu situación y diseñamos la solución ideal.'
};

document.addEventListener('DOMContentLoaded', async function () {
  // Partir de lo ya publicado en data/config.json (mismo mecanismo que la landing)
  const config = await cargarConfigPublicado();
  aplicarConfigPublicado(config);

  inicializarTabs();
  renderizarFormularioPrecios();
  renderizarFormularioContenido();
  renderizarAnalytics();
  inicializarAcciones();
});

/**
 * Manejo de tabs (Precios / Contenido / Analytics)
 */
function inicializarTabs() {
  const tabs = document.querySelectorAll('.admin-tab');

  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      const destino = this.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      document.querySelectorAll('.admin-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === `panel-${destino}`);
      });

      if (destino === 'analytics') {
        renderizarAnalytics();
      }
    });
  });
}

/**
 * ===== PRECIOS =====
 */
function renderizarFormularioPrecios() {
  const contenedor = document.getElementById('precios-form-contenedor');
  if (!contenedor) return;

  let html = '';

  Object.values(PRICING_CONFIG.paquetes).forEach(paquete => {
    html += `
      <div class="admin-package-block">
        <h3 style="font-size: var(--font-size-base); margin: 0 0 var(--space-md);">${paquete.nombre}</h3>
        <div class="admin-fields-row">
          <div class="input-group">
            <label for="precio-${paquete.id}">Precio mensual (MXN)</label>
            <input type="number" id="precio-${paquete.id}" min="0" step="100" value="${paquete.precio_mensual}">
          </div>
          <div class="input-group">
            <label for="meses-${paquete.id}">Mínimo de meses</label>
            <input type="number" id="meses-${paquete.id}" min="1" step="1" value="${paquete.minimo_meses}">
          </div>
        </div>
      </div>
    `;
  });

  contenedor.innerHTML = html;
}

function guardarPrecios() {
  const overrides = {};

  Object.keys(PRICING_CONFIG.paquetes).forEach(id => {
    const precioInput = document.getElementById(`precio-${id}`);
    const mesesInput = document.getElementById(`meses-${id}`);

    const precio = Math.max(0, parseInt(precioInput.value, 10) || 0);
    const meses = Math.max(1, parseInt(mesesInput.value, 10) || 1);

    overrides[id] = { precio_mensual: precio, minimo_meses: meses };
    Object.assign(PRICING_CONFIG.paquetes[id], overrides[id]);
  });

  Storage.set('addv_pricing_overrides', overrides);
  mostrarMensajeGuardado('precios-save-msg');
}

function restaurarPrecios() {
  restaurarPreciosOriginales();
  renderizarFormularioPrecios();
  mostrarMensajeGuardado('precios-save-msg');
}

/**
 * ===== CONTENIDO =====
 */
function renderizarFormularioContenido() {
  const contenedor = document.getElementById('contenido-form-contenedor');
  if (!contenedor) return;

  const overrides = Storage.get(CONTENT_OVERRIDES_KEY) || {};

  const campos = [
    { key: 'hero-title', label: 'Título principal (Hero)', tipo: 'input' },
    { key: 'hero-desc', label: 'Descripción principal (Hero)', tipo: 'textarea' },
    { key: 'cta-title', label: 'Título CTA final', tipo: 'input' },
    { key: 'cta-desc', label: 'Descripción CTA final', tipo: 'textarea' }
  ];

  let html = '';

  const publicado = window.CONFIG_CONTENIDO_PUBLICADO || {};

  campos.forEach(campo => {
    const valor = overrides[campo.key] !== undefined
      ? overrides[campo.key]
      : (publicado[campo.key] !== undefined ? publicado[campo.key] : CONTENT_DEFAULTS[campo.key]);
    const valorEscapado = escaparHtml(valor);

    html += '<div class="input-group">';
    html += `<label for="contenido-${campo.key}">${campo.label}</label>`;
    html += campo.tipo === 'textarea'
      ? `<textarea id="contenido-${campo.key}" rows="3">${valorEscapado}</textarea>`
      : `<input type="text" id="contenido-${campo.key}" value="${valorEscapado}">`;
    html += '</div>';
  });

  contenedor.innerHTML = html;
}

function guardarContenido() {
  const overrides = {};

  Object.keys(CONTENT_DEFAULTS).forEach(key => {
    const el = document.getElementById(`contenido-${key}`);
    if (el) overrides[key] = el.value;
  });

  guardarOverridesContenido(overrides);
  mostrarMensajeGuardado('contenido-save-msg');
}

function restaurarContenido() {
  restaurarContenidoOriginal();
  renderizarFormularioContenido();
  mostrarMensajeGuardado('contenido-save-msg');
}

/**
 * ===== PUBLICAR (descargar config.json) =====
 * Sitio estático sin backend: la única forma real de publicar un cambio es
 * commitear data/config.json. Este botón genera el archivo actualizado —
 * combinando lo ya publicado con la vista previa local sin guardar — para
 * que se descargue y se suba al repo manualmente.
 */
function descargarConfigJSON() {
  const paquetes = {};
  Object.keys(PRICING_CONFIG.paquetes).forEach(id => {
    paquetes[id] = {
      precio_mensual: PRICING_CONFIG.paquetes[id].precio_mensual,
      minimo_meses: PRICING_CONFIG.paquetes[id].minimo_meses
    };
  });

  const overridesContenido = Storage.get(CONTENT_OVERRIDES_KEY) || {};
  const publicado = window.CONFIG_CONTENIDO_PUBLICADO || {};
  const contenido = {};
  Object.keys(CONTENT_DEFAULTS).forEach(key => {
    contenido[key] = overridesContenido[key] !== undefined
      ? overridesContenido[key]
      : (publicado[key] !== undefined ? publicado[key] : CONTENT_DEFAULTS[key]);
  });

  const configActualizado = {
    _notas: 'Config publicado del sitio. Editable a mano o vía panel admin (descargar y commitear). Los campos ausentes usan el default de js/cotizador.js y js/admin.js.',
    paquetes,
    contenido
  };

  const blob = new Blob([JSON.stringify(configActualizado, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = 'config.json';
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  URL.revokeObjectURL(url);
}

/**
 * Escapar HTML básico para insertar valores en atributos/innerHTML
 */
function escaparHtml(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

/**
 * ===== ANALYTICS =====
 */
function renderizarAnalytics() {
  const log = obtenerEventLog();

  renderizarStatsAnalytics(log);
  renderizarTablaAnalytics(log);
}

function renderizarStatsAnalytics(log) {
  const contenedor = document.getElementById('analytics-stats');
  if (!contenedor) return;

  const categorias = new Set(log.map(e => e.categoria));
  const ultimo = log.length ? new Date(log[log.length - 1].ts) : null;

  contenedor.innerHTML = `
    <div class="admin-stat-tile">
      <span class="admin-stat-value">${log.length}</span>
      <span class="admin-stat-label">Eventos registrados</span>
    </div>
    <div class="admin-stat-tile">
      <span class="admin-stat-value">${categorias.size}</span>
      <span class="admin-stat-label">Categorías distintas</span>
    </div>
    <div class="admin-stat-tile">
      <span class="admin-stat-value" style="font-size: var(--font-size-base);">${ultimo ? ultimo.toLocaleString('es-MX') : '—'}</span>
      <span class="admin-stat-label">Último evento</span>
    </div>
  `;
}

function renderizarTablaAnalytics(log) {
  const contenedor = document.getElementById('analytics-log-contenedor');
  if (!contenedor) return;

  if (!log.length) {
    contenedor.innerHTML = '<p class="admin-empty-state">Sin eventos registrados todavía en este navegador. Navega la landing (selecciona paquetes, abre WhatsApp) para generar actividad.</p>';
    return;
  }

  const filas = log.slice().reverse().slice(0, 50).map(evento => `
    <tr>
      <td>${new Date(evento.ts).toLocaleString('es-MX')}</td>
      <td>${escaparHtml(evento.categoria)}</td>
      <td>${escaparHtml(evento.accion)}</td>
      <td>${escaparHtml(evento.etiqueta || '—')}</td>
    </tr>
  `).join('');

  contenedor.innerHTML = `
    <table class="admin-log-table">
      <thead>
        <tr><th>Fecha</th><th>Categoría</th><th>Acción</th><th>Etiqueta</th></tr>
      </thead>
      <tbody>${filas}</tbody>
    </table>
  `;
}

/**
 * Mostrar mensaje "Guardado ✓" temporalmente
 */
function mostrarMensajeGuardado(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;

  el.style.display = 'inline';
  setTimeout(() => { el.style.display = 'none'; }, 2000);
}

/**
 * Botones de acción (guardar, restaurar, limpiar, logout)
 */
function inicializarAcciones() {
  document.getElementById('btn-guardar-precios').addEventListener('click', guardarPrecios);
  document.getElementById('btn-restaurar-precios').addEventListener('click', restaurarPrecios);

  document.getElementById('btn-guardar-contenido').addEventListener('click', guardarContenido);
  document.getElementById('btn-restaurar-contenido').addEventListener('click', restaurarContenido);

  document.getElementById('btn-descargar-config').addEventListener('click', descargarConfigJSON);

  document.getElementById('btn-limpiar-analytics').addEventListener('click', function () {
    limpiarEventLog();
    renderizarAnalytics();
  });

  document.getElementById('btn-logout').addEventListener('click', function () {
    cerrarSesionAdmin();
    window.location.href = 'login.html';
  });
}
