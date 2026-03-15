// ==================== VERSION 3.0 - DEPLOYED 2026-03-10 ====================
// PUBLIC ENDPOINTS MOVED BEFORE AUTH MIDDLEWARE
// Last deploy: 2026-03-10 - FORCE REDEPLOY VERSION

import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// ==================== WORKAROUND: VALORES CORRECTOS ====================
// Las variables de entorno están corruptas (hashes en lugar de JWT tokens)
// Solución temporal: usar los valores correctos directamente
const CORRECT_SUPABASE_URL = "https://vrclozhgaacehojbnpuo.supabase.co";
const CORRECT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyY2xvemhnYWFjZWhvamJucHVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MDc1OTEsImV4cCI6MjA4NTk4MzU5MX0.efL3mUq8zFgaqAY92FWiwGTBxlPmzkVq9kDjVXbjeVQ";

// IMPORTANTE: Reemplaza este valor con tu SERVICE_ROLE_KEY real
// Ve a: https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/settings/api
// Busca "service_role" key (la que es SECRET) y cópiala aquí abajo
const CORRECT_SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyY2xvemhnYWFjZWhvamJucHVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDQwNzU5MSwiZXhwIjoyMDg1OTgzNTkxfQ.JKJ5UjZEkT1rJzV-JezonKaWI83-oO-X_0A60woQAh4";

// Check environment variables
const ENV_SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const ENV_SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const ENV_SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

// Validate if environment variables are corrupted (hashes instead of JWT tokens)
const urlIsValid = ENV_SUPABASE_URL && ENV_SUPABASE_URL.length >= 40 && ENV_SUPABASE_URL.startsWith('https://');
const serviceKeyIsValid = ENV_SUPABASE_SERVICE_ROLE_KEY && ENV_SUPABASE_SERVICE_ROLE_KEY.length > 100 && ENV_SUPABASE_SERVICE_ROLE_KEY.startsWith('eyJ');
const anonKeyIsValid = ENV_SUPABASE_ANON_KEY && ENV_SUPABASE_ANON_KEY.length > 100 && ENV_SUPABASE_ANON_KEY.startsWith('eyJ');

// Use correct values if environment variables are corrupted
const SUPABASE_URL = urlIsValid ? ENV_SUPABASE_URL : CORRECT_SUPABASE_URL;
const SUPABASE_ANON_KEY = anonKeyIsValid ? ENV_SUPABASE_ANON_KEY : CORRECT_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = serviceKeyIsValid ? ENV_SUPABASE_SERVICE_ROLE_KEY : CORRECT_SUPABASE_SERVICE_ROLE_KEY;

// Track configuration status
const ENV_CONFIGURED = !!(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY && SUPABASE_ANON_KEY);
const USING_WORKAROUND = !urlIsValid || !serviceKeyIsValid || !anonKeyIsValid;

console.log('🔧 Server Configuration:', {
  url: SUPABASE_URL,
  urlSource: urlIsValid ? 'ENV (valid)' : 'HARDCODED',
  anonKeySource: anonKeyIsValid ? 'ENV (valid)' : 'HARDCODED',
  serviceKeySource: serviceKeyIsValid ? 'ENV (valid)' : 'HARDCODED',
  usingWorkaround: USING_WORKAROUND,
  configured: ENV_CONFIGURED
});

if (USING_WORKAROUND) {
  console.warn('⚠️ USING WORKAROUND: Environment variables are corrupted, using hardcoded values');
  console.warn('   This is a temporary solution. Ideally, secrets should be fixed in Supabase Dashboard.');
}

if (!ENV_CONFIGURED) {
  console.error('❌ CRITICAL ERROR: Missing required environment variables!');
  console.error('   Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY');
}

// Initialize Supabase clients only if configured
let supabase: any = null;
let supabaseAuth: any = null;

if (ENV_CONFIGURED) {
  // Initialize Supabase client for auth and storage
  supabase = createClient(
    SUPABASE_URL!,
    SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Create a separate client for auth operations (uses ANON_KEY)
  supabaseAuth = createClient(
    SUPABASE_URL!,
    SUPABASE_ANON_KEY!,
  );
} else {
  console.warn('⚠️ Supabase clients NOT initialized - environment variables missing');
}

// Storage bucket name
const COMPETITIONS_BUCKET = "make-4909a0bc-competitions";

// ==================== AUTHENTICATION MIDDLEWARE ====================

// Middleware to verify JWT token and get user
async function authMiddleware(c: any, next: any) {
  // Check if environment is configured
  if (!ENV_CONFIGURED || !supabase || !supabaseAuth) {
    console.error('❌ Auth middleware: Server not configured');
    return c.json({ 
      code: 503, 
      message: 'Server not configured. Environment variables missing.',
      configured: false
    }, 503);
  }

  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('❌ Auth middleware: No token provided');
    console.error('   Headers:', JSON.stringify(Object.fromEntries(c.req.header())));
    return c.json({ code: 401, message: 'Missing authorization header' }, 401);
  }

  const token = authHeader.split(' ')[1];
  
  if (!token || token.trim() === '') {
    console.error('❌ Auth middleware: Empty token');
    return c.json({ code: 401, message: 'Empty token' }, 401);
  }
  
  console.log('🔑 Auth middleware: Validating token (length:', token.length, ')');
  console.log('🔍 Token preview:', token.substring(0, 50) + '...');
  
  try {
    // IMPORTANTE: Primero intentar validar con SERVICE_ROLE_KEY
    // Esto permite validar tokens generados con cualquier key (ANON o SERVICE_ROLE)
    let validationResult = await supabase.auth.getUser(token);
    
    // Si falla con SERVICE_ROLE_KEY, intentar con ANON_KEY
    if (validationResult.error) {
      console.log('⚠️ Validación con SERVICE_ROLE_KEY falló, intentando con ANON_KEY...');
      validationResult = await supabaseAuth.auth.getUser(token);
    }
    
    const { data: { user }, error } = validationResult;
    
    if (error) {
      console.error('❌ Auth middleware - Token validation error:', error.message);
      console.error('   Error details:', JSON.stringify(error, null, 2));
      console.error('   Token (first 50 chars):', token.substring(0, 50));
      console.error('   SUPABASE_URL configurada:', !!SUPABASE_URL);
      console.error('   SUPABASE_SERVICE_ROLE_KEY configurada:', !!SUPABASE_SERVICE_ROLE_KEY);
      console.error('   SUPABASE_ANON_KEY configurada:', !!SUPABASE_ANON_KEY);
      
      // Proveer mensajes de error más específicos
      if (error.message.includes('expired')) {
        return c.json({ code: 401, message: 'Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.' }, 401);
      }
      if (error.message.includes('invalid') || error.message.includes('malformed') || error.message.includes('JWT')) {
        console.error('❌ Token JWT inválido. Esto puede ser por:');
        console.error('   1. Token corrupto o malformado');
        console.error('   2. Token generado con diferentes credenciales de Supabase');
        console.error('   3. Variables de entorno mal configuradas en Edge Functions');
        return c.json({ 
          code: 401, 
          message: 'Invalid JWT',
          debug: {
            errorMessage: error.message,
            tokenLength: token.length,
            tokenPreview: token.substring(0, 30) + '...',
            supabaseConfigured: !!SUPABASE_URL && !!SUPABASE_SERVICE_ROLE_KEY && !!SUPABASE_ANON_KEY
          }
        }, 401);
      }
      
      return c.json({ code: 401, message: error.message }, 401);
    }
    
    if (!user) {
      console.error('❌ Auth middleware: No user found');
      return c.json({ code: 401, message: 'Invalid token - no user' }, 401);
    }
    
    console.log('✅ Auth middleware: User validated:', user.email, '(ID:', user.id, ')');
    console.log('   User metadata:', JSON.stringify(user.user_metadata, null, 2));
    
    // Store user in context
    c.set('user', user);
    c.set('userId', user.id);
    
    await next();
  } catch (error) {
    console.error('❌ Auth middleware unexpected error:', error);
    console.error('   Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('   Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return c.json({ 
      code: 401, 
      message: 'Auth error',
      debug: error instanceof Error ? error.message : String(error)
    }, 401);
  }
}

// Ensure bucket exists on startup
async function initializeStorage() {
  if (!ENV_CONFIGURED || !supabase) {
    console.warn('⚠️ Skipping storage initialization - server not configured');
    return;
  }
  
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === COMPETITIONS_BUCKET);
    
    if (!bucketExists) {
      console.log(`📦 Creating bucket: ${COMPETITIONS_BUCKET}`);
      const { error } = await supabase.storage.createBucket(COMPETITIONS_BUCKET, {
        public: false,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['application/pdf']
      });
      
      if (error && error.message !== "The resource already exists") {
        console.error('❌ Error creating bucket:', error);
      } else {
        console.log(`✅ Bucket created: ${COMPETITIONS_BUCKET}`);
      }
    } else {
      console.log(`✅ Bucket already exists: ${COMPETITIONS_BUCKET}`);
    }
  } catch (error) {
    console.error('❌ Error initializing storage:', error);
  }
}

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ==================== PUBLIC ENDPOINTS (NO AUTH REQUIRED) ====================
// IMPORTANTE: Estos endpoints DEBEN ir ANTES de cualquier middleware de autenticación

// TEST ENDPOINT - Verificar que el código nuevo está desplegado
app.get("/make-server-4909a0bc/test-public", async (c) => {
  return c.json({ 
    success: true, 
    message: "✅ Código nuevo desplegado correctamente - Version 3.0!",
    timestamp: new Date().toISOString(),
    version: "3.0-public-endpoints-before-auth",
    deployedAt: "2026-03-10"
  });
});

// NUEVO TEST ENDPOINT CON NOMBRE DIFERENTE - Sin caché
app.get("/make-server-4909a0bc/health-check-v3", async (c) => {
  return c.json({ 
    success: true, 
    status: "healthy",
    message: "✅ Version 3.0 activa!",
    timestamp: new Date().toISOString(),
    version: "3.0",
    endpoints: {
      public: [
        "/make-server-4909a0bc/test-public",
        "/make-server-4909a0bc/health-check-v3",
        "/make-server-4909a0bc/password-requests/create"
      ]
    }
  });
});

