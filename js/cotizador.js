/**
 * ADDV Cotizador Interactivo
 * Lógica de cálculo de precios, selección de paquetes/módulos, validaciones
 */

// Configuración de precios (basada en pricing_config.json)
const PRICING_CONFIG = {
  paquetes: {
    basico: {
      id: 'basico',
      nombre: 'Paquete Básico',
      precio_mensual: 4500,
      minimo_meses: 7,
      servicios_incluidos: [
        'bot_whatsapp_basico',
        'google_calendar_dual',
        'stripe_pago_simple',
        'logo_rediseno',
        'brand_book',
        'onboarding_2semanas'
      ],
      recomendado: false
    },
    profesional: {
      id: 'profesional',
      nombre: 'Paquete Profesional',
      precio_mensual: 12000,
      minimo_meses: 3,
      servicios_incluidos: [
        'bot_whatsapp_avanzado',
        'google_calendar_dual',
        'stripe_pago_recurrente',
        'expediente_clinico',
        'logo_rediseno',
        'brand_book',
        'templates_redes',
        'messaging_privacidad',
        'estrategia_1embudo',
        'calendario_contenido_30d',
        'community_manager_20h',
        'meta_ads_setup',
        'meta_ads_optimizacion',
        'google_analytics',
        'acompañamiento_15d',
        'revision_kpi_mensual'
      ],
      recomendado: true,
      pauta_publicitaria_incluida: 500
    },
    premium: {
      id: 'premium',
      nombre: 'Paquete Premium',
      precio_mensual: 25000,
      minimo_meses: 3,
      servicios_incluidos: [
        'bot_whatsapp_avanzado_plus',
        'google_calendar_dual',
        'stripe_pago_recurrente_plus',
        'expediente_clinico_avanzado',
        'logo_rediseno',
        'brand_book',
        'templates_redes',
        'messaging_privacidad',
        'estrategia_3embudos',
        'calendario_contenido_30d',
        'community_manager_40h',
        'embudo_ventas_2',
        'meta_ads_setup',
        'meta_ads_optimizacion_avanzada',
        'google_ads_gestion',
        'seo_local',
        'email_marketing_automatico',
        'portal_paciente',
        'referral_program',
        'google_analytics_plus',
        'acompañamiento_continuo',
        'revision_kpi_mensual_profunda',
        'estrategia_trimestral'
      ],
      recomendado: false,
      pauta_publicitaria_incluida: 2000
    }
  },

  servicios: {
    bot_whatsapp_basico: { nombre: 'Bot WhatsApp Básico', precio: 3000 },
    bot_whatsapp_avanzado: { nombre: 'Bot WhatsApp Avanzado', precio: 5000 },
    google_calendar_dual: { nombre: 'Google Calendar Dual', precio: 500 },
    stripe_pago_simple: { nombre: 'Stripe - Pagos Simples', precio: 1500 },
    stripe_pago_recurrente: { nombre: 'Stripe - Pagos Recurrentes', precio: 2000 },
    expediente_clinico: { nombre: 'Expediente Clínico Mínimo', precio: 3500 },
    logo_rediseno: { nombre: 'Logo Rediseño', precio: 2500 },
    brand_book: { nombre: 'Brand Book Completo', precio: 1500 },
    templates_redes: { nombre: 'Templates para Redes', precio: 2000 },
    messaging_privacidad: { nombre: 'Messaging de Privacidad', precio: 800 },
    estrategia_3embudos: { nombre: 'Estrategia 3 Embudos', precio: 3000 },
    estrategia_1embudo: { nombre: 'Estrategia 1 Embudo', precio: 1500 },
    embudo_ventas_2: { nombre: '2 Embudos de Venta Profesionales', precio: 4500 },
    calendario_contenido_30d: { nombre: 'Calendario Contenido 30d', precio: 2500 },
    community_manager_20h: { nombre: 'Community Manager (20h/mes)', precio: 5000 },
    community_manager_40h: { nombre: 'Community Manager (40h/mes)', precio: 8000 },
    meta_ads_setup: { nombre: 'Meta Ads Setup', precio: 3500 },
    google_ads_gestion: { nombre: 'Google Ads Gestión', precio: 4000 },
    email_marketing_automatico: { nombre: 'Email Marketing Automático', precio: 2500 },
    portal_paciente: { nombre: 'Portal del Paciente', precio: 4000 },
    referral_program: { nombre: 'Referral Program', precio: 1500 },
    onboarding_2semanas: { nombre: 'Onboarding 2 Semanas', precio: 2000 },
    acompañamiento_15d: { nombre: 'Acompañamiento 15 días', precio: 1500 },
    revision_kpi_mensual: { nombre: 'Revisión KPI Mensual', precio: 1500 }
  },

  iva_porcentaje: 16,
  numero_whatsapp: '525539944697'
};

