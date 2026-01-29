/**
 * Local Storage Service - Fallback cuando el servidor no está disponible
 */

import type { Swimmer, Competition, SwimmerCompetition } from '../data/swimmers';
import type { Workout } from '../data/workouts';
import type { Challenge } from '../data/challenges';
import type { Holiday } from '../data/holidays';
import type { TestControl, TestResult } from '../data/testControl';
import type { AttendanceRecord } from './api';

const STORAGE_KEYS = {
  SWIMMERS: 'swimming_app_swimmers',
  COMPETITIONS: 'swimming_app_competitions',
  SWIMMER_COMPETITIONS: 'swimming_app_swimmer_competitions',
  WORKOUTS: 'swimming_app_workouts',
  CHALLENGES: 'swimming_app_challenges',
  HOLIDAYS: 'swimming_app_holidays',
  TEST_CONTROLS: 'swimming_app_test_controls',
  TEST_RESULTS: 'swimming_app_test_results',
  ATTENDANCE: 'swimming_app_attendance',
};

// Helper to safely parse JSON from localStorage
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

// Helper to safely save JSON to localStorage
function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

// ==================== SWIMMERS ====================

export function getSwimmers(): Swimmer[] {
  return getFromStorage<Swimmer[]>(STORAGE_KEYS.SWIMMERS, []);
}

export function saveSwimmers(swimmers: Swimmer[]): void {
  saveToStorage(STORAGE_KEYS.SWIMMERS, swimmers);
}

export function addSwimmer(swimmer: Omit<Swimmer, 'id'>): Swimmer {
  const swimmers = getSwimmers();
  const id = `s${Date.now()}`;
  const newSwimmer = { ...swimmer, id };
  swimmers.push(newSwimmer);
  saveSwimmers(swimmers);
  return newSwimmer;
}

export function updateSwimmer(id: string, swimmer: Omit<Swimmer, 'id'>): Swimmer {
  const swimmers = getSwimmers();
  const index = swimmers.findIndex(s => s.id === id);
  if (index === -1) throw new Error('Swimmer not found');
  const updatedSwimmer = { ...swimmer, id };
  swimmers[index] = updatedSwimmer;
  saveSwimmers(swimmers);
  return updatedSwimmer;
}

export function deleteSwimmer(id: string): void {
  const swimmers = getSwimmers();
  const filtered = swimmers.filter(s => s.id !== id);
  saveSwimmers(filtered);
}

// ==================== COMPETITIONS ====================

export function getCompetitions(): Competition[] {
  return getFromStorage<Competition[]>(STORAGE_KEYS.COMPETITIONS, []);
}

export function saveCompetitions(competitions: Competition[]): void {
  saveToStorage(STORAGE_KEYS.COMPETITIONS, competitions);
}

export function addCompetition(competition: Omit<Competition, 'id'>): Competition {
  const competitions = getCompetitions();
  const id = `c${Date.now()}`;
  const newCompetition = { ...competition, id };
  competitions.push(newCompetition);
  saveCompetitions(competitions);
  return newCompetition;
}

export function updateCompetition(id: string, competition: Omit<Competition, 'id'>): Competition {
  const competitions = getCompetitions();
  const index = competitions.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Competition not found');
  const updatedCompetition = { ...competition, id };
  competitions[index] = updatedCompetition;
  saveCompetitions(competitions);
  return updatedCompetition;
}

export function deleteCompetition(id: string): void {
  const competitions = getCompetitions();
  const filtered = competitions.filter(c => c.id !== id);
  saveCompetitions(filtered);
}

// ==================== SWIMMER COMPETITIONS ====================

export function getSwimmerCompetitions(): SwimmerCompetition[] {
  return getFromStorage<SwimmerCompetition[]>(STORAGE_KEYS.SWIMMER_COMPETITIONS, []);
}

export function saveSwimmerCompetitions(participations: SwimmerCompetition[]): void {
  saveToStorage(STORAGE_KEYS.SWIMMER_COMPETITIONS, participations);
}

