import { useQuery } from '@tanstack/react-query';
import * as api from '../services/api';
import type { Swimmer, Competition, SwimmerCompetition, Workout, Holiday } from '../data/swimmers';
import type { TestControl, TestResult } from '../data/testControl';
import type { AttendanceRecord } from '../services/api';

// Calcula la fecha de inicio para filtrar asistencia (últimos 90 días)
function getAttendanceFromDate(): string {
  const d = new Date();
  d.setDate(d.getDate() - 90);
  return d.toISOString().split('T')[0];
}

export function useSwimmers() {
  return useQuery<Swimmer[]>({
    queryKey: ['swimmers'],
    queryFn: api.fetchSwimmers,
    staleTime: 15 * 60 * 1000,
  });
}

export function useCompetitions() {
  return useQuery<Competition[]>({
    queryKey: ['competitions'],
    queryFn: api.fetchCompetitions,
    staleTime: 30 * 60 * 1000,
  });
}

export function useSwimmerCompetitions() {
  return useQuery<SwimmerCompetition[]>({
    queryKey: ['swimmer-competitions'],
    queryFn: api.fetchSwimmerCompetitions,
    staleTime: 30 * 60 * 1000,
  });
}

export function useWorkouts() {
  return useQuery<Workout[]>({
    queryKey: ['workouts'],
    queryFn: api.fetchWorkouts,
    staleTime: 30 * 60 * 1000,
  });
}

export function useHolidays() {
  return useQuery<Holiday[]>({
    queryKey: ['holidays'],
    queryFn: api.fetchHolidays,
    staleTime: 60 * 60 * 1000,
  });
}

export function useTestControls() {
  return useQuery<TestControl[]>({
    queryKey: ['test-controls'],
    queryFn: api.fetchTestControls,
    staleTime: 15 * 60 * 1000,
  });
}

export function useTestResults() {
  return useQuery<TestResult[]>({
    queryKey: ['test-results'],
    queryFn: api.fetchTestResults,
    staleTime: 15 * 60 * 1000,
  });
}

// Carga asistencia filtrando por los últimos 90 días para reducir datos transferidos
export function useAttendance(fromDate?: string) {
  const defaultFrom = getAttendanceFromDate();
  const from = fromDate ?? defaultFrom;
  return useQuery<AttendanceRecord[]>({
    queryKey: ['attendance', from],
    queryFn: () => api.fetchAttendance(from),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useRecords() {
  return useQuery<any>({
    queryKey: ['records'],
    queryFn: api.fetchRecords,
    staleTime: 30 * 60 * 1000,
  });
}
