/**
 * ADDV Admin — Autenticación
 *
 * ADVERTENCIA: sitio 100% estático (GitHub Pages, sin backend).
 * Este gate es client-side únicamente — cualquiera con DevTools puede
 * leer ADMIN_PASSWORD_HASH y, con esfuerzo, evadirlo. No protege datos
 * sensibles reales; solo evita que un visitante casual toque el panel.
 * Password por defecto: "addv2026" — cámbiala regenerando el hash abajo.
 */

const ADMIN_AUTH_CONFIG = {
  // SHA-256 de "addv2026". Regenerar con: hashearPassword('nueva_password').then(console.log)
  passwordHash: 'c247f18949c271e7a0bc4744ece3c28cd7847e24d3b2ed718bf6ce0b7aa95f61',
  sessionKey: 'addv_admin_session',
  sessionDurationMs: 1000 * 60 * 60 * 2 // 2 horas
};

/**
 * Hashear texto con SHA-256 (Web Crypto API)
 * @param {string} texto
 * @returns {Promise<string>}
 */
async function hashearPassword(texto) {
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Intentar iniciar sesión de admin
 * @param {string} password
 * @returns {Promise<boolean>}
 */
async function intentarLogin(password) {
  const hash = await hashearPassword(password);

  if (hash !== ADMIN_AUTH_CONFIG.passwordHash) {
    return false;
  }

  const sesion = { autenticado: true, expira: Date.now() + ADMIN_AUTH_CONFIG.sessionDurationMs };
  sessionStorage.setItem(ADMIN_AUTH_CONFIG.sessionKey, JSON.stringify(sesion));
  return true;
}

/**
 * Verificar si hay sesión de admin válida (no expirada)
 * @returns {boolean}
 */
function haySesionAdminValida() {
  try {
    const raw = sessionStorage.getItem(ADMIN_AUTH_CONFIG.sessionKey);
    if (!raw) return false;

    const sesion = JSON.parse(raw);
    return !!sesion.autenticado && Date.now() < sesion.expira;
  } catch (e) {
    return false;
  }
}

/**
 * Cerrar sesión de admin
 */
function cerrarSesionAdmin() {
  sessionStorage.removeItem(ADMIN_AUTH_CONFIG.sessionKey);
}

/**
 * Exigir sesión de admin en la página actual; redirige a login si no hay
 */
function exigirSesionAdmin() {
  if (!haySesionAdminValida()) {
    window.location.href = 'login.html';
  }
}

window.hashearPassword = hashearPassword;
window.intentarLogin = intentarLogin;
window.haySesionAdminValida = haySesionAdminValida;
window.cerrarSesionAdmin = cerrarSesionAdmin;
window.exigirSesionAdmin = exigirSesionAdmin;