export function addSwimmerCompetition(participation: Omit<SwimmerCompetition, 'id'>): SwimmerCompetition {
  const participations = getSwimmerCompetitions();
  const id = `sc${Date.now()}`;
  const newParticipation = { ...participation, id };
  participations.push(newParticipation);
  saveSwimmerCompetitions(participations);
  return newParticipation;
}

export function updateSwimmerCompetition(id: string, participation: Omit<SwimmerCompetition, 'id'>): SwimmerCompetition {
  const participations = getSwimmerCompetitions();
  const index = participations.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Participation not found');
  const updatedParticipation = { ...participation, id };
  participations[index] = updatedParticipation;
  saveSwimmerCompetitions(participations);
  return updatedParticipation;
}

export function deleteSwimmerCompetition(id: string): void {
  const participations = getSwimmerCompetitions();
  const filtered = participations.filter(p => p.id !== id);
  saveSwimmerCompetitions(filtered);
}

// ==================== WORKOUTS ====================

export function getWorkouts(): Workout[] {
  return getFromStorage<Workout[]>(STORAGE_KEYS.WORKOUTS, []);
}

export function saveWorkouts(workouts: Workout[]): void {
  saveToStorage(STORAGE_KEYS.WORKOUTS, workouts);
}

export function addWorkout(workout: Omit<Workout, 'id'>): Workout {
  const workouts = getWorkouts();
  const id = `w${Date.now()}`;
  const newWorkout = { ...workout, id };
  workouts.push(newWorkout);
  saveWorkouts(workouts);
  return newWorkout;
}

export function updateWorkout(id: string, workout: Omit<Workout, 'id'>): Workout {
  const workouts = getWorkouts();
  const index = workouts.findIndex(w => w.id === id);
  if (index === -1) throw new Error('Workout not found');
  const updatedWorkout = { ...workout, id };
  workouts[index] = updatedWorkout;
  saveWorkouts(workouts);
  return updatedWorkout;
}

export function deleteWorkout(id: string): void {
  const workouts = getWorkouts();
  const filtered = workouts.filter(w => w.id !== id);
  saveWorkouts(filtered);
}

// ==================== CHALLENGES ====================

export function getChallenges(): Challenge[] {
  return getFromStorage<Challenge[]>(STORAGE_KEYS.CHALLENGES, []);
}

export function saveChallenges(challenges: Challenge[]): void {
  saveToStorage(STORAGE_KEYS.CHALLENGES, challenges);
}

export function addChallenge(challenge: Omit<Challenge, 'id'>): Challenge {
  const challenges = getChallenges();
  const id = `ch${Date.now()}`;
  const newChallenge = { ...challenge, id };
  challenges.push(newChallenge);
  saveChallenges(challenges);
  return newChallenge;
}

export function updateChallenge(id: string, challenge: Omit<Challenge, 'id'>): Challenge {
  const challenges = getChallenges();
  const index = challenges.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Challenge not found');
  const updatedChallenge = { ...challenge, id };
  challenges[index] = updatedChallenge;
  saveChallenges(challenges);
  return updatedChallenge;
}

export function deleteChallenge(id: string): void {
  const challenges = getChallenges();
  const filtered = challenges.filter(c => c.id !== id);
  saveChallenges(filtered);
}

// ==================== HOLIDAYS ====================

export function getHolidays(): Holiday[] {
  return getFromStorage<Holiday[]>(STORAGE_KEYS.HOLIDAYS, []);
}

export function saveHolidays(holidays: Holiday[]): void {
  saveToStorage(STORAGE_KEYS.HOLIDAYS, holidays);
}

export function addHoliday(holiday: Omit<Holiday, 'id'>): Holiday {
  const holidays = getHolidays();
  const id = `h${Date.now()}`;
  const newHoliday = { ...holiday, id };
  holidays.push(newHoliday);
  saveHolidays(holidays);
  return newHoliday;
}

