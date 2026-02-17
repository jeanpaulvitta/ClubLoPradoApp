// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// ==================== KV STORE (INLINE - NO EXTERNAL IMPORTS) ====================

const kvClient = () => createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const isTableNotFoundError = (error: any): boolean => {
  return error?.message?.includes("Could not find the table") || 
         (error?.message?.includes("relation") && error?.message?.includes("does not exist"));
};

const kv = {
  set: async (key: string, value: any): Promise<void> => {
    const supabase = kvClient();
    const { error } = await supabase.from("kv_store_4909a0bc").upsert({ key, value });
    if (error) {
      if (isTableNotFoundError(error)) {
        console.warn(`⚠️ KV Store table not found. Key: ${key}`);
        return;
      }
      throw new Error(error.message);
    }
  },

  get: async (key: string): Promise<any> => {
    const supabase = kvClient();
    const { data, error } = await supabase.from("kv_store_4909a0bc").select("value").eq("key", key).maybeSingle();
    if (error) {
      if (isTableNotFoundError(error)) {
        console.warn(`⚠️ KV Store table not found. Key: ${key}`);
        return null;
      }
      throw new Error(error.message);
    }
    return data?.value;
  },

  del: async (key: string): Promise<void> => {
    const supabase = kvClient();
    const { error} = await supabase.from("kv_store_4909a0bc").delete().eq("key", key);
    if (error) {
      if (isTableNotFoundError(error)) {
        console.warn(`⚠️ KV Store table not found. Key: ${key}`);
        return;
      }
      throw new Error(error.message);
    }
  },

  mset: async (keys: string[], values: any[]): Promise<void> => {
    const supabase = kvClient();
    const { error } = await supabase.from("kv_store_4909a0bc").upsert(keys.map((k, i) => ({ key: k, value: values[i] })));
    if (error) {
      if (isTableNotFoundError(error)) {
        console.warn(`⚠️ KV Store table not found. Keys: ${keys.join(', ')}`);
        return;
      }
      throw new Error(error.message);
    }
  },

  mget: async (keys: string[]): Promise<any[]> => {
    const supabase = kvClient();
    const { data, error } = await supabase.from("kv_store_4909a0bc").select("value").in("key", keys);
    if (error) {
      if (isTableNotFoundError(error)) {
        console.warn(`⚠️ KV Store table not found. Keys: ${keys.join(', ')}`);
        return [];
      }
      throw new Error(error.message);
    }
    return data?.map((d) => d.value) ?? [];
  },

  mdel: async (keys: string[]): Promise<void> => {
    const supabase = kvClient();
    const { error } = await supabase.from("kv_store_4909a0bc").delete().in("key", keys);
    if (error) {
      if (isTableNotFoundError(error)) {
        console.warn(`⚠️ KV Store table not found. Keys: ${keys.join(', ')}`);
        return;
      }
      throw new Error(error.message);
    }
  },

  getByPrefix: async (prefix: string): Promise<any[]> => {
    const supabase = kvClient();
    const { data, error } = await supabase.from("kv_store_4909a0bc").select("key, value").like("key", prefix + "%");
    if (error) {
      if (isTableNotFoundError(error)) {
        console.warn(`⚠️ KV Store table not found. Prefix: ${prefix}`);
        return [];
      }
      throw new Error(error.message);
    }
    return data?.map((d) => d.value) ?? [];
  }
};

console.info('🏊 Club Natación Lo Prado - Server v3.0.0-COMPLETO');
console.info('📦 Sistema completo con todas las funcionalidades');

// ==================== MAIN SERVER CODE ====================

// Check for required environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_ANON_KEY) {
  console.error('❌ CRITICAL ERROR: Missing required environment variables!');
  console.error('   Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY');
  console.error('   Configure them in: Supabase Dashboard → Edge Functions → make-server-4909a0bc → Secrets');
}

// Initialize Supabase client for auth and storage
const supabase = createClient(
  SUPABASE_URL ?? '',
  SUPABASE_SERVICE_ROLE_KEY ?? '',
);

// Create a separate client for auth operations (uses ANON_KEY)
const supabaseAuth = createClient(
  SUPABASE_URL ?? '',
  SUPABASE_ANON_KEY ?? '',
);

// Storage bucket name
const COMPETITIONS_BUCKET = "make-4909a0bc-competitions";

// ==================== AUTHENTICATION MIDDLEWARE ====================

