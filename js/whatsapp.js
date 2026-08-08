/**
 * ADDV WhatsApp Integration
 * Manejo de botón flotante, generación de mensajes, tracking
 */

const WHATSAPP_CONFIG = {
  numero: '525539944697',
  nombre_empresa: 'ADDV'
};

/**
 * Rastrear clicks en WhatsApp (analytics)
 */
function rastrearWhatsAppClick() {
  // Intentar usar Google Analytics si está disponible
  if (typeof gtag !== 'undefined') {
    gtag('event', 'whatsapp_click', {
      'event_category': 'engagement',
      'event_label': 'whatsapp_button'
    });
  }

  // Rastreo local con localStorage
  const hoy = new Date().toISOString().split('T')[0];
  const clave = `whatsapp_clicks_${hoy}`;
  const clicks = parseInt(localStorage.getItem(clave) || '0') + 1;
  localStorage.setItem(clave, clicks);

  console.log(`WhatsApp clicks hoy: ${clicks}`);
}

/**
 * Generar mensaje personalizado para WhatsApp
 * @param {Object} datos - Datos de la cotización
 * @returns {string} Mensaje formateado
 */
function generarMensajeWhatsApp(datos) {
  let mensaje = '👋 Hola, me interesa los servicios de ADDV\n\n';

  if (datos.paquete) {
    mensaje += `📦 *Paquete:* ${datos.paquete}\n`;
  }

  if (datos.total) {
    mensaje += `💰 *Total:* ${formatPrice(datos.total)} MXN\n`;
  }

  if (datos.consulta) {
    mensaje += `\n📝 *Mi consulta:*\n${datos.consulta}\n`;
  }

  mensaje += `\nMe gustaría conocer más detalles.`;

  return mensaje;
}

/**
 * Enviar consulta por WhatsApp con datos personalizados
 * @param {Object} datos - {paquete, total, consulta}
 */
function enviarPorWhatsApp(datos) {
  const mensaje = generarMensajeWhatsApp(datos);
  const url = `https://wa.me/${WHATSAPP_CONFIG.numero}?text=${encodeURIComponent(mensaje)}`;
  
  window.open(url, '_blank', 'width=600,height=700');
  rastrearWhatsAppClick();
}

/**
 * Crear enlace de WhatsApp predefinido
 * @param {string} mensaje - Mensaje a enviar
 * @returns {string} URL de WhatsApp
 */
function crearEnlaceWhatsApp(mensaje) {
  return `https://wa.me/${WHATSAPP_CONFIG.numero}?text=${encodeURIComponent(mensaje)}`;
}

/**
 * Verificar si WhatsApp está disponible en el dispositivo
 * @returns {boolean}
 */
function tieneWhatsApp() {
  return /android|iphone|ipad|windows phone/i.test(navigator.userAgent.toLowerCase());
}

/**
 * Helper para formatear precios
 */
function formatPrice(valor) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(valor);
}

// Exportar funciones globales
window.enviarPorWhatsApp = enviarPorWhatsApp;
window.crearEnlaceWhatsApp = crearEnlaceWhatsApp;
window.tieneWhatsApp = tieneWhatsApp;
