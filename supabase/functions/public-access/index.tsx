// ==================== PUBLIC ACCESS SERVICE - VERSION 1.0 ====================
// Nueva función Edge dedicada SOLO para endpoints públicos (sin autenticación)
// Creada: 2026-03-15

import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";

const app = new Hono();

// ==================== CONFIGURACIÓN ====================

// Importar KV store helper
interface KVStore {
  get: (key: string) => Promise<any>;
  set: (key: string, value: any) => Promise<void>;
}

const kv: KVStore = {
  async get(key: string) {
    const { createClient } = await import("npm:@supabase/supabase-js@2");
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
    );
    
    const { data, error } = await supabase
      .from('kv_store_4909a0bc')
      .select('value')
      .eq('key', key)
      .single();
    
    if (error || !data) return null;
    return data.value;
  },
  
  async set(key: string, value: any) {
    const { createClient } = await import("npm:@supabase/supabase-js@2");
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
    );
    
    await supabase
      .from('kv_store_4909a0bc')
      .upsert({ key, value }, { onConflict: 'key' });
  }
};

// ==================== MIDDLEWARES ====================

// Enable logger
app.use('*', logger(console.log));

// Enable CORS
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  }),
);

// ==================== PUBLIC ENDPOINTS ====================

// Health check
app.get("/health", (c) => {
  return c.json({ 
    success: true, 
    status: "healthy",
    message: "✅ Public Access Service Online!",
    timestamp: new Date().toISOString(),
    version: "1.0"
  });
});

// Create password request - PUBLIC ENDPOINT (NO AUTH REQUIRED)
app.post("/request", async (c) => {
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📝 POST /request - PUBLIC ENDPOINT');
    
    const body = await c.req.json();
    const { name, email, role } = body;
    
    console.log(`📥 Request body:`, { name, email, role });
    
    // Validar campos requeridos
    if (!name || !email || !role) {
      console.error('❌ Missing required fields');
      return c.json({ 
        success: false,
        code: 400,
        error: 'Faltan campos requeridos',
        required: ['name', 'email', 'role']
      }, 400);
    }
    
    // Validar rol
    if (!['swimmer', 'coach'].includes(role)) {
      console.error('❌ Invalid role:', role);
      return c.json({ 
        success: false,
        code: 400,
        error: 'Rol inválido. Debe ser "swimmer" o "coach"'
      }, 400);
    }
    
    // Generar ID único
    const id = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`🆔 Generated ID: ${id}`);
    
    // Crear objeto de solicitud
    const passwordRequest = {
      id,
      name,
      email,
      role,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    console.log(`💾 Saving password request:`, passwordRequest);
    
    // Obtener solicitudes existentes
    const existingRequests = await kv.get('password-requests:list') || [];
    console.log(`📊 Existing requests count: ${existingRequests.length}`);
    
    // Agregar nueva solicitud
    const updatedRequests = [...existingRequests, passwordRequest];
    
    // Guardar en KV store
    await kv.set('password-requests:list', updatedRequests);
    console.log(`✅ Password request saved successfully`);
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return c.json({ 
      success: true,
      request: passwordRequest,
      message: 'Solicitud creada exitosamente'
    });
  } catch (error) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ Error creating password request:', error);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return c.json({ 
      success: false,
      code: 500,
      error: 'Error al crear solicitud',
      details: String(error)
    }, 500);
  }
});

// ==================== START SERVER ====================

Deno.serve(app.fetch);