// Create a new password request - PUBLIC ENDPOINT (NO AUTH)
app.post("/make-server-4909a0bc/password-requests/create", async (c) => {
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📝 POST /password-requests/create - PUBLIC ENDPOINT');
    
    const body = await c.req.json();
    const { name, email, role } = body;
    
    console.log(`📥 Request body:`, { name, email, role });
    
    if (!name || !email || !role) {
      console.error('❌ Missing required fields');
      return c.json({ 
        code: 400,
        error: 'Faltan campos requeridos',
        required: ['name', 'email', 'role']
      }, 400);
    }
    
    if (!['swimmer', 'coach'].includes(role)) {
      console.error('❌ Invalid role:', role);
      return c.json({ 
        code: 400,
        error: 'Rol inválido. Debe ser "swimmer" o "coach"'
      }, 400);
    }
    
    // Generate unique ID
    const id = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`🆔 Generated ID: ${id}`);
    
    // Create password request object
    const passwordRequest = {
      id,
      name,
      email,
      role,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    console.log(`💾 Saving password request:`, passwordRequest);
    
    // Get existing requests
    const existingRequests = await kv.get('password-requests:list') || [];
    console.log(`📊 Existing requests count: ${existingRequests.length}`);
    
    // Add new request
    const updatedRequests = [...existingRequests, passwordRequest];
    
    // Save to KV store
    await kv.set('password-requests:list', updatedRequests);
    console.log(`✅ Password request saved successfully`);
    
    return c.json({ 
      success: true,
      request: passwordRequest,
      message: 'Solicitud creada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error creating password request:', error);
    return c.json({ 
      code: 500,
      error: 'Error al crear solicitud',
      details: String(error)
    }, 500);
  }
});

// ==================== HELPER FUNCTIONS ====================

/**
 * Función compartida para crear usuario con contraseña generada automáticamente
 * Usada por /auth/create-user y /password-requests/:id/approve
 */
async function createUserWithPassword(
  email: string,
  name: string,
  role: 'admin' | 'swimmer' | 'coach'
): Promise<{ user: any; password: string }> {
  console.log('🔐 createUserWithPassword - Iniciando creación de usuario');
  console.log('  - Email:', email);
  console.log('  - Nombre:', name);
  console.log('  - Rol:', role);
  
  // Generar contraseña temporal fuerte
  const tempPassword = `NP${Date.now()}!${Math.random().toString(36).substring(2, 10)}`;
  console.log('  - Password generada (length):', tempPassword.length);
  
  // Crear usuario con Supabase Auth usando admin.createUser
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true, // Auto-confirmar email
    user_metadata: {
      name,
      role,
    }
  });
  
  if (error) {
    console.error('❌ Error al crear usuario:', error);
    throw error;
  }
  
  if (!data.user) {
    console.error('❌ No se recibió información del usuario creado');
    throw new Error('No se recibió información del usuario creado');
  }
  
  console.log('✅ Usuario creado exitosamente:', data.user.id);
  
  return {
    user: data.user,
    password: tempPassword
  };
}

// ==================== AUTHENTICATION ROUTES ====================

/**
 * Crear nuevo usuario (solo admin)
 * Genera password automática y crea usuario en Supabase Auth
 */
app.post("/make-server-4909a0bc/auth/create-user", authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    if (user?.user_metadata?.role !== 'admin') {
      return c.json({ 
        error: 'Solo administradores pueden crear nuevos usuarios' 
      }, 403);
    }
    
    const { email, name, role } = await c.req.json();
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 POST /auth/create-user - Creando usuario');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Datos recibidos:', { email, name, role });
    
    // Validar datos requeridos
    if (!email || !name || !role) {
      return c.json({ 
        error: 'Email, nombre y rol son requeridos' 
      }, 400);
    }
    
    // Validar rol
    if (!['admin', 'swimmer', 'coach'].includes(role)) {
      return c.json({ 
        error: 'Rol inválido. Debe ser "admin", "swimmer" o "coach"' 
      }, 400);
    }
    
    // Crear usuario usando función compartida
    const { user: createdUser, password } = await createUserWithPassword(email, name, role);
    
    console.log('✅ Usuario creado exitosamente');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return c.json({
      success: true,
      user: {
        id: createdUser.id,
        email: createdUser.email,
        name,
        role,
      },
      password, // Contraseña generada
      message: 'Usuario creado exitosamente'
    }, 201);
    
  } catch (error) {
    console.error('❌ Error en /auth/create-user:', error);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (error instanceof Error && (error.message.includes('already') || error.message.includes('exists'))) {
      return c.json({ 
        error: 'Ya existe un usuario con este correo electrónico',
        existingUser: true
      }, 400);
    }
    
    return c.json({ 
      error: error instanceof Error ? error.message : 'Error al crear usuario',
      details: String(error)
    }, 500);
  }
});