// Copia inmutable de precios/mínimos originales (para "Restaurar valores originales" en admin)
const PRICING_DEFAULTS = JSON.parse(JSON.stringify(PRICING_CONFIG.paquetes));

/**
 * Cargar data/config.json — precios y contenido ya publicados en el repo (git).
 * Si el archivo no existe o el sitio se abrió sin servidor (file://), se
 * mantienen los defaults de este archivo sin romper la carga de la página.
 */
async function cargarConfigPublicado() {
  try {
    const resp = await fetch('data/config.json', { cache: 'no-store' });
    if (!resp.ok) return null;
    return await resp.json();
  } catch (e) {
    return null;
  }
}

/**
 * Aplicar config.json (publicado) sobre los defaults de PRICING_CONFIG
 */
function aplicarConfigPublicado(config) {
  if (config && config.paquetes) {
    Object.keys(config.paquetes).forEach(id => {
      if (PRICING_CONFIG.paquetes[id]) {
        Object.assign(PRICING_CONFIG.paquetes[id], config.paquetes[id]);
      }
    });
  }

  window.CONFIG_CONTENIDO_PUBLICADO = (config && config.contenido) || {};
  window.PRICING_PUBLICADO = JSON.parse(JSON.stringify(PRICING_CONFIG.paquetes));
}

/**
 * Aplicar overrides de precios en vista previa desde el panel admin (localStorage)
 * Nota: sitio estático sin backend — esto es solo una previsualización en este
 * navegador. Para publicar de verdad hay que descargar config.json y commitearlo.
 */
function aplicarOverridesPrecios() {
  let overrides;
  try {
    const raw = localStorage.getItem('addv_pricing_overrides');
    overrides = raw ? JSON.parse(raw) : null;
  } catch (e) {
    overrides = null;
  }

  if (!overrides) return;

  Object.keys(overrides).forEach(id => {
    if (PRICING_CONFIG.paquetes[id]) {
      Object.assign(PRICING_CONFIG.paquetes[id], overrides[id]);
    }
  });
}

/**
 * Restaurar precios/mínimos: descarta la vista previa local sin publicar y
 * vuelve a lo publicado en data/config.json (o al default de fábrica si el
 * sitio se abrió sin ese archivo, ej. file://).
 */
function restaurarPreciosOriginales() {
  const base = window.PRICING_PUBLICADO || PRICING_DEFAULTS;

  Object.keys(base).forEach(id => {
    PRICING_CONFIG.paquetes[id].precio_mensual = base[id].precio_mensual;
    PRICING_CONFIG.paquetes[id].minimo_meses = base[id].minimo_meses;
  });

  try {
    localStorage.removeItem('addv_pricing_overrides');
  } catch (e) { /* localStorage no disponible */ }
}

/**
 * Sincronizar el precio mostrado en las tarjetas estáticas con PRICING_CONFIG
 */
function actualizarPreciosVisibles() {
  Object.values(PRICING_CONFIG.paquetes).forEach(paquete => {
    const el = document.querySelector(`[data-price-for="${paquete.id}"]`);
    if (el) {
      el.innerHTML = `$${paquete.precio_mensual.toLocaleString('es-MX')}<span style="font-size: 0.5em;">/mes</span>`;
    }
  });
}

// Estado del cotizador
let cotizador_state = {
  paquete_seleccionado: null,
  servicios_adicionales: [],
  meses: 1,
  descuento_pct: 0
};

