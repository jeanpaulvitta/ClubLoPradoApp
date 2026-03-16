import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Label } from './ui/label';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { UserPlus, CheckCircle, XCircle, Clock, Copy, Shield, Mail, User, AlertCircle, AlertTriangle, ExternalLink, Share2, MessageCircle, QrCode, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import * as passwordRequestsApi from '../services/passwordRequests';
import type { PasswordRequest } from '../services/passwordRequests';

// Helper function para copiar texto al portapapeles con fallback
function copyToClipboard(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Método 1: Intentar usar la API del portapapeles moderna
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => resolve())
        .catch(() => {
          // Si falla, usar el método de fallback
          fallbackCopyTextToClipboard(text, resolve, reject);
        });
    } else {
      // Si no está disponible, usar directamente el fallback
      fallbackCopyTextToClipboard(text, resolve, reject);
    }
  });
}

// Método de fallback usando execCommand
function fallbackCopyTextToClipboard(text: string, resolve: () => void, reject: (error: Error) => void) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  
  // Evitar scroll
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (successful) {
      resolve();
    } else {
      reject(new Error('No se pudo copiar al portapapeles'));
    }
  } catch (err) {
    document.body.removeChild(textArea);
    reject(err instanceof Error ? err : new Error('Error al copiar'));
  }
}

// Funciones de localStorage eliminadas - ahora usamos Supabase KV store
// Las solicitudes se almacenan en el backend en "password-requests:list"

