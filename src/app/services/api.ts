import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import type { TestControl, TestResult } from '../data/testControl';
import type { Swimmer, Competition, SwimmerCompetition, Workout, Holiday } from '../data/swimmers';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc`;

// Get auth token from session (SOLO para autenticación)
function getAuthToken(): string {
  try {
    // Primero intentar con supabase_session (formato principal)
    const sessionStr = window.localStorage.getItem('supabase_session');
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      if (session.accessToken) {
        console.log('🔑 Token encontrado en supabase_session');
        return session.accessToken;
      }
    }
    
    // Fallback: intentar con supabase.auth.token
    const authTokenStr = window.localStorage.getItem('supabase.auth.token');
    if (authTokenStr) {
      const authSession = JSON.parse(authTokenStr);
      if (authSession.access_token) {
        console.log('🔑 Token encontrado en supabase.auth.token');
        return authSession.access_token;
      }
    }
    
    console.warn('⚠️ No se encontró token de autenticación, usando publicAnonKey');
  } catch (error) {
    console.warn('Error getting auth token:', error);
  }
  
  // Si no hay token, usar la clave pública anónima
  return publicAnonKey;
}

// Get headers with current auth token
function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`,
  };
}

// Get public headers (sin autenticación para rutas GET públicas)
function getPublicHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
  };
}

// Check if server is available
let serverAvailable = true;
let lastHealthCheck = 0;
const HEALTH_CHECK_INTERVAL = 30000; // 30 seconds
let useLocalStorageFallback = false;

async function checkServerHealth(): Promise<boolean> {
  const now = Date.now();
  if (now - lastHealthCheck < HEALTH_CHECK_INTERVAL) {
    return serverAvailable;
  }
  
  try {
    console.log('🔍 Checking server health...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_BASE_URL}/health`, {
      headers: getHeaders(),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    serverAvailable = response.ok;
    lastHealthCheck = now;
    
    if (serverAvailable) {
      console.log('✅ Server is healthy');
      useLocalStorageFallback = false;
    } else {
      console.warn('⚠️ Server returned non-OK status:', response.status);
      useLocalStorageFallback = true;
    }
    
    return serverAvailable;
  } catch (error) {
    console.error('❌ Server health check failed:', error);
    serverAvailable = false;
    lastHealthCheck = now;
    useLocalStorageFallback = true;
    return false;
  }
}

// Helper function to add timeout to fetch requests
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout: number = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout - server did not respond in time');
    }
    throw error;
  }
}

// ==================== SWIMMERS API ====================

export async function fetchSwimmers(): Promise<Swimmer[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/swimmers`, { headers: getPublicHeaders() });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to fetch swimmers: ${error.error || response.statusText}`);
    }
    const data = await response.json();
    // El servidor devuelve un array directo, no un objeto con propiedad swimmers
    const swimmers = Array.isArray(data) ? data : (data.swimmers || []);
    console.log('✅ Swimmers fetched from Supabase:', swimmers.length);
    
    return swimmers;
  } catch (error) {
    console.error('❌ Error fetching swimmers from Supabase:', error);
    throw error;
  }
}

export async function addSwimmer(swimmer: Omit<Swimmer, 'id'>): Promise<Swimmer> {
  try {
    const response = await fetch(`${API_BASE_URL}/swimmers`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(swimmer),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to add swimmer: ${error.error || response.statusText}`);
    }
    const data = await response.json();
    console.log('✅ Swimmer added to Supabase:', data.swimmer);
    
    return data.swimmer;
  } catch (error) {
    console.error('❌ Error adding swimmer to Supabase:', error);
    throw error;
  }
}

export async function updateSwimmer(id: string, swimmer: Omit<Swimmer, 'id'>): Promise<Swimmer> {
  try {
    const response = await fetch(`${API_BASE_URL}/swimmers/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(swimmer),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to update swimmer: ${error.error || response.statusText}`);
    }
    const data = await response.json();
    console.log('✅ Swimmer updated in Supabase:', data.swimmer);
    
    return data.swimmer;
  } catch (error) {
    console.error('❌ Error updating swimmer in Supabase:', error);
    throw error;
  }
}

export async function deleteSwimmer(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/swimmers/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to delete swimmer: ${error.error || response.statusText}`);
    }
    console.log('✅ Swimmer deleted from Supabase:', id);
  } catch (error) {
    console.error('❌ Error deleting swimmer from Supabase:', error);
    throw error;
  }
}