// Sign up new user (requires admin authentication)
app.post("/make-server-4909a0bc/auth/signup", authMiddleware, async (c) => {
  try {
    const { email, password, name, role } = await c.req.json();
    
    // Verificar que el usuario que está creando sea admin
    const creatingUser = c.get('user');
    const creatingUserRole = creatingUser?.user_metadata?.role;
    
    console.log('🔐 SIGNUP - User creating account:', creatingUser?.email, 'Role:', creatingUserRole);
    console.log('🔐 SIGNUP - Creating user:', { email, name, role });
    
    // Solo admins pueden crear usuarios
    if (creatingUserRole !== 'admin') {
      console.error('❌ SIGNUP - Non-admin trying to create user:', creatingUser?.email);
      return c.json({ 
        code: 403,
        message: 'Solo los administradores pueden crear nuevos usuarios'
      }, 403);
    }
    
    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email since email server not configured
      user_metadata: {
        name,
        role: role || 'swimmer',
      }
    });
    
    if (error) {
      console.error('❌ Signup error:', error);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      return c.json({ 
        error: error.message || 'Error al registrar usuario',
        details: error,
        email: email,
        role: role
      }, 400);
    }
    
    console.log('✅ User created:', data.user.id);
    
    // If role is swimmer, create swimmer profile
    let swimmerId = null;
    if (role === 'swimmer') {
      try {
        const swimmers = await kv.get("swimmers:list") || [];
        const today = new Date();
        const defaultBirthYear = today.getFullYear() - 25;
        const defaultDateOfBirth = `${defaultBirthYear}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        
        swimmerId = `s${Date.now()}`;
        const swimmerData = {
          id: swimmerId,
          userId: data.user.id,
          name,
          email,
          rut: '00.000.000-0',
          gender: 'Masculino',
          dateOfBirth: defaultDateOfBirth,
          schedule: '7am',
          joinDate: new Date().toISOString().split('T')[0],
          personalBests: [],
          personalBestsHistory: [],
          goals: [],
        };
        
        swimmers.push(swimmerData);
        await kv.set("swimmers:list", swimmers);
        console.log('✅ Swimmer profile created:', swimmerId);
      } catch (err) {
        console.error('⚠️ Error creating swimmer profile:', err);
      }
    }
    
    return c.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name,
        role: data.user.user_metadata.role,
        swimmerId,
      }
    }, 201);
  } catch (error) {
    console.error('❌ Signup error (catch):', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack');
    return c.json({ 
      error: 'Error al registrar usuario',
      details: String(error),
      message: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// Sign in user
app.post("/make-server-4909a0bc/auth/signin", async (c) => {
  try {
    console.log('🔐 SIGNIN REQUEST RECEIVED');
    console.log('📥 Headers:', Object.fromEntries(c.req.header()));
    
    const { email, password } = await c.req.json();
    
    console.log('🔐 SIGNIN - Authenticating:', email);
    console.log('🔑 Password provided:', password ? '✓' : '✗');
    
    // First, try to authenticate with ANON client to verify password
    const { data: authData, error: authError } = await supabaseAuth.auth.signInWithPassword({
      email,
      password,
    });
    
    // AUTO-CREATE ADMIN: Si el error es "Invalid login credentials" y el email es admin@loprado.cl,
    // crear el usuario automáticamente con la contraseña proporcionada
    if (authError && authError.message.includes('Invalid login credentials') && email === 'admin@loprado.cl') {
      console.log('👑 AUTO-INIT: Usuario admin no existe, creando automáticamente...');
      
      try {
        // Crear usuario admin con la contraseña proporcionada
        const { data: createData, error: createError } = await supabase.auth.admin.createUser({
          email: 'admin@loprado.cl',
          password: password, // Usar la contraseña que proporcionó el usuario
          email_confirm: true,
          user_metadata: {
            name: 'Administrador',
            role: 'admin',
          }
        });
        
        if (createError) {
          console.error('❌ Error creando usuario admin:', createError);
          return c.json({ error: 'Error al crear usuario administrador' }, 500);
        }
        
        console.log('✅ Usuario admin creado exitosamente:', createData.user.id);
        
        // Intentar login nuevamente
        const { data: retryAuthData, error: retryAuthError } = await supabaseAuth.auth.signInWithPassword({
          email,
          password,
        });
        
        if (retryAuthError) {
          console.error('❌ Error en login después de crear admin:', retryAuthError);
          return c.json({ error: retryAuthError.message }, 401);
        }
        
        console.log('✅ Admin autenticado exitosamente');
        
        return c.json({
          session: retryAuthData.session,
          user: {
            id: retryAuthData.user.id,
            email: retryAuthData.user.email,
            name: retryAuthData.user.user_metadata.name,
            role: retryAuthData.user.user_metadata.role,
            swimmerId: null,
          }
        });
      } catch (autoCreateError) {
        console.error('❌ Error en auto-creación de admin:', autoCreateError);
        return c.json({ error: 'Credenciales inválidas' }, 401);
      }
    }
    
    // If email not confirmed, confirm it and create session using admin API
    if (authError && authError.message.includes('Email not confirmed')) {
      console.log('📧 Email not confirmed, handling with admin API...');
      
      // Get user using admin API
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
      
      if (listError) {
        console.error('❌ Error listing users:', listError);
        return c.json({ error: 'Error al verificar usuario' }, 500);
      }
      
      const user = users?.find(u => u.email === email);
      
      if (!user) {
        console.log('❌ User not found:', email);
        return c.json({ error: 'Credenciales inválidas' }, 401);
      }
      
      // Confirm email
      console.log('📧 Confirming email for user:', user.id);
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { email_confirm: true }
      );
      
      if (updateError) {
        console.error('❌ Error confirming email:', updateError);
        return c.json({ error: 'Error al confirmar email' }, 500);
      }
      
      console.log('✅ Email confirmed, generating access token...');
      
      // Verify password by trying to sign in again with ANON client
      // Wait a bit for the confirmation to propagate
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { data: retryData, error: retryError } = await supabaseAuth.auth.signInWithPassword({
        email,
        password,
      });
      
      if (retryError) {
        console.error('❌ Password verification failed:', retryError);
        
        // If still failing due to email confirmation, generate token directly using admin
        if (retryError.message.includes('Email not confirmed')) {
          console.log('⚠️ Still not confirmed, generating link with admin API...');
          
          // Generate magic link to get token
          const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
            type: 'magiclink',
            email: email,
          });
          
          if (linkError || !linkData) {
            console.error('❌ Error generating link:', linkError);
            return c.json({ error: 'Error al generar sesión' }, 500);
          }
          
          console.log('✅ Magic link generated, extracting session...');
          
          // Get swimmer ID if user is a swimmer
          let swimmerId = null;
          if (user.user_metadata.role === 'swimmer') {
            const swimmers = await kv.get("swimmers:list") || [];
            const swimmer = swimmers.find((s: any) => s.userId === user.id || s.email === email);
            swimmerId = swimmer?.id || null;
          }
          
          // Return session from magic link
          return c.json({
            session: {
              access_token: linkData.properties.access_token,
              refresh_token: linkData.properties.refresh_token,
            },
            user: {
              id: user.id,
              email: user.email,
              name: user.user_metadata.name,
              role: user.user_metadata.role,
              swimmerId,
            }
          });
        }
        
        return c.json({ error: retryError.message }, 401);
      }
      
      // Use retry data
      if (!retryData.user || !retryData.session) {
        console.error('❌ No user or session returned after retry');
        return c.json({ error: 'Error de autenticación' }, 401);
      }
      
      // Get swimmer ID if user is a swimmer
      let swimmerId = null;
      if (retryData.user.user_metadata.role === 'swimmer') {
        const swimmers = await kv.get("swimmers:list") || [];
        const swimmer = swimmers.find((s: any) => s.userId === retryData.user.id || s.email === email);
        swimmerId = swimmer?.id || null;
      }
      
      console.log('✅ User authenticated after confirmation:', retryData.user.id);
      
      return c.json({
        session: retryData.session,
        user: {
          id: retryData.user.id,
          email: retryData.user.email,
          name: retryData.user.user_metadata.name,
          role: retryData.user.user_metadata.role,
          swimmerId,
        }
      });
    }
    
    // Handle other auth errors
    if (authError) {
      console.error('❌ Supabase signin error:', authError);
      return c.json({ error: authError.message }, 401);
    }
    
    // Success - email was already confirmed
    if (!authData.user || !authData.session) {
      console.error('❌ No user or session returned');
      return c.json({ error: 'Error de autenticación' }, 401);
    }
    
    // Get swimmer ID if user is a swimmer
    let swimmerId = null;
    if (authData.user.user_metadata.role === 'swimmer') {
      const swimmers = await kv.get("swimmers:list") || [];
      const swimmer = swimmers.find((s: any) => s.userId === authData.user.id || s.email === email);
      swimmerId = swimmer?.id || null;
    }
    
    console.log('✅ User authenticated:', authData.user.id);
    
    return c.json({
      session: authData.session,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: authData.user.user_metadata.name,
        role: authData.user.user_metadata.role,
        swimmerId,
      }
    });
  } catch (error) {
    console.error('❌ Signin error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get current user session
app.get("/make-server-4909a0bc/auth/session", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ user: null, session: null });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return c.json({ user: null, session: null });
    }
    
    // Get swimmer ID if user is a swimmer
    let swimmerId = null;
    if (user.user_metadata.role === 'swimmer') {
      const swimmers = await kv.get("swimmers:list") || [];
      const swimmer = swimmers.find((s: any) => s.userId === user.id || s.email === user.email);
      swimmerId = swimmer?.id || null;
    }
    
    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata.name,
        role: user.user_metadata.role,
        swimmerId,
      },
      session: { access_token: token }
    });
  } catch (error) {
    console.error('❌ Session error:', error);
    return c.json({ user: null, session: null });
  }
});

// Sign out user
app.post("/make-server-4909a0bc/auth/signout", authMiddleware, async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const token = authHeader?.split(' ')[1];
    
    if (token) {
      await supabase.auth.admin.signOut(token);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error('❌ Signout error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Change password
app.post("/make-server-4909a0bc/auth/change-password", authMiddleware, async (c) => {
  try {
    console.log('🔐 Change password request received');
    
    const { currentPassword, newPassword } = await c.req.json();
    const userId = c.get('userId');
    
    if (!currentPassword || !newPassword) {
      console.error('❌ Missing passwords');
      return c.json({ error: 'Se requiere contraseña actual y nueva contraseña' }, 400);
    }
    
    if (newPassword.length < 6) {
      console.error('❌ New password too short');
      return c.json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' }, 400);
    }
    
    console.log('📋 Getting user data for:', userId);
    
    // Obtener el usuario actual
    const { data: userData, error: getUserError } = await supabase.auth.admin.getUserById(userId);
    
    if (getUserError || !userData?.user) {
      console.error('❌ Get user error:', getUserError);
      return c.json({ error: 'Usuario no encontrado' }, 404);
    }
    
    console.log('✅ User found:', userData.user.email);
    console.log('🔍 Verifying current password...');
    
    // Verificar la contraseña actual intentando hacer login con supabaseAuth
    const { error: signInError } = await supabaseAuth.auth.signInWithPassword({
      email: userData.user.email!,
      password: currentPassword,
    });
    
    if (signInError) {
      console.error('❌ Current password verification failed:', signInError.message);
      return c.json({ error: 'La contraseña actual es incorrecta' }, 401);
    }
    
    console.log('✅ Current password verified');
    console.log('🔄 Updating password...');
    
    // Cambiar a la nueva contraseña
    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
      password: newPassword
    });
    
    if (updateError) {
      console.error('❌ Change password error:', updateError.message);
      return c.json({ error: updateError.message || 'Error al actualizar contraseña' }, 400);
    }
    
    console.log('✅ Password changed successfully for user:', userId);
    return c.json({ success: true, message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('❌ Change password unexpected error:', error);
    return c.json({ error: 'Error interno del servidor al cambiar contraseña' }, 500);
  }
});

// Health check endpoint - NO requiere autenticación
// Este endpoint debe funcionar SIEMPRE, incluso sin variables de entorno
app.get("/make-server-4909a0bc/health", (c) => {
  const envCheck = {
    SUPABASE_URL: !!SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_ANON_KEY: !!SUPABASE_ANON_KEY,
  };
  
  // Validate JWT keys format (usando las variables FINALES, no las de entorno)
  // Estas son las que ya tienen el workaround aplicado si es necesario
  const urlValid = SUPABASE_URL && SUPABASE_URL.length >= 40 && SUPABASE_URL.startsWith('https://');
  const serviceKeyValid = SUPABASE_SERVICE_ROLE_KEY && SUPABASE_SERVICE_ROLE_KEY.length > 100 && SUPABASE_SERVICE_ROLE_KEY.startsWith('eyJ');
  const anonKeyValid = SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.length > 100 && SUPABASE_ANON_KEY.startsWith('eyJ');
  
  const allValid = urlValid && serviceKeyValid && anonKeyValid;
  
  // Log environment details for debugging
  console.log('🔍 Health Check - Environment Status:', {
    ENV_CONFIGURED,
    SUPABASE_URL_length: SUPABASE_URL ? SUPABASE_URL.length : 0,
    SUPABASE_URL_valid: urlValid,
    SUPABASE_URL_preview: SUPABASE_URL ? `${SUPABASE_URL.substring(0, 30)}...` : 'NOT SET',
    SUPABASE_SERVICE_ROLE_KEY_length: SUPABASE_SERVICE_ROLE_KEY ? SUPABASE_SERVICE_ROLE_KEY.length : 0,
    SUPABASE_SERVICE_ROLE_KEY_valid: serviceKeyValid,
    SUPABASE_SERVICE_ROLE_KEY_preview: SUPABASE_SERVICE_ROLE_KEY ? `${SUPABASE_SERVICE_ROLE_KEY.substring(0, 10)}...` : 'NOT SET',
    SUPABASE_ANON_KEY_length: SUPABASE_ANON_KEY ? SUPABASE_ANON_KEY.length : 0,
    SUPABASE_ANON_KEY_valid: anonKeyValid,
    SUPABASE_ANON_KEY_preview: SUPABASE_ANON_KEY ? `${SUPABASE_ANON_KEY.substring(0, 10)}...` : 'NOT SET',
  });
  
  // Build validation messages (solo si las variables FINALES son inválidas)
  const validationErrors = [];
  if (!urlValid) {
    validationErrors.push('❌ SUPABASE_URL: Must be a valid HTTPS URL (>= 40 chars, starts with https://)');
  }
  if (!serviceKeyValid) {
    validationErrors.push('❌ SUPABASE_SERVICE_ROLE_KEY: Must be a valid JWT token (> 100 chars, starts with eyJ)');
  }
  if (!anonKeyValid) {
    validationErrors.push('❌ SUPABASE_ANON_KEY: Must be a valid JWT token (> 100 chars, starts with eyJ)');
  }
  
  // SIEMPRE devolver 200 OK, incluso si no está configurado
  return c.json({ 
    status: allValid ? "ok" : "misconfigured", 
    timestamp: new Date().toISOString(),
    version: "2.2.0",
    environment: envCheck,
    configured: ENV_CONFIGURED,
    valid: allValid,
    usingWorkaround: USING_WORKAROUND,
    message: allValid
      ? USING_WORKAROUND 
        ? "✅ All environment variables configured correctly (using workaround for corrupted secrets)" 
        : "✅ All environment variables configured correctly"
      : "⚠️ Environment variables are SET but INVALID. Check format below.",
    validationErrors: validationErrors.length > 0 ? validationErrors : undefined,
    workaroundInfo: USING_WORKAROUND ? {
      reason: "Environment variables are corrupted (hashes instead of JWT tokens)",
      solution: "Using hardcoded correct values as workaround",
      sources: {
        url: !urlIsValid ? 'HARDCODED' : 'ENV',
        anonKey: !anonKeyIsValid ? 'HARDCODED' : 'ENV',
        serviceKey: !serviceKeyIsValid ? 'HARDCODED' : 'ENV'
      },
      note: "The server is using the FINAL values (after workaround), so it should work correctly"
    } : undefined,
    instructions: !allValid ? [
      "🔧 Go to Supabase Dashboard → Edge Functions → make-server-4909a0bc → Environment Variables",
      "📋 Get your keys from: Settings → API → Project API keys",
      "🔑 SUPABASE_URL: Should start with https:// (e.g., https://xxxxx.supabase.co)",
      "🔑 SUPABASE_ANON_KEY: Should start with eyJ and be ~200-300 characters",
      "🔑 SUPABASE_SERVICE_ROLE_KEY: Should start with eyJ and be ~200-300 characters",
      "⚠️ Current keys look like HASHES (SHA-256), not JWT tokens!",
      "💾 After updating, redeploy the function"
    ] : undefined,
    debug: {
      urlSet: !!SUPABASE_URL,
      urlLength: SUPABASE_URL ? SUPABASE_URL.length : 0,
      urlValid,
      serviceKeySet: !!SUPABASE_SERVICE_ROLE_KEY,
      serviceKeyLength: SUPABASE_SERVICE_ROLE_KEY ? SUPABASE_SERVICE_ROLE_KEY.length : 0,
      serviceKeyValid,
      serviceKeyPreview: SUPABASE_SERVICE_ROLE_KEY ? SUPABASE_SERVICE_ROLE_KEY.substring(0, 10) + '...' : 'NOT SET',
      anonKeySet: !!SUPABASE_ANON_KEY,
      anonKeyLength: SUPABASE_ANON_KEY ? SUPABASE_ANON_KEY.length : 0,
      anonKeyValid,
      anonKeyPreview: SUPABASE_ANON_KEY ? SUPABASE_ANON_KEY.substring(0, 10) + '...' : 'NOT SET',
    }
  }, 200); // Explícitamente devolver status code 200
});

// Debug endpoint to check password-requests routes
app.get("/make-server-4909a0bc/debug/password-requests-status", (c) => {
  return c.json({
    message: "Password requests routes are registered",
    routes: {
      "POST /password-requests/create": "Create new request (PUBLIC - NO AUTH) ⭐",
      "GET /password-requests": "List all requests (admin only)",
      "POST /password-requests/:id/approve": "Approve request (admin only)",
      "POST /password-requests/:id/reject": "Reject request (admin only)",
      "DELETE /password-requests/:id": "Delete request (admin only)",
    },
    timestamp: new Date().toISOString(),
    serverConfigured: ENV_CONFIGURED,
    supabaseReady: !!supabase && !!supabaseAuth,
    note: "POST /password-requests/create does NOT require authentication - it's a public endpoint"
  });
});

// Utility endpoint to confirm all unconfirmed emails
app.post("/make-server-4909a0bc/util/confirm-emails", async (c) => {
  try {
    console.log('🔧 UTILITY - Confirming all unconfirmed emails...');
    
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('❌ Error listing users:', error);
      return c.json({ error: error.message }, 500);
    }
    
    const unconfirmedUsers = users?.filter(u => !u.email_confirmed_at) || [];
    
    console.log(`📧 Found ${unconfirmedUsers.length} unconfirmed users`);
    
    const results = [];
    for (const user of unconfirmedUsers) {
      console.log(`📧 Confirming email for: ${user.email}`);
      
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { email_confirm: true }
      );
      
      if (updateError) {
        console.error(`❌ Error confirming ${user.email}:`, updateError);
        results.push({ email: user.email, success: false, error: updateError.message });
      } else {
        console.log(`✅ Confirmed: ${user.email}`);
        results.push({ email: user.email, success: true });
      }
    }
    
    return c.json({ 
      totalUsers: users?.length || 0,
      unconfirmedCount: unconfirmedUsers.length,
      results 
    });
  } catch (error) {
    console.error('❌ Error in confirm-emails utility:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Utility endpoint to update user role to admin
app.post("/make-server-4909a0bc/util/set-admin-role", async (c) => {
  try {
    const { email } = await c.req.json();
    
    if (!email) {
      return c.json({ error: 'Email is required' }, 400);
    }
    
    console.log(`🔧 UTILITY - Updating role to admin for: ${email}`);
    
    // Buscar el usuario por email
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Error listing users:', listError);
      return c.json({ error: listError.message }, 500);
    }
    
    const user = users?.find(u => u.email === email);
    
    if (!user) {
      console.error(`❌ User not found: ${email}`);
      return c.json({ error: `User not found: ${email}` }, 404);
    }
    
    // Actualizar el rol a admin
    const { data, error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          ...user.user_metadata,
          role: 'admin',
          name: user.user_metadata?.name || email.split('@')[0]
        }
      }
    );
    
    if (updateError) {
      console.error(`❌ Error updating role for ${email}:`, updateError);
      return c.json({ error: updateError.message }, 500);
    }
    
    console.log(`✅ Role updated to admin for: ${email}`);
    
    return c.json({ 
      success: true,
      email: email,
      role: 'admin',
      user: {
        id: data.user.id,
        email: data.user.email,
        role: data.user.user_metadata.role
      }
    });
  } catch (error) {
    console.error('❌ Error in set-admin-role utility:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Utility endpoint to create admin user if it doesn't exist
app.post("/make-server-4909a0bc/util/create-admin", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }
    
    console.log(`🔧 UTILITY - Creating admin user: ${email}`);
    
    // Verificar si el usuario ya existe
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Error listing users:', listError);
      return c.json({ error: listError.message }, 500);
    }
    
    const existingUser = users?.find(u => u.email === email);
    
    if (existingUser) {
      console.log(`⚠️ User already exists: ${email}`);
      return c.json({ 
        success: false,
        error: 'User already exists',
        user: {
          id: existingUser.id,
          email: existingUser.email,
          role: existingUser.user_metadata?.role || 'admin'
        }
      }, 400);
    }
    
    // Crear el usuario admin
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: 'Administrador',
        role: 'admin',
      }
    });
    
    if (error) {
      console.error('❌ Error creating admin user:', error);
      return c.json({ error: error.message }, 500);
    }
    
    console.log(`✅ Admin user created: ${email}`);
    
    return c.json({ 
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name,
        role: data.user.user_metadata.role,
      }
    });
  } catch (error) {
    console.error('❌ Error in create-admin utility:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Debug endpoint to check KV store contents
app.get("/make-server-4909a0bc/debug/test-controls", async (c) => {
  try {
    const testControls = await kv.get("test-controls:list");
    return c.json({ 
      count: testControls ? testControls.length : 0,
      testControls: testControls || [],
      ids: testControls ? testControls.map((tc: any) => tc.id) : []
    });
  } catch (error) {
    console.error("Error in debug endpoint:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== PASSWORD REQUESTS ROUTES ====================

// Get all password requests (admin only)
app.get("/make-server-4909a0bc/password-requests", authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    if (user?.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Solo administradores pueden ver solicitudes' }, 403);
    }
    
    const requests = await kv.get("password-requests:list") || [];
    return c.json({ requests });
  } catch (error) {
    console.error("Error fetching password requests:", error);
    return c.json({ error: "Failed to fetch password requests", details: String(error) }, 500);
  }
});

// Approve a password request and create user account (admin only)
app.post("/make-server-4909a0bc/password-requests/:id/approve", authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    if (user?.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Solo administradores pueden aprobar solicitudes' }, 403);
    }
    
    const requestId = c.req.param('id');
    const requests = await kv.get("password-requests:list") || [];
    
    const requestIndex = requests.findIndex((r: any) => r.id === requestId);
    if (requestIndex === -1) {
      return c.json({ error: 'Solicitud no encontrada' }, 404);
    }
    
    const request = requests[requestIndex];
    
    if (request.status !== 'pending') {
      return c.json({ error: 'Esta solicitud ya fue procesada' }, 400);
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Aprobando solicitud:', requestId);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
      // Crear usuario usando función compartida
      const { user: createdUser, password: tempPassword } = await createUserWithPassword(
        request.email,
        request.name,
        request.role
      );
      
      console.log('✅ Usuario creado exitosamente:', createdUser.id);
      
      // Actualizar solicitud
      requests[requestIndex] = {
        ...request,
        status: 'approved',
        approvedAt: new Date().toISOString(),
        approvedBy: user.email,
        generatedPassword: tempPassword,
      };
      
      await kv.set("password-requests:list", requests);
      
      console.log('✅ Solicitud aprobada y usuario creado');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      return c.json({ 
        success: true,
        credentials: {
          email: request.email,
          password: tempPassword,
        },
        userId: createdUser.id,
        message: '✅ Usuario creado exitosamente'
      }, 201);
      
    } catch (createError) {
      console.error('❌ Error al crear usuario:', createError);
      
      if (createError instanceof Error && (createError.message.includes('already') || createError.message.includes('exists'))) {
        // Usuario ya existe - marcar solicitud como aprobada de todos modos
        requests[requestIndex] = {
          ...request,
          status: 'approved',
          approvedAt: new Date().toISOString(),
          generatedPassword: 'Usuario ya existe',
        };
        await kv.set("password-requests:list", requests);
        
        return c.json({ 
          error: 'El usuario ya existe en el sistema',
          existingUser: true
        }, 400);
      }
      
      throw createError;
    }
    
  } catch (error) {
    console.error("❌ Error approving password request:", error);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return c.json({ 
      error: error instanceof Error ? error.message : "Failed to approve request", 
      details: String(error) 
    }, 500);
  }
});

// Reject a password request (admin only)
app.post("/make-server-4909a0bc/password-requests/:id/reject", authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    if (user?.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Solo administradores pueden rechazar solicitudes' }, 403);
    }
    
    const requestId = c.req.param('id');
    const requests = await kv.get("password-requests:list") || [];
    
    const requestIndex = requests.findIndex((r: any) => r.id === requestId);
    if (requestIndex === -1) {
      return c.json({ error: 'Solicitud no encontrada' }, 404);
    }
    
    const request = requests[requestIndex];
    
    if (request.status !== 'pending') {
      return c.json({ error: 'Esta solicitud ya fue procesada' }, 400);
    }
    
    // Actualizar solicitud
    requests[requestIndex] = {
      ...request,
      status: 'approved',
      approvedAt: new Date().toISOString(),
      approvedBy: user.email,
      generatedPassword: tempPassword, // Guardar temporalmente para mostrar al admin
    };
    
    await kv.set("password-requests:list", requests);
    
    return c.json({ 
      success: true,
      credentials: {
        email: request.email,
        password: tempPassword,
      },
      userId: data.user.id,
      message: '✅ Usuario creado. IMPORTANTE: Debes aprobar al usuario en el Dashboard de Supabase (cambiar status a "approved")'
    }, 201);
    
  } catch (error) {
    console.error("❌ Error approving password request:", error);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return c.json({ 
      error: error instanceof Error ? error.message : "Failed to approve request", 
      details: String(error) 
    }, 500);
  }
});

// Delete a password request (admin only)
app.delete("/make-server-4909a0bc/password-requests/:id", authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    if (user?.user_metadata?.role !== 'admin') {
      return c.json({ error: 'Solo administradores pueden eliminar solicitudes' }, 403);
    }
    
    const requestId = c.req.param('id');
    const requests = await kv.get("password-requests:list") || [];
    
    const filteredRequests = requests.filter((r: any) => r.id !== requestId);
    
    if (filteredRequests.length === requests.length) {
      return c.json({ error: 'Solicitud no encontrada' }, 404);
    }
    
    await kv.set("password-requests:list", filteredRequests);
    
    return c.json({ 
      success: true,
      message: 'Solicitud eliminada exitosamente'
    });
    
  } catch (error) {
    console.error("Error deleting password request:", error);
    return c.json({ error: "Failed to delete request", details: String(error) }, 500);
  }
});

// ==================== SWIMMERS ROUTES ====================

// Get all swimmers
app.get("/make-server-4909a0bc/swimmers", async (c) => {
  try {
    const swimmers = await kv.get("swimmers:list");
    return c.json({ swimmers: swimmers || [] });
  } catch (error) {
    console.error("Error fetching swimmers:", error);
    return c.json({ error: "Failed to fetch swimmers", details: String(error) }, 500);
  }
});

// Add a new swimmer
app.post("/make-server-4909a0bc/swimmers", async (c) => {
  try {
    const newSwimmer = await c.req.json();
    const swimmers = await kv.get("swimmers:list") || [];
    
    // Generate unique ID
    const id = `s${Date.now()}`;
    const swimmerWithId = { ...newSwimmer, id };
    
    // Add to list
    const updatedSwimmers = [...swimmers, swimmerWithId];
    await kv.set("swimmers:list", updatedSwimmers);
    
    return c.json({ swimmer: swimmerWithId }, 201);
  } catch (error) {
    console.error("Error adding swimmer:", error);
    return c.json({ error: "Failed to add swimmer", details: String(error) }, 500);
  }
});

// Update a swimmer
app.put("/make-server-4909a0bc/swimmers/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updatedData = await c.req.json();
    const swimmers = await kv.get("swimmers:list") || [];
    
    const index = swimmers.findIndex((s: any) => s.id === id);
    if (index === -1) {
      return c.json({ error: "Swimmer not found" }, 404);
    }
    
    swimmers[index] = { ...updatedData, id };
    await kv.set("swimmers:list", swimmers);
    
    return c.json({ swimmer: swimmers[index] });
  } catch (error) {
    console.error("Error updating swimmer:", error);
    return c.json({ error: "Failed to update swimmer", details: String(error) }, 500);
  }
});

// Delete a swimmer
app.delete("/make-server-4909a0bc/swimmers/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const swimmers = await kv.get("swimmers:list") || [];
    
    const filteredSwimmers = swimmers.filter((s: any) => s.id !== id);
    
    if (filteredSwimmers.length === swimmers.length) {
      return c.json({ error: "Swimmer not found" }, 404);
    }
    
    await kv.set("swimmers:list", filteredSwimmers);
    
    // Also delete all attendance records for this swimmer
    const attendanceKeys = await kv.getByPrefix(`attendance:${id}:`);
    if (attendanceKeys && attendanceKeys.length > 0) {
      await kv.mdel(attendanceKeys.map((item: any) => item.key));
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting swimmer:", error);
    return c.json({ error: "Failed to delete swimmer", details: String(error) }, 500);
  }
});

// ==================== ATTENDANCE ROUTES ====================

// Get all attendance records
app.get("/make-server-4909a0bc/attendance", async (c) => {
  try {
    const records = await kv.getByPrefix("attendance:");
    const attendanceList = records
      ? records
          .filter((item: any) => item.key !== "attendance:list")
          .map((item: any) => item.value)
          .filter((record: any) => record && record.id && record.swimmerId && record.sessionId) // Filtrar registros inválidos
      : [];
    return c.json({ attendance: attendanceList });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return c.json({ error: "Failed to fetch attendance", details: String(error) }, 500);
  }
});

// Add attendance record
app.post("/make-server-4909a0bc/attendance", async (c) => {
  try {
    const record = await c.req.json();
    const id = `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const recordWithId = { ...record, id };
    
    // Store individual record
    await kv.set(`attendance:${record.swimmerId}:${record.sessionId}:${id}`, recordWithId);
    
    return c.json({ record: recordWithId }, 201);
  } catch (error) {
    console.error("Error adding attendance:", error);
    return c.json({ error: "Failed to add attendance", details: String(error) }, 500);
  }
});

