/**
 * API Service with LocalStorage Fallback
 * Intenta usar el servidor primero, si falla usa localStorage automáticamente
 */

import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import type { Swimmer, Competition, SwimmerCompetition } from '../data/swimmers';
import type { Workout } from '../data/workouts';
import type { Challenge } from '../data/challenges';
import type { Holiday } from '../data/holidays';
import type { TestControl, TestResult } from '../data/testControl';
import type { AttendanceRecord } from './api';
import * as localStorage from './localStorage';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc`;

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

// Track connection status
let serverOnline = false;
let healthCheckDone = false;

// Silent health check - solo intenta una vez
async function isServerAvailable(): Promise<boolean> {
  if (healthCheckDone) return serverOnline;
  
  try {
    healthCheckDone = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    
    const response = await fetch(`${API_BASE_URL}/health`, {
      headers,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    serverOnline = response.ok;
    
    if (serverOnline) {
      console.log('✅ Servidor conectado');
    }
    
    return serverOnline;
  } catch {
    serverOnline = false;
    return false;
  }
}

// ==================== SWIMMERS ====================

export async function fetchSwimmers(): Promise<Swimmer[]> {
  if (await isServerAvailable()) {
    try {
      const response = await fetch(`${API_BASE_URL}/swimmers`, { headers });
      if (response.ok) {
        const data = await response.json();
        const swimmers = data.swimmers || [];
        localStorage.saveSwimmers(swimmers);
        return swimmers;
      }
    } catch {}
  }
  
  return localStorage.getSwimmers();
}

export async function addSwimmer(swimmer: Omit<Swimmer, 'id'>): Promise<Swimmer> {
  const newSwimmer = localStorage.addSwimmer(swimmer);
  
  if (await isServerAvailable()) {
    try {
      const response = await fetch(`${API_BASE_URL}/swimmers`, {
        method: 'POST',
        headers,
        body: JSON.stringify(swimmer),
      });
      if (response.ok) {
        const data = await response.json();
        return data.swimmer;
      }
    } catch {}
  }
  
  return newSwimmer;
}

export async function updateSwimmer(id: string, swimmer: Omit<Swimmer, 'id'>): Promise<Swimmer> {
  const updated = localStorage.updateSwimmer(id, swimmer);
  
  if (await isServerAvailable()) {
    try {
      await fetch(`${API_BASE_URL}/swimmers/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(swimmer),
      });
    } catch {}
  }
  
  return updated;
}

export async function deleteSwimmer(id: string): Promise<void> {
  localStorage.deleteSwimmer(id);
  
  if (await isServerAvailable()) {
    try {
      await fetch(`${API_BASE_URL}/swimmers/${id}`, {
        method: 'DELETE',
        headers,
      });
    } catch {}
  }
}

// ==================== COMPETITIONS ====================

export async function fetchCompetitions(): Promise<Competition[]> {
  if (await isServerAvailable()) {
    try {
      const response = await fetch(`${API_BASE_URL}/competitions`, { headers });
      if (response.ok) {
        const data = await response.json();
        const competitions = data.competitions || [];
        localStorage.saveCompetitions(competitions);
        return competitions;
      }
    } catch {}
  }
  
  return localStorage.getCompetitions();
}

export async function addCompetition(competition: Omit<Competition, 'id'>): Promise<Competition> {
  const newCompetition = localStorage.addCompetition(competition);
  
  if (await isServerAvailable()) {
    try {
      await fetch(`${API_BASE_URL}/competitions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(competition),
      });
    } catch {}
  }
  
  return newCompetition;
}

export async function updateCompetition(id: string, competition: Omit<Competition, 'id'>): Promise<Competition> {
  const updated = localStorage.updateCompetition(id, competition);
  
  if (await isServerAvailable()) {
    try {
      await fetch(`${API_BASE_URL}/competitions/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(competition),
      });
    } catch {}
  }
  
  return updated;
}

export async function deleteCompetition(id: string): Promise<void> {
  localStorage.deleteCompetition(id);
  
  if (await isServerAvailable()) {
    try {
      await fetch(`${API_BASE_URL}/competitions/${id}`, {
        method: 'DELETE',
        headers,
      });
    } catch {}
  }
}

// ==================== SWIMMER COMPETITIONS ====================

export async function fetchSwimmerCompetitions(): Promise<SwimmerCompetition[]> {
  if (await isServerAvailable()) {
    try {
      const response = await fetch(`${API_BASE_URL}/swimmer-competitions`, { headers });
      if (response.ok) {
        const data = await response.json();
        const participations = data.participations || [];
        localStorage.saveSwimmerCompetitions(participations);
        return participations;
      }
    } catch {}
  }
  
  return localStorage.getSwimmerCompetitions();
}

