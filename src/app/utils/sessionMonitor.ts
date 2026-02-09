/**
 * Monitor de sesión para detectar problemas de autenticación
 * 
 * Este módulo ayuda a diagnosticar por qué se está cerrando la sesión
 */

let sessionLostCount = 0;
let lastSessionCheck = Date.now();

export interface SessionEvent {
  timestamp: number;
  type: 'login' | 'logout' | 'check' | 'lost' | 'error';
  message: string;
  details?: any;
}

const sessionEvents: SessionEvent[] = [];
const MAX_EVENTS = 50;

export function logSessionEvent(type: SessionEvent['type'], message: string, details?: any) {
  const event: SessionEvent = {
    timestamp: Date.now(),
    type,
    message,
    details,
  };
  
  sessionEvents.push(event);
  
  // Mantener solo los últimos MAX_EVENTS eventos
  if (sessionEvents.length > MAX_EVENTS) {
    sessionEvents.shift();
  }
  
  // Log con emoji según el tipo
  const emoji = {
    login: '🔑',
    logout: '🚪',
    check: '✅',
    lost: '⚠️',
    error: '❌',
  }[type];
  
  console.log(`${emoji} [SESSION ${type.toUpperCase()}] ${message}`, details || '');
  
  // Si hay pérdida de sesión frecuente, alertar
  if (type === 'lost') {
    sessionLostCount++;
    
    if (sessionLostCount >= 3) {
      console.error('🚨 ALERTA: Sesión perdida múltiples veces. Posibles causas:');
      console.error('1. Token de Supabase expirando demasiado rápido');
      console.error('2. Problema de conectividad con el backend');
      console.error('3. Error en la lógica de verificación de sesión');
      console.error('4. Problemas con localStorage');
      
      // Mostrar historial de eventos
      console.table(sessionEvents.slice(-10));
    }
  }
}

export function getSessionEvents(): SessionEvent[] {
  return [...sessionEvents];
}

export function getSessionStats() {
  const now = Date.now();
  const timeSinceLastCheck = now - lastSessionCheck;
  
  return {
    sessionLostCount,
    timeSinceLastCheck,
    lastSessionCheck,
    eventsCount: sessionEvents.length,
    recentEvents: sessionEvents.slice(-5),
  };
}

export function updateLastSessionCheck() {
  lastSessionCheck = Date.now();
}

export function resetSessionLostCount() {
  sessionLostCount = 0;
}

// Detectar si la sesión se pierde durante la navegación
export function monitorSessionChanges() {
  let previousUser: any = null;
  
  setInterval(() => {
    const sessionData = localStorage.getItem('supabase_session');
    
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        
        if (previousUser && !session) {
          logSessionEvent('lost', 'Sesión perdida durante monitoreo', {
            previousUser: previousUser.email,
          });
        }
        
        previousUser = session;
      } catch (error) {
        logSessionEvent('error', 'Error al parsear sesión en monitoreo', error);
      }
    } else if (previousUser) {
      logSessionEvent('lost', 'Sesión eliminada de localStorage', {
        previousUser: previousUser.email,
      });
      previousUser = null;
    }
  }, 10000); // Verificar cada 10 segundos
}

// Iniciar monitoreo automáticamente
if (typeof window !== 'undefined') {
  monitorSessionChanges();
}