// Update attendance record
app.put("/make-server-4909a0bc/attendance/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updatedData = await c.req.json();
    
    // Find the record by searching all attendance keys
    const allRecords = await kv.getByPrefix("attendance:");
    const recordItem = allRecords?.find((item: any) => item.value?.id === id);
    
    if (!recordItem) {
      return c.json({ error: "Attendance record not found" }, 404);
    }
    
    const updatedRecord = { ...updatedData, id };
    await kv.set(recordItem.key, updatedRecord);
    
    return c.json({ record: updatedRecord });
  } catch (error) {
    console.error("Error updating attendance:", error);
    return c.json({ error: "Failed to update attendance", details: String(error) }, 500);
  }
});

// Delete attendance record
app.delete("/make-server-4909a0bc/attendance/:id", async (c) => {
  try {
    const id = c.req.param("id");
    console.log("🔍 Attempting to delete attendance record with ID:", id);
    
    // Find and delete the record
    const allRecords = await kv.getByPrefix("attendance:");
    console.log("📋 Total attendance records found:", allRecords?.length || 0);
    
    // Log all record IDs for debugging
    if (allRecords && allRecords.length > 0) {
      console.log("📝 Available record IDs:", allRecords.map((item: any) => item.value?.id).filter(Boolean));
    }
    
    const recordItem = allRecords?.find((item: any) => item.value?.id === id);
    
    if (!recordItem) {
      console.log("❌ Record not found with ID:", id);
      // Return success even if not found to avoid UI errors
      return c.json({ success: true, message: "Record not found or already deleted" });
    }
    
    console.log("✅ Found record to delete:", recordItem.key);
    await kv.del(recordItem.key);
    console.log("✅ Attendance record deleted successfully");
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting attendance:", error);
    return c.json({ error: "Failed to delete attendance", details: String(error) }, 500);
  }
});