// ==================== ATTENDANCE API ====================

export interface AttendanceRecord {
  id: string;
  swimmerId: string;
  sessionId: string;
  date: string;
  schedule: string;
  status: 'present' | 'absent' | 'late';
  distanceCompleted: number;
  borgScale?: number;
  notes?: string;
}

export async function fetchAttendance(): Promise<AttendanceRecord[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/attendance`, { headers: getHeaders() });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Attendance fetch error response:', errorText);
      
      // Si es un error de servidor 500, intentar parsear JSON
      try {
        const error = JSON.parse(errorText);
        throw new Error(`Failed to fetch attendance: ${error.error || error.details || response.statusText}`);
      } catch {
        throw new Error(`Failed to fetch attendance: ${response.statusText} (${response.status})`);
      }
    }
    const data = await response.json();
    const attendanceList = data.attendance || [];
    console.log('✅ Attendance fetched from server:', attendanceList.length, 'records');
    return attendanceList;
  } catch (error) {
    console.error('❌ Error fetching attendance:', error);
    // En lugar de lanzar el error, retornar array vacío para no bloquear la aplicación
    console.warn('⚠️ Returning empty attendance array due to error');
    return [];
  }
}

export async function addAttendanceRecord(record: Omit<AttendanceRecord, 'id'>): Promise<AttendanceRecord> {
  try {
    const response = await fetch(`${API_BASE_URL}/attendance`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(record),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to add attendance: ${error.error || response.statusText}`);
    }
    const data = await response.json();
    console.log('✅ Attendance record added:', data.record);
    return data.record;
  } catch (error) {
    console.error('❌ Error adding attendance:', error);
    throw error;
  }
}

export async function updateAttendanceRecord(id: string, record: Omit<AttendanceRecord, 'id'>): Promise<AttendanceRecord> {
  try {
    const response = await fetch(`${API_BASE_URL}/attendance/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(record),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to update attendance: ${error.error || response.statusText}`);
    }
    const data = await response.json();
    console.log('✅ Attendance record updated:', data.record);
    return data.record;
  } catch (error) {
    console.error('❌ Error updating attendance:', error);
    throw error;
  }
}

export async function deleteAttendanceRecord(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/attendance/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to delete attendance: ${error.error || response.statusText}`);
    }
    console.log('✅ Attendance record deleted:', id);
  } catch (error) {
    console.error('❌ Error deleting attendance:', error);
    throw error;
  }
}

// ==================== COMPETITIONS API ====================

export async function fetchCompetitions(): Promise<Competition[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/competitions`, { headers: getPublicHeaders() });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to fetch competitions: ${error.error || response.statusText}`);
    }
    const data = await response.json();
    console.log('✅ Competitions fetched from server:', data.competitions);
    return data.competitions;
  } catch (error) {
    console.error('❌ Error fetching competitions:', error);
    throw error;
  }
}

export async function addCompetition(competition: Omit<Competition, 'id'>): Promise<Competition> {
  try {
    console.log('🔄 Sending competition to server:', competition);
    const response = await fetch(`${API_BASE_URL}/competitions`, {
      method: 'POST',
      headers: getPublicHeaders(), // Usar publicAnonKey en lugar de token de usuario
      body: JSON.stringify(competition),
    });
    
    console.log('📡 Server response status:', response.status, response.statusText);
    
    if (!response.ok) {
      let errorMessage = 'Unknown error';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.details || errorData.message || JSON.stringify(errorData);
      } catch (parseError) {
        errorMessage = await response.text() || response.statusText;
      }
      console.error('❌ Server returned error:', errorMessage);
      throw new Error(`Failed to add competition (${response.status}): ${errorMessage}`);
    }
    
    const data = await response.json();
    console.log('✅ Competition added successfully:', data.competition);
    return data.competition;
  } catch (error) {
    console.error('❌ Error adding competition:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to add competition: ${String(error)}`);
  }
}