export function PasswordRequestsManager() {
  const [requests, setRequests] = useState<PasswordRequest[]>([]);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PasswordRequest | null>(null);
  const [approvedCredentials, setApprovedCredentials] = useState<{ email: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverConfigured, setServerConfigured] = useState<boolean | null>(null);
  const [healthCheckData, setHealthCheckData] = useState<any>(null);
  const [projectIdState, setProjectIdState] = useState<string>('vrclozhgaacehojbnpuo');
  const [showQRCode, setShowQRCode] = useState(false);

  // Obtener el contexto de autenticación
  const auth = useAuth();
  const { user, createUserAccount } = auth;

  useEffect(() => {
    // Solo cargar solicitudes si el usuario está autenticado
    if (user) {
      loadRequests();
    } else {
      console.log('⏸️ Usuario no autenticado, no se cargan solicitudes');
      setRequests([]);
    }
    
    checkServerConfig();
    loadProjectId();
  }, [user]); // Dependencia: volver a ejecutar cuando cambie el usuario

  const loadProjectId = async () => {
    try {
      const { projectId } = await import('../../../utils/supabase/info');
      setProjectIdState(projectId);
    } catch (error) {
      console.error('Error cargando projectId:', error);
    }
  };

  const checkServerConfig = async () => {
    try {
      const { projectId, publicAnonKey } = await import('../../../utils/supabase/info');
      const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc`;
      
      console.log('🔍 Verificando configuración del servidor...');
      console.log('📍 URL:', `${API_URL}/health`);
      
      // Enviar Authorization header con el ANON_KEY
      // Supabase requiere autenticación incluso para endpoints públicos
      const response = await fetch(`${API_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      console.log('📡 Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });
      
      // Si el servidor devuelve un error HTTP (401, 500, etc)
      if (!response.ok) {
        console.error('❌ El servidor respondió con error:', response.status, response.statusText);
        
        // Intentar leer el cuerpo de la respuesta para más detalles
        let errorDetails = '';
        try {
          const text = await response.text();
          console.error('📄 Cuerpo de la respuesta:', text);
          errorDetails = text;
        } catch (e) {
          console.error('⚠️ No se pudo leer el cuerpo de la respuesta');
        }
        
        // Si es 401, analizar el mensaje de error
        if (response.status === 401) {
          console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.error('⚠️ ERROR 401: PROBLEMA DE AUTENTICACIÓN');
          console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.error('');
          
          // Analizar el mensaje de error específico
          if (errorDetails.includes('Missing authorization header')) {
            console.error('❌ PROBLEMA: Edge Function requiere autenticación pero NO tiene');
            console.error('             configuradas las variables de entorno.');
            console.error('');
            console.error('Esto significa:');
            console.error('1. La Edge Function está desplegada ✅');
            console.error('2. Supabase está protegiendo la función con JWT ✅');
            console.error('3. PERO las variables de entorno NO están configuradas ❌');
          } else {
            console.error('1. La Edge Function está desplegada ✅');
            console.error('2. PERO las variables de entorno NO están configuradas ❌');
          }
          console.error('');
          console.error('🛠️ SOLUCIÓN:');
          console.error('');
          console.error('Paso 1: Ve a Supabase Dashboard');
          console.error('Paso 2: Edge Functions → make-server-4909a0bc → Settings');
          console.error('Paso 3: Agrega estas 3 variables (botón "Add new secret"):');
          console.error('');
          console.error('   Variable 1:');
          console.error('   Name:  SUPABASE_URL');
          console.error('   Value: https://vrclozhgaacehojbnpuo.supabase.co');
          console.error('');
          console.error('   Variable 2:');
          console.error('   Name:  SUPABASE_ANON_KEY');
          console.error('   Value: [Settings → API → anon key]');
          console.error('          Debe empezar con "eyJ" y tener ~300 caracteres');
          console.error('');
          console.error('   Variable 3:');
          console.error('   Name:  SUPABASE_SERVICE_ROLE_KEY');
          console.error('   Value: [Settings → API → service_role key]');
          console.error('          Debe empezar con "eyJ" y tener ~300 caracteres');
          console.error('');
          console.error('Paso 4: REDEPLOY la función (botón "Deploy")');
          console.error('Paso 5: Espera 1-2 minutos');
          console.error('Paso 6: Recarga esta página');
          console.error('');
          console.error('📖 Guía detallada: /CONFIGURAR_VARIABLES_ENTORNO.md');
          console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          
          setServerConfigured(false);
          return;
        }
        
        setServerConfigured(false);
        return;
      }
      
      const data = await response.json();
      console.log('✅ Health check data:', data);
      
      // Guardar los datos del health check para mostrarlos en el UI
      setHealthCheckData(data);
      
      // Verificar si el servidor tiene las variables configuradas Y son válidas
      const isConfigured = data.status === 'ok' && data.configured === true && data.valid === true;
      setServerConfigured(isConfigured);
      
      if (!isConfigured) {
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        if (data.valid === false) {
          console.error('❌ KEYS CONFIGURADAS PERO INVÁLIDAS!');
          console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.error('');
          console.error('⚠️ Las variables están SET pero con valores INCORRECTOS');
          console.error('');
          if (data.validationErrors) {
            data.validationErrors.forEach((err: string) => console.error('  ' + err));
          }
          console.error('');
          console.error('🔍 Debug info:');
          console.error('  SUPABASE_URL length:', data.debug?.urlLength, data.debug?.urlValid ? '✅' : '❌');
          console.error('  SERVICE_ROLE_KEY length:', data.debug?.serviceKeyLength, data.debug?.serviceKeyValid ? '✅' : '❌');
          console.error('  SERVICE_ROLE_KEY preview:', data.debug?.serviceKeyPreview);
          console.error('  ANON_KEY length:', data.debug?.anonKeyLength, data.debug?.anonKeyValid ? '✅' : '❌');
          console.error('  ANON_KEY preview:', data.debug?.anonKeyPreview);
          console.error('');
          console.error('🚨 PROBLEMA DETECTADO:');
          console.error('  Las keys parecen ser HASHES (SHA-256) en lugar de JWT tokens!');
          console.error('');
          console.error('✅ SOLUCIÓN:');
          console.error('  1. Ve a Supabase Dashboard → Settings → API → Project API keys');
          console.error('  2. Copia las keys COMPLETAS (empiezan con "eyJ", no con letras/números random)');
          console.error('  3. ANON_KEY debe tener ~200-300 caracteres');
          console.error('  4. SERVICE_ROLE_KEY debe tener ~200-300 caracteres');
          console.error('  5. Ve a Edge Functions → make-server-4909a0bc → Environment Variables');
          console.error('  6. BORRA las variables actuales');
          console.error('  7. Agrega nuevamente con las keys JWT CORRECTAS');
          console.error('  8. Redeploy la función');
        } else {
          console.error('⚠️ SERVIDOR RESPONDE PERO NO ESTÁ CONFIGURADO');
          console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.error('');
          console.error('Respuesta del servidor:', data);
          console.error('');
          console.error('Esto significa que:');
          console.error('- La función está desplegada ✅');
          console.error('- PERO las variables de entorno NO están configuradas ❌');
          console.error('');
          console.error('Sigue los pasos en /CONFIGURAR_VARIABLES_ENTORNO.md');
        }
        
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      } else {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ SERVIDOR CONFIGURADO CORRECTAMENTE');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('');
        console.log('El sistema de creación de usuarios está listo para usarse.');
        console.log('');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      }
    } catch (error) {
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ ERROR AL VERIFICAR CONFIGURACIÓN DEL SERVIDOR');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('');
      console.error('Detalles del error:', error);
      console.error('');
      console.error('Posibles causas:');
      console.error('1. La Edge Function NO está desplegada');
      console.error('2. Hay un error de red (CORS, timeout, etc)');
      console.error('3. La URL del proyecto es incorrecta');
      console.error('');
      console.error('Verifica:');
      console.error('- Edge Functions → make-server-4909a0bc → Status: "Active"');
      console.error('- Las variables de entorno están configuradas');
      console.error('- La función fue redesplegada después de agregar las variables');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      setServerConfigured(false);
    }
  };

  const loadRequests = async () => {
    // Verificar si hay usuario autenticado antes de intentar cargar
    if (!user) {
      console.log('⏸️ No hay usuario autenticado, saltando carga de solicitudes');
      setRequests([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('📋 Cargando solicitudes de contraseña desde Supabase...');
      
      const allRequests = await passwordRequestsApi.getPasswordRequests();
      
      console.log(`✅ ${allRequests.length} solicitudes cargadas`);
      setRequests(allRequests);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar solicitudes';
      
      // Solo loguear y mostrar toast si es un error real, no si es "no hay sesión"
      const isSessionError = errorMessage.includes('No hay sesión') || 
                             errorMessage.includes('sesión ha expirado') ||
                             errorMessage.includes('inicia sesión');
      
      if (!isSessionError) {
        console.error('Error cargando solicitudes:', error);
        toast.error(errorMessage);
      } else {
        // Es un error de sesión, solo log silencioso
        console.log('ℹ️ No se pudieron cargar solicitudes (sesión no activa)');
      }
      
      // Mostrar array vacío si hay error
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (request: PasswordRequest) => {
    setLoading(true);
    try {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔐 PasswordRequestsManager - Iniciando aprobación de solicitud');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━��━');
      console.log('📋 Datos de la solicitud:');
      console.log('  - ID:', request.id);
      console.log('  - Email:', request.email);
      console.log('  - Nombre:', request.name);
      console.log('  - Rol:', request.role);
      console.log('  - Estado actual:', request.status);
      console.log('');

      // MODO DEGRADADO: Si el servidor NO está configurado, usar generación local
      if (serverConfigured === false) {
        console.warn('⚠️ MODO DEGRADADO: Servidor no disponible, generando credenciales localmente');
        console.warn('   ADVERTENCIA: Esto NO crea una cuenta real en Supabase Auth');
        console.warn('   El usuario NO podrá iniciar sesión hasta que el backend esté configurado');
        
        // Confirmar con el usuario
        const confirmed = window.confirm(
          '⚠️ MODO DEGRADADO ACTIVADO\n\n' +
          'El servidor backend NO está disponible (Error 401).\n\n' +
          '🔧 Opciones:\n\n' +
          '1. CANCELAR y configurar el servidor primero (RECOMENDADO)\n' +
          '   - Click en "Abrir Supabase Dashboard"\n' +
          '   - Desplegar la Edge Function\n' +
          '   - Configurar variables de entorno\n\n' +
          '2. CONTINUAR en modo degradado (solo para testing)\n' +
          '   - Se generará una contraseña local\n' +
          '   - NO se creará cuenta en Supabase\n' +
          '   - El usuario NO podrá iniciar sesión\n\n' +
          '¿Deseas CONTINUAR en modo degradado?\n' +
          '(NO recomendado para producción)'
        );
        
        if (!confirmed) {
          console.log('✅ Usuario canceló. Debe configurar el servidor primero.');
          setLoading(false);
          toast.info('Configuración cancelada. Por favor, configura el servidor primero.', {
            duration: 5000,
          });
          return;
        }
        
        // Generar contraseña local (temporal)
        const generatedPassword = generateLocalPassword();
        
        console.warn('⚠️ Contraseña generada localmente (NO válida para login):', generatedPassword);
        
        // Actualizar el estado de la solicitud
        const updatedRequests = requests.map(req => 
          req.id === request.id 
            ? { ...req, status: 'approved' as const, generatedPassword }
            : req
        );
        
        savePasswordRequests(updatedRequests);
        setRequests(updatedRequests);
        
        // Mostrar credenciales generadas
        setApprovedCredentials({
          email: request.email,
          password: generatedPassword
        });
        setShowApproveDialog(true);
        
        toast.warning('⚠️ Credenciales generadas localmente. El usuario NO podrá iniciar sesión hasta que configures el servidor.', {
          duration: 8000,
        });
        
        console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.warn('⚠️ MODO DEGRADADO: Solicitud marcada como aprobada (sin cuenta real)');
        console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        setLoading(false);
        return;
      }

      // Verificar en tiempo real que el servidor funciona
      console.log('📍 Verificando configuración del servidor en tiempo real...');
      const { projectId } = await import('../../../utils/supabase/info');
      const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc`;
      
      // NO enviar Authorization header - es un endpoint público
      const healthCheck = await fetch(`${API_URL}/health`);
      
      if (!healthCheck.ok) {
        console.error('❌ BLOQUEADO: Health check falló con status:', healthCheck.status);
        setServerConfigured(false);
        toast.error('⚠️ El servidor no está disponible. Por favor, configúralo primero.', {
          duration: 6000,
        });
        setLoading(false);
        return;
      }
      
      const healthData = await healthCheck.json();
      
      if (healthData.status !== 'ok') {
        console.error('❌ BLOQUEADO: Health check falló:', healthData);
        setServerConfigured(false);
        toast.error('⚠️ El servidor no está disponible. Por favor, configúralo primero.', {
          duration: 6000,
        });
        setLoading(false);
        return;
      }
      
      console.log('✅ Servidor verificado y funcionando correctamente');
      
      // Verificar que tenemos usuario admin autenticado
      if (!user) {
        console.error('❌ No hay usuario autenticado');
        throw new Error('No hay usuario autenticado. Por favor, inicia sesión.');
      }
      
      console.log('✅ Usuario actual:', user.email, '(Rol:', user.role, ')');
      
      if (user.role !== 'admin') {
        console.error('❌ Usuario no es admin:', user.role);
        throw new Error('Solo los administradores pueden aprobar solicitudes.');
      }
      
      console.log('');
      console.log('📍 Llamando a createUserAccount...');
      
      // Crear la cuenta del usuario con Supabase Auth
      const credentials = await createUserAccount(request.email, request.name, request.role);
      
      console.log('');
      console.log('✅ PasswordRequestsManager - Credenciales recibidas:');
      console.log('  - Email:', credentials.email);
      console.log('  - Password length:', credentials.password.length);
      console.log('  - Password preview:', credentials.password.substring(0, 10) + '...');
      console.log('');
      
      // Actualizar el estado de la solicitud
      const updatedRequests = requests.map(req => 
        req.id === request.id 
          ? { ...req, status: 'approved' as const, generatedPassword: credentials.password }
          : req
      );
      
      savePasswordRequests(updatedRequests);
      setRequests(updatedRequests);
      
      // Mostrar credenciales generadas
      setApprovedCredentials(credentials);
      setShowApproveDialog(true);
      
      console.log('✅ PasswordRequestsManager - Solicitud aprobada y credenciales guardadas');
      console.log('⚠️ RECORDATORIO: Debes aprobar al usuario en Supabase Dashboard');
      console.log('📋 Dashboard → Authentication → Users → Editar usuario → Cambiar status a "approved"');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      toast.success('Cuenta creada - Recuerda aprobar al usuario en el Dashboard de Supabase', {
        duration: 6000,
      });
    } catch (error) {
      console.error('');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ PasswordRequestsManager - Error al aprobar solicitud');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('Error object:', error);
      console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('Error message:', error instanceof Error ? error.message : String(error));
      if (error instanceof Error && error.stack) {
        console.error('Error stack:', error.stack);
      }
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('');
      
      // Verificar si el error es por email duplicado
      const errorMessage = error instanceof Error ? error.message : 'Error al aprobar solicitud';
      
      if (errorMessage.includes('already') || errorMessage.includes('exists') || errorMessage.includes('duplicate') || errorMessage.includes('ya existe')) {
        // Marcar como aprobada con nota especial
        const updatedRequests = requests.map(req => 
          req.id === request.id 
            ? { ...req, status: 'approved' as const, generatedPassword: 'Usuario ya existe' }
            : req
        );
        
        savePasswordRequests(updatedRequests);
        setRequests(updatedRequests);
        
        toast.error('Este usuario ya tiene una cuenta creada. La solicitud se marcó como aprobada.');
      } else if (errorMessage.includes('sesión ha expirado') || errorMessage.includes('vuelve a iniciar sesión')) {
        toast.error('Tu sesión ha expirado. Por favor, cierra sesión y vuelve a iniciar sesión.', {
          duration: 5000,
        });
      } else {
        toast.error(`Error: ${errorMessage}`, {
          duration: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = (requestId: string) => {
    const updatedRequests = requests.map(req => 
      req.id === requestId 
        ? { ...req, status: 'rejected' as const }
        : req
    );
    
    savePasswordRequests(updatedRequests);
    setRequests(updatedRequests);
    toast.success('Solicitud rechazada');
  };

  const handleCopyCredentials = () => {
    if (approvedCredentials) {
      const message = `🏊‍♂️ CLUB NATACIÓN LO PRADO - Credenciales de Acceso

¡Hola! Tu solicitud de acceso ha sido aprobada.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Email: ${approvedCredentials.email}
🔑 Contraseña: ${approvedCredentials.password}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 INSTRUCCIONES:
1. Ingresa a la aplicación con estas credenciales
2. Cambia tu contraseña desde tu perfil (recomendado)
3. La contraseña es temporal y única

⚠️ IMPORTANTE: 
• Guarda estas credenciales en un lugar seguro
• No compartas tu contraseña con nadie
• Si olvidas tu contraseña, contacta al administrador

¡Bienvenido al equipo del Club Natación Lo Prado! 🏊‍♂️💪`;
      
      copyToClipboard(message).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('✅ Mensaje completo copiado al portapapeles');
      }).catch(error => {
        toast.error(error instanceof Error ? error.message : 'Error al copiar');
      });
    }
  };

  const handleCopyEmail = () => {
    if (approvedCredentials) {
      copyToClipboard(approvedCredentials.email).then(() => {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
        toast.success('Email copiado al portapapeles');
      }).catch(error => {
        toast.error(error instanceof Error ? error.message : 'Error al copiar');
      });
    }
  };

  const handleCopyPassword = () => {
    if (approvedCredentials) {
      copyToClipboard(approvedCredentials.password).then(() => {
        setCopiedPassword(true);
        setTimeout(() => setCopiedPassword(false), 2000);
        toast.success('Contraseña copiada al portapapeles');
      }).catch(error => {
        toast.error(error instanceof Error ? error.message : 'Error al copiar');
      });
    }
  };

  const handleShareWhatsApp = () => {
    if (approvedCredentials) {
      const message = `🏊‍♂️ *CLUB NATACIÓN LO PRADO*
Credenciales de Acceso

¡Hola! Tu solicitud de acceso ha sido aprobada.

━━━━━━━━━━━━━━━━━━
📧 *Email:* ${approvedCredentials.email}
🔑 *Contraseña:* ${approvedCredentials.password}
━━━━━━━━━━━━━━━━━━

📝 *INSTRUCCIONES:*
1. Ingresa a la aplicación
2. Cambia tu contraseña desde tu perfil
3. La contraseña es temporal

⚠️ *IMPORTANTE:*
• Guarda estas credenciales en un lugar seguro
• No compartas tu contraseña con nadie

¡Bienvenido al equipo! 🏊‍♂️💪`;
      
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
      toast.success('✅ Abriendo WhatsApp...');
    }
  };

  const handleShareEmail = () => {
    if (approvedCredentials) {
      const subject = encodeURIComponent('🏊‍♂️ Credenciales de Acceso - Club Natación Lo Prado');
      const body = encodeURIComponent(`¡Hola!

Tu solicitud de acceso al sistema del Club Natación Lo Prado ha sido aprobada.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Email: ${approvedCredentials.email}
🔑 Contraseña: ${approvedCredentials.password}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 INSTRUCCIONES:
1. Ingresa a la aplicación con estas credenciales
2. Cambia tu contraseña desde tu perfil (recomendado)
3. La contraseña es temporal y única

⚠️ IMPORTANTE:
• Guarda estas credenciales en un lugar seguro
• No compartas tu contraseña con nadie
 Si olvidas tu contraseña, contacta al administrador

¡Bienvenido al equipo del Club Natación Lo Prado! 🏊‍♂️💪`);
      
      window.location.href = `mailto:${approvedCredentials.email}?subject=${subject}&body=${body}`;
      toast.success('✅ Abriendo cliente de correo...');
    }
  };

  const handleToggleQRCode = () => {
    setShowQRCode(!showQRCode);
  };

  const getQRCodeData = () => {
    if (!approvedCredentials) return '';
    return JSON.stringify({
      type: 'club_natacion_lo_prado',
      email: approvedCredentials.email,
      password: approvedCredentials.password,
      timestamp: new Date().toISOString()
    });
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const approvedRequests = requests.filter(r => r.status === 'approved');
  const rejectedRequests = requests.filter(r => r.status === 'rejected');

  const testAuth = async () => {
    console.log('🧪 Iniciando prueba de autenticación...');
    
    // Verificar que haya un usuario antes de probar
    if (!user) {
      console.log('ℹ️ No hay usuario autenticado. Inicia sesión primero.');
      toast.info('Por favor, inicia sesión antes de probar la autenticación.');
      return;
    }
    
    try {
      const { projectId, publicAnonKey } = await import('../../../utils/supabase/info');
      const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc`;
      
      console.log('📍 URL del servidor:', API_URL);
      console.log('📍 Usuario actual:', user?.email, '(ID:', user?.id, ')');
      
      // Verificar sesión de Supabase
      const { supabase } = await import('../services/supabaseClient');
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.log('ℹ️ Error obteniendo sesión:', sessionError.message);
        toast.error('Error al obtener sesión: ' + sessionError.message);
        return;
      }
      
      if (!sessionData.session) {
        console.error('❌ No hay sesión activa en Supabase');
        toast.error('No hay sesión activa. Por favor, cierra sesión y vuelve a iniciar sesión.');
        return;
      }
      
      const token = sessionData.session.access_token;
      console.log('✅ Token obtenido de sesión');
      console.log('   Longitud:', token.length);
      console.log('   Preview:', token.substring(0, 50) + '...');
      console.log('   Expira en:', sessionData.session.expires_at ? new Date(sessionData.session.expires_at * 1000).toLocaleString() : 'desconocido');
      
      // Probar endpoint de health
      console.log('📍 Probando endpoint de health...');
      const healthResponse = await fetch(`${API_URL}/health`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      const healthData = await healthResponse.json();
      console.log('✅ Health check:', healthData);
      
      // Verificar si el servidor está configurado
      if (healthData.status !== 'ok') {
        console.error('❌ Servidor NO configurado correctamente:', healthData);
        setServerConfigured(false);
        toast.error('⚠️ El servidor NO está configurado. Revisa /SOLUCION_INVALID_JWT.md', {
          duration: 8000,
        });
        
        // Mostrar alerta con instrucciones
        alert(`🚨 SERVIDOR NO CONFIGURADO\n\n` +
          `El servidor Edge Function necesita configuración.\n\n` +
          `📋 SOLUCIÓN RÁPIDA (5 minutos):\n\n` +
          `1. Ve a: https://supabase.com/dashboard/project/${projectId}\n` +
          `2. Edge Functions → make-server-4909a0bc → Settings/Secrets\n` +
          `3. Agrega estas 3 variables de entorno:\n` +
          `   • SUPABASE_URL\n` +
          `   • SUPABASE_ANON_KEY\n` +
          `   • SUPABASE_SERVICE_ROLE_KEY\n\n` +
          `4. Reinicia la Edge Function\n\n` +
          `📄 Ver instrucciones completas en:\n` +
          `/SOLUCION_INVALID_JWT.md`);
        return;
      }
      
      setServerConfigured(true);
      
      // Probar autenticación con el token
      console.log('📍 Probando autenticación con token...');
      const testResponse = await fetch(`${API_URL}/auth/session`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!testResponse.ok) {
        const errorData = await testResponse.json();
        
        // Detectar si es error de autenticación (401/JWT)
        const isAuthError = errorData.code === 401 || errorData.message?.includes('JWT');
        
        if (isAuthError) {
          console.log('ℹ️ Error de autenticación (JWT):', errorData);
        } else {
          console.error('❌ Error de autenticación:', errorData);
        }
        
        if (errorData.message === 'Invalid JWT') {
          toast.error('⚠️ Error de autenticación JWT. Revisa /SOLUCION_INVALID_JWT.md', {
            duration: 8000,
          });
          
          alert(`🚨 ERROR: Invalid JWT\n\n` +
            `El token de autenticación no es válido.\n\n` +
            `Esto usualmente significa que las variables de entorno\n` +
            `en Supabase Edge Functions están mal configuradas.\n\n` +
            `📋 SOLUCIÓN:\n` +
            `Ver archivo /SOLUCION_INVALID_JWT.md para\n` +
            `instrucciones paso a paso.`);
        } else {
          toast.error('Error de autenticación: ' + (errorData.message || 'Desconocido'));
        }
        return;
      }
      
      const sessionCheckData = await testResponse.json();
      console.log('✅ Sesión verificada:', sessionCheckData);
      
      setServerConfigured(true);
      toast.success('✅ Autenticación funcionando correctamente');
    } catch (error) {
      console.error('❌ Error en prueba de autenticación:', error);
      toast.error('Error: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  if (user?.role !== 'admin') {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            Solo los administradores pueden acceder a esta sección
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alerta de servidor no configurado */}
      {serverConfigured === false && (
        <Alert variant="destructive" className="border-red-300 bg-red-50">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-red-900 font-bold text-lg">
            {healthCheckData?.valid === false ? '🔑 Keys Configuradas PERO Inválidas' : '🚨 Servidor Backend NO Disponible'}
          </AlertTitle>
          <AlertDescription className="text-red-800">
            <div className="space-y-3 mt-3">
              <>
              {/* CASO 1: Keys inválidas (placeholders sb_secret_xxx) */}
              {healthCheckData?.valid === false && (
                <div className="bg-white border border-red-200 rounded-lg p-4">
                  <p className="font-semibold text-base mb-2 text-red-900">
                    ❌ PROBLEMA DETECTADO: Estás usando PLACEHOLDERS en lugar de las Keys JWT reales
                  </p>
                  
                  <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-3 my-3">
                    <p className="font-bold text-yellow-900 mb-2">Estado del Servidor:</p>
                    <div className="space-y-1 text-sm font-mono bg-white p-2 rounded border border-yellow-200">
                      <div className="flex justify-between">
                        <span>SUPABASE_URL:</span>
                        <span className={healthCheckData.debug?.urlValid ? 'text-green-600' : 'text-red-600'}>
                          {healthCheckData.debug?.urlLength} chars {healthCheckData.debug?.urlValid ? '✅' : '❌'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>SERVICE_ROLE_KEY:</span>
                        <span className={healthCheckData.debug?.serviceKeyValid ? 'text-green-600' : 'text-red-600'}>
                          {healthCheckData.debug?.serviceKeyLength} chars {healthCheckData.debug?.serviceKeyValid ? '✅' : '❌'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 ml-4">
                        Preview: {healthCheckData.debug?.serviceKeyPreview}
                      </div>
                      <div className="flex justify-between">
                        <span>ANON_KEY:</span>
                        <span className={healthCheckData.debug?.anonKeyValid ? 'text-green-600' : 'text-red-600'}>
                          {healthCheckData.debug?.anonKeyLength} chars {healthCheckData.debug?.anonKeyValid ? '✅' : '❌'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 ml-4">
                        Preview: {healthCheckData.debug?.anonKeyPreview}
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-300 rounded-lg p-3 my-3">
                    <p className="font-bold text-red-900 mb-2">🚨 El Problema:</p>
                    <p className="text-sm text-red-800">
                      Las keys que configuraste son <strong>referencias/placeholders</strong> (como <code className="bg-red-100 px-1 rounded">sb_secret_xxx</code> o <code className="bg-red-100 px-1 rounded">sb_publish_xxx</code>), 
                      NO las keys JWT reales que empiezan con <code className="bg-green-100 px-1 rounded">eyJ</code>.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-300 rounded-lg p-3">
                    <p className="font-bold text-blue-900 mb-2">✅ Solución (3 minutos):</p>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li className="text-blue-800">
                        <strong>Ve a Settings → API</strong> en Supabase Dashboard
                      </li>
                      <li className="text-blue-800">
                        Copia las <strong>keys COMPLETAS</strong>:
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                          <li><code className="bg-blue-100 px-1 rounded text-xs">anon public</code> → debe empezar con <code className="bg-green-100 px-1 rounded text-xs">eyJ</code> (~205 chars)</li>
                          <li><code className="bg-blue-100 px-1 rounded text-xs">service_role secret</code> → debe empezar con <code className="bg-green-100 px-1 rounded text-xs">eyJ</code> (~300 chars)</li>
                        </ul>
                      </li>
                      <li className="text-blue-800">
                        Ve a <strong>Edge Functions → make-server-4909a0bc → Settings → Secrets</strong>
                      </li>
                      <li className="text-blue-800">
                        <strong>BORRA</strong> las 3 variables actuales
                      </li>
                      <li className="text-blue-800">
                        <strong>Agrega nuevamente</strong> con las keys JWT reales (NO pongas <code className="bg-red-100 px-1 rounded text-xs">sb_secret_xxx</code>)
                      </li>
                      <li className="text-blue-800">
                        Click en <strong>"Deploy function"</strong> y espera 1-2 min
                      </li>
                      <li className="text-blue-800">
                        Recarga esta página (F5)
                      </li>
                    </ol>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="mt-3 w-full"
                      onClick={() => window.open('/INSTRUCCIONES_CONFIGURACION_SUPABASE.md', '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ver Guía Completa Paso a Paso
                    </Button>
                  </div>
                </div>
              )}

              {/* CASO 2: Función no desplegada o error 401 genérico */}
              {!healthCheckData || healthCheckData.valid !== false ? (
                <div className="bg-white border border-red-200 rounded-lg p-4">
                  <p className="font-semibold text-base mb-2">
                    ❌ Error 401: No se puede conectar con la Edge Function
                  </p>
                  <p className="text-sm mb-3">
                    La Edge Function <code className="bg-red-100 px-2 py-1 rounded font-mono">make-server-4909a0bc</code> NO está respondiendo correctamente.
                  </p>
                
                <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-3 mb-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-bold mb-2">🤔 ¿Por qué funciona tu login pero NO crear usuarios?</p>
                      <div className="space-y-1.5 text-blue-800">
                        <p>
                          <strong>Tu login SÍ funciona:</strong> Usa Supabase Auth directo (no necesita servidor)
                        </p>
                        <p>
                          <strong>Crear usuarios NO funciona:</strong> Requiere Edge Function con <code className="bg-blue-100 px-1 rounded text-xs">SERVICE_ROLE_KEY</code> (clave secreta que no puede estar en el navegador)
                        </p>
                        <p className="mt-2">
                          📖 <button 
                            onClick={() => window.open('/POR_QUE_FUNCIONA_ADMIN_PERO_NO_CREAR_USUARIOS.md', '_blank')}
                            className="text-blue-700 underline hover:text-blue-900 font-semibold"
                          >
                            Ver explicación completa aquí
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded p-3 text-sm space-y-2">
                  <p className="font-semibold">🔍 Posibles causas del error 401:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>La función NO ha sido desplegada en Supabase</li>
                    <li>Las variables de entorno NO están configuradas</li>
                    <li>Hay un error de compilación en la función</li>
                    <li>La función fue borrada accidentalmente</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  SOLUCIÓN: Desplegar Edge Function Manualmente (5 minutos)
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold mb-2">📋 Opción 1: Verificar si existe (más rápido)</p>
                    <ol className="list-decimal list-inside space-y-1.5 text-sm ml-2">
                      <li>Abre el <strong>Supabase Dashboard</strong> (botón abajo)</li>
                      <li>Ve a <strong>Edge Functions</strong> en el menú lateral</li>
                      <li>Busca la función <code className="bg-blue-100 px-1 rounded">make-server-4909a0bc</code></li>
                      <li>Si existe pero está inactiva:
                        <ul className="list-disc list-inside ml-4 mt-1">
                          <li>Click en la función → <strong>Settings</strong></li>
                          <li>Agrega las 3 variables de entorno (ver abajo)</li>
                          <li>Click en <strong>"Deploy"</strong> o <strong>"Redeploy"</strong></li>
                        </ul>
                      </li>
                      <li>Si NO existe, continúa con Opción 2</li>
                    </ol>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-semibold mb-2">🚀 Opción 2: Desplegar desde código</p>
                    <ol className="list-decimal list-inside space-y-1.5 text-sm ml-2">
                      <li>En Supabase Dashboard → <strong>Edge Functions</strong></li>
                      <li>Click en <strong>"Create a new function"</strong></li>
                      <li>Nombre: <code className="bg-blue-100 px-2 py-1 rounded font-mono">make-server-4909a0bc</code></li>
                      <li>Copia y pega TODO el código de <code>/supabase/functions/server/index.tsx</code></li>
                      <li>Click en <strong>"Deploy function"</strong></li>
                      <li>Espera 1-2 minutos a que se despliegue</li>
                      <li>Luego configura las variables (ver abajo)</li>
                    </ol>
                  </div>

                  <Separator />

                  <div className="bg-yellow-50 border border-yellow-300 rounded p-3">
                    <p className="text-sm font-semibold text-yellow-900 mb-2">⚙️ Variables de entorno requeridas:</p>
                    <div className="space-y-1 text-xs font-mono bg-white p-2 rounded border border-yellow-200">
                      <div>1. <strong>SUPABASE_URL</strong> = https://vrclozhgaacehojbnpuo.supabase.co</div>
                      <div>2. <strong>SUPABASE_ANON_KEY</strong> = (tu anon key)</div>
                      <div>3. <strong>SUPABASE_SERVICE_ROLE_KEY</strong> = (tu service role key)</div>
                    </div>
                    <p className="text-xs text-yellow-800 mt-2">
                      💡 Las keys están en: Settings → API → Project API keys
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded p-3">
                    <p className="text-sm font-semibold text-green-900 mb-2">✅ Después de configurar:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm ml-2 text-green-800">
                      <li>Haz click en <strong>"Deploy"</strong> o <strong>"Redeploy"</strong></li>
                      <li><strong>IMPORTANTE:</strong> Espera 30-60 segundos</li>
                      <li>Verifica que el status sea <strong>"Active"</strong></li>
                      <li>Regresa aquí y haz click en "Verificar de Nuevo"</li>
                    </ol>
                  </div>
                </div>
                </div>
              </div>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={() => window.open(`https://supabase.com/dashboard/project/${projectIdState}/functions`, '_blank')}
                  className="bg-green-600 hover:bg-green-700 flex-1"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir Supabase Dashboard
                </Button>
                <Button 
                  onClick={() => window.open('/SOLUCION_ERROR_401_PASO_A_PASO.md', '_blank')}
                  variant="outline"
                  className="flex-1 border-2 border-blue-500 text-blue-700 hover:bg-blue-50 font-semibold"
                >
                  📖 Guía Paso a Paso (5 min)
                </Button>
                <Button 
                  onClick={checkServerConfig}
                  variant="outline"
                  className="bg-white hover:bg-blue-50"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Verificar de Nuevo
                </Button>
              </div>

              <div className="mt-3 p-3 bg-gray-100 rounded text-xs text-gray-700">
                <p className="font-semibold mb-1">📞 ¿Necesitas ayuda?</p>
                <p>Si después de seguir estos pasos el error persiste, verifica:</p>
                <ul className="list-disc list-inside ml-2 mt-1 space-y-0.5">
                  <li>Que la función esté en estado <strong>"Active"</strong></li>
                  <li>Que las 3 variables estén configuradas correctamente</li>
                  <li>Que hiciste <strong>Redeploy</strong> después de configurar</li>
                  <li>Los <strong>Logs</strong> de la función para ver errores</li>
                </ul>
                <div className="mt-2 pt-2 border-t border-gray-300">
                  <p className="font-semibold mb-1">📖 Recursos disponibles:</p>
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => window.open('/SOLUCION_RAPIDA_ERROR_401.md', '_blank')}
                      className="text-blue-600 hover:text-blue-800 underline text-left"
                    >
                      → Solución Rápida (2 min)
                    </button>
                    <button 
                      onClick={() => window.open('/SOLUCION_ERROR_401_PASO_A_PASO.md', '_blank')}
                      className="text-blue-600 hover:text-blue-800 underline text-left"
                    >
                      → Guía Completa Paso a Paso (5 min)
                    </button>
                    <button 
                      onClick={() => window.open('/POR_QUE_FUNCIONA_ADMIN_PERO_NO_CREAR_USUARIOS.md', '_blank')}
                      className="text-blue-600 hover:text-blue-800 underline text-left"
                    >
                      → ¿Por qué mi login funciona pero crear usuarios no?
                    </button>
                  </div>
                </div>
              </div>
            </>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Botón de prueba de autenticación - Solo cuando está OK */}
      {serverConfigured === true && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">
                  {serverConfigured === true ? '✅ Servidor Configurado' : '⚙️ Verificación del Servidor'}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  {serverConfigured === true 
                    ? 'El servidor está funcionando correctamente'
                    : 'Verifica el estado de autenticación (ver consola del navegador)'}
                </p>
              </div>
              <Button 
                onClick={testAuth}
                variant="outline"
                size="sm"
                className="bg-white hover:bg-blue-100"
              >
                <Shield className="w-4 h-4 mr-2" />
                {serverConfigured === true ? 'Verificar de Nuevo' : 'Probar Auth'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600">Pendientes</p>
                <p className="text-3xl font-bold text-yellow-700">{pendingRequests.length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Aprobadas</p>
                <p className="text-3xl font-bold text-green-700">{approvedRequests.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Rechazadas</p>
                <p className="text-3xl font-bold text-red-700">{rejectedRequests.length}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Solicitudes Pendientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Solicitudes Pendientes
          </CardTitle>
          <CardDescription>
            Aprueba o rechaza solicitudes de acceso al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No hay solicitudes pendientes</p>
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.name}</TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>
                        <Badge variant={request.role === 'coach' ? 'default' : 'secondary'}>
                          {request.role === 'coach' ? 'Entrenador' : 'Nadador'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(request.requestedAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveRequest(request)}
                            disabled={loading || serverConfigured === false}
                            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={serverConfigured === false ? 'Configura el servidor primero' : ''}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            {serverConfigured === false ? 'Servidor sin configurar' : 'Aprobar'}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectRequest(request.id)}
                            disabled={loading}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Rechazar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Solicitudes Aprobadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Solicitudes Aprobadas
          </CardTitle>
          <CardDescription>
            Usuarios que ya tienen acceso al sistema. Click en "Copiar Datos" para compartir credenciales.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {approvedRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay solicitudes aprobadas todavía
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Contraseña Generada</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.name}</TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>
                        <Badge variant={request.role === 'coach' ? 'default' : 'secondary'}>
                          {request.role === 'coach' ? 'Entrenador' : 'Nadador'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {request.generatedPassword?.substring(0, 20)}...
                        </code>
                      </TableCell>
                      <TableCell>{new Date(request.requestedAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const text = `📧 Credenciales de Acceso - Club Natación Lo Prado\n\n` +
                              `👤 Nombre: ${request.name}\n` +
                              `📨 Email: ${request.email}\n` +
                              `🔑 Contraseña: ${request.generatedPassword}\n` +
                              `👔 Rol: ${request.role === 'coach' ? 'Entrenador' : 'Nadador'}\n\n` +
                              `🔗 Acceso al Sistema:\n` +
                              `Ingresa con tu email y contraseña en el sistema.\n\n` +
                              `⚠️ IMPORTANTE: Esta contraseña es temporal. Te recomendamos cambiarla desde tu perfil después de iniciar sesión.`;
                            
                            copyToClipboard(text).then(() => {
                              toast.success('✅ Credenciales copiadas al portapapeles');
                            }).catch(error => {
                              toast.error(error instanceof Error ? error.message : 'Error al copiar');
                            });
                          }}
                          className="gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          Copiar Datos
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de credenciales aprobadas */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader className={serverConfigured === false ? "bg-yellow-50 -mx-6 -mt-6 px-6 py-4 border-b border-yellow-100" : "bg-green-50 -mx-6 -mt-6 px-6 py-4 border-b border-green-100"}>
            <div className="flex items-center gap-2">
              {serverConfigured === false ? (
                <>
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  <DialogTitle className="text-yellow-900">⚠️ Credenciales Generadas (Modo Degradado)</DialogTitle>
                </>
              ) : (
                <>
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <DialogTitle className="text-green-900">¡Solicitud Aprobada!</DialogTitle>
                </>
              )}
            </div>
            <DialogDescription className={serverConfigured === false ? "text-yellow-700" : "text-green-700"}>
              {serverConfigured === false 
                ? "ADVERTENCIA: Estas credenciales fueron generadas localmente. El usuario NO podrá iniciar sesión hasta que configures el servidor backend."
                : "La cuenta ha sido creada exitosamente. Comparte estas credenciales con el usuario."}
            </DialogDescription>
          </DialogHeader>

          {approvedCredentials && (
            <div className="space-y-4 py-4">
              {serverConfigured === false && (
                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-red-900">
                      <p className="font-bold mb-2">🚨 MODO DEGRADADO ACTIVO</p>
                      <ul className="list-disc list-inside space-y-1 text-red-800">
                        <li><strong>La contraseña NO es válida</strong> para iniciar sesión</li>
                        <li><strong>NO se creó cuenta</strong> en Supabase Auth</li>
                        <li><strong>Debes configurar el servidor</strong> para crear cuentas reales</li>
                      </ul>
                      <p className="mt-2 font-semibold text-red-900">
                        📋 Configura el servidor antes de compartir estas credenciales
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {serverConfigured !== false && (
                <>
                  <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-red-900">
                        <p className="font-bold mb-2">🔴 PASO OBLIGATORIO: Aprobar Usuario</p>
                        <p className="mb-2">
                          El usuario fue creado pero <strong>NO podrá iniciar sesión</strong> hasta que lo apruebes manualmente en Supabase:
                        </p>
                        <ol className="list-decimal list-inside space-y-1 text-red-800 ml-2">
                          <li>Ve a <strong>Dashboard de Supabase</strong></li>
                          <li>Authentication → Users</li>
                          <li>Encuentra al usuario por email</li>
                          <li>Editar → User Metadata</li>
                          <li>Cambiar <code className="bg-red-100 px-1">"pending_approval"</code> → <code className="bg-green-100 px-1">"approved"</code></li>
                        </ol>
                        <p className="mt-3 font-semibold text-red-900">
                          📖 Ver guía completa: <code className="bg-red-100 px-1">/GUIA_RAPIDA_APROBAR_USUARIOS.md</code>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <strong>IMPORTANTE:</strong> Copia estas credenciales y envíalas al usuario de forma segura. 
                        La contraseña es temporal y el usuario podrá cambiarla desde su perfil.
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-3">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs text-gray-600 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      Correo Electrónico
                    </Label>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCopyEmail}
                      className="h-6 px-2"
                    >
                      {copiedEmail ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                  <p className="font-mono text-sm break-all select-all">{approvedCredentials.email}</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs text-gray-600 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Contraseña Temporal
                    </Label>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCopyPassword}
                      className="h-6 px-2"
                    >
                      {copiedPassword ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                  <p className="font-mono text-sm break-all select-all">{approvedCredentials.password}</p>
                </div>
              </div>

              {/* Opciones de compartir */}
              <div className="space-y-3">
                <Separator />
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Compartir Credenciales
                  </h4>
                  <p className="text-xs text-gray-600 mb-3">
                    Elige cómo deseas compartir la contraseña provisoria con el usuario
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={handleCopyCredentials}
                      variant="default"
                      className="bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          ¡Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copiar Todo
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleShareWhatsApp}
                      variant="outline"
                      size="sm"
                      className="border-green-500 text-green-700 hover:bg-green-50"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button
                      onClick={handleShareEmail}
                      variant="outline"
                      size="sm"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                    <Button
                      onClick={handleToggleQRCode}
                      variant="outline"
                      size="sm"
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      {showQRCode ? 'Ocultar QR' : 'Mostrar QR'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Código QR */}
              {showQRCode && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-center space-y-3">
                    <h4 className="text-sm font-semibold">Código QR con Credenciales</h4>
                    <p className="text-xs text-gray-600">El usuario puede escanear este código para obtener sus credenciales</p>
                    <div className="flex justify-center">
                      <QRCodeSVG
                        value={getQRCodeData()}
                        size={200}
                        level="M"
                        includeMargin={true}
                        bgColor="#ffffff"
                        fgColor="#000000"
                      />
                    </div>
                    <p className="text-xs text-gray-500 italic">
                      Captura de pantalla o muestra directamente al usuario
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              onClick={() => {
                setShowApproveDialog(false);
                setApprovedCredentials(null);
                setCopied(false);
                setCopiedEmail(false);
                setCopiedPassword(false);
                setShowQRCode(false);
              }}
              variant="outline"
              className="w-full"
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Función eliminada - ahora se usa el servicio en /src/app/services/passwordRequests.ts

// Función para generar contraseña local (modo degradado)
const generateLocalPassword = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};