// Inicializar cotizador: primero lo publicado (data/config.json), luego la
// vista previa local (localStorage), y recién ahí se pinta la UI.
document.addEventListener('DOMContentLoaded', async function() {
  const config = await cargarConfigPublicado();
  aplicarConfigPublicado(config);
  aplicarOverridesPrecios();

  renderizarCotizador();
  actualizarTotal();
  actualizarPreciosVisibles();

  if (typeof aplicarOverridesContenido === 'function') {
    aplicarOverridesContenido();
  }
});

/**
 * Renderizar interfaz del cotizador
 */
function renderizarCotizador() {
  const contenedor = document.getElementById('cotizador-contenido');
  
  if (!contenedor) return;

  let html = '<div class="input-group">';
  html += '<label for="paquete-select">Selecciona un paquete</label>';
  html += '<select id="paquete-select" onchange="selectPackage(this.value)">';
  html += '<option value="">-- Elige un paquete --</option>';
  
  Object.values(PRICING_CONFIG.paquetes).forEach(paquete => {
    html += `<option value="${paquete.id}">${paquete.nombre} - ${formatPrice(paquete.precio_mensual)}/mes</option>`;
  });
  
  html += '</select>';
  html += '</div>';

  html += '<div class="input-group">';
  html += '<label for="meses-input">Cantidad de meses</label>';
  html += '<input type="number" id="meses-input" min="1" value="1" onchange="cambiarMeses(this.value)">';
  html += '</div>';

  html += '<div style="margin-top: var(--space-lg); padding-top: var(--space-lg); border-top: 1px solid var(--color-gray-200);">';
  html += '<p style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin: 0 0 var(--space-sm) 0;">Subtotal: <strong id="subtotal-precio">$0.00</strong></p>';
  html += '<p style="font-size: var(--font-size-sm); color: var(--color-gray-600); margin: 0;">IVA (16%): <strong id="iva-precio">$0.00</strong></p>';
  html += '</div>';

  contenedor.innerHTML = html;
}

/**
 * Seleccionar un paquete
 */
function selectPackage(paquete_id) {
  if (!paquete_id) {
    cotizador_state.paquete_seleccionado = null;
    cotizador_state.servicios_adicionales = [];
  } else {
    cotizador_state.paquete_seleccionado = paquete_id;
    cotizador_state.servicios_adicionales = [];
    cotizador_state.meses = PRICING_CONFIG.paquetes[paquete_id].minimo_meses;

    document.getElementById('meses-input').value = cotizador_state.meses;
  }

  // Mantener sincronizado el <select> del cotizador, incluso cuando
  // selectPackage() se llama desde afuera (botones de las tarjetas de precio)
  const select = document.getElementById('paquete-select');
  if (select) select.value = paquete_id || '';

  actualizarTotal();
}

/**
 * Elegir un paquete desde las tarjetas de precio: aplica la selección en el
 * cotizador y lo lleva a la vista para que el cambio de precio sea visible
 */