export async function addSwimmerCompetition(participation: Omit<SwimmerCompetition, 'id'>): Promise<SwimmerCompetition> {
  const newParticipation = localStorage.addSwimmerCompetition(participation);
  
  if (await isServerAvailable()) {
    try {
      await fetch(`${API_BASE_URL}/swimmer-competitions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(participation),
      });
    } catch {}
  }
  
  return newParticipation;
}

export async function updateSwimmerCompetition(id: string, participation: Omit<SwimmerCompetition, 'id'>): Promise<SwimmerCompetition> {
  const updated = localStorage.updateSwimmerCompetition(id, participation);
  
  if (await isServerAvailable()) {
    try {
      await fetch(`${API_BASE_URL}/swimmer-competitions/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(participation),
      });
    } catch {}
  }
  
  return updated;
}

export async function deleteSwimmerCompetition(id: string): Promise<void> {
  localStorage.deleteSwimmerCompetition(id);
  
  if (await isServerAvailable()) {
    try {
      await fetch(`${API_BASE_URL}/swimmer-competitions/${id}`, {
        method: 'DELETE',
        headers,
      });
    } catch {}
  }
}

// ==================== WORKOUTS ====================

export async function fetchWorkouts(): Promise<Workout[]> {
  if (await isServerAvailable()) {
    try {
      const response = await fetch(`${API_BASE_URL}/workouts`, { headers });
      if (response.ok) {
        const data = await response.json();
        const workouts = data.workouts || [];
        localStorage.saveWorkouts(workouts);
        return workouts;
      }
    } catch {}
  }
  
  return localStorage.getWorkouts();
}

export async function addWorkout(workout: Omit<Workout, 'id'>): Promise<Workout> {
  const newWorkout = localStorage.addWorkout(workout);
  
  if (await isServerAvailable()) {
    try {
      await fetch(`${API_BASE_URL}/workouts`, {
        method: 'POST',
        headers,
        body: JSON.stringify(workout),
      });
    } catch {}
  }
  
  return newWorkout;
}

export async function updateWorkout(id: string, workout: Omit<Workout, 'id'>): Promise<Workout> {
  const updated = localStorage.updateWorkout(id, workout);
  
  if (await isServerAvailable()) {
    try {
      await fetch(`${API_BASE_URL}/workouts/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(workout),
      });
    } catch {}
  }
  
  return updated;
}

export async function deleteWorkout(id: string): Promise<void> {
  localStorage.deleteWorkout(id);
  
  if (await isServerAvailable()) {
    try {
      await fetch(`${API_BASE_URL}/workouts/${id}`, {
        method: 'DELETE',
        headers,
      });
    } catch {}
  }
}

// ==================== CHALLENGES ====================

export async function fetchChallenges(): Promise<Challenge[]> {
  if (await isServerAvailable()) {
    try {
      const response = await fetch(`${API_BASE_URL}/challenges`, { headers });
      if (response.ok) {
        const data = await response.json();
        const challenges = data.challenges || [];
        localStorage.saveChallenges(challenges);
        return challenges;
      }
    } catch {}
  }
  
  return localStorage.getChallenges();
}

export async function addChallenge(challenge: Omit<Challenge, 'id'>): Promise<Challenge> {
  const newChallenge = localStorage.addChallenge(challenge);
  
  if (await isServerAvailable()) {
    try {
      await fetch(`${API_BASE_URL}/challenges`, {
        method: 'POST',
        headers,
        body: JSON.stringify(challenge),
      });
    } catch {}
  }
  
  return newChallenge;
}

export async function updateChallenge(id: string, challenge: Omit<Challenge, 'id'>): Promise<Challenge> {
  const updated = localStorage.updateChallenge(id, challenge);
  
  if (await isServerAvailable()) {
    try {
      await fetch(`${API_BASE_URL}/challenges/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(challenge),
      });
    } catch {}
  }
  
  return updated;
}

export async function deleteChallenge(id: string): Promise<void> {
  localStorage.deleteChallenge(id);
  
  if (await isServerAvailable()) {
    try {
      await fetch(`${API_BASE_URL}/challenges/${id}`, {
        method: 'DELETE',
        headers,
      });
    } catch {}
  }
}

// ==================== HOLIDAYS ====================

export async function fetchHolidays(): Promise<Holiday[]> {
  if (await isServerAvailable()) {
    try {
      const response = await fetch(`${API_BASE_URL}/holidays`, { headers });
      if (response.ok) {
        const data = await response.json();
        const holidays = data.holidays || [];
        localStorage.saveHolidays(holidays);
        return holidays;
      }
    } catch {}
  }
  
  return localStorage.getHolidays();
}

export async function addHoliday(holiday: Omit<Holiday, 'id'>): Promise<Holiday> {
  const newHoliday = localStorage.addHoliday(holiday);
  
  if (await isServerAvailable()) {
    try {
      await fetch(`${API_BASE_URL}/holidays`, {
        method: 'POST',
        headers,
        body: JSON.stringify(holiday),
      });
    } catch {}
  }
  
  return newHoliday;
}