export function updateHoliday(id: string, holiday: Omit<Holiday, 'id'>): Holiday {
  const holidays = getHolidays();
  const index = holidays.findIndex(h => h.id === id);
  if (index === -1) throw new Error('Holiday not found');
  const updatedHoliday = { ...holiday, id };
  holidays[index] = updatedHoliday;
  saveHolidays(holidays);
  return updatedHoliday;
}

export function deleteHoliday(id: string): void {
  const holidays = getHolidays();
  const filtered = holidays.filter(h => h.id !== id);
  saveHolidays(filtered);
}

// ==================== TEST CONTROLS ====================

export function getTestControls(): TestControl[] {
  return getFromStorage<TestControl[]>(STORAGE_KEYS.TEST_CONTROLS, []);
}

export function saveTestControls(testControls: TestControl[]): void {
  saveToStorage(STORAGE_KEYS.TEST_CONTROLS, testControls);
}

export function addTestControl(testControl: Omit<TestControl, 'id'>): TestControl {
  const testControls = getTestControls();
  const id = `tc${Date.now()}`;
  const newTestControl = { ...testControl, id };
  testControls.push(newTestControl);
  saveTestControls(testControls);
  return newTestControl;
}

export function updateTestControl(id: string, testControl: Omit<TestControl, 'id'>): TestControl {
  const testControls = getTestControls();
  const index = testControls.findIndex(tc => tc.id === id);
  if (index === -1) throw new Error('Test control not found');
  const updatedTestControl = { ...testControl, id };
  testControls[index] = updatedTestControl;
  saveTestControls(testControls);
  return updatedTestControl;
}

export function deleteTestControl(id: string): void {
  const testControls = getTestControls();
  const filtered = testControls.filter(tc => tc.id !== id);
  saveTestControls(filtered);
}

// ==================== TEST RESULTS ====================

export function getTestResults(): TestResult[] {
  return getFromStorage<TestResult[]>(STORAGE_KEYS.TEST_RESULTS, []);
}

export function saveTestResults(testResults: TestResult[]): void {
  saveToStorage(STORAGE_KEYS.TEST_RESULTS, testResults);
}

export function addTestResult(testResult: Omit<TestResult, 'id'>): TestResult {
  const testResults = getTestResults();
  const id = `tr${Date.now()}`;
  const newTestResult = { ...testResult, id };
  testResults.push(newTestResult);
  saveTestResults(testResults);
  return newTestResult;
}

export function updateTestResult(id: string, testResult: Omit<TestResult, 'id'>): TestResult {
  const testResults = getTestResults();
  const index = testResults.findIndex(tr => tr.id === id);
  if (index === -1) throw new Error('Test result not found');
  const updatedTestResult = { ...testResult, id };
  testResults[index] = updatedTestResult;
  saveTestResults(testResults);
  return updatedTestResult;
}

export function deleteTestResult(id: string): void {
  const testResults = getTestResults();
  const filtered = testResults.filter(tr => tr.id !== id);
  saveTestResults(filtered);
}

// ==================== ATTENDANCE ====================

export function getAttendance(): AttendanceRecord[] {
  return getFromStorage<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, []);
}

export function saveAttendance(attendance: AttendanceRecord[]): void {
  saveToStorage(STORAGE_KEYS.ATTENDANCE, attendance);
}

export function addAttendanceRecord(record: Omit<AttendanceRecord, 'id'>): AttendanceRecord {
  const attendance = getAttendance();
  const id = `a${Date.now()}`;
  const newRecord = { ...record, id };
  attendance.push(newRecord);
  saveAttendance(attendance);
  return newRecord;
}

export function updateAttendanceRecord(id: string, record: Omit<AttendanceRecord, 'id'>): AttendanceRecord {
  const attendance = getAttendance();
  const index = attendance.findIndex(a => a.id === id);
  if (index === -1) throw new Error('Attendance record not found');
  const updatedRecord = { ...record, id };
  attendance[index] = updatedRecord;
  saveAttendance(attendance);
  return updatedRecord;
}

export function deleteAttendanceRecord(id: string): void {
  const attendance = getAttendance();
  const filtered = attendance.filter(a => a.id !== id);
  saveAttendance(filtered);
}