// ==================== COMPETITIONS ROUTES ====================

// Get all competitions
app.get("/make-server-4909a0bc/competitions", async (c) => {
  try {
    const competitions = await kv.get("competitions:list");
    return c.json({ competitions: competitions || [] });
  } catch (error) {
    console.error("Error fetching competitions:", error);
    return c.json({ error: "Failed to fetch competitions", details: String(error) }, 500);
  }
});

// Add a new competition
app.post("/make-server-4909a0bc/competitions", async (c) => {
  try {
    const newCompetition = await c.req.json();
    const competitions = await kv.get("competitions:list") || [];
    
    // Generate unique ID
    const id = `comp_${Date.now()}`;
    const competitionWithId = { ...newCompetition, id };
    
    // Add to list
    const updatedCompetitions = [...competitions, competitionWithId];
    await kv.set("competitions:list", updatedCompetitions);
    
    return c.json({ competition: competitionWithId }, 201);
  } catch (error) {
    console.error("Error adding competition:", error);
    return c.json({ error: "Failed to add competition", details: String(error) }, 500);
  }
});

// Update a competition
app.put("/make-server-4909a0bc/competitions/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updatedData = await c.req.json();
    const competitions = await kv.get("competitions:list") || [];
    
    const index = competitions.findIndex((comp: any) => comp.id === id);
    if (index === -1) {
      return c.json({ error: "Competition not found" }, 404);
    }
    
    competitions[index] = { ...updatedData, id };
    await kv.set("competitions:list", competitions);
    
    return c.json({ competition: competitions[index] });
  } catch (error) {
    console.error("Error updating competition:", error);
    return c.json({ error: "Failed to update competition", details: String(error) }, 500);
  }
});

// Delete a competition
app.delete("/make-server-4909a0bc/competitions/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const competitions = await kv.get("competitions:list") || [];
    
    // Find competition before deleting to get PDF info
    const competition = competitions.find((comp: any) => comp.id === id);
    
    const filteredCompetitions = competitions.filter((comp: any) => comp.id !== id);
    
    if (filteredCompetitions.length === competitions.length) {
      return c.json({ error: "Competition not found" }, 404);
    }
    
    // Delete PDF from storage if exists
    if (competition?.pdfUrl) {
      try {
        const fileName = competition.pdfFileName || `competition-${id}.pdf`;
        const { error: deleteError } = await supabase.storage
          .from(COMPETITIONS_BUCKET)
          .remove([fileName]);
        
        if (deleteError) {
          console.error('⚠️ Error deleting PDF:', deleteError);
        } else {
          console.log(`✅ PDF deleted from storage: ${fileName}`);
        }
      } catch (err) {
        console.error('⚠️ Failed to delete PDF:', err);
      }
    }
    
    await kv.set("competitions:list", filteredCompetitions);
    
    // Also delete all swimmer participation records for this competition
    const participations = await kv.get("swimmer_competitions:list") || [];
    const filteredParticipations = participations.filter((p: any) => p.competitionId !== id);
    await kv.set("swimmer_competitions:list", filteredParticipations);
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting competition:", error);
    return c.json({ error: "Failed to delete competition", details: String(error) }, 500);
  }
});

