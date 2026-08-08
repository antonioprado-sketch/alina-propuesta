/**
 * ADDV Landing Page — Main Script
 * Funciones principales, inicialización, navegación, smooth scroll
 */

// Configuración global
const APP_CONFIG = {
  nombre: 'ADDV',
  version: '1.0.0',
  debug: true
};

/**
 * Inicialización de la aplicación
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log(`${APP_CONFIG.nombre} v${APP_CONFIG.version} inicializado`);
  
  inicializarNavegacion();
  inicializarSmoothScroll();
  inicializarHeaderScroll();
  inicializarA11y();
  // aplicarOverridesContenido() la dispara js/cotizador.js una vez cargado
  // data/config.json, para no pintar el contenido dos veces (flash de texto viejo).
});

/**
 * Inicializar navegación y links internos
 */
function inicializarNavegacion() {
  // Manejar clicks en links internos
  document.querySelectorAll('a[href^="#"]').forEach(enlace => {
    enlace.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href === '#') return;
      
      e.preventDefault();
      
      const elemento = document.querySelector(href);
      if (elemento) {
        elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/**
 * Smooth scroll (fallback si CSS no lo soporta)
 */
function inicializarSmoothScroll() {
  // Los navegadores modernos soportan scroll-behavior en CSS
  // Este es solo un fallback para navegadores antiguos
  
  if (!('scrollBehavior' in document.documentElement.style)) {
    document.querySelectorAll('a[href^="#"]').forEach(enlace => {
      enlace.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
          const elemento = document.querySelector(href);
          if (elemento) {
            polyfillSmoothScroll(elemento);
          }
        }
      });
    });
  }
}

/**
 * Polyfill para smooth scroll en navegadores antiguos
 */
function polyfillSmoothScroll(elemento) {
  const start = window.pageYOffset;
  const target = elemento.getBoundingClientRect().top + start;
  const duration = 1000; // 1 segundo
  const startTime = performance.now();

  function scroll(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out-cubic)
    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
    
    window.scrollTo(0, start + (target - start) * easeOutCubic);
    
    if (progress < 1) {
      requestAnimationFrame(scroll);
    }
  }

  requestAnimationFrame(scroll);
}

/**
 * Cambiar header al scrollear
 */
function inicializarHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScrollTop = 0;
  let ticking = false;

  function actualizarHeader() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 20) {
      header.style.boxShadow = 'var(--shadow-md)';
    } else {
      header.style.boxShadow = 'var(--shadow-sm)';
    }

    lastScrollTop = scrollTop;
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(actualizarHeader);
      ticking = true;
    }
  }, { passive: true });

  // Llamada inicial
  actualizarHeader();
}

/**
 * Mejorar accesibilidad
 */
function inicializarA11y() {
  // Agregar focus-visible para navegación por teclado
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
  });

  // Agregar estilos para keyboard navigation
  const style = document.createElement('style');
  style.textContent = `
    .keyboard-nav *:focus {
      outline: 2px solid var(--color-cyan);
      outline-offset: 2px;
    }

    /* Skip to main content link */
    .skip-link {
      position: absolute;
      top: -40px;
      left: 0;
      background: var(--color-navy);
      color: var(--color-white);
      padding: 8px;
      text-decoration: none;
      z-index: 100;
    }

    .skip-link:focus {
      top: 0;
    }
  `;
  document.head.appendChild(style);

  // Agregar skip link si no existe
  if (!document.querySelector('.skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Ir al contenido principal';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // Asegurar que main tiene id
  const main = document.querySelector('main');
  if (main && !main.id) {
    main.id = 'main';
  }
}

/**
 * Utilidades de almacenamiento local
 */
const Storage = {
  get: function(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.warn('Error reading from localStorage:', e);
      return null;
    }
  },

  set: function(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('Error writing to localStorage:', e);
      return false;
    }
  },

  remove: function(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn('Error removing from localStorage:', e);
      return false;
    }
  },

  clear: function() {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.warn('Error clearing localStorage:', e);
      return false;
    }
  }
};

/**
 * Funciones de logging (development only)
 */
const Logger = {
  log: function(mensaje, datos) {
    if (APP_CONFIG.debug) {
      console.log(`[${APP_CONFIG.nombre}] ${mensaje}`, datos || '');
    }
  },

  warn: function(mensaje, datos) {
    if (APP_CONFIG.debug) {
      console.warn(`[${APP_CONFIG.nombre}] ⚠️ ${mensaje}`, datos || '');
    }
  },

  error: function(mensaje, datos) {
    console.error(`[${APP_CONFIG.nombre}] ❌ ${mensaje}`, datos || '');
  }
};

/**
 * Helper para trackear eventos (placeholder para GA)
 */
function rastrearEvento(categoria, accion, etiqueta) {
  // Google Analytics (si está configurado)
  if (typeof gtag !== 'undefined') {
    gtag('event', accion, {
      'event_category': categoria,
      'event_label': etiqueta
    });
  }

  // Log local
  Logger.log(`Evento rastreado: ${categoria} > ${accion}`, etiqueta);
  registrarEventoLocal(categoria, accion, etiqueta);
}