function elegirPaquete(paquete_id) {
  selectPackage(paquete_id);

  const cotizador = document.getElementById('cotizador');
  if (cotizador) cotizador.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Cambiar número de meses
 */
function cambiarMeses(valor) {
  cotizador_state.meses = Math.max(1, parseInt(valor) || 1);
  actualizarTotal();
}

/**
 * Calcular total
 */
function calcularTotal() {
  let subtotal = 0;

  // Si hay paquete seleccionado
  if (cotizador_state.paquete_seleccionado) {
    const paquete = PRICING_CONFIG.paquetes[cotizador_state.paquete_seleccionado];
    subtotal = paquete.precio_mensual * cotizador_state.meses;
  }

  // Agregar servicios adicionales
  cotizador_state.servicios_adicionales.forEach(servicio_id => {
    if (PRICING_CONFIG.servicios[servicio_id]) {
      subtotal += PRICING_CONFIG.servicios[servicio_id].precio;
    }
  });

  // Aplicar descuento si hay
  const descuento_monto = subtotal * (cotizador_state.descuento_pct / 100);
  const subtotal_con_descuento = subtotal - descuento_monto;

  // Calcular IVA
  const iva = subtotal_con_descuento * (PRICING_CONFIG.iva_porcentaje / 100);
  const total = subtotal_con_descuento + iva;

  return {
    subtotal: subtotal,
    descuento_monto: descuento_monto,
    subtotal_con_descuento: subtotal_con_descuento,
    iva: iva,
    total: total
  };
}

/**
 * Actualizar visualización del total
 */
function actualizarTotal() {
  const calculo = calcularTotal();

  // Actualizar valores en pantalla
  const subtotalElement = document.getElementById('subtotal-precio');
  const ivaElement = document.getElementById('iva-precio');
  const totalElement = document.getElementById('total-precio');

  if (subtotalElement) {
    subtotalElement.textContent = formatPrice(calculo.subtotal);
  }
  if (ivaElement) {
    ivaElement.textContent = formatPrice(calculo.iva);
  }
  if (totalElement) {
    totalElement.textContent = `${formatPrice(calculo.total)} MXN`;
  }

  // Habilitar botón WhatsApp solo si hay selección
  const btnWhatsApp = document.getElementById('btn-whatsapp');
  if (btnWhatsApp) {
    btnWhatsApp.disabled = !cotizador_state.paquete_seleccionado;
  }
}

/**
 * Formatear número a precio
 */
function formatPrice(valor) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(valor);
}

/**
 * Abrir WhatsApp con mensaje preformulado
 */
function openWhatsApp() {
  if (!cotizador_state.paquete_seleccionado) {
    alert('Por favor selecciona un paquete primero');
    return;
  }

  const calculo = calcularTotal();
  const paquete = PRICING_CONFIG.paquetes[cotizador_state.paquete_seleccionado];

  // Construir mensaje
  let mensaje = '\u{1F44B} Hola, me interesa la propuesta comercial de ADDV\n\n';
  mensaje += `\u2705 *Paquete Seleccionado:*\n${paquete.nombre}\n\n`;
  mensaje += `\u{1F4AC} *Cotización:*\n`;
  mensaje += `Subtotal: ${formatPrice(calculo.subtotal)}\n`;
  mensaje += `IVA (16%): ${formatPrice(calculo.iva)}\n`;
  mensaje += `*Total: ${formatPrice(calculo.total)}* (${cotizador_state.meses} mes${cotizador_state.meses > 1 ? 'es' : ''})\n\n`;
  mensaje += `Me gustaría conocer más detalles y proceder con la contratación.`;

  // Construir URL de WhatsApp
  const urlWhatsApp = `https://wa.me/${PRICING_CONFIG.numero_whatsapp}?text=${encodeURIComponent(mensaje)}`;

  // Abrir en nueva pestaña
  window.open(urlWhatsApp, '_blank');
}

/**
 * Copiar cotización (opcional)
 */
function copiarCotizacion() {
  const calculo = calcularTotal();
  const paquete = cotizador_state.paquete_seleccionado 
    ? PRICING_CONFIG.paquetes[cotizador_state.paquete_seleccionado].nombre 
    : 'Sin paquete';

  let texto = `Cotización ADDV\n`;
  texto += `Paquete: ${paquete}\n`;
  texto += `Subtotal: ${formatPrice(calculo.subtotal)}\n`;
  texto += `IVA: ${formatPrice(calculo.iva)}\n`;
  texto += `Total: ${formatPrice(calculo.total)}\n`;

  navigator.clipboard.writeText(texto).then(() => {
    alert('Cotización copiada al portapapeles');
  });
}

// Exportar para uso global
window.selectPackage = selectPackage;
window.elegirPaquete = elegirPaquete;
window.cambiarMeses = cambiarMeses;
window.openWhatsApp = openWhatsApp;
window.copiarCotizacion = copiarCotizacion;
window.PRICING_DEFAULTS = PRICING_DEFAULTS;
window.aplicarOverridesPrecios = aplicarOverridesPrecios;
window.restaurarPreciosOriginales = restaurarPreciosOriginales;
window.actualizarPreciosVisibles = actualizarPreciosVisibles;
window.cargarConfigPublicado = cargarConfigPublicado;
window.aplicarConfigPublicado = aplicarConfigPublicado;