// Upload PDF for competition
app.post("/make-server-4909a0bc/competitions/:id/upload-pdf", async (c) => {
  try {
    const id = c.req.param("id");
    const formData = await c.req.formData();
    const file = formData.get('file');
    
    if (!file || !(file instanceof File)) {
      return c.json({ error: "No file provided" }, 400);
    }
    
    // Validate file type
    if (file.type !== 'application/pdf') {
      return c.json({ error: "Only PDF files are allowed" }, 400);
    }
    
    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return c.json({ error: "File size must be less than 10MB" }, 400);
    }
    
    // Get competition
    const competitions = await kv.get("competitions:list") || [];
    const compIndex = competitions.findIndex((comp: any) => comp.id === id);
    
    if (compIndex === -1) {
      return c.json({ error: "Competition not found" }, 404);
    }
    
    const competition = competitions[compIndex];
    
    // Delete old PDF if exists
    if (competition.pdfFileName) {
      try {
        await supabase.storage
          .from(COMPETITIONS_BUCKET)
          .remove([competition.pdfFileName]);
        console.log(`🗑️ Old PDF deleted: ${competition.pdfFileName}`);
      } catch (err) {
        console.log('⚠️ Could not delete old PDF:', err);
      }
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${id}_${timestamp}_${sanitizedName}`;
    
    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(COMPETITIONS_BUCKET)
      .upload(fileName, fileBuffer, {
        contentType: 'application/pdf',
        upsert: false
      });
    
    if (uploadError) {
      console.error('❌ Error uploading PDF:', uploadError);
      return c.json({ error: "Failed to upload PDF", details: uploadError.message }, 500);
    }
    
    // Get signed URL (valid for 1 year)
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from(COMPETITIONS_BUCKET)
      .createSignedUrl(fileName, 31536000); // 1 year in seconds
    
    if (urlError || !signedUrlData) {
      console.error('❌ Error creating signed URL:', urlError);
      return c.json({ error: "Failed to create download URL", details: urlError?.message }, 500);
    }
    
    // Update competition with PDF info
    competitions[compIndex] = {
      ...competition,
      pdfUrl: signedUrlData.signedUrl,
      pdfFileName: fileName
    };
    
    await kv.set("competitions:list", competitions);
    
    console.log(`✅ PDF uploaded successfully for competition ${id}: ${fileName}`);
    
    return c.json({
      success: true,
      competition: competitions[compIndex],
      fileName
    });
    
  } catch (error) {
    console.error("Error uploading PDF:", error);
    return c.json({ error: "Failed to upload PDF", details: String(error) }, 500);
  }
});

// Delete PDF from competition
app.delete("/make-server-4909a0bc/competitions/:id/pdf", async (c) => {
  try {
    const id = c.req.param("id");
    
    const competitions = await kv.get("competitions:list") || [];
    const compIndex = competitions.findIndex((comp: any) => comp.id === id);
    
    if (compIndex === -1) {
      return c.json({ error: "Competition not found" }, 404);
    }
    
    const competition = competitions[compIndex];
    
    if (!competition.pdfFileName) {
      return c.json({ error: "No PDF attached to this competition" }, 404);
    }
    
    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from(COMPETITIONS_BUCKET)
      .remove([competition.pdfFileName]);
    
    if (deleteError) {
      console.error('❌ Error deleting PDF:', deleteError);
      return c.json({ error: "Failed to delete PDF", details: deleteError.message }, 500);
    }
    
    // Remove PDF info from competition
    competitions[compIndex] = {
      ...competition,
      pdfUrl: undefined,
      pdfFileName: undefined
    };
    
    await kv.set("competitions:list", competitions);
    
    console.log(`✅ PDF deleted successfully from competition ${id}`);
    
    return c.json({
      success: true,
      competition: competitions[compIndex]
    });
    
  } catch (error) {
    console.error("Error deleting PDF:", error);
    return c.json({ error: "Failed to delete PDF", details: String(error) }, 500);
  }
});

// ==================== SWIMMER COMPETITIONS ROUTES ====================

// Get all swimmer competition participations
app.get("/make-server-4909a0bc/swimmer-competitions", async (c) => {
  try {
    const participations = await kv.get("swimmer_competitions:list");
    return c.json({ participations: participations || [] });
  } catch (error) {
    console.error("Error fetching swimmer competitions:", error);
    return c.json({ error: "Failed to fetch swimmer competitions", details: String(error) }, 500);
  }
});

// Add or update swimmer competition participation
app.post("/make-server-4909a0bc/swimmer-competitions", async (c) => {
  try {
    const newParticipation = await c.req.json();
    const participations = await kv.get("swimmer_competitions:list") || [];
    
    // Check if participation already exists
    const existingIndex = participations.findIndex(
      (p: any) => p.swimmerId === newParticipation.swimmerId && p.competitionId === newParticipation.competitionId
    );
    
    let participationWithId;
    if (existingIndex !== -1) {
      // Update existing participation
      participationWithId = { ...newParticipation, id: participations[existingIndex].id };
      participations[existingIndex] = participationWithId;
    } else {
      // Create new participation
      const id = `sc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      participationWithId = { ...newParticipation, id };
      participations.push(participationWithId);
    }
    
    await kv.set("swimmer_competitions:list", participations);
    
    return c.json({ participation: participationWithId }, 201);
  } catch (error) {
    console.error("Error adding swimmer competition:", error);
    return c.json({ error: "Failed to add swimmer competition", details: String(error) }, 500);
  }
});

// Update swimmer competition participation
app.put("/make-server-4909a0bc/swimmer-competitions/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updatedData = await c.req.json();
    const participations = await kv.get("swimmer_competitions:list") || [];
    
    const index = participations.findIndex((p: any) => p.id === id);
    if (index === -1) {
      return c.json({ error: "Swimmer competition not found" }, 404);
    }
    
    participations[index] = { ...updatedData, id };
    await kv.set("swimmer_competitions:list", participations);
    
    return c.json({ participation: participations[index] });
  } catch (error) {
    console.error("Error updating swimmer competition:", error);
    return c.json({ error: "Failed to update swimmer competition", details: String(error) }, 500);
  }
});

// Delete swimmer competition participation
app.delete("/make-server-4909a0bc/swimmer-competitions/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const participations = await kv.get("swimmer_competitions:list") || [];
    
    const filteredParticipations = participations.filter((p: any) => p.id !== id);
    
    if (filteredParticipations.length === participations.length) {
      return c.json({ error: "Swimmer competition not found" }, 404);
    }
    
    await kv.set("swimmer_competitions:list", filteredParticipations);
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting swimmer competition:", error);
    return c.json({ error: "Failed to delete swimmer competition", details: String(error) }, 500);
  }
});

// ==================== COMPETITION RESULTS ROUTES ====================

// Helper function to convert time to seconds
function timeToSeconds(time: string): number {
  const parts = time.split(':');
  if (parts.length === 2) {
    const minutes = parseInt(parts[0]);
    const seconds = parseFloat(parts[1]);
    return minutes * 60 + seconds;
  }
  return parseFloat(time);
}

// Helper function to parse event name
function parseEvent(eventName: string): { distance: number; style: string } | null {
  const match = eventName.match(/(\d+)m?\s+(.+)/i);
  if (match) {
    const distance = parseInt(match[1]);
    const style = match[2].trim();
    
    const styleMap: Record<string, string> = {
      'Libre': 'Libre',
      'Espalda': 'Espalda',
      'Pecho': 'Pecho',
      'Mariposa': 'Mariposa',
      'Combinado': 'Combinado',
      'IM': 'Combinado',
      'Medley': 'Combinado'
    };
    
    const normalizedStyle = styleMap[style] || style;
    return { distance, style: normalizedStyle };
  }
  return null;
}