export async function updateHoliday(id: string, holiday: Omit<Holiday, 'id'>): Promise<Holiday> {
  const updated = localStorage.updateHoliday(id, holiday);
  
  if (await isServerAvailable()) {
    try {
      await fetch(`${API_BASE_URL}/holidays/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(holiday),
      });
    } catch {}
  }
  
  return updated;
}

export async function deleteHoliday(id: string): Promise<void> {
  localStorage.deleteHoliday(id);
  
  if (await isServerAvailable()) {
    try {
      await fetch(`${API_BASE_URL}/holidays/${id}`, {
        method: 'DELETE',
        headers,
      });
    } catch {}
  }
}

// ==================== TEST CONTROLS ====================

export async function fetchTestControls(): Promise<TestControl[]> {
  if (await isServerAvailable()) {
    try {
      const response = await fetch(`${API_BASE_URL}/test-controls`, { headers });
      if (response.ok) {
        const data = await response.json();
        const testControls = data.testControls || [];
        localStorage.saveTestControls(testControls);
        return testControls;
      }
    } catch {}
  }
  
  return localStorage.getTestControls();
}

export async function addTestControl(testControl: Omit<TestControl, 'id'>): Promise<TestControl> {
  const newTestControl = localStorage.addTestControl(testControl);
  
  if (await isServerAvailable()) {
    try {
      await fetch(`${API_BASE_URL}/test-controls`, {
        method: 'POST',
        headers,
        body: JSON.stringify(testControl),
      });
    } catch {}
  }
  
  return newTestControl;
}

export async function updateTestControl(id: string, testControl: Omit<TestControl, 'id'>): Promise<TestControl> {
  const updated = localStorage.updateTestControl(id, testControl);
  
  if (await isServerAvailable()) {
    try {
      await fetch(`${API_BASE_URL}/test-controls/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(testControl),
      });
    } catch {}
  }
  
  return updated;
}

export async function deleteTestControl(id: string): Promise<void> {
  localStorage.deleteTestControl(id);
  
  if (await isServerAvailable()) {
    try {
      await fetch(`${API_BASE_URL}/test-controls/${id}`, {
        method: 'DELETE',
        headers,
      });
    } catch {}
  }
}

// ==================== TEST RESULTS ====================

export async function fetchTestResults(): Promise<TestResult[]> {
  if (await isServerAvailable()) {
    try {
      const response = await fetch(`${API_BASE_URL}/test-results`, { headers });
      if (response.ok) {
        const data = await response.json();
        const testResults = data.testResults || [];
        localStorage.saveTestResults(testResults);
        return testResults;
      }
    } catch {}
  }
  
  return localStorage.getTestResults();
}

export async function addTestResult(testResult: Omit<TestResult, 'id'>): Promise<TestResult> {
  const newTestResult = localStorage.addTestResult(testResult);
  
  if (await isServerAvailable()) {
    try {
      await fetch(`${API_BASE_URL}/test-results`, {
        method: 'POST',
        headers,
        body: JSON.stringify(testResult),
      });
    } catch {}
  }
  
  return newTestResult;
}

export async function updateTestResult(id: string, testResult: Omit<TestResult, 'id'>): Promise<TestResult> {
  const updated = localStorage.updateTestResult(id, testResult);
  
  if (await isServerAvailable()) {
    try {
      await fetch(`${API_BASE_URL}/test-results/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(testResult),
      });
    } catch {}
  }
  
  return updated;
}

export async function deleteTestResult(id: string): Promise<void> {
  localStorage.deleteTestResult(id);
  
  if (await isServerAvailable()) {
    try {
      await fetch(`${API_BASE_URL}/test-results/${id}`, {
        method: 'DELETE',
        headers,
      });
    } catch {}
  }
}

// ==================== ATTENDANCE ====================

export async function fetchAttendance(): Promise<AttendanceRecord[]> {
  return localStorage.getAttendance();
}

export async function addAttendanceRecord(record: Omit<AttendanceRecord, 'id'>): Promise<AttendanceRecord> {
  return localStorage.addAttendanceRecord(record);
}

export async function updateAttendanceRecord(id: string, record: Omit<AttendanceRecord, 'id'>): Promise<AttendanceRecord> {
  return localStorage.updateAttendanceRecord(id, record);
}

export async function deleteAttendanceRecord(id: string): Promise<void> {
  localStorage.deleteAttendanceRecord(id);
}

// ==================== COMPETITION RESULTS ====================

export async function updateCompetitionResults(
  swimmerId: string,
  competitionId: string,
  events: { event: string; time?: string; position?: number; points?: number }[]
): Promise<{ participation: SwimmerCompetition; swimmer: Swimmer }> {
  const participations = localStorage.getSwimmerCompetitions();
  const participation = participations.find(
    p => p.swimmerId === swimmerId && p.competitionId === competitionId
  );
  
  if (participation) {
    const updatedParticipation = { ...participation, events };
    await updateSwimmerCompetition(participation.id, updatedParticipation);
  }
  
  const swimmers = localStorage.getSwimmers();
  const swimmer = swimmers.find(s => s.id === swimmerId);
  
  if (!swimmer || !participation) {
    throw new Error('Swimmer or participation not found');
  }
  
  return {
    participation: participation,
    swimmer: swimmer,
  };
}