// Middleware to verify JWT token and get user
async function authMiddleware(c: any, next: any) {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized - No token provided' }, 401);
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized - Invalid token' }, 401);
    }
    
    // Store user in context
    c.set('user', user);
    c.set('userId', user.id);
    
    await next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return c.json({ error: 'Unauthorized - Auth error' }, 401);
  }
}

// Ensure bucket exists on startup
async function initializeStorage() {
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
      
      if (error) {
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

// Initialize storage on startup
initializeStorage();

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

// ==================== HEALTH CHECK ====================

app.get("/make-server-4909a0bc/health", (c) => {
  const envCheck = {
    SUPABASE_URL: !!SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_ANON_KEY: !!SUPABASE_ANON_KEY,
  };
  
  const allConfigured = Object.values(envCheck).every(v => v);
  
  return c.json({ 
    status: allConfigured ? "ok" : "misconfigured", 
    timestamp: new Date().toISOString(),
    version: "3.0.0-COMPLETO",
    environment: envCheck,
    message: allConfigured 
      ? "✅ Servidor completo - Club Natación Lo Prado" 
      : "⚠️ Missing environment variables"
  });
});

// ==================== AUTHENTICATION ROUTES ====================

// Sign up new user
app.post("/make-server-4909a0bc/auth/signup", async (c) => {
  try {
    const { email, password, name, role } = await c.req.json();
    
    console.log('🔐 SIGNUP - Creating user:', { email, name, role });
    
    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        role: role || 'swimmer',
      }
    });
    
    if (error) {
      console.error('❌ Signup error:', error);
      return c.json({ 
        error: error.message || 'Error al registrar usuario',
        details: error
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
    return c.json({ 
      error: 'Error al registrar usuario',
      details: String(error)
    }, 500);
  }
});

// Sign in user
app.post("/make-server-4909a0bc/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    console.log('🔐 SIGNIN - Authenticating:', email);
    
    const { data: authData, error: authError } = await supabaseAuth.auth.signInWithPassword({
      email,
      password,
    });
    
    // AUTO-CREATE ADMIN
    if (authError && authError.message.includes('Invalid login credentials') && email === 'admin@loprado.cl') {
      console.log('👑 AUTO-INIT: Creating admin user...');
      
      const { data: createData, error: createError } = await supabase.auth.admin.createUser({
        email: 'admin@loprado.cl',
        password: password,
        email_confirm: true,
        user_metadata: {
          name: 'Administrador',
          role: 'admin',
        }
      });
      
      if (createError) {
        console.error('❌ Error creating admin:', createError);
        return c.json({ error: 'Error al crear administrador' }, 500);
      }
      
      console.log('✅ Admin created:', createData.user.id);
      
      const { data: retryAuthData, error: retryAuthError } = await supabaseAuth.auth.signInWithPassword({
        email,
        password,
      });
      
      if (retryAuthError) {
        return c.json({ error: retryAuthError.message }, 401);
      }
      
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
    }
    
    if (authError) {
      console.error('❌ Signin error:', authError);
      return c.json({ error: authError.message }, 401);
    }
    
    if (!authData.user || !authData.session) {
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

// Sign out
app.post("/make-server-4909a0bc/auth/signout", authMiddleware, async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const token = authHeader?.split(' ')[1];
    
    if (token) {
      await supabase.auth.admin.signOut(token);
    }
    
    return c.json({ message: 'Signed out successfully' });
  } catch (error) {
    console.error('❌ Signout error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Change password
app.post("/make-server-4909a0bc/auth/change-password", authMiddleware, async (c) => {
  try {
    const { currentPassword, newPassword } = await c.req.json();
    const user = c.get('user');
    
    // Verify current password
    const { error: signInError } = await supabaseAuth.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    
    if (signInError) {
      return c.json({ error: 'Contraseña actual incorrecta' }, 401);
    }
    
    // Update password
    const { error } = await supabase.auth.admin.updateUserById(user.id, {
      password: newPassword,
    });
    
    if (error) {
      return c.json({ error: error.message }, 400);
    }
    
    return c.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('❌ Change password error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== SWIMMERS ROUTES ====================

// Get all swimmers
app.get("/make-server-4909a0bc/swimmers", authMiddleware, async (c) => {
  try {
    const swimmers = await kv.get("swimmers:list") || [];
    return c.json(swimmers);
  } catch (error) {
    console.error('❌ Get swimmers error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get single swimmer
app.get("/make-server-4909a0bc/swimmers/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const swimmers = await kv.get("swimmers:list") || [];
    const swimmer = swimmers.find((s: any) => s.id === id);
    
    if (!swimmer) {
      return c.json({ error: 'Nadador no encontrado' }, 404);
    }
    
    return c.json(swimmer);
  } catch (error) {
    console.error('❌ Get swimmer error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Create swimmer
app.post("/make-server-4909a0bc/swimmers", authMiddleware, async (c) => {
  try {
    const swimmerData = await c.req.json();
    const swimmers = await kv.get("swimmers:list") || [];
    
    const newSwimmer = {
      id: `s${Date.now()}`,
      ...swimmerData,
      personalBests: swimmerData.personalBests || [],
      personalBestsHistory: swimmerData.personalBestsHistory || [],
      goals: swimmerData.goals || [],
    };
    
    swimmers.push(newSwimmer);
    await kv.set("swimmers:list", swimmers);
    
    console.log('✅ Swimmer created:', newSwimmer.id);
    return c.json(newSwimmer, 201);
  } catch (error) {
    console.error('❌ Create swimmer error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Update swimmer
app.put("/make-server-4909a0bc/swimmers/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const swimmers = await kv.get("swimmers:list") || [];
    
    const index = swimmers.findIndex((s: any) => s.id === id);
    if (index === -1) {
      return c.json({ error: 'Nadador no encontrado' }, 404);
    }
    
    swimmers[index] = { ...swimmers[index], ...updates };
    await kv.set("swimmers:list", swimmers);
    
    console.log('✅ Swimmer updated:', id);
    return c.json(swimmers[index]);
  } catch (error) {
    console.error('❌ Update swimmer error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Delete swimmer
app.delete("/make-server-4909a0bc/swimmers/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const swimmers = await kv.get("swimmers:list") || [];
    
    const filtered = swimmers.filter((s: any) => s.id !== id);
    if (filtered.length === swimmers.length) {
      return c.json({ error: 'Nadador no encontrado' }, 404);
    }
    
    await kv.set("swimmers:list", filtered);
    
    console.log('✅ Swimmer deleted:', id);
    return c.json({ message: 'Nadador eliminado' });
  } catch (error) {
    console.error('❌ Delete swimmer error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== ATTENDANCE ROUTES ====================

// Get all attendance records
app.get("/make-server-4909a0bc/attendance", authMiddleware, async (c) => {
  try {
    const attendance = await kv.get("attendance:list") || [];
    return c.json(attendance);
  } catch (error) {
    console.error('❌ Get attendance error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get attendance by swimmer
app.get("/make-server-4909a0bc/attendance/swimmer/:swimmerId", authMiddleware, async (c) => {
  try {
    const swimmerId = c.req.param('swimmerId');
    const attendance = await kv.get("attendance:list") || [];
    const filtered = attendance.filter((a: any) => a.swimmerId === swimmerId);
    return c.json(filtered);
  } catch (error) {
    console.error('❌ Get swimmer attendance error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Create/Update attendance record
app.post("/make-server-4909a0bc/attendance", authMiddleware, async (c) => {
  try {
    const attendanceData = await c.req.json();
    const attendance = await kv.get("attendance:list") || [];
    
    // Check if record exists
    const index = attendance.findIndex((a: any) => 
      a.swimmerId === attendanceData.swimmerId && a.date === attendanceData.date
    );
    
    if (index !== -1) {
      // Update existing
      attendance[index] = { ...attendance[index], ...attendanceData };
    } else {
      // Create new
      attendance.push(attendanceData);
    }
    
    await kv.set("attendance:list", attendance);
    
    console.log('✅ Attendance recorded:', attendanceData.swimmerId, attendanceData.date);
    return c.json(attendanceData);
  } catch (error) {
    console.error('❌ Record attendance error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Bulk update attendance
app.post("/make-server-4909a0bc/attendance/bulk", authMiddleware, async (c) => {
  try {
    const records = await c.req.json();
    const attendance = await kv.get("attendance:list") || [];
    
    for (const record of records) {
      const index = attendance.findIndex((a: any) => 
        a.swimmerId === record.swimmerId && a.date === record.date
      );
      
      if (index !== -1) {
        attendance[index] = { ...attendance[index], ...record };
      } else {
        attendance.push(record);
      }
    }
    
    await kv.set("attendance:list", attendance);
    
    console.log('✅ Bulk attendance recorded:', records.length);
    return c.json({ message: 'Asistencias registradas', count: records.length });
  } catch (error) {
    console.error('❌ Bulk attendance error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== COMPETITIONS ROUTES ====================

// Get all competitions
app.get("/make-server-4909a0bc/competitions", authMiddleware, async (c) => {
  try {
    const competitions = await kv.get("competitions:list") || [];
    return c.json(competitions);
  } catch (error) {
    console.error('❌ Get competitions error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get single competition
app.get("/make-server-4909a0bc/competitions/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const competitions = await kv.get("competitions:list") || [];
    const competition = competitions.find((c: any) => c.id === id);
    
    if (!competition) {
      return c.json({ error: 'Competencia no encontrada' }, 404);
    }
    
    return c.json(competition);
  } catch (error) {
    console.error('❌ Get competition error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Create competition
app.post("/make-server-4909a0bc/competitions", authMiddleware, async (c) => {
  try {
    const competitionData = await c.req.json();
    const competitions = await kv.get("competitions:list") || [];
    
    const newCompetition = {
      id: `comp${Date.now()}`,
      ...competitionData,
    };
    
    competitions.push(newCompetition);
    await kv.set("competitions:list", competitions);
    
    console.log('✅ Competition created:', newCompetition.id);
    return c.json(newCompetition, 201);
  } catch (error) {
    console.error('❌ Create competition error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Update competition
app.put("/make-server-4909a0bc/competitions/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const competitions = await kv.get("competitions:list") || [];
    
    const index = competitions.findIndex((c: any) => c.id === id);
    if (index === -1) {
      return c.json({ error: 'Competencia no encontrada' }, 404);
    }
    
    competitions[index] = { ...competitions[index], ...updates };
    await kv.set("competitions:list", competitions);
    
    console.log('✅ Competition updated:', id);
    return c.json(competitions[index]);
  } catch (error) {
    console.error('❌ Update competition error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Delete competition
app.delete("/make-server-4909a0bc/competitions/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const competitions = await kv.get("competitions:list") || [];
    
    const filtered = competitions.filter((c: any) => c.id !== id);
    if (filtered.length === competitions.length) {
      return c.json({ error: 'Competencia no encontrada' }, 404);
    }
    
    await kv.set("competitions:list", filtered);
    
    console.log('✅ Competition deleted:', id);
    return c.json({ message: 'Competencia eliminada' });
  } catch (error) {
    console.error('❌ Delete competition error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== SWIMMER COMPETITIONS ROUTES ====================

// Get all swimmer competitions
app.get("/make-server-4909a0bc/swimmer-competitions", authMiddleware, async (c) => {
  try {
    const swimmerCompetitions = await kv.get("swimmerCompetitions:list") || [];
    return c.json(swimmerCompetitions);
  } catch (error) {
    console.error('❌ Get swimmer competitions error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get swimmer competitions by swimmer ID
app.get("/make-server-4909a0bc/swimmer-competitions/swimmer/:swimmerId", authMiddleware, async (c) => {
  try {
    const swimmerId = c.req.param('swimmerId');
    const swimmerCompetitions = await kv.get("swimmerCompetitions:list") || [];
    const filtered = swimmerCompetitions.filter((sc: any) => sc.swimmerId === swimmerId);
    return c.json(filtered);
  } catch (error) {
    console.error('❌ Get swimmer competitions error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Create/Update swimmer competition
app.post("/make-server-4909a0bc/swimmer-competitions", authMiddleware, async (c) => {
  try {
    const scData = await c.req.json();
    const swimmerCompetitions = await kv.get("swimmerCompetitions:list") || [];
    
    // Check if record exists
    const index = swimmerCompetitions.findIndex((sc: any) => 
      sc.swimmerId === scData.swimmerId && sc.competitionId === scData.competitionId
    );
    
    if (index !== -1) {
      // Update existing
      swimmerCompetitions[index] = { ...swimmerCompetitions[index], ...scData };
    } else {
      // Create new
      const newSC = {
        id: `sc${Date.now()}`,
        ...scData,
      };
      swimmerCompetitions.push(newSC);
    }
    
    await kv.set("swimmerCompetitions:list", swimmerCompetitions);
    
    console.log('✅ Swimmer competition recorded:', scData.swimmerId);
    return c.json(scData);
  } catch (error) {
    console.error('❌ Record swimmer competition error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== WORKOUTS ROUTES ====================

// Get all workouts (PUBLIC - no auth required)
app.get("/make-server-4909a0bc/workouts", async (c) => {
  try {
    const workouts = await kv.get("workouts:list") || [];
    return c.json(workouts);
  } catch (error) {
    console.error('❌ Get workouts error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Create workout
app.post("/make-server-4909a0bc/workouts", authMiddleware, async (c) => {
  try {
    const workoutData = await c.req.json();
    const workouts = await kv.get("workouts:list") || [];
    
    const newWorkout = {
      id: `w${Date.now()}`,
      ...workoutData,
    };
    
    workouts.push(newWorkout);
    await kv.set("workouts:list", workouts);
    
    console.log('✅ Workout created:', newWorkout.id);
    return c.json(newWorkout, 201);
  } catch (error) {
    console.error('❌ Create workout error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Update workout
app.put("/make-server-4909a0bc/workouts/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const workouts = await kv.get("workouts:list") || [];
    
    const index = workouts.findIndex((w: any) => w.id === id);
    if (index === -1) {
      return c.json({ error: 'Entrenamiento no encontrado' }, 404);
    }
    
    workouts[index] = { ...workouts[index], ...updates };
    await kv.set("workouts:list", workouts);
    
    console.log('✅ Workout updated:', id);
    return c.json(workouts[index]);
  } catch (error) {
    console.error('❌ Update workout error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Delete workout
app.delete("/make-server-4909a0bc/workouts/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const workouts = await kv.get("workouts:list") || [];
    
    const index = workouts.findIndex((w: any) => w.id === id);
    if (index === -1) {
      return c.json({ error: 'Entrenamiento no encontrado' }, 404);
    }
    
    // Soft delete
    workouts[index].deleted = true;
    workouts[index].deletedAt = new Date().toISOString();
    await kv.set("workouts:list", workouts);
    
    console.log('✅ Workout deleted:', id);
    return c.json({ message: 'Entrenamiento eliminado' });
  } catch (error) {
    console.error('❌ Delete workout error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Bulk create/update workouts
app.post("/make-server-4909a0bc/workouts/bulk", authMiddleware, async (c) => {
  try {
    const workoutsData = await c.req.json();
    const workouts = await kv.get("workouts:list") || [];
    
    for (const workoutData of workoutsData) {
      if (workoutData.id) {
        // Update existing
        const index = workouts.findIndex((w: any) => w.id === workoutData.id);
        if (index !== -1) {
          workouts[index] = { ...workouts[index], ...workoutData };
        }
      } else {
        // Create new
        workouts.push({
          id: `w${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...workoutData,
        });
      }
    }
    
    await kv.set("workouts:list", workouts);
    
    console.log('✅ Bulk workouts processed:', workoutsData.length);
    return c.json({ message: 'Entrenamientos procesados', count: workoutsData.length });
  } catch (error) {
    console.error('❌ Bulk workouts error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== HOLIDAYS ROUTES ====================

// Get all holidays
app.get("/make-server-4909a0bc/holidays", authMiddleware, async (c) => {
  try {
    const holidays = await kv.get("holidays:list") || [];
    return c.json(holidays);
  } catch (error) {
    console.error('❌ Get holidays error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Create holiday
app.post("/make-server-4909a0bc/holidays", authMiddleware, async (c) => {
  try {
    const holidayData = await c.req.json();
    const holidays = await kv.get("holidays:list") || [];
    
    const newHoliday = {
      id: `h${Date.now()}`,
      ...holidayData,
    };
    
    holidays.push(newHoliday);
    await kv.set("holidays:list", holidays);
    
    console.log('✅ Holiday created:', newHoliday.id);
    return c.json(newHoliday, 201);
  } catch (error) {
    console.error('❌ Create holiday error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Delete holiday
app.delete("/make-server-4909a0bc/holidays/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const holidays = await kv.get("holidays:list") || [];
    
    const filtered = holidays.filter((h: any) => h.id !== id);
    if (filtered.length === holidays.length) {
      return c.json({ error: 'Feriado no encontrado' }, 404);
    }
    
    await kv.set("holidays:list", filtered);
    
    console.log('✅ Holiday deleted:', id);
    return c.json({ message: 'Feriado eliminado' });
  } catch (error) {
    console.error('❌ Delete holiday error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== TEST CONTROLS ROUTES ====================

// Get all test controls
app.get("/make-server-4909a0bc/test-controls", authMiddleware, async (c) => {
  try {
    const testControls = await kv.get("testControls:list") || [];
    return c.json(testControls);
  } catch (error) {
    console.error('❌ Get test controls error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Create test control
app.post("/make-server-4909a0bc/test-controls", authMiddleware, async (c) => {
  try {
    const testData = await c.req.json();
    const testControls = await kv.get("testControls:list") || [];
    
    const newTest = {
      id: `tc${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...testData,
    };
    
    testControls.push(newTest);
    await kv.set("testControls:list", testControls);
    
    console.log('✅ Test control created:', newTest.id);
    return c.json(newTest, 201);
  } catch (error) {
    console.error('❌ Create test control error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Update test control
app.put("/make-server-4909a0bc/test-controls/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const testControls = await kv.get("testControls:list") || [];
    
    const index = testControls.findIndex((t: any) => t.id === id);
    if (index === -1) {
      return c.json({ error: 'Test control no encontrado' }, 404);
    }
    
    testControls[index] = { ...testControls[index], ...updates };
    await kv.set("testControls:list", testControls);
    
    console.log('✅ Test control updated:', id);
    return c.json(testControls[index]);
  } catch (error) {
    console.error('❌ Update test control error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Delete test control
app.delete("/make-server-4909a0bc/test-controls/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const testControls = await kv.get("testControls:list") || [];
    
    const filtered = testControls.filter((t: any) => t.id !== id);
    if (filtered.length === testControls.length) {
      return c.json({ error: 'Test control no encontrado' }, 404);
    }
    
    await kv.set("testControls:list", filtered);
    
    console.log('✅ Test control deleted:', id);
    return c.json({ message: 'Test control eliminado' });
  } catch (error) {
    console.error('❌ Delete test control error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== TEST RESULTS ROUTES ====================

// Get all test results
app.get("/make-server-4909a0bc/test-results", authMiddleware, async (c) => {
  try {
    const testResults = await kv.get("testResults:list") || [];
    return c.json(testResults);
  } catch (error) {
    console.error('❌ Get test results error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Create test result
app.post("/make-server-4909a0bc/test-results", authMiddleware, async (c) => {
  try {
    const resultData = await c.req.json();
    const testResults = await kv.get("testResults:list") || [];
    
    const newResult = {
      id: `tr${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...resultData,
    };
    
    testResults.push(newResult);
    await kv.set("testResults:list", testResults);
    
    console.log('✅ Test result created:', newResult.id);
    return c.json(newResult, 201);
  } catch (error) {
    console.error('❌ Create test result error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Update test result
app.put("/make-server-4909a0bc/test-results/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const testResults = await kv.get("testResults:list") || [];
    
    const index = testResults.findIndex((t: any) => t.id === id);
    if (index === -1) {
      return c.json({ error: 'Resultado no encontrado' }, 404);
    }
    
    testResults[index] = { ...testResults[index], ...updates };
    await kv.set("testResults:list", testResults);
    
    console.log('✅ Test result updated:', id);
    return c.json(testResults[index]);
  } catch (error) {
    console.error('❌ Update test result error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Delete test result
app.delete("/make-server-4909a0bc/test-results/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const testResults = await kv.get("testResults:list") || [];
    
    const filtered = testResults.filter((t: any) => t.id !== id);
    if (filtered.length === testResults.length) {
      return c.json({ error: 'Resultado no encontrado' }, 404);
    }
    
    await kv.set("testResults:list", filtered);
    
    console.log('✅ Test result deleted:', id);
    return c.json({ message: 'Resultado eliminado' });
  } catch (error) {
    console.error('❌ Delete test result error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== PASSWORD REQUESTS ROUTES ====================

// Get all password requests
app.get("/make-server-4909a0bc/password-requests", authMiddleware, async (c) => {
  try {
    const requests = await kv.get("passwordRequests:list") || [];
    return c.json(requests);
  } catch (error) {
    console.error('❌ Get password requests error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Create password request
app.post("/make-server-4909a0bc/password-requests", async (c) => {
  try {
    const requestData = await c.req.json();
    const requests = await kv.get("passwordRequests:list") || [];
    
    const newRequest = {
      id: `pr${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      ...requestData,
    };
    
    requests.push(newRequest);
    await kv.set("passwordRequests:list", requests);
    
    console.log('✅ Password request created:', newRequest.id);
    return c.json(newRequest, 201);
  } catch (error) {
    console.error('❌ Create password request error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Update password request
app.put("/make-server-4909a0bc/password-requests/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const requests = await kv.get("passwordRequests:list") || [];
    
    const index = requests.findIndex((r: any) => r.id === id);
    if (index === -1) {
      return c.json({ error: 'Solicitud no encontrada' }, 404);
    }
    
    requests[index] = { ...requests[index], ...updates };
    await kv.set("passwordRequests:list", requests);
    
    console.log('✅ Password request updated:', id);
    return c.json(requests[index]);
  } catch (error) {
    console.error('❌ Update password request error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Delete password request
app.delete("/make-server-4909a0bc/password-requests/:id", authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const requests = await kv.get("passwordRequests:list") || [];
    
    const filtered = requests.filter((r: any) => r.id !== id);
    if (filtered.length === requests.length) {
      return c.json({ error: 'Solicitud no encontrada' }, 404);
    }
    
    await kv.set("passwordRequests:list", filtered);
    
    console.log('✅ Password request deleted:', id);
    return c.json({ message: 'Solicitud eliminada' });
  } catch (error) {
    console.error('❌ Delete password request error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== ACHIEVEMENTS ROUTES ====================

// Get all achievements
app.get("/make-server-4909a0bc/achievements", authMiddleware, async (c) => {
  try {
    const achievements = await kv.get("achievements:list") || [];
    return c.json(achievements);
  } catch (error) {
    console.error('❌ Get achievements error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Create achievement
app.post("/make-server-4909a0bc/achievements", authMiddleware, async (c) => {
  try {
    const achievementData = await c.req.json();
    const achievements = await kv.get("achievements:list") || [];
    
    const newAchievement = {
      id: `ach${Date.now()}`,
      ...achievementData,
    };
    
    achievements.push(newAchievement);
    await kv.set("achievements:list", achievements);
    
    console.log('✅ Achievement created:', newAchievement.id);
    return c.json(newAchievement, 201);
  } catch (error) {
    console.error('❌ Create achievement error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== RECORDS ROUTES ====================

// Get all team records
app.get("/make-server-4909a0bc/records", authMiddleware, async (c) => {
  try {
    const records = await kv.get("records:list") || [];
    return c.json(records);
  } catch (error) {
    console.error('❌ Get records error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Update team records
app.post("/make-server-4909a0bc/records", authMiddleware, async (c) => {
  try {
    const recordsData = await c.req.json();
    await kv.set("records:list", recordsData);
    
    console.log('✅ Records updated');
    return c.json({ message: 'Récords actualizados' });
  } catch (error) {
    console.error('❌ Update records error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ==================== MESOCICLOS ROUTES ====================

// Get all mesociclos
app.get("/make-server-4909a0bc/mesociclos", authMiddleware, async (c) => {
  try {
    const mesociclos = await kv.get("mesociclos:list") || [];
    return c.json(mesociclos);
  } catch (error) {
    console.error('❌ Get mesociclos error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Create/Update mesociclos
app.post("/make-server-4909a0bc/mesociclos", authMiddleware, async (c) => {
  try {
    const mesociclosData = await c.req.json();
    await kv.set("mesociclos:list", mesociclosData);
    
    console.log('✅ Mesociclos saved');
    return c.json({ message: 'Mesociclos guardados' });
  } catch (error) {
    console.error('❌ Save mesociclos error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

console.log('✅ Server configured with ALL routes');
console.log('📋 Available routes:');
console.log('   - Auth: signup, signin, session, signout, change-password');
console.log('   - Swimmers: CRUD operations');
console.log('   - Attendance: Record and query');
console.log('   - Competitions: CRUD operations');
console.log('   - Swimmer Competitions: Track participation');
console.log('   - Workouts: CRUD and bulk operations');
console.log('   - Holidays: Manage training calendar');
console.log('   - Test Controls: Create and manage tests');
console.log('   - Test Results: Record swimmer results');
console.log('   - Password Requests: Admin approval system');
console.log('   - Achievements: Track swimmer achievements');
console.log('   - Records: Team records management');
console.log('   - Mesociclos: Training period management');

Deno.serve(async (req: Request) => {
  const response = await app.fetch(req);
  return response;
});