// Update competition results and automatically update personal bests
app.post("/make-server-4909a0bc/competition-results", async (c) => {
  try {
    const { swimmerId, competitionId, events } = await c.req.json();
    
    if (!swimmerId || !competitionId || !events) {
      return c.json({ error: "Missing required fields: swimmerId, competitionId, events" }, 400);
    }
    
    // Get current data
    const swimmers = await kv.get("swimmers:list") || [];
    const participations = await kv.get("swimmer_competitions:list") || [];
    const competitions = await kv.get("competitions:list") || [];
    
    // Find swimmer
    const swimmerIndex = swimmers.findIndex((s: any) => s.id === swimmerId);
    if (swimmerIndex === -1) {
      return c.json({ error: "Swimmer not found" }, 404);
    }
    
    // Find competition
    const competition = competitions.find((c: any) => c.id === competitionId);
    if (!competition) {
      return c.json({ error: "Competition not found" }, 404);
    }
    
    const swimmer = swimmers[swimmerIndex];
    
    // Find or create participation
    let participationIndex = participations.findIndex(
      (p: any) => p.swimmerId === swimmerId && p.competitionId === competitionId
    );
    
    let participation;
    if (participationIndex === -1) {
      // Create new participation
      const id = `sc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      participation = {
        id,
        swimmerId,
        competitionId,
        participates: true,
        events: events
      };
      participations.push(participation);
      participationIndex = participations.length - 1;
    } else {
      // Update existing participation
      participation = participations[participationIndex];
      participation.events = events;
    }
    
    // Update personal bests and history
    const currentBests = swimmer.personalBests || [];
    const currentHistory = swimmer.personalBestsHistory || [];
    const updatedBests = [...currentBests];
    const newHistoryEntries = [];
    
    for (const event of events) {
      if (!event.time) continue; // Skip events without a time
      
      const parsed = parseEvent(event.event);
      if (!parsed) continue;
      
      const { distance, style } = parsed;
      const timeInSeconds = timeToSeconds(event.time);
      
      // Create history entry
      const historyEntry = {
        id: `pb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        distance,
        style,
        time: event.time,
        timeInSeconds,
        date: competition.startDate,
        location: competition.location,
        isPersonalBest: false
      };
      
      // Check if this is a personal best
      const existingBestIndex = updatedBests.findIndex(
        (pb: any) => pb.distance === distance && pb.style === style
      );
      
      if (existingBestIndex === -1) {
        // First time for this distance/style
        updatedBests.push({
          distance,
          style,
          time: event.time,
          date: competition.startDate,
          location: competition.location
        });
        historyEntry.isPersonalBest = true;
      } else {
        // Check if it's faster than current best
        const currentBestTime = timeToSeconds(updatedBests[existingBestIndex].time);
        if (timeInSeconds < currentBestTime) {
          updatedBests[existingBestIndex] = {
            distance,
            style,
            time: event.time,
            date: competition.startDate,
            location: competition.location
          };
          historyEntry.isPersonalBest = true;
        }
      }
      
      newHistoryEntries.push(historyEntry);
    }
    
    // Update swimmer with new bests and history
    swimmers[swimmerIndex] = {
      ...swimmer,
      personalBests: updatedBests,
      personalBestsHistory: [...currentHistory, ...newHistoryEntries]
    };
    
    // Save all updates
    await kv.set("swimmers:list", swimmers);
    await kv.set("swimmer_competitions:list", participations);
    
    console.log(`✅ Competition results updated for swimmer ${swimmerId} in competition ${competitionId}`);
    console.log(`   - ${newHistoryEntries.filter((e: any) => e.isPersonalBest).length} new personal best(s)`);
    
    return c.json({
      participation: participations[participationIndex],
      swimmer: swimmers[swimmerIndex]
    });
  } catch (error) {
    console.error("Error updating competition results:", error);
    return c.json({ error: "Failed to update competition results", details: String(error) }, 500);
  }
});

// ==================== HOLIDAYS ROUTES ====================

// Get all holidays
app.get("/make-server-4909a0bc/holidays", async (c) => {
  try {
    const holidays = await kv.get("holidays:list");
    return c.json({ holidays: holidays || [] });
  } catch (error) {
    console.error("Error fetching holidays:", error);
    return c.json({ error: "Failed to fetch holidays", details: String(error) }, 500);
  }
});

// Add a new holiday
app.post("/make-server-4909a0bc/holidays", async (c) => {
  try {
    const newHoliday = await c.req.json();
    const holidays = await kv.get("holidays:list") || [];
    
    // Generate unique ID
    const id = `h${Date.now()}`;
    const holidayWithId = { ...newHoliday, id };
    
    // Add to list
    const updatedHolidays = [...holidays, holidayWithId];
    await kv.set("holidays:list", updatedHolidays);
    
    return c.json({ holiday: holidayWithId }, 201);
  } catch (error) {
    console.error("Error adding holiday:", error);
    return c.json({ error: "Failed to add holiday", details: String(error) }, 500);
  }
});

// Update a holiday
app.put("/make-server-4909a0bc/holidays/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updatedData = await c.req.json();
    const holidays = await kv.get("holidays:list") || [];
    
    const index = holidays.findIndex((h: any) => h.id === id);
    if (index === -1) {
      return c.json({ error: "Holiday not found" }, 404);
    }
    
    holidays[index] = { ...updatedData, id };
    await kv.set("holidays:list", holidays);
    
    return c.json({ holiday: holidays[index] });
  } catch (error) {
    console.error("Error updating holiday:", error);
    return c.json({ error: "Failed to update holiday", details: String(error) }, 500);
  }
});

// Delete a holiday
app.delete("/make-server-4909a0bc/holidays/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const holidays = await kv.get("holidays:list") || [];
    
    const filteredHolidays = holidays.filter((h: any) => h.id !== id);
    
    if (filteredHolidays.length === holidays.length) {
      return c.json({ error: "Holiday not found" }, 404);
    }
    
    await kv.set("holidays:list", filteredHolidays);
    
    return c.json({ message: "Holiday deleted successfully" });
  } catch (error) {
    console.error("Error deleting holiday:", error);
    return c.json({ error: "Failed to delete holiday", details: String(error) }, 500);
  }
});

// ==================== TEST CONTROL ROUTES ====================

// Get all test controls
app.get("/make-server-4909a0bc/test-controls", async (c) => {
  try {
    const testControls = await kv.get("test-controls:list");
    return c.json({ testControls: testControls || [] });
  } catch (error) {
    console.error("Error fetching test controls:", error);
    return c.json({ error: "Failed to fetch test controls", details: String(error) }, 500);
  }
});

// Add a new test control
app.post("/make-server-4909a0bc/test-controls", async (c) => {
  try {
    const newTestControl = await c.req.json();
    console.log("📝 Creating new test control:", newTestControl);
    
    const testControls = await kv.get("test-controls:list") || [];
    console.log("📋 Existing test controls before add:", testControls.length);
    
    // Generate unique ID
    const id = `tc${Date.now()}`;
    const testControlWithId = { 
      ...newTestControl, 
      id,
      createdAt: new Date().toISOString()
    };
    
    console.log("🆕 New test control with ID:", { id, name: testControlWithId.name });
    
    // Add to list
    const updatedTestControls = [...testControls, testControlWithId];
    await kv.set("test-controls:list", updatedTestControls);
    
    // Verify it was saved
    const verification = await kv.get("test-controls:list") || [];
    console.log("✅ Test controls after save:", verification.length, "items");
    console.log("📋 All test control IDs:", verification.map((tc: any) => tc.id));
    
    return c.json({ testControl: testControlWithId }, 201);
  } catch (error) {
    console.error("Error adding test control:", error);
    return c.json({ error: "Failed to add test control", details: String(error) }, 500);
  }
});

// Update a test control
app.put("/make-server-4909a0bc/test-controls/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updatedData = await c.req.json();
    const testControls = await kv.get("test-controls:list") || [];
    
    const index = testControls.findIndex((tc: any) => tc.id === id);
    if (index === -1) {
      return c.json({ error: "Test control not found" }, 404);
    }
    
    testControls[index] = { ...updatedData, id, createdAt: testControls[index].createdAt };
    await kv.set("test-controls:list", testControls);
    
    return c.json({ testControl: testControls[index] });
  } catch (error) {
    console.error("Error updating test control:", error);
    return c.json({ error: "Failed to update test control", details: String(error) }, 500);
  }
});

// Delete a test control
app.delete("/make-server-4909a0bc/test-controls/:id", async (c) => {
  try {
    const id = c.req.param("id");
    
    const testControls = await kv.get("test-controls:list");
    const list = testControls || [];
    
    const filtered = list.filter((tc: any) => tc.id !== id);
    
    if (filtered.length === list.length) {
      // Test control not found - responder con 404 silenciosamente
      return c.json({ error: "Test control not found" }, 404);
    }
    
    // Delete the test control
    await kv.set("test-controls:list", filtered);
    
    // Also delete associated test results
    const testResults = await kv.get("test-results:list") || [];
    const filteredResults = testResults.filter((tr: any) => tr.testId !== id);
    const deletedResultsCount = testResults.length - filteredResults.length;
    
    if (deletedResultsCount > 0) {
      await kv.set("test-results:list", filteredResults);
      console.log(`✅ Deleted ${deletedResultsCount} associated test results`);
    }
    
    return c.json({ success: true, deletedResults: deletedResultsCount });
  } catch (error) {
    console.error("❌ Error deleting test control:", error);
    return c.json({ error: "Failed to delete test control", details: String(error) }, 500);
  }
});

// ==================== TEST RESULTS ROUTES ====================

// Get all test results
app.get("/make-server-4909a0bc/test-results", async (c) => {
  try {
    const testResults = await kv.get("test-results:list");
    return c.json({ testResults: testResults || [] });
  } catch (error) {
    console.error("Error fetching test results:", error);
    return c.json({ error: "Failed to fetch test results", details: String(error) }, 500);
  }
});

// Add a new test result
app.post("/make-server-4909a0bc/test-results", async (c) => {
  try {
    const newTestResult = await c.req.json();
    const testResults = await kv.get("test-results:list") || [];
    
    // Generate unique ID
    const id = `tr${Date.now()}`;
    const testResultWithId = { 
      ...newTestResult, 
      id,
      createdAt: new Date().toISOString()
    };
    
    // Add to list
    const updatedTestResults = [...testResults, testResultWithId];
    await kv.set("test-results:list", updatedTestResults);
    
    return c.json({ testResult: testResultWithId }, 201);
  } catch (error) {
    console.error("Error adding test result:", error);
    return c.json({ error: "Failed to add test result", details: String(error) }, 500);
  }
});

// Update a test result
app.put("/make-server-4909a0bc/test-results/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updatedData = await c.req.json();
    const testResults = await kv.get("test-results:list") || [];
    
    const index = testResults.findIndex((tr: any) => tr.id === id);
    if (index === -1) {
      return c.json({ error: "Test result not found" }, 404);
    }
    
    testResults[index] = { ...updatedData, id, createdAt: testResults[index].createdAt };
    await kv.set("test-results:list", testResults);
    
    return c.json({ testResult: testResults[index] });
  } catch (error) {
    console.error("Error updating test result:", error);
    return c.json({ error: "Failed to update test result", details: String(error) }, 500);
  }
});

// Delete a test result
app.delete("/make-server-4909a0bc/test-results/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const testResults = await kv.get("test-results:list") || [];
    
    const filteredTestResults = testResults.filter((tr: any) => tr.id !== id);
    
    if (filteredTestResults.length === testResults.length) {
      return c.json({ error: "Test result not found" }, 404);
    }
    
    await kv.set("test-results:list", filteredTestResults);
    
    return c.json({ message: "Test result deleted successfully" });
  } catch (error) {
    console.error("Error deleting test result:", error);
    return c.json({ error: "Failed to delete test result", details: String(error) }, 500);
  }
});

// ==================== WORKOUT ROUTES ====================