export async function updateCompetition(id: string, competition: Omit<Competition, 'id'>): Promise<Competition> {
  try {
    console.log('🔄 Updating competition:', id, competition);
    const response = await fetch(`${API_BASE_URL}/competitions/${id}`, {
      method: 'PUT',
      headers: getPublicHeaders(), // Usar publicAnonKey
      body: JSON.stringify(competition),
    });
    
    console.log('📡 Server response status:', response.status, response.statusText);
    
    if (!response.ok) {
      let errorMessage = 'Unknown error';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.details || errorData.message || JSON.stringify(errorData);
      } catch (parseError) {
        errorMessage = await response.text() || response.statusText;
      }
      console.error('❌ Server returned error:', errorMessage);
      throw new Error(`Failed to update competition (${response.status}): ${errorMessage}`);
    }
    
    const data = await response.json();
    console.log('✅ Competition updated successfully:', data.competition);
    return data.competition;
  } catch (error) {
    console.error('❌ Error updating competition:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to update competition: ${String(error)}`);
  }
}

export async function deleteCompetition(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/competitions/${id}`, {
      method: 'DELETE',
      headers: getPublicHeaders(), // Usar publicAnonKey
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to delete competition: ${error.error || response.statusText}`);
    }
    console.log('✅ Competition deleted:', id);
  } catch (error) {
    console.error('❌ Error deleting competition:', error);
    throw error;
  }
}

// Upload PDF for competition
export async function uploadCompetitionPDF(competitionId: string, file: File): Promise<Competition> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/competitions/${competitionId}/upload-pdf`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        // Don't set Content-Type - browser will set it with boundary for multipart/form-data
      },
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to upload PDF: ${error.error || response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ PDF uploaded:', data.fileName);
    return data.competition;
  } catch (error) {
    console.error('❌ Error uploading PDF:', error);
    throw error;
  }
}

// Delete PDF from competition
export async function deleteCompetitionPDF(competitionId: string): Promise<Competition> {
  try {
    const response = await fetch(`${API_BASE_URL}/competitions/${competitionId}/pdf`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to delete PDF: ${error.error || response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ PDF deleted from competition');
    return data.competition;
  } catch (error) {
    console.error('❌ Error deleting PDF:', error);
    throw error;
  }
}

// ==================== SWIMMER COMPETITIONS API ====================

export async function fetchSwimmerCompetitions(): Promise<SwimmerCompetition[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/swimmer-competitions`, { headers: getPublicHeaders() });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to fetch swimmer competitions: ${error.error || response.statusText}`);
    }
    const data = await response.json();
    console.log('✅ Swimmer competitions fetched from server:', data.participations);
    return data.participations;
  } catch (error) {
    console.error('❌ Error fetching swimmer competitions:', error);
    throw error;
  }
}

export async function addSwimmerCompetition(participation: Omit<SwimmerCompetition, 'id'>): Promise<SwimmerCompetition> {
  try {
    const response = await fetch(`${API_BASE_URL}/swimmer-competitions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(participation),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to add swimmer competition: ${error.error || response.statusText}`);
    }
    const data = await response.json();
    console.log('✅ Swimmer competition added:', data.participation);
    return data.participation;
  } catch (error) {
    console.error('❌ Error adding swimmer competition:', error);
    throw error;
  }
}

export async function updateSwimmerCompetition(id: string, participation: Omit<SwimmerCompetition, 'id'>): Promise<SwimmerCompetition> {
  try {
    const response = await fetch(`${API_BASE_URL}/swimmer-competitions/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(participation),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to update swimmer competition: ${error.error || response.statusText}`);
    }
    const data = await response.json();
    console.log('✅ Swimmer competition updated:', data.participation);
    return data.participation;
  } catch (error) {
    console.error('❌ Error updating swimmer competition:', error);
    throw error;
  }
}

export async function deleteSwimmerCompetition(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/swimmer-competitions/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to delete swimmer competition: ${error.error || response.statusText}`);
    }
    console.log('✅ Swimmer competition deleted:', id);
  } catch (error) {
    console.error('❌ Error deleting swimmer competition:', error);
    throw error;
  }
}

// ==================== COMPETITION RESULTS API ====================