/**
 * Overrides de contenido y log de eventos (usados por el panel admin)
 * Nota: sitio estático sin backend — todo vive en localStorage de este navegador
 */
const CONTENT_OVERRIDES_KEY = 'addv_content_overrides';
const EVENT_LOG_KEY = 'addv_event_log';
const EVENT_LOG_MAX = 200;

/**
 * Sobreescribir textos de la landing: primero lo publicado en data/config.json
 * (window.CONFIG_CONTENIDO_PUBLICADO, ver js/cotizador.js), y encima la vista
 * previa local sin publicar del panel admin (localStorage) si existe.
 */
function aplicarOverridesContenido() {
  const publicado = window.CONFIG_CONTENIDO_PUBLICADO || {};
  Object.keys(publicado).forEach(key => {
    const el = document.querySelector(`[data-content-key="${key}"]`);
    if (el) el.textContent = publicado[key];
  });

  const overrides = Storage.get(CONTENT_OVERRIDES_KEY);
  if (!overrides) return;

  Object.keys(overrides).forEach(key => {
    const el = document.querySelector(`[data-content-key="${key}"]`);
    if (el) el.textContent = overrides[key];
  });
}

/**
 * Guardar overrides de contenido desde el panel admin
 * @param {Object} overrides - mapa data-content-key -> texto
 */
function guardarOverridesContenido(overrides) {
  return Storage.set(CONTENT_OVERRIDES_KEY, overrides);
}

/**
 * Borrar overrides de contenido (vuelve a los textos originales del HTML)
 */
function restaurarContenidoOriginal() {
  return Storage.remove(CONTENT_OVERRIDES_KEY);
}

/**
 * Agregar un evento al log local (acotado a EVENT_LOG_MAX entradas)
 */
function registrarEventoLocal(categoria, accion, etiqueta) {
  const log = Storage.get(EVENT_LOG_KEY) || [];
  log.push({ ts: Date.now(), categoria, accion, etiqueta: etiqueta || '' });

  if (log.length > EVENT_LOG_MAX) {
    log.splice(0, log.length - EVENT_LOG_MAX);
  }

  Storage.set(EVENT_LOG_KEY, log);
}

/**
 * Leer el log de eventos local (usado por el panel admin)
 */
function obtenerEventLog() {
  return Storage.get(EVENT_LOG_KEY) || [];
}

/**
 * Vaciar el log de eventos local
 */
function limpiarEventLog() {
  Storage.remove(EVENT_LOG_KEY);
}

/**
 * Detectar Device Type
 */
function detectarDispositivo() {
  const ua = navigator.userAgent.toLowerCase();
  
  if (/mobile|android|iphone|ipad|tablet|opera mini|windows phone/i.test(ua)) {
    return /ipad|android(?!.*mobile)/.test(ua) ? 'tablet' : 'mobile';
  }
  
  return 'desktop';
}

/**
 * Verificar conexión a internet
 */
function verificarConexion() {
  return navigator.onLine;
}

// Rastrear cambios de conexión
window.addEventListener('online', function() {
  Logger.log('Conexión restablecida');
  rastrearEvento('conexion', 'online', 'usuario_conectado');
});

window.addEventListener('offline', function() {
  Logger.warn('Conexión perdida');
  rastrearEvento('conexion', 'offline', 'usuario_desconectado');
});

/**
 * Función de ayuda: Copiar al portapapeles
 */
function copiarAlPortapapeles(texto) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(texto).then(() => {
      Logger.log('Texto copiado al portapapeles');
      return true;
    }).catch(() => {
      Logger.warn('Error al copiar al portapapeles');
      return false;
    });
  } else {
    // Fallback para navegadores antiguos
    const textarea = document.createElement('textarea');
    textarea.value = texto;
    document.body.appendChild(textarea);
    textarea.select();
    const resultado = document.execCommand('copy');
    document.body.removeChild(textarea);
    
    if (resultado) {
      Logger.log('Texto copiado al portapapeles (fallback)');
    }
    return resultado;
  }
}

/**
 * Función de ayuda: Obtener parámetros de URL
 */
function obtenerParametroURL(nombre) {
  const url = new URL(window.location);
  return url.searchParams.get(nombre);
}

/**
 * Función de ayuda: Debounce
 */
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Función de ayuda: Throttle
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Exportar funciones globales
window.Storage = Storage;
window.Logger = Logger;
window.rastrearEvento = rastrearEvento;
window.detectarDispositivo = detectarDispositivo;
window.verificarConexion = verificarConexion;
window.copiarAlPortapapeles = copiarAlPortapapeles;
window.obtenerParametroURL = obtenerParametroURL;
window.debounce = debounce;
window.throttle = throttle;
window.aplicarOverridesContenido = aplicarOverridesContenido;
window.guardarOverridesContenido = guardarOverridesContenido;
window.restaurarContenidoOriginal = restaurarContenidoOriginal;
window.obtenerEventLog = obtenerEventLog;
window.limpiarEventLog = limpiarEventLog;

// Log de inicialización
Logger.log('Dispositivo detectado:', detectarDispositivo());
Logger.log('Conexión disponible:', verificarConexion());