// Storage-based functions to avoid KV table trigger issues
// Workouts are stored in Supabase Storage bucket instead of KV table
const WORKOUTS_BUCKET = "make-4909a0bc-workouts";
const WORKOUTS_FILE = "workouts.json";

// Initialize storage bucket on startup
async function initWorkoutsBucket() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === WORKOUTS_BUCKET);
    
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(WORKOUTS_BUCKET, {
        public: false,
        fileSizeLimit: 10485760 // 10MB
      });
      if (error && error.message !== "The resource already exists") {
        console.error("Error creating workouts bucket:", error);
      } else {
        console.log("✅ Workouts storage bucket ready");
      }
    } else {
      console.log("✅ Workouts storage bucket already exists");
    }
    
    // Initialize with empty array if file doesn't exist
    const { data: files } = await supabase.storage
      .from(WORKOUTS_BUCKET)
      .list();
    
    const fileExists = files?.some(f => f.name === WORKOUTS_FILE);
    if (!fileExists) {
      console.log("📝 Creating initial workouts.json file...");
      const emptyWorkouts = JSON.stringify([], null, 2);
      await supabase.storage
        .from(WORKOUTS_BUCKET)
        .upload(WORKOUTS_FILE, new Blob([emptyWorkouts], { type: 'application/json' }), {
          contentType: 'application/json'
        });
      console.log("✅ Initial workouts.json created");
    }
  } catch (error) {
    console.error("Error initializing workouts bucket:", error);
  }
}

// Get workouts from storage
async function getWorkoutsFromStorage(): Promise<any[]> {
  try {
    const { data, error } = await supabase.storage
      .from(WORKOUTS_BUCKET)
      .download(WORKOUTS_FILE);
    
    if (error) {
      console.error("Download error details:", error);
      // Return empty array if file doesn't exist or any error
      return [];
    }
    
    if (!data) {
      console.log("No data returned from download");
      return [];
    }
    
    const text = await data.text();
    if (!text || text.trim() === '') {
      return [];
    }
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error getting workouts from storage:", error);
    return [];
  }
}

// Save workouts to storage
async function saveWorkoutsToStorage(workouts: any[]): Promise<void> {
  try {
    const jsonString = JSON.stringify(workouts, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    console.log(`💾 Saving ${workouts.length} workouts to storage...`);
    
    const { error } = await supabase.storage
      .from(WORKOUTS_BUCKET)
      .upload(WORKOUTS_FILE, blob, {
        upsert: true,
        contentType: 'application/json'
      });
    
    if (error) {
      console.error("Storage upload error:", error);
      throw error;
    }
    
    console.log("✅ Workouts saved successfully");
  } catch (error) {
    console.error("Error saving workouts to storage:", error);
    throw error;
  }
}



// Helper function to deeply normalize objects and ensure all have required timestamp fields
function deepNormalizeObject(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(deepNormalizeObject);
  
  const now = new Date().toISOString();
  const result: any = {};
  
  // First copy and recursively process all properties
  for (const key in obj) {
    result[key] = deepNormalizeObject(obj[key]);
  }
  
  // Ensure timestamps exist
  if (!result.created_at && !result.createdAt) {
    result.created_at = now;
  } else if (result.createdAt && !result.created_at) {
    result.created_at = result.createdAt;
  }
  
  if (!result.updated_at && !result.updatedAt) {
    result.updated_at = now;
  } else if (result.updatedAt && !result.updated_at) {
    result.updated_at = result.updatedAt;
  }
  
  return result;
}

// Helper function to normalize a single workout
function normalizeWorkout(workout: any): any {
  return deepNormalizeObject(workout);
}

// Helper function to normalize array of workouts
function normalizeWorkouts(workouts: any[]): any[] {
  return workouts.map(normalizeWorkout);
}

// Get all workouts
app.get("/make-server-4909a0bc/workouts", async (c) => {
  try {
    const workouts = await getWorkoutsFromStorage();
    // Filter out deleted workouts - only return active ones
    const activeWorkouts = workouts.filter((w: any) => !w.deleted);
    console.log(`📊 Returning ${activeWorkouts.length} active workouts (${workouts.length} total, ${workouts.length - activeWorkouts.length} deleted)`);
    if (activeWorkouts.length > 0) {
      console.log("🔍 Sample workout groups:", activeWorkouts.slice(0, 3).map((w: any) => ({ id: w.id, group: w.group, groupType: typeof w.group })));
    }
    return c.json({ workouts: activeWorkouts });
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return c.json({ error: "Failed to fetch workouts", details: String(error) }, 500);
  }
});

// Add a new workout
app.post("/make-server-4909a0bc/workouts", async (c) => {
  try {
    const newWorkout = await c.req.json();
    console.log("📝 Creating new workout:", newWorkout.title || newWorkout.type);
    console.log("🔍 Group value received:", newWorkout.group, "Type:", typeof newWorkout.group);
    
    const workouts = await getWorkoutsFromStorage();
    console.log("📋 Existing workouts before add:", workouts.length);
    
    // Generate unique ID
    const id = `w${Date.now()}`;
    const now = new Date().toISOString();
    const workoutWithId = { 
      ...newWorkout, 
      id,
      created_at: now,
      updated_at: now
    };
    
    console.log("🆕 New workout with ID:", { id, title: workoutWithId.title });
    
    // Normalize ALL workouts (existing + new) to ensure they all have timestamps
    const normalizedExisting = normalizeWorkouts(workouts);
    const normalizedNew = normalizeWorkout(workoutWithId);
    const updatedWorkouts = [...normalizedExisting, normalizedNew];
    
    console.log("🔍 About to save array with", updatedWorkouts.length, "workouts");
    
    await saveWorkoutsToStorage(updatedWorkouts);
    
    console.log("✅ Workout added successfully");
    
    return c.json({ workout: normalizedNew }, 201);
  } catch (error) {
    console.error("Error adding workout:", error);
    console.error("Error stack:", error.stack);
    return c.json({ error: "Failed to add workout", details: String(error) }, 500);
  }
});

// Update a workout
app.put("/make-server-4909a0bc/workouts/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updatedData = await c.req.json();
    const workouts = await getWorkoutsFromStorage();
    
    const index = workouts.findIndex((w: any) => w.id === id);
    if (index === -1) {
      return c.json({ error: "Workout not found" }, 404);
    }
    
    // Normalize all workouts first
    const normalizedWorkouts = normalizeWorkouts(workouts);
    
    // Update the specific workout and normalize it
    const updatedWorkout = { 
      ...updatedData, 
      id, 
      created_at: normalizedWorkouts[index].created_at,
      updated_at: new Date().toISOString() 
    };
    normalizedWorkouts[index] = normalizeWorkout(updatedWorkout);
    
    await saveWorkoutsToStorage(normalizedWorkouts);
    
    console.log("✅ Workout updated:", id);
    
    return c.json({ workout: normalizedWorkouts[index] });
  } catch (error) {
    console.error("Error updating workout:", error);
    return c.json({ error: "Failed to update workout", details: String(error) }, 500);
  }
});

// Delete a workout (soft delete - mark as deleted)
app.delete("/make-server-4909a0bc/workouts/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const workouts = await getWorkoutsFromStorage();
    
    const index = workouts.findIndex((w: any) => w.id === id);
    if (index === -1) {
      return c.json({ error: "Workout not found" }, 404);
    }
    
    // Normalize all workouts first
    const normalizedWorkouts = normalizeWorkouts(workouts);
    
    // Soft delete - mark as deleted and normalize
    const deletedWorkout = { 
      ...normalizedWorkouts[index], 
      deleted: true, 
      deleted_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    normalizedWorkouts[index] = normalizeWorkout(deletedWorkout);
    
    await saveWorkoutsToStorage(normalizedWorkouts);
    
    console.log("✅ Workout soft deleted:", id);
    
    return c.json({ message: "Workout deleted successfully" });
  } catch (error) {
    console.error("Error deleting workout:", error);
    return c.json({ error: "Failed to delete workout", details: String(error) }, 500);
  }
});

// Restore a deleted workout
app.post("/make-server-4909a0bc/workouts/:id/restore", async (c) => {
  try {
    const id = c.req.param("id");
    const workouts = await getWorkoutsFromStorage();
    
    const index = workouts.findIndex((w: any) => w.id === id);
    if (index === -1) {
      return c.json({ error: "Workout not found" }, 404);
    }
    
    // Normalize all workouts first
    const normalizedWorkouts = normalizeWorkouts(workouts);
    
    // Remove deleted flag and normalize
    const { deleted, deleted_at, deletedAt, ...workoutData } = normalizedWorkouts[index];
    const restoredWorkout = { 
      ...workoutData, 
      restored_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    normalizedWorkouts[index] = normalizeWorkout(restoredWorkout);
    
    await saveWorkoutsToStorage(normalizedWorkouts);
    
    console.log("✅ Workout restored:", id);
    
    return c.json({ workout: normalizedWorkouts[index] });
  } catch (error) {
    console.error("Error restoring workout:", error);
    return c.json({ error: "Failed to restore workout", details: String(error) }, 500);
  }
});

// Permanently delete a workout
app.delete("/make-server-4909a0bc/workouts/:id/permanent", async (c) => {
  try {
    const id = c.req.param("id");
    const workouts = await getWorkoutsFromStorage();
    
    const filteredWorkouts = workouts.filter((w: any) => w.id !== id);
    
    if (filteredWorkouts.length === workouts.length) {
      return c.json({ error: "Workout not found" }, 404);
    }
    
    // Normalize remaining workouts before saving
    const normalizedWorkouts = normalizeWorkouts(filteredWorkouts);
    await saveWorkoutsToStorage(normalizedWorkouts);
    
    console.log("✅ Workout permanently deleted:", id);
    
    return c.json({ message: "Workout permanently deleted" });
  } catch (error) {
    console.error("Error permanently deleting workout:", error);
    return c.json({ error: "Failed to permanently delete workout", details: String(error) }, 500);
  }
});

// Initialize storage buckets on startup
console.log('🚀 Starting server initialization...');
await initializeStorage();
await initWorkoutsBucket();
console.log('✅ Server initialization complete');

Deno.serve(app.fetch);