export async function updateCompetitionResults(
  swimmerId: string,
  competitionId: string,
  events: { event: string; time?: string; position?: number; points?: number }[]
): Promise<{ participation: SwimmerCompetition; swimmer: Swimmer }> {
  try {
    const response = await fetch(`${API_BASE_URL}/competition-results`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ swimmerId, competitionId, events }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to update competition results: ${error.error || response.statusText}`);
    }
    const data = await response.json();
    console.log('✅ Competition results updated:', data);
    return data;
  } catch (error) {
    console.error('❌ Error updating competition results:', error);
    throw error;
  }
}

// ==================== WORKOUTS API ====================

export async function fetchWorkouts(): Promise<Workout[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/workouts`, { headers: getPublicHeaders() });
    
    if (!response.ok) {
      let errorMessage = '';
      try {
        const error = await response.json();
        errorMessage = error.error || error.message || JSON.stringify(error);
      } catch (parseError) {
        const errorText = await response.text();
        errorMessage = errorText || response.statusText;
      }
      throw new Error(`Failed to fetch workouts: ${errorMessage} (Status: ${response.status})`);
    }
    
    const data = await response.json();
    
    // El servidor puede devolver un array directo o un objeto con propiedad workouts
    const workouts = Array.isArray(data) ? data : (data.workouts || []);
    console.log('✅ Workouts fetched from Supabase:', workouts.length);
    if (workouts.length > 0) {
      console.log('🔍 Sample workout groups from server:', workouts.slice(0, 3).map((w: any) => ({ id: w.id, group: w.group, groupType: typeof w.group, mesociclo: w.mesociclo })));
    }
    
    return workouts;
  } catch (error) {
    console.error('❌ Error fetching workouts from Supabase:', error);
    throw error;
  }
}

export async function addWorkout(workout: Omit<Workout, 'id'>): Promise<Workout> {
  try {
    console.log('🔄 Sending workout to server:', workout);
    const response = await fetch(`${API_BASE_URL}/workouts`, {
      method: 'POST',
      headers: getPublicHeaders(),
      body: JSON.stringify(workout),
    });
    
    console.log('📡 Server response status:', response.status, response.statusText);
    
    if (!response.ok) {
      let errorMessage = 'Unknown error';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.details || errorData.message || JSON.stringify(errorData);
      } catch (parseError) {
        errorMessage = await response.text() || response.statusText;
      }
      console.error('❌ Server returned error:', errorMessage);
      throw new Error(`Failed to add workout (${response.status}): ${errorMessage}`);
    }
    
    const data = await response.json();
    console.log('✅ Workout added successfully:', data.workout);
    return data.workout;
  } catch (error) {
    console.error('❌ Error adding workout:', error);
    throw error;
  }
}

export async function updateWorkout(id: string, workout: Omit<Workout, 'id'>): Promise<Workout> {
  try {
    const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
      method: 'PUT',
      headers: getPublicHeaders(),
      body: JSON.stringify(workout),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to update workout: ${error.error || response.statusText}`);
    }
    const data = await response.json();
    console.log('✅ Workout updated:', data.workout);
    return data.workout;
  } catch (error) {
    console.error('❌ Error updating workout:', error);
    throw error;
  }
}

export async function deleteWorkout(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
      method: 'DELETE',
      headers: getPublicHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to delete workout: ${error.error || response.statusText}`);
    }
    console.log('✅ Workout deleted:', id);
  } catch (error) {
    console.error('❌ Error deleting workout:', error);
    throw error;
  }
}

// ==================== HOLIDAYS API ====================

// TEMPORARY: Migrate existing workouts to have required timestamp fields
export async function migrateWorkouts(): Promise<{ count: number }> {
  try {
    console.log('🔄 Starting workout migration...');
    const response = await fetch(`${API_BASE_URL}/workouts/migrate`, {
      method: 'POST',
      headers: getPublicHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to migrate workouts: ${error.error || response.statusText}`);
    }
    const data = await response.json();
    console.log('✅ Migration completed:', data);
    return data;
  } catch (error) {
    console.error('❌ Error migrating workouts:', error);
    throw error;
  }
}

export async function fetchHolidays(): Promise<Holiday[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/holidays`, { headers: getPublicHeaders() });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to fetch holidays: ${error.error || response.statusText}`);
    }
    const data = await response.json();
    console.log('✅ Holidays fetched from server:', data.holidays);
    return data.holidays;
  } catch (error) {
    console.error('❌ Error fetching holidays:', error);
    throw error;
  }
}

export async function addHoliday(holiday: Omit<Holiday, 'id'>): Promise<Holiday> {
  try {
    const response = await fetch(`${API_BASE_URL}/holidays`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(holiday),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to add holiday: ${error.error || response.statusText}`);
    }
    const data = await response.json();
    console.log('✅ Holiday added:', data.holiday);
    return data.holiday;
  } catch (error) {
    console.error('❌ Error adding holiday:', error);
    throw error;
  }
}

