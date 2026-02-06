import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Initialize Supabase client for auth and storage
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
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
      email_confirm: true, // Auto-confirm email since email server not configured
      user_metadata: {
        name,
        role: role || 'swimmer',
      }
    });
    
    if (error) {
      console.error('❌ Signup error:', error);
      return c.json({ error: error.message }, 400);
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
    console.error('❌ Signup error:', error);
    return c.json({ error: String(error) }, 500);
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
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('❌ Supabase signin error:', error);
      return c.json({ error: error.message }, 401);
    }
    
    // Get swimmer ID if user is a swimmer
    let swimmerId = null;
    if (data.user.user_metadata.role === 'swimmer') {
      const swimmers = await kv.get("swimmers:list") || [];
      const swimmer = swimmers.find((s: any) => s.userId === data.user.id || s.email === email);
      swimmerId = swimmer?.id || null;
    }
    
    console.log('✅ User authenticated:', data.user.id);
    
    return c.json({
      session: data.session,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name,
        role: data.user.user_metadata.role,
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
    const { newPassword } = await c.req.json();
    const userId = c.get('userId');
    
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      password: newPassword
    });
    
    if (error) {
      console.error('❌ Change password error:', error);
      return c.json({ error: error.message }, 400);
    }
    
    console.log('✅ Password changed for user:', userId);
    return c.json({ success: true });
  } catch (error) {
    console.error('❌ Change password error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Health check endpoint
app.get("/make-server-4909a0bc/health", (c) => {
  return c.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    version: "2.0.1" // Force redeploy
  });
});

// Initialize admin user (idempotent - only creates if not exists)
app.post("/make-server-4909a0bc/auth/init-admin", async (c) => {
  try {
    const adminEmail = "admin@loprado.cl";
    const adminPassword = "admin123";
    
    console.log('🔧 INIT ADMIN - Checking if admin exists...');
    
    // Check if admin already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingAdmin = existingUsers?.users?.find(user => user.email === adminEmail);
    
    if (existingAdmin) {
      console.log('✅ Admin user found, DELETING and RECREATING with new password...');
      
      // Delete existing admin to ensure clean state
      const { error: deleteError } = await supabase.auth.admin.deleteUser(existingAdmin.id);
      
      if (deleteError) {
        console.error('❌ Error deleting existing admin:', deleteError);
        // Continue anyway, try to create
      } else {
        console.log('✅ Existing admin deleted successfully');
      }
    }
    
    // Create admin user (fresh or recreated)
    console.log('🔐 Creating admin user:', adminEmail);
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name: "Administrador",
        role: "admin",
      }
    });
    
    if (error) {
      console.error('❌ Error creating admin:', error);
      return c.json({ error: error.message }, 400);
    }
    
    console.log('✅ Admin user created successfully:', data.user.id);
    
    return c.json({
      success: true,
      message: 'Admin user created successfully',
      email: adminEmail,
      password: adminPassword,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name,
        role: data.user.user_metadata.role,
      }
    }, 201);
  } catch (error) {
    console.error('❌ Init admin error:', error);
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

Deno.serve(app.fetch);