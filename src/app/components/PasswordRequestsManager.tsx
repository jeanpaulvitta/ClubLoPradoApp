import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Label } from './ui/label';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { UserPlus, CheckCircle, XCircle, Clock, Copy, Shield, Mail, User, AlertCircle, AlertTriangle, ExternalLink, Share2, MessageCircle, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { ServerSetupGuide } from './ServerSetupGuide';
import { QRCodeSVG } from 'qrcode.react';

interface PasswordRequest {
  id: string;
  name: string;
  email: string;
  role: 'swimmer' | 'coach';
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  generatedPassword?: string;
}

const REQUESTS_KEY = 'natacion_master_password_requests';

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

function getPasswordRequests(): PasswordRequest[] {
  const stored = localStorage.getItem(REQUESTS_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function savePasswordRequests(requests: PasswordRequest[]) {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
}

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
  const [projectIdState, setProjectIdState] = useState<string>('vrclozhgaacehojbnpuo');
  const [showQRCode, setShowQRCode] = useState(false);

  // Obtener el contexto de autenticación
  const auth = useAuth();
  const { user, createUserAccount } = auth;

  useEffect(() => {
    loadRequests();
    checkServerConfig();
    loadProjectId();
  }, []);

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
      const { projectId } = await import('../../../utils/supabase/info');
      const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc`;
      
      const response = await fetch(`${API_URL}/health`);
      const data = await response.json();
      
      setServerConfigured(data.status === 'ok');
    } catch (error) {
      console.error('Error verificando configuración del servidor:', error);
      setServerConfigured(false);
    }
  };

  const loadRequests = () => {
    const allRequests = getPasswordRequests();
    setRequests(allRequests);
  };

  const handleApproveRequest = async (request: PasswordRequest) => {
    setLoading(true);
    try {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔐 PasswordRequestsManager - Iniciando aprobación de solicitud');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📋 Datos de la solicitud:');
      console.log('  - ID:', request.id);
      console.log('  - Email:', request.email);
      console.log('  - Nombre:', request.name);
      console.log('  - Rol:', request.role);
      console.log('  - Estado actual:', request.status);
      console.log('');

      // VALIDAR QUE EL SERVIDOR ESTÉ CONFIGURADO ANTES DE CONTINUAR
      if (serverConfigured === false) {
        console.error('❌ BLOQUEADO: Servidor no configurado');
        toast.error('⚠️ No se puede aprobar. El servidor necesita configuración.', {
          duration: 6000,
        });
        alert(
          '🚨 SERVIDOR NO CONFIGURADO\n\n' +
          'No se puede aprobar solicitudes porque el servidor Edge Function\n' +
          'no tiene las variables de entorno configuradas.\n\n' +
          '📋 DEBES COMPLETAR ESTOS PASOS PRIMERO:\n\n' +
          '1. Ve a Supabase Dashboard\n' +
          '2. Edge Functions → make-server-4909a0bc → Settings/Secrets\n' +
          '3. Agrega las 3 variables de entorno\n' +
          '4. Reinicia la función\n' +
          '5. Haz clic en "Verificar de Nuevo"\n\n' +
          'Ver instrucciones completas en /SOLUCION_INVALID_JWT.md'
        );
        setLoading(false);
        return;
      }

      // Verificar en tiempo real que el servidor funciona
      console.log('📍 Verificando configuración del servidor en tiempo real...');
      const { projectId } = await import('../../../utils/supabase/info');
      const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc`;
      
      const healthCheck = await fetch(`${API_URL}/health`);
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
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      toast.success('Solicitud aprobada y cuenta creada');
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
��� Si olvidas tu contraseña, contacta al administrador

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
    try {
      const { projectId, publicAnonKey } = await import('../../../utils/supabase/info');
      const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc`;
      
      console.log('📍 URL del servidor:', API_URL);
      console.log('📍 Usuario actual:', user?.email, '(ID:', user?.id, ')');
      
      // Verificar sesión de Supabase
      const { supabase } = await import('../services/supabaseClient');
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ Error obteniendo sesión:', sessionError);
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
      const healthResponse = await fetch(`${API_URL}/health`);
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
        console.error('❌ Error de autenticación:', errorData);
        
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
      {/* Guía visual de configuración del servidor */}
      {serverConfigured === false && (
        <ServerSetupGuide 
          projectId={projectIdState} 
          onRecheck={async () => {
            await checkServerConfig();
            await testAuth();
          }}
        />
      )}

      {/* Botón de prueba de autenticación - Solo para debugging */}
      {serverConfigured !== false && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">
                  {serverConfigured === true ? '✅ Servidor Configurado' : '🧪 Prueba de Diagnóstico'}
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
          <DialogHeader className="bg-green-50 -mx-6 -mt-6 px-6 py-4 border-b border-green-100">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <DialogTitle className="text-green-900">¡Solicitud Aprobada!</DialogTitle>
            </div>
            <DialogDescription className="text-green-700">
              La cuenta ha sido creada exitosamente. Comparte estas credenciales con el usuario.
            </DialogDescription>
          </DialogHeader>

          {approvedCredentials && (
            <div className="space-y-4 py-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <strong>IMPORTANTE:</strong> Copia estas credenciales y envíalas al usuario de forma segura. 
                    La contraseña es temporal y el usuario podrá cambiarla desde su perfil.
                  </div>
                </div>
              </div>

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

// Función helper para crear una nueva solicitud (se llamará desde LoginPage)
export function createPasswordRequest(name: string, email: string, role: 'swimmer' | 'coach'): void {
  const requests = getPasswordRequests();
  
  // Verificar si ya existe una solicitud para este email
  if (requests.some(r => r.email === email && r.status === 'pending')) {
    throw new Error('Ya existe una solicitud pendiente para este correo electrónico');
  }
  
  const newRequest: PasswordRequest = {
    id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    email,
    role,
    requestedAt: new Date().toISOString(),
    status: 'pending',
  };
  
  requests.push(newRequest);
  savePasswordRequests(requests);
}