export async function updateHoliday(id: string, holiday: Omit<Holiday, 'id'>): Promise<Holiday> {
  try {
    const response = await fetch(`${API_BASE_URL}/holidays/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(holiday),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to update holiday: ${error.error || response.statusText}`);
    }
    const data = await response.json();
    console.log('✅ Holiday updated:', data.holiday);
    return data.holiday;
  } catch (error) {
    console.error('❌ Error updating holiday:', error);
    throw error;
  }
}

export async function deleteHoliday(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/holidays/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to delete holiday: ${error.error || response.statusText}`);
    }
    console.log('✅ Holiday deleted:', id);
  } catch (error) {
    console.error('❌ Error deleting holiday:', error);
    throw error;
  }
}

// ==================== TEST CONTROL API ====================

export async function fetchTestControls(): Promise<TestControl[]> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/test-controls`, { headers: getPublicHeaders() }, 15000);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Test controls fetch error:', errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('✅ Test controls fetched:', data.testControls?.length || 0);
    return data.testControls || [];
  } catch (error) {
    console.error('❌ Error fetching test controls:', error);
    // En lugar de lanzar el error, retornar array vacío para no bloquear la carga
    return [];
  }
}

export async function addTestControl(testControl: Omit<TestControl, 'id'>): Promise<TestControl> {
  try {
    const response = await fetch(`${API_BASE_URL}/test-controls`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(testControl),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to add test control: ${error.error || response.statusText}`);
    }
    const data = await response.json();
    console.log('✅ Test control added:', data.testControl);
    return data.testControl;
  } catch (error) {
    console.error('❌ Error adding test control:', error);
    throw error;
  }
}

export async function updateTestControl(id: string, testControl: Omit<TestControl, 'id'>): Promise<TestControl> {
  try {
    const response = await fetch(`${API_BASE_URL}/test-controls/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(testControl),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to update test control: ${error.error || response.statusText}`);
    }
    const data = await response.json();
    console.log('✅ Test control updated:', data.testControl);
    return data.testControl;
  } catch (error) {
    console.error('❌ Error updating test control:', error);
    throw error;
  }
}

export async function deleteTestControl(id: string): Promise<void> {
  try {
    // Use a longer timeout for delete operations (30 seconds)
    const response = await fetchWithTimeout(`${API_BASE_URL}/test-controls/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }, 30000);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || response.statusText);
    }
    console.log('✅ Test control deleted:', id);
  } catch (error) {
    // Lanzar el error silenciosamente sin ningún log para 404
    const errorMsg = error instanceof Error ? error.message : String(error);
    if (!errorMsg.toLowerCase().includes('not found') && !errorMsg.toLowerCase().includes('404')) {
      console.error('❌ Error deleting test control:', error);
    }
    throw error;
  }
}

// ==================== TEST RESULTS API ====================

export async function fetchTestResults(): Promise<TestResult[]> {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/test-results`, { headers: getPublicHeaders() }, 15000);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Test results fetch error:', errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('✅ Test results fetched:', data.testResults?.length || 0);
    return data.testResults || [];
  } catch (error) {
    console.error('❌ Error fetching test results:', error);
    // En lugar de lanzar el error, retornar array vacío para no bloquear la carga
    return [];
  }
}

export async function addTestResult(testResult: Omit<TestResult, 'id'>): Promise<TestResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/test-results`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(testResult),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to add test result: ${error.error || response.statusText}`);
    }
    const data = await response.json();
    console.log('✅ Test result added:', data.testResult);
    return data.testResult;
  } catch (error) {
    console.error('❌ Error adding test result:', error);
    throw error;
  }
}

export async function updateTestResult(id: string, testResult: Omit<TestResult, 'id'>): Promise<TestResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/test-results/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(testResult),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to update test result: ${error.error || response.statusText}`);
    }
    const data = await response.json();
    console.log('✅ Test result updated:', data.testResult);
    return data.testResult;
  } catch (error) {
    console.error('❌ Error updating test result:', error);
    throw error;
  }
}

export async function deleteTestResult(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/test-results/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to delete test result: ${error.error || response.statusText}`);
    }
    console.log('✅ Test result deleted:', id);
  } catch (error) {
    console.error('❌ Error deleting test result:', error);
    throw error;
  }
}