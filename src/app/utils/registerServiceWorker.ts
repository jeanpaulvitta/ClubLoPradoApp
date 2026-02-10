/**
 * Registra el Service Worker de manera segura
 * Solo se activa en entornos compatibles (HTTPS o localhost)
 */

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  // Verificar soporte
  if (!('serviceWorker' in navigator)) {
    return null;
  }

  // Verificar contexto seguro
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname === '[::1]';
  const isHTTPS = window.location.protocol === 'https:';
  
  // Detectar si estamos en Figma Make o entorno similar
  const isFigmaPreview = window.location.hostname.includes('figma');
  const isPreviewEnvironment = window.location.hostname.includes('preview') || 
                               window.location.hostname.includes('iframe');
  
  // No intentar registrar en entornos de preview
  if (isFigmaPreview || isPreviewEnvironment) {
    return null;
  }
  
  if (!isHTTPS && !isLocalhost) {
    return null;
  }

  try {
    // Registrar el Service Worker directamente sin verificación previa
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none'
    });

    console.log('✅ Service Worker registrado:', registration.scope);

    // Manejar actualizaciones
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('🔄 Nueva versión del Service Worker disponible');
          }
        });
      }
    });

    return registration;
  } catch (error) {
    // Fallo silencioso - la app continúa normalmente
    return null;
  }
}

/**
 * Desregistra todos los Service Workers
 * Útil para desarrollo o troubleshooting
 */
export async function unregisterServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
      console.log('🗑️ Service Worker desregistrado');
    }
  } catch (error) {
    console.error('❌ Error al desregistrar Service Worker:', error);
  }
}

/**
 * Verifica si hay un Service Worker activo
 */
export function hasActiveServiceWorker(): boolean {
  return !!(navigator.serviceWorker && navigator.serviceWorker.controller);
}

/**
 * Verifica si el entorno soporta Service Workers
 */
export function isServiceWorkerSupported(): boolean {
  const hasSupport = 'serviceWorker' in navigator;
  const isSecure = window.isSecureContext;
  
  return hasSupport && isSecure;
}