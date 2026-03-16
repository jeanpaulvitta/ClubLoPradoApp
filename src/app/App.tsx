// Main application component with authentication  
// Version: 3.4.2 - JWT errors silenced in testAuth too (2026-03-15)
import React, { useState, useEffect, useMemo } from "react";
import jsPDF from "jspdf";
import { Toaster } from "@/app/components/ui/sonner";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { AuthProvider, useAuth } from "@/app/contexts/AuthContext";
import { ProtectedRoute } from "@/app/components/ProtectedRoute";
import { ErrorBoundary } from "@/app/components/ErrorBoundary";
import { UserMenu } from "@/app/components/UserMenu";
import { PWAInstaller } from "@/app/components/PWAInstaller";
import { AddSwimmerDialog } from "@/app/components/AddSwimmerDialog";
import { SwimmerListItem } from "@/app/components/SwimmerListItem";
import { SwimmerDetailsDialog } from "@/app/components/SwimmerDetailsDialog";
import { SwimmersStats } from "@/app/components/SwimmersStats";
import { CompetitionManager } from "@/app/components/CompetitionManager";
import { CompetitionResults } from "@/app/components/CompetitionResults";
import { WorkoutManager } from "@/app/components/WorkoutManager";
import { HolidayManager } from "@/app/components/HolidayManager";
import { TrashManager } from "@/app/components/TrashManager";

import { TrainingVolumeBloqueCharts } from "@/app/components/TrainingVolumeBloqueCharts";
import { TrainingStats } from "@/app/components/TrainingStats";
import { VolumeTrendSync } from "@/app/components/VolumeTrendSync";
import { IntegratedCalendar } from "@/app/components/IntegratedCalendar";
import { TeamRecordsBoard } from "@/app/components/TeamRecordsBoard";
import { AchievementsBoard } from "@/app/components/AchievementsBoard";
import { AttendanceManager } from "@/app/components/AttendanceManager";
import { TestControlManager } from "@/app/components/TestControlManager";
import { PasswordRequestsManager } from "@/app/components/PasswordRequestsManager";
import { MinimumTimesChecker } from "@/app/components/MinimumTimesChecker";
import { SwimmerMinimumTimesView } from "@/app/components/SwimmerMinimumTimesView";
import { MinimumTimesReference } from "@/app/components/MinimumTimesReference";
import { GroupFilterSelector } from "@/app/components/GroupFilterSelector";
import { SeasonStructureInfo } from "@/app/components/SeasonStructureInfo";
import { PhysicalPreparation } from "@/app/components/PhysicalPreparation";
import { generateAllSwimmersPDF } from "@/app/utils/pdfGenerator";
import { 
  Users, 
  Calendar, 
  Medal, 
  Dumbbell, 
  ClipboardList, 
  Target, 
  TrendingUp, 
  CalendarDays, 
  Trophy, 
  Crown,
  Award,
  Shield,
  Clipboard,
  FileDown,
  Filter,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Info as InfoIcon,
  Activity,
  Upload,
  Info,
  CheckCircle,
  Eye,
  Download,
  AlertCircle
} from "lucide-react";
import type { 
  Swimmer, 
  AttendanceRecord, 
  Competition, 
  SwimmerCompetition,
  Workout,
  Holiday,
  TestControl,
  TestResult,
  PersonalBest,
  PersonalBestHistory,
  SwimmerGoal
} from "@/app/data/swimmers";
import * as api from "@/app/services/api";
import { isTeamRecord } from "@/app/utils/recordsUtils";
import { calculateAge, calculateCategoryFromBirthDate, getTrainingGroupFromBirthDate } from "@/app/utils/swimmerUtils";
import { Logo } from "./components/Logo";
import { projectId, publicAnonKey } from "/utils/supabase/info";

// Función auxiliar para convertir tiempo MM:SS.SS a segundos
function timeToSeconds(time: string): number {
  const parts = time.split(':');
  if (parts.length === 2) {
    const minutes = parseInt(parts[0]);
    const seconds = parseFloat(parts[1]);
    return minutes * 60 + seconds;
  }
  return parseFloat(time);
}

function MainApp() {
  const { user } = useAuth(); // Obtener usuario autenticado
  const [swimmers, setSwimmers] = useState<Swimmer[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [swimmerCompetitions, setSwimmerCompetitions] = useState<SwimmerCompetition[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [testControls, setTestControls] = useState<TestControl[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("entrenamientos");
  const [selectedSwimmer, setSelectedSwimmer] = useState<Swimmer | null>(null);
  const [swimmerDialogOpen, setSwimmerDialogOpen] = useState(false);
  
  // Estados para filtros de nadadores
  const [filterGender, setFilterGender] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterGroup, setFilterGroup] = useState<"all" | 1 | 2>("all");
  
  // Estado para seleccionar qué estructura de temporada ver
  const [selectedSeasonGroup, setSelectedSeasonGroup] = useState<"group1" | "group2">("group1");
  
  // Estados para mostrar/ocultar información de estructura
  const [showStructureInfo, setShowStructureInfo] = useState(false);
  const [showTrainingStats, setShowTrainingStats] = useState(false);
  
  // Estado para el diálogo de bloque seleccionado
  const [selectedBloque, setSelectedBloque] = useState<string | null>(null);
  
  // Estado para el entrenamiento seleccionado (visualización detallada)
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  
  // Obtener el nadador actual si el usuario es un nadador
  const currentSwimmer = user?.swimmerId 
    ? swimmers.find(s => s.id === user.swimmerId) 
    : null;

  // Cargar datos desde el servidor al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  // Log configuration info on mount
  useEffect(() => {
    console.log('📱 Club Natación Lo Prado - Sistema de Gestión');
    console.log('🔧 Versión: 2.0.4');
    console.log('');
    console.log('⚠️ IMPORTANTE: Si ves errores de "Missing authorization header",');
    console.log('   significa que el servidor NO ESTÁ DESPLEGADO en Supabase.');
    console.log('');
    console.log('🚨 SOLUCIÓN RÁPIDA (5 minutos):');
    console.log('');
    console.log('   1. Instalar CLI de Supabase:');
    console.log('      Mac: brew install supabase/tap/supabase');
    console.log('      Windows: https://github.com/supabase/cli/releases/latest/download/supabase_windows_amd64.msi');
    console.log('');
    console.log('   2. Abrir terminal en la carpeta del proyecto y ejecutar:');
    console.log('      supabase login');
    console.log('      supabase link --project-ref vrclozhgaacehojbnpuo');
    console.log('      supabase functions deploy make-server-4909a0bc');
    console.log('');
    console.log('   3. Configurar variables en Supabase Dashboard:');
    console.log('      https://supabase.com/dashboard/project/vrclozhgaacehojbnpuo/functions/make-server-4909a0bc');
    console.log('      → Secrets → Agregar:');
    console.log('         SUPABASE_URL');
    console.log('         SUPABASE_ANON_KEY');
    console.log('         SUPABASE_SERVICE_ROLE_KEY');
    console.log('');
    console.log('📄 Ver instrucciones detalladas: /DESPLIEGUE_EN_3_PASOS.md');
    console.log('');
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar datos con manejo de errores individual
      const results = await Promise.allSettled([
        api.fetchSwimmers(),
        api.fetchCompetitions(),
        api.fetchSwimmerCompetitions(),
        api.fetchWorkouts(),
        api.fetchHolidays(),
        api.fetchTestControls(),
        api.fetchTestResults(),
      ]);

      // Extraer datos exitosos o usar arrays vacíos en caso de error
      const swimmersData = results[0].status === 'fulfilled' ? results[0].value : [];
      const competitionsData = results[1].status === 'fulfilled' ? results[1].value : [];
      const participationsData = results[2].status === 'fulfilled' ? results[2].value : [];
      const workoutsData = results[3].status === 'fulfilled' ? results[3].value : [];
      const holidaysData = results[4].status === 'fulfilled' ? results[4].value : [];
      const testControlsData = results[5].status === 'fulfilled' ? results[5].value : [];
      const testResultsData = results[6].status === 'fulfilled' ? results[6].value : [];

      // Log de errores si los hay (sin detener la carga)
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const names = ['swimmers', 'competitions', 'participations', 'workouts', 'holidays', 'test-controls', 'test-results'];
          console.warn(`⚠️ Error loading ${names[index]}:`, result.reason);
        }
      });
      
      setSwimmers(swimmersData);
      setCompetitions(competitionsData);
      setSwimmerCompetitions(participationsData);
      
      // Cargar entrenamientos - usar los que vienen de la BD
      console.log('📊 Entrenamientos cargados desde BD:', workoutsData.length);
      if (workoutsData.length > 0) {
        console.log('📋 Muestra de entrenamientos:', workoutsData.slice(0, 3).map(w => ({
          id: w.id,
          week: w.week,
          bloque: w.bloque,
          mesociclo: w.mesociclo,
          day: w.day,
          group: w.group,
          distance: w.distance
        })));
        
        // Verificar estadísticas de distancia
        const totalDist = workoutsData.reduce((sum: number, w: any) => sum + (w.distance || 0), 0);
        console.log('📏 Distancia total de entrenamientos:', totalDist, 'm');
        console.log('📏 Promedio por entrenamiento:', Math.round(totalDist / workoutsData.length), 'm');
      }
      setWorkouts(workoutsData);
      
      // Cargar días feriados
      console.log('📊 Días feriados cargados desde BD:', holidaysData.length);
      setHolidays(holidaysData);
      
      // Cargar controles de prueba
      console.log('📊 Controles de prueba cargados desde BD:', testControlsData.length);
      setTestControls(testControlsData);
      
      // Cargar resultados de prueba
      console.log('📊 Resultados de prueba cargados desde BD:', testResultsData.length);
      setTestResults(testResultsData);
      
      console.log("✅ Datos cargados desde Supabase:", {
        swimmers: swimmersData.length,
        competitions: competitionsData.length,
        participations: participationsData.length,
        workouts: workoutsData.length,
        holidays: holidaysData.length,
        testControls: testControlsData.length,
        testResults: testResultsData.length,
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMsg);
      console.error("❌ Error cargando datos:", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Funciones para gestionar nadadores
  const handleAddSwimmer = async (newSwimmer: Omit<Swimmer, "id">) => {
    try {
      const swimmer = await api.addSwimmer(newSwimmer);
      setSwimmers([...swimmers, swimmer]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      alert(`Error al agregar nadador: ${errorMsg}`);
      console.error("❌ Error al agregar nadador:", err);
    }
  };

  const handleEditSwimmer = async (id: string, updatedSwimmer: Omit<Swimmer, "id">) => {
    try {
      const swimmer = await api.updateSwimmer(id, updatedSwimmer);
      setSwimmers(swimmers.map(s => s.id === id ? swimmer : s));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      alert(`Error al actualizar nadador: ${errorMsg}`);
      console.error("❌ Error al actualizar nadador:", err);
    }
  };

  const handleDeleteSwimmer = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este nadador?")) {
      try {
        await api.deleteSwimmer(id);
        setSwimmers(swimmers.filter(s => s.id !== id));
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Error desconocido";
        alert(`Error al eliminar nadador: ${errorMsg}`);
        console.error("❌ Error al eliminar nadador:", err);
      }
    }
  };

  const handleSavePersonalBests = async (swimmerId: string, personalBests: PersonalBest[], history: PersonalBestHistory[]) => {
    try {
      const swimmer = swimmers.find(s => s.id === swimmerId);
      if (!swimmer) return;

      // Convertir tiempo a segundos para cada entrada del historial
      const processedHistory = history.map(h => ({
        ...h,
        timeInSeconds: h.timeInSeconds || timeToSeconds(h.time)
      }));

      // Agregar nuevas marcas al historial existente
      const existingHistory = swimmer.personalBestsHistory || [];
      const updatedHistory = [...existingHistory, ...processedHistory];

      const updatedSwimmer = { 
        ...swimmer, 
        personalBests,
        personalBestsHistory: updatedHistory
      };
      await api.updateSwimmer(swimmerId, updatedSwimmer);
      
      // Actualizar la lista de nadadores
      const updatedSwimmers = swimmers.map(s => s.id === swimmerId ? { ...s, personalBests, personalBestsHistory: updatedHistory } : s);
      setSwimmers(updatedSwimmers);
      
      // Actualizar el nadador seleccionado si es el mismo
      if (selectedSwimmer && selectedSwimmer.id === swimmerId) {
        setSelectedSwimmer({ ...selectedSwimmer, personalBests, personalBestsHistory: updatedHistory });
      }
      
      console.log("✅ Mejores marcas guardadas:", personalBests);
      alert("✅ Mejores marcas guardadas exitosamente");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      alert(`Error al guardar mejores marcas: ${errorMsg}`);
      console.error("❌ Error al guardar mejores marcas:", err);
    }
  };

  const handleUpdateGoals = async (swimmerId: string, goals: SwimmerGoal[]) => {
    try {
      const swimmer = swimmers.find(s => s.id === swimmerId);
      if (!swimmer) return;

      const updatedSwimmer = { 
        ...swimmer, 
        goals
      };
      await api.updateSwimmer(swimmerId, updatedSwimmer);
      
      // Actualizar la lista de nadadores
      const updatedSwimmers = swimmers.map(s => s.id === swimmerId ? { ...s, goals } : s);
      setSwimmers(updatedSwimmers);
      
      // Actualizar el nadador seleccionado si es el mismo
      if (selectedSwimmer && selectedSwimmer.id === swimmerId) {
        setSelectedSwimmer({ ...selectedSwimmer, goals });
      }
      
      console.log("✅ Metas actualizadas:", goals);
      alert("✅ Metas actualizadas exitosamente");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      alert(`Error al actualizar metas: ${errorMsg}`);
      console.error("❌ Error al actualizar metas:", err);
    }
  };

  // Funciones para gestionar competencias
  const handleAddCompetition = async (newCompetition: Omit<Competition, "id">) => {
    try {
      const competition = await api.addCompetition(newCompetition);
      setCompetitions([...competitions, competition]);
      console.log("✅ Competencia agregada:", competition);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      alert(`Error al agregar competencia: ${errorMsg}`);
      console.error("❌ Error al agregar competencia:", err);
    }
  };

  const handleEditCompetition = async (id: string, updatedCompetition: Omit<Competition, "id">) => {
    try {
      const competition = await api.updateCompetition(id, updatedCompetition);
      setCompetitions(competitions.map(c => c.id === id ? competition : c));
      console.log("✅ Competencia actualizada:", competition);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      alert(`Error al actualizar competencia: ${errorMsg}`);
      console.error("❌ Error al actualizar competencia:", err);
    }
  };

  const handleDeleteCompetition = async (id: string) => {
    try {
      await api.deleteCompetition(id);
      setCompetitions(competitions.filter(c => c.id !== id));
      // También eliminar participaciones relacionadas
      setSwimmerCompetitions(swimmerCompetitions.filter(sc => sc.competitionId !== id));
      console.log("✅ Competencia eliminada:", id);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      alert(`Error al eliminar competencia: ${errorMsg}`);
      console.error("❌ Error al eliminar competencia:", err);
    }
  };

  const handleToggleCompetitionParticipation = async (
    swimmerId: string,
    competitionId: string,
    participates: boolean
  ) => {
    try {
      // Buscar si ya existe una participación
      const existing = swimmerCompetitions.find(
        sc => sc.swimmerId === swimmerId && sc.competitionId === competitionId
      );

      if (existing) {
        // Actualizar participación existente
        const updated = { ...existing, participates };
        await api.updateSwimmerCompetition(existing.id, updated);
        setSwimmerCompetitions(
          swimmerCompetitions.map(sc => sc.id === existing.id ? updated : sc)
        );
      } else {
        // Crear nueva participación
        const newParticipation: Omit<SwimmerCompetition, "id"> = {
          swimmerId,
          competitionId,
          participates,
          events: [],
        };
        const created = await api.addSwimmerCompetition(newParticipation);
        setSwimmerCompetitions([...swimmerCompetitions, created]);
      }

      console.log(`✅ Participación ${participates ? 'marcada' : 'desmarcada'}:`, {
        swimmerId,
        competitionId,
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      alert(`Error al actualizar participación: ${errorMsg}`);
      console.error("❌ Error al actualizar participación:", err);
    }
  };

  // Función para actualizar resultados de competencias
  const handleUpdateCompetitionResults = async (
    competitionId: string,
    events: { event: string; time?: string; position?: number; points?: number }[]
  ) => {
    if (!currentSwimmer) {
      alert("No se pudo identificar tu perfil de nadador");
      return;
    }

    try {
      const result = await api.updateCompetitionResults(
        currentSwimmer.id,
        competitionId,
        events
      );

      // Actualizar estado local con la participación actualizada
      const existingIndex = swimmerCompetitions.findIndex(
        sc => sc.id === result.participation.id
      );

      if (existingIndex !== -1) {
        const updated = [...swimmerCompetitions];
        updated[existingIndex] = result.participation;
        setSwimmerCompetitions(updated);
      } else {
        setSwimmerCompetitions([...swimmerCompetitions, result.participation]);
      }

      // Actualizar el nadador con las marcas personales actualizadas
      const updatedSwimmers = swimmers.map(s => 
        s.id === currentSwimmer.id ? result.swimmer : s
      );
      setSwimmers(updatedSwimmers);

      alert("✅ Resultados guardados exitosamente. Tus marcas personales se han actualizado automáticamente.");
      console.log("✅ Resultados de competencia guardados:", result);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      alert(`Error al guardar resultados: ${errorMsg}`);
      console.error("❌ Error al guardar resultados de competencia:", err);
    }
  };

  // Funciones para gestionar entrenamientos
  const handleAddWorkout = async (workout: Omit<Workout, "id">) => {
    try {
      const newWorkout = await api.addWorkout(workout);
      setWorkouts([...workouts, newWorkout]);
      console.log("✅ Entrenamiento agregado:", newWorkout);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      alert(`Error al agregar entrenamiento: ${errorMsg}`);
      console.error("❌ Error al agregar entrenamiento:", err);
    }
  };

  const handleEditWorkout = async (id: string, workout: Omit<Workout, "id">) => {
    try {
      const updated = await api.updateWorkout(id, workout);
      setWorkouts(workouts.map(w => w.id === id ? updated : w));
      console.log("✅ Entrenamiento actualizado:", updated);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      
      // Detectar si es un error de configuración
      if (errorMsg.includes('Internal server error') || errorMsg.includes('500')) {
        console.error('🚨 ERROR DE CONFIGURACIÓN DETECTADO');
        console.error('');
        console.error('❌ El servidor NO está configurado correctamente.');
        console.error('📋 Solución: Configura las variables de entorno en Supabase Edge Functions');
        console.error('📄 Ver: /INSTRUCCIONES_CONFIGURACION_SUPABASE.md');
        console.error('🔍 Usa la pestaña "Diagnóstico" (solo admins) para verificar');
        console.error('');
        alert(`⚠️ Error de Configuración del Servidor\n\nEl servidor backend no está configurado.\n\n📋 Solución:\n1. Ve a la pestaña "Diagnóstico" (admin)\n2. Sigue las instrucciones para configurar Supabase\n\nError técnico: ${errorMsg}`);
      } else {
        alert(`Error al actualizar entrenamiento: ${errorMsg}`);
      }
      
      console.error("❌ Error al actualizar entrenamiento:", err);
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    try {
      await api.deleteWorkout(id);
      setWorkouts(workouts.filter(w => w.id !== id));
      console.log("✅ Entrenamiento eliminado:", id);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      alert(`Error al eliminar entrenamiento: ${errorMsg}`);
      console.error("❌ Error al eliminar entrenamiento:", err);
    }
  };

  // ==================== HOLIDAYS HANDLERS ====================

  const handleAddHoliday = async (holiday: Omit<Holiday, 'id'>) => {
    try {
      const newHoliday = await api.addHoliday(holiday);
      setHolidays([...holidays, newHoliday]);
      console.log("✅ Día feriado agregado:", newHoliday);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      alert(`Error al agregar día feriado: ${errorMsg}`);
      console.error("❌ Error al agregar día feriado:", err);
    }
  };

  const handleEditHoliday = async (id: string, holiday: Omit<Holiday, 'id'>) => {
    try {
      const updatedHoliday = await api.updateHoliday(id, holiday);
      setHolidays(holidays.map(h => h.id === id ? updatedHoliday : h));
      console.log("✅ Día feriado actualizado:", updatedHoliday);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      alert(`Error al actualizar día feriado: ${errorMsg}`);
      console.error("❌ Error al actualizar día feriado:", err);
    }
  };

  const handleDeleteHoliday = async (id: string) => {
    try {
      await api.deleteHoliday(id);
      setHolidays(holidays.filter(h => h.id !== id));
      console.log("✅ Día feriado eliminado:", id);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      alert(`Error al eliminar día feriado: ${errorMsg}`);
      console.error("❌ Error al eliminar día feriado:", err);
    }
  };

  // ==================== TEST CONTROL HANDLERS ====================

  const handleAddTestControl = async (testControl: TestControl) => {
    try {
      console.log('✅ App: Test control added from child component:', testControl.id);
      
      // Solo actualizar el estado con el test control ya creado
      setTestControls(prev => [...prev, testControl]);
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      alert(`Error al agregar test control: ${errorMsg}`);
      console.error("❌ Error al agregar test control:", err);
    }
  };

  const handleEditTestControl = async (id: string, testControl: TestControl) => {
    try {
      const updatedTestControl = await api.updateTestControl(id, testControl);
      setTestControls(testControls.map(tc => tc.id === id ? updatedTestControl : tc));
      console.log("✅ Test control actualizado:", updatedTestControl);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      alert(`Error al actualizar test control: ${errorMsg}`);
      console.error("❌ Error al actualizar test control:", err);
    }
  };

  const handleDeleteTestControl = async (id: string) => {
    try {
      await api.deleteTestControl(id);
      setTestControls(testControls.filter(tc => tc.id !== id));
      console.log("✅ Test control eliminado:", id);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      alert(`Error al eliminar test control: ${errorMsg}`);
      console.error("❌ Error al eliminar test control:", err);
    }
  };

  const handleAddTestResult = async (testResult: Omit<TestResult, 'id'>) => {
    try {
      const newTestResult = await api.addTestResult(testResult);
      setTestResults([...testResults, newTestResult]);
      console.log("✅ Resultado de test agregado:", newTestResult);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      alert(`Error al agregar resultado de test: ${errorMsg}`);
      console.error("❌ Error al agregar resultado de test:", err);
    }
  };

  const handleEditTestResult = async (id: string, testResult: Omit<TestResult, 'id'>) => {
    try {
      const updated = await api.updateTestResult(id, testResult);
      setTestResults(testResults.map(tr => tr.id === id ? updated : tr));
      console.log("✅ Resultado de test actualizado:", updated);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      alert(`Error al actualizar resultado de test: ${errorMsg}`);
      console.error("❌ Error al actualizar resultado de test:", err);
    }
  };

  const handleDeleteTestResult = async (id: string) => {
    try {
      await api.deleteTestResult(id);
      setTestResults(testResults.filter(tr => tr.id !== id));
      console.log("✅ Resultado de test eliminado:", id);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      alert(`Error al eliminar resultado de test: ${errorMsg}`);
      console.error("❌ Error al eliminar resultado de test:", err);
    }
  };

  // Función para generar PDF del entrenamiento
  const generateWorkoutPDF = (workout: Workout) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    // Header con logo del club
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(239, 68, 68); // Rojo del club
    doc.text("Club Natación Lo Prado", pageWidth / 2, yPosition, { align: "center" });
    
    yPosition += 10;
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Plan de Entrenamiento", pageWidth / 2, yPosition, { align: "center" });
    
    yPosition += 15;
    
    // Información general
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Fecha: ${workout.date}`, 20, yPosition);
    yPosition += 7;
    
    doc.text(`Día: ${workout.day}`, 20, yPosition);
    yPosition += 7;
    
    doc.text(`Grupo: ${String(workout.group) === "1" ? "Grupo 1 (Menores)" : "Grupo 2 (Mayores)"}`, 20, yPosition);
    yPosition += 7;
    
    if (workout.schedule) {
      doc.text(`Horario: ${workout.schedule === "AM" ? "Mañana" : "Tarde"}`, 20, yPosition);
      yPosition += 7;
    }
    
    doc.text(`Bloque: ${workout.mesociclo}`, 20, yPosition);
    yPosition += 7;
    
    doc.text(`Distancia Total: ${workout.distance}m`, 20, yPosition);
    yPosition += 7;
    
    doc.text(`Duración: ${workout.duration} min`, 20, yPosition);
    yPosition += 7;
    
    doc.text(`Intensidad: ${workout.intensity}`, 20, yPosition);
    yPosition += 7;
    
    if (workout.focus) {
      doc.text(`Enfoque: ${workout.focus}`, 20, yPosition);
      yPosition += 7;
    }
    
    yPosition += 5;
    
    // Calentamiento
    doc.setFillColor(239, 68, 68);
    doc.rect(20, yPosition, pageWidth - 40, 7, "F");
    doc.setTextColor(255, 255, 255);
    doc.text("CALENTAMIENTO", 25, yPosition + 5);
    yPosition += 12;
    
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    const warmupLines = doc.splitTextToSize(workout.warmup, pageWidth - 50);
    doc.text(warmupLines, 25, yPosition);
    yPosition += warmupLines.length * 6 + 5;
    
    // Serie Principal
    doc.setFillColor(239, 68, 68);
    doc.rect(20, yPosition, pageWidth - 40, 7, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("SERIE PRINCIPAL", 25, yPosition + 5);
    yPosition += 12;
    
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    workout.mainSet.forEach((set, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      const setLines = doc.splitTextToSize(`${index + 1}. ${set}`, pageWidth - 50);
      doc.text(setLines, 25, yPosition);
      yPosition += setLines.length * 6 + 2;
    });
    
    yPosition += 5;
    
    // Enfriamiento
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFillColor(239, 68, 68);
    doc.rect(20, yPosition, pageWidth - 40, 7, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("ENFRIAMIENTO", 25, yPosition + 5);
    yPosition += 12;
    
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    const cooldownLines = doc.splitTextToSize(workout.cooldown, pageWidth - 50);
    doc.text(cooldownLines, 25, yPosition);
    
    // Footer
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, 285, { align: "center" });
      doc.text(`Generado: ${new Date().toLocaleDateString('es-CL')}`, pageWidth - 20, 285, { align: "right" });
    }
    
    // Guardar PDF
    const filename = `Entrenamiento_${workout.date}_${String(workout.group) === "1" ? "Grupo1" : "Grupo2"}.pdf`;
    doc.save(filename);
  };

  // Lista de sesiones de entrenamientos (sin desafíos)
  const allSessions = [
    // Mapear todos los entrenamientos (sin filtros restrictivos)
    ...workouts
      .filter(w => !w.deleted) // Solo excluir los explícitamente eliminados
      .map((w, idx) => ({ 
        ...w, 
        type: 'workout' as const,
        mesociclo: w.mesociclo || w.bloque || "Bloque 1", // Usar mesociclo primero, luego bloque
        // Si week no existe, calcularlo basado en el índice (3 entrenamientos por semana)
        week: w.week || Math.floor(idx / 3) + 1
      }))
  ];



  // Función para convertir texto de fecha a formato ISO
  const parseDateToISO = (dateText: string, week: number): string => {
    // Mapa de meses en español a números
    const monthMap: { [key: string]: number } = {
      'enero': 0,
      'febrero': 1,
      'marzo': 2,
      'abril': 3,
      'mayo': 4,
      'junio': 5,
      'julio': 6,
      'agosto': 7,
      'septiembre': 8,
      'octubre': 9,
      'noviembre': 10,
      'diciembre': 11
    };

    // Extraer día y mes del texto (formato: "2 de marzo")
    const regex = /(\d+)\s+de\s+(\w+)/i;
    const match = dateText.match(regex);
    
    if (match) {
      const day = parseInt(match[1]);
      const monthName = match[2].toLowerCase();
      const month = monthMap[monthName];
      
      if (month !== undefined) {
        // Crear fecha con año 2026
        const date = new Date(2026, month, day);
        return date.toISOString().split('T')[0];
      }
    }
    
    // Fallback: usar cálculo basado en semana si no se puede parsear
    const baseDate = new Date(2026, 2, 2); // 2 de marzo de 2026
    let daysToAdd = (week - 1) * 7;
    
    // Agregar días según el día de la semana
    if (dateText.includes("Miércoles") || dateText.includes("miércoles")) {
      daysToAdd += 2;
    } else if (dateText.includes("Viernes") || dateText.includes("viernes")) {
      daysToAdd += 4;
    } else if (dateText.includes("Sábado") || dateText.includes("sábado")) {
      daysToAdd += 5;
    }
    
    const resultDate = new Date(baseDate);
    resultDate.setDate(resultDate.getDate() + daysToAdd);
    
    return resultDate.toISOString().split('T')[0];
  };

  // Generar fechas ISO para todas las sesiones
  const allSessionsWithDates = allSessions.map((session, idx) => ({
    ...session,
    dateISO: parseDateToISO(session.date, session.week)
  }));

  // Debug: Verificar que tenemos sesiones
  console.log("📅 Sesiones para calendario:", {
    totalSessions: allSessionsWithDates.length,
    workouts: workouts.length,
    sample: allSessionsWithDates.slice(0, 3)
  });

  // Función para convertir registros de AttendanceManager a formato SwimmerCard
  const convertAttendanceRecords = (swimmerId: string) => {
    // Por ahora retornamos un array vacío ya que AttendanceManager maneja su propio estado
    // Esto se puede mejorar en el futuro para compartir datos entre componentes
    return [];
  };

  // Función para filtrar nadadores
  const getFilteredSwimmers = () => {
    return swimmers.filter((swimmer) => {
      // Filtro por género
      if (filterGender !== "all" && swimmer.gender !== filterGender) {
        return false;
      }
      
      // Filtro por categoría
      if (filterCategory !== "all") {
        const category = calculateCategoryFromBirthDate(swimmer.dateOfBirth);
        if (category !== filterCategory) {
          return false;
        }
      }
      
      // Filtro por grupo de entrenamiento
      if (filterGroup !== "all") {
        const swimmerGroup = getTrainingGroupFromBirthDate(swimmer.dateOfBirth);
        if (swimmerGroup !== filterGroup) {
          return false;
        }
      }
      
      return true;
    });
  };

  // Obtener todas las categorías únicas de los nadadores
  const getUniqueCategories = () => {
    const categories = new Set<string>();
    swimmers.forEach((swimmer) => {
      const category = calculateCategoryFromBirthDate(swimmer.dateOfBirth);
      categories.add(category);
    });
    return Array.from(categories).sort();
  };

  const filteredSwimmers = getFilteredSwimmers();
  const uniqueCategories = getUniqueCategories();

  // Agrupar sesiones por semana
  const groupSessionsByWeek = () => {
    const grouped: { [week: number]: typeof allSessions } = {};
    allSessions.forEach((session) => {
      if (!grouped[session.week]) {
        grouped[session.week] = [];
      }
      grouped[session.week].push(session);
    });
    return grouped;
  };

  const sessionsByWeek = groupSessionsByWeek();

  // Calcular estadísticas generales
  const totalDistance = workouts.reduce((sum, w) => sum + (w.distance || 0), 0);
  const totalWorkouts = workouts.length;
  const avgDistance = totalWorkouts > 0 ? Math.round(totalDistance / totalWorkouts) : 0;

  // Calcular estadísticas por grupo
  const group1Workouts = workouts.filter(w => String(w.group) === "1" || w.group === 1);
  const group2Workouts = workouts.filter(w => String(w.group) === "2" || w.group === 2);
  
  const group1Distance = group1Workouts.reduce((sum, w) => sum + (w.distance || 0), 0);
  const group1Count = group1Workouts.length;
  const group1Avg = group1Count > 0 ? Math.round(group1Distance / group1Count) : 0;
  
  const group2Distance = group2Workouts.reduce((sum, w) => sum + (w.distance || 0), 0);
  const group2Count = group2Workouts.length;
  const group2Avg = group2Count > 0 ? Math.round(group2Distance / group2Count) : 0;

  // Definir estadísticas de mesociclos
  const mesocicloStats = [
    {
      name: "Bloque 1",
      weeks: 4,
      dateRange: "9 Feb - 5 Mar 2026",
      description: "Fuerza, resistencia, técnica básica, virajes cortos y económicos",
      competition: "Copas Chile 1 - Velocidad",
      competitionDate: "12-13 Sep 2026",
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      name: "Bloque 2",
      weeks: 4,
      dateRange: "23 Mar - 19 Abr 2026",
      description: "Ritmo aeróbico, eficiencia técnica, control respiratorio, virajes largos y económicos",
      competition: "Copas Chile 2 - Fondo (800-1500m)",
      competitionDate: "17-19 Abr 2026",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      name: "Bloque 3",
      weeks: 4,
      dateRange: "20 Abr - 17 May 2026",
      description: "Ritmos de prueba, control de parciales, virajes rápidos, subacuático reglamentario",
      competition: "Copas Chile 3 - Medio Fondo (100-400m)",
      competitionDate: "15-17 May 2026",
      icon: CalendarDays,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      name: "Bloque 4",
      weeks: 6,
      dateRange: "18 May - 5 Jul 2026",
      description: "Consolidación técnica por estilo, ejecución bajo presión competitiva",
      competition: "Festival Menores (6-7 Jun) | Nacional Infantil (18-21 Jun) | Nacional Categorías (1-5 Jul)",
      competitionDate: "6 Jun - 5 Jul 2026",
      icon: Trophy,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      name: "Bloque 5",
      weeks: 6,
      dateRange: "6 Jul - 16 Ago 2026",
      description: "Volumen competitivo, experiencia multievento, estabilidad técnica",
      competition: "Internacional Brasil (20-26 Jul) | Nacional Desarrollo (13-16 Ago)",
      competitionDate: "20 Jul - 16 Ago 2026",
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      name: "Bloque 6",
      weeks: 4,
      dateRange: "17 Ago - 13 Sep 2026",
      description: "Salidas, break out, subacuático máximo reglamentario, velocidad pura (50m)",
      competition: "Copas Chile 1 - Velocidad",
      competitionDate: "12-13 Sep 2026",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      name: "Bloque 7",
      weeks: 3,
      dateRange: "14 Sep - 4 Oct 2026",
      description: "Resistencia aeróbica extendida, técnica económica, virajes eficientes",
      competition: "Copas Chile 2 - Fondo",
      competitionDate: "3-4 Oct 2026",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      name: "Bloque 8",
      weeks: 5,
      dateRange: "5 Oct - 8 Nov 2026",
      description: "Distancias competitivas medianas, ritmo controlado, resistencia específica",
      competition: "Copas Chile 3 - Medio Fondo",
      competitionDate: "6-8 Nov 2026",
      icon: CalendarDays,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      name: "Bloque 9",
      weeks: 9,
      dateRange: "9 Nov - 9 Ene 2027",
      description: "Base aeróbica, desarrollo técnico general, preparación física integral",
      competition: "Ninguna - Fase de Preparación",
      competitionDate: "N/A",
      icon: Target,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
    },
    {
      name: "Bloque 10",
      weeks: 4,
      dateRange: "10 Ene - 7 Feb 2027",
      description: "Afinamiento final, optimización de rendimiento, preparación mental competitiva",
      competition: "Nacional Apertura",
      competitionDate: "5-7 Feb 2027",
      icon: Trophy,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  ];

  // Calcular total de semanas en la temporada
  const totalWeeksInSeason = mesocicloStats.reduce((sum, bloque) => sum + bloque.weeks, 0);

  // Renderizado principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* Header */}
      <header className="bg-black text-white shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <div className="flex items-center justify-between gap-3 sm:gap-6 mb-3 sm:mb-4">
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="bg-white rounded-lg p-1.5 sm:p-2 shadow-md">
                <Logo className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold leading-tight">Club Natación Lo Prado</h1>
                <p className="text-red-400 text-sm sm:text-lg">Haz que todo sea posible</p>
              </div>
            </div>
            <UserMenu />
          </div>
          <div className="space-y-3 mt-4 sm:mt-6">
            {/* Temporada */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2 border border-white/20 w-full">
              <p className="text-xs sm:text-sm text-gray-300">Temporada 2026-2027</p>
              <p className="font-semibold text-sm sm:text-base">9 Feb 2026 - 7 Feb 2027</p>
            </div>

            {/* Estadísticas por Grupo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Grupo 1 */}
              <div className="bg-red-600/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-3 border border-red-400/40">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm sm:text-base font-bold text-red-100">👶 Grupo 1 - Menores</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-xs text-gray-300">Entrenamientos</p>
                    <p className="font-semibold text-sm sm:text-base">{group1Count}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-300">Dist. Total</p>
                    <p className="font-semibold text-sm sm:text-base">{(group1Distance / 1000).toFixed(1)} km</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-300">Promedio</p>
                    <p className="font-semibold text-sm sm:text-base">{group1Avg > 0 ? `${group1Avg}m` : 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Grupo 2 */}
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-3 border border-gray-600/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm sm:text-base font-bold text-gray-100">🏅 Grupo 2 - Mayores</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-xs text-gray-300">Entrenamientos</p>
                    <p className="font-semibold text-sm sm:text-base">{group2Count}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-300">Dist. Total</p>
                    <p className="font-semibold text-sm sm:text-base">{(group2Distance / 1000).toFixed(1)} km</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-300">Promedio</p>
                    <p className="font-semibold text-sm sm:text-base">{group2Avg > 0 ? `${group2Avg}m` : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Banner de Modo Offline - Solo si el backend está offline */}
      {typeof window !== 'undefined' && localStorage.getItem('backend_offline_mode') === 'true' && (
        <div className="bg-yellow-500 border-b-4 border-yellow-600">
          <div className="container mx-auto px-3 sm:px-4 py-3">
            <Alert className="bg-yellow-50 border-yellow-600">
              <AlertCircle className="h-5 w-5 text-yellow-800" />
              <AlertDescription className="text-yellow-900">
                <div className="space-y-2">
                  <p className="font-bold text-lg">⚠️ MODO OFFLINE ACTIVADO</p>
                  <p className="text-sm">
                    La aplicación está funcionando con datos locales porque el backend NO está configurado correctamente.
                  </p>
                  <p className="text-sm font-semibold">
                    ⚠️ LIMITACIONES: No se pueden crear nadadores, registrar asistencias ni guardar cambios en el servidor.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-yellow-100 border-yellow-600 hover:bg-yellow-200"
                      onClick={async () => {
                        // Verificar conexión al servidor
                        try {
                          const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc/health`, {
                            headers: { 'Authorization': `Bearer ${publicAnonKey}` }
                          });
                          
                          if (response.ok) {
                            // Servidor está OK, limpiar modo offline
                            localStorage.removeItem('backend_offline_mode');
                            alert('✅ Servidor conectado correctamente. Recargando aplicación...');
                            window.location.reload();
                          } else {
                            alert('❌ El servidor aún no está disponible. Verifica la configuración en Supabase Dashboard.');
                          }
                        } catch (error) {
                          alert('❌ No se pudo conectar al servidor. Verifica que las Edge Functions estén desplegadas.');
                        }
                      }}
                    >
                      🔄 Verificar Servidor y Salir
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-yellow-100 border-yellow-600 hover:bg-yellow-200"
                      onClick={() => {
                        localStorage.removeItem('backend_offline_mode');
                        window.location.reload();
                      }}
                    >
                      Salir Sin Verificar ⚠️
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* NAVEGACIÓN PRINCIPAL POR SECCIONES */}
        <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
          <TabsList className={`grid w-full ${user?.role === "admin" ? "grid-cols-5 sm:grid-cols-12" : "grid-cols-5 sm:grid-cols-9"} mb-4 sm:mb-8 h-auto gap-1`}>
            <TabsTrigger value="entrenamientos" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden lg:inline">Entrenamientos</span>
              <span className="lg:hidden">Entrenos</span>
            </TabsTrigger>
            <TabsTrigger value="preparacion-fisica" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden lg:inline">Prep. Física</span>
              <span className="lg:hidden">Física</span>
            </TabsTrigger>
            <TabsTrigger value="calendario" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Calendario</span>
            </TabsTrigger>
            <TabsTrigger value="nadadores" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Nadadores</span>
            </TabsTrigger>
            <TabsTrigger value="competencias" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <Medal className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden lg:inline">Competencias</span>
              <span className="lg:hidden">Compet.</span>
            </TabsTrigger>
            <TabsTrigger value="test-control" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <Clipboard className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden lg:inline">Test Control</span>
              <span className="lg:hidden">Tests</span>
            </TabsTrigger>
            <TabsTrigger value="records" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Récords</span>
            </TabsTrigger>
            <TabsTrigger value="logros" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <Award className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Logros</span>
            </TabsTrigger>
            <TabsTrigger value="asistencia" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Asistencia</span>
            </TabsTrigger>
            {/* Pestañas Admin - Solo para Administradores */}
            {user?.role === "admin" && (
              <>
                <TabsTrigger value="usuarios" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Usuarios</span>
                </TabsTrigger>
              </>
            )}
          </TabsList>

          {/* SECCIÓN 1: ENTRENAMIENTOS Y COMPETENCIAS */}
          <TabsContent value="entrenamientos" className="space-y-8">
            {/* Selector de Grupo de Temporada */}
            <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="w-full sm:w-auto">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
                      <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
                      <span className="break-words">Estructura Temporada 2026-2027</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 break-words">
                      Selecciona el grupo para ver su planificación específica
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button
                      variant={selectedSeasonGroup === "group1" ? "default" : "outline"}
                      onClick={() => setSelectedSeasonGroup("group1")}
                      className="gap-2 w-full sm:w-auto justify-start sm:justify-center text-sm"
                    >
                      <Users className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1 sm:flex-none text-left sm:text-center">Grupo 1 (Menores)</span>
                      <span className="text-xs opacity-75 flex-shrink-0">({totalWeeksInSeason} sem)</span>
                    </Button>
                    <Button
                      variant={selectedSeasonGroup === "group2" ? "default" : "outline"}
                      onClick={() => setSelectedSeasonGroup("group2")}
                      className="gap-2 w-full sm:w-auto justify-start sm:justify-center text-sm"
                    >
                      <Users className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1 sm:flex-none text-left sm:text-center">Grupo 2 (Mayores)</span>
                      <span className="text-xs opacity-75 flex-shrink-0">({totalWeeksInSeason} sem)</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {workouts.length === 0 && (
              <Alert className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300">
                <Info className="h-5 w-5 text-yellow-600" />
                <AlertDescription>
                  <div>
                    <p className="font-semibold text-yellow-900 mb-1">
                      ⚠️ No hay entrenamientos en la base de datos
                    </p>
                    <p className="text-sm text-yellow-800 mb-3">
                      Para comenzar, necesitas agregar entrenamientos manualmente.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Planificación de Bloques */}
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                <div className="w-full sm:w-auto">
                  <h2 className="text-xl sm:text-2xl font-bold break-words">
                    {selectedSeasonGroup === "group1" ? "Grupo 1: Menores (E-D-C-A)" : "Grupo 2: Mayores (Inf B - Juvenil - Mayores)"}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mt-1 break-words">
                    📊 Haz clic en cada bloque para ver sus entrenamientos · Temporada 2026-2027
                  </p>
                </div>
              </div>
              
              {/* Botón para ver información detallada */}
              <div className="mb-6">
                <Button
                  variant={showStructureInfo ? "default" : "outline"}
                  onClick={() => setShowStructureInfo(!showStructureInfo)}
                  className="w-full gap-2 h-auto py-3 justify-between bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-blue-300 text-blue-900"
                >
                  <div className="flex items-center gap-2">
                    <InfoIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-semibold">Información del Grupo</span>
                  </div>
                  {showStructureInfo ? (
                    <ChevronUp className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 flex-shrink-0" />
                  )}
                </Button>
              </div>
              
              {/* Información detallada de la estructura */}
              {showStructureInfo && (
                <div className="mb-6 animate-in slide-in-from-top duration-300">
                  <SeasonStructureInfo selectedGroup={selectedSeasonGroup} />
                </div>
              )}
              
              {/* Tarjetas simples de bloques con estadísticas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {mesocicloStats.map((mesociclo) => {
                  const Icon = mesociclo.icon;
                  // Calcular entrenamientos de este bloque
                  const bloqueWorkouts = allSessions.filter(s => {
                    const matchesMesociclo = s.mesociclo === mesociclo.name;
                    const groupNumber = selectedSeasonGroup === "group1" ? 1 : 2;
                    const matchesGroup = String(s.group) === String(groupNumber);
                    
                    // Debug: Log solo para el primer bloque
                    if (mesociclo.name === "Bloque 1" && matchesMesociclo) {
                      console.log(`🔍 ${mesociclo.name} - Session group: "${s.group}" (${typeof s.group}), Expected: "${groupNumber}" (${typeof groupNumber}), Match: ${matchesGroup}`);
                    }
                    
                    return matchesMesociclo && matchesGroup;
                  });
                  const totalDistance = bloqueWorkouts.reduce((sum, s) => sum + s.distance, 0);
                  
                  return (
                    <Card 
                      key={mesociclo.name} 
                      className={`${mesociclo.borderColor || 'border-gray-200'} ${mesociclo.bgColor || ''} cursor-pointer hover:shadow-lg transition-all hover:scale-105`}
                      onClick={() => setSelectedBloque(mesociclo.name)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <Icon className={`w-6 h-6 ${mesociclo.color}`} />
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{mesociclo.name}</h3>
                            {mesociclo.dateRange && (
                              <p className="text-xs text-gray-500 mb-1">
                                📅 {mesociclo.dateRange}
                              </p>
                            )}
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {mesociclo.description}
                            </p>
                            {mesociclo.competition && (
                              <div className="mb-2 p-2 bg-white rounded border border-red-200">
                                <p className="text-xs font-semibold text-red-600 mb-0.5 line-clamp-1">
                                  🏆 {mesociclo.competition}
                                </p>
                                {mesociclo.competitionDate && (
                                  <p className="text-xs text-gray-500">
                                    {mesociclo.competitionDate}
                                  </p>
                                )}
                              </div>
                            )}
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="text-xs">
                                {mesociclo.weeks} semanas
                              </Badge>
                              <Badge variant="outline" className="text-xs bg-red-100 text-red-700 border-red-300">
                                {bloqueWorkouts.length} entrenamientos
                              </Badge>
                              {totalDistance > 0 && (
                                <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-300">
                                  {(totalDistance / 1000).toFixed(1)} km
                                </Badge>
                              )}
                            </div>
                            {bloqueWorkouts.length > 0 && (
                              <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                                <span>Ver entrenamientos</span>
                                <ChevronRight className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
            
            {/* Diálogo para mostrar entrenamientos del bloque */}
            <Dialog open={selectedBloque !== null} onOpenChange={(open) => !open && setSelectedBloque(null)}>
                <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                      {selectedBloque && (() => {
                        const bloque = mesocicloStats.find(m => m.name === selectedBloque);
                        const Icon = bloque?.icon || Target;
                        return (
                          <>
                            <Icon className={`w-7 h-7 ${bloque?.color || 'text-gray-600'}`} />
                            {selectedBloque}
                          </>
                        );
                      })()}
                    </DialogTitle>
                    <DialogDescription>
                      {selectedBloque && mesocicloStats.find(m => m.name === selectedBloque)?.description}
                    </DialogDescription>
                  </DialogHeader>

                  {selectedBloque && (() => {
                    const bloqueWorkouts = allSessions.filter(s => {
                      const matchesMesociclo = s.mesociclo === selectedBloque;
                      const groupNumber = selectedSeasonGroup === "group1" ? 1 : 2;
                      const matchesGroup = String(s.group) === String(groupNumber);
                      return matchesMesociclo && matchesGroup;
                    });

                    if (bloqueWorkouts.length === 0) {
                      return (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                          <p className="text-gray-600 font-semibold mb-2">
                            No hay entrenamientos en este bloque
                          </p>
                          <p className="text-sm text-gray-500">
                            Crea entrenamientos asignándolos a "{selectedBloque}" en el gestor de entrenamientos.
                          </p>
                        </div>
                      );
                    }

                    // Agrupar por fecha
                    const workoutsByDate: { [key: string]: typeof bloqueWorkouts } = {};
                    bloqueWorkouts.forEach((workout) => {
                      if (!workoutsByDate[workout.date]) {
                        workoutsByDate[workout.date] = [];
                      }
                      workoutsByDate[workout.date].push(workout);
                    });

                    return (
                      <div className="space-y-4 mt-4">
                        {/* Estadísticas del bloque */}
                        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                          <CardContent className="pt-4">
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div>
                                <p className="text-sm text-gray-600">Entrenamientos</p>
                                <p className="text-2xl font-bold">{bloqueWorkouts.length}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Distancia Total</p>
                                <p className="text-2xl font-bold">
                                  {(bloqueWorkouts.reduce((sum, w) => sum + w.distance, 0) / 1000).toFixed(1)} km
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Promedio/Sesión</p>
                                <p className="text-2xl font-bold">
                                  {Math.round(bloqueWorkouts.reduce((sum, w) => sum + w.distance, 0) / bloqueWorkouts.length)}m
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Lista de entrenamientos agrupados por fecha */}
                        <div className="space-y-3">
                          {Object.entries(workoutsByDate)
                            .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
                            .map(([date, workouts]) => (
                              <div key={date} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                                <div className="font-semibold text-lg mb-3 flex items-center gap-2">
                                  <span>{workouts[0]?.day}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {date}
                                  </Badge>
                                </div>
                                <div className="space-y-2">
                                  {workouts.map((workout, idx) => (
                                    <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                                      <div className="flex items-start justify-between mb-2 gap-3">
                                        <div className="flex items-center gap-2 flex-wrap flex-1">
                                          {workout.schedule && (
                                            <Badge className="text-xs bg-blue-100 text-blue-700">
                                              {workout.schedule === "AM" ? "🌅 AM" : "🌆 PM"}
                                            </Badge>
                                          )}
                                          <Badge className={`text-xs ${
                                            String(workout.group) === "1" ? "bg-purple-100 text-purple-700" :
                                            "bg-green-100 text-green-700"
                                          }`}>
                                            {String(workout.group) === "1" ? "👶 Grupo 1" : "🏅 Grupo 2"}
                                          </Badge>
                                          <Badge variant="outline" className="text-xs">
                                            {workout.distance}m
                                          </Badge>
                                          <Badge variant="outline" className="text-xs">
                                            {workout.intensity}
                                          </Badge>
                                          {workout.focus && (
                                            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-300">
                                              {workout.focus}
                                            </Badge>
                                          )}
                                        </div>
                                        <div className="flex gap-1 flex-shrink-0">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-7 px-2"
                                            onClick={() => setSelectedWorkout(workout)}
                                          >
                                            <Eye className="w-3 h-3 mr-1" />
                                            Ver
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-7 px-2 hover:bg-red-50"
                                            onClick={() => generateWorkoutPDF(workout)}
                                          >
                                            <Download className="w-3 h-3 mr-1" />
                                            PDF
                                          </Button>
                                        </div>
                                      </div>
                                      {workout.focus && (
                                        <p className="text-xs text-gray-500 mt-2">
                                          🎯 Enfoque: {workout.focus}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    );
                  })()}
                </DialogContent>
              </Dialog>

            {/* Diálogo para visualizar entrenamiento completo */}
            <Dialog open={selectedWorkout !== null} onOpenChange={(open) => !open && setSelectedWorkout(null)}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>Entrenamiento Completo</span>
                    {selectedWorkout && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:bg-red-50"
                        onClick={() => generateWorkoutPDF(selectedWorkout)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Descargar PDF
                      </Button>
                    )}
                  </DialogTitle>
                  <DialogDescription>
                    Detalle completo del plan de entrenamiento
                  </DialogDescription>
                </DialogHeader>

                {selectedWorkout && (
                  <div className="space-y-4">
                    {/* Información General */}
                    <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Fecha</p>
                            <p className="font-semibold">{selectedWorkout.date}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Día</p>
                            <p className="font-semibold">{selectedWorkout.day}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Horario</p>
                            <Badge className="text-xs bg-blue-100 text-blue-700">
                              {selectedWorkout.schedule === "AM" ? "🌅 Mañana" : "🌆 Tarde"}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Grupo</p>
                            <Badge className={`text-xs ${
                              String(selectedWorkout.group) === "1" ? "bg-purple-100 text-purple-700" :
                              "bg-green-100 text-green-700"
                            }`}>
                              {String(selectedWorkout.group) === "1" ? "👶 Grupo 1" : "🏅 Grupo 2"}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Bloque</p>
                            <p className="font-semibold text-sm">{selectedWorkout.mesociclo}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Distancia</p>
                            <p className="font-semibold text-red-600">{selectedWorkout.distance}m</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Duración</p>
                            <p className="font-semibold">{selectedWorkout.duration} min</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Intensidad</p>
                            <Badge variant="outline">{selectedWorkout.intensity}</Badge>
                          </div>
                        </div>
                        {selectedWorkout.focus && (
                          <div className="mt-4">
                            <p className="text-xs text-gray-600 mb-1">Enfoque</p>
                            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
                              🎯 {selectedWorkout.focus}
                            </Badge>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Calentamiento */}
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-1 h-6 bg-red-600 rounded"></div>
                          <h3 className="font-bold text-lg">Calentamiento</h3>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-line">
                          {selectedWorkout.warmup}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Serie Principal */}
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-1 h-6 bg-red-600 rounded"></div>
                          <h3 className="font-bold text-lg">Serie Principal</h3>
                        </div>
                        <div className="space-y-2">
                          {selectedWorkout.mainSet.map((set, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm">
                                <span className="font-semibold text-red-600 mr-2">{index + 1}.</span>
                                {set}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Enfriamiento */}
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-1 h-6 bg-red-600 rounded"></div>
                          <h3 className="font-bold text-lg">Enfriamiento</h3>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-line">
                          {selectedWorkout.cooldown}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* Gestión de Entrenamientos (solo para admins/coaches) */}
            {(user?.role === "admin" || user?.role === "coach") && (
              <div className="space-y-4">
                {/* Indicador de Grupo Activo con Selector de Bloque Rápido */}
                <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
                  <CardContent className="pt-4 space-y-3">
                    <p className="text-sm font-semibold text-gray-700">
                      📝 Gestionando entrenamientos de: <span className="text-red-600">
                        {selectedSeasonGroup === "group1" ? "Grupo 1 - Menores (E-D-C-A)" : "Grupo 2 - Mayores (Inf B - Juvenil - Mayores)"}
                      </span>
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <CalendarDays className="w-4 h-4 text-red-600" />
                      <span>Los bloques de arriba muestran estadísticas de entrenamientos creados</span>
                    </div>
                  </CardContent>
                </Card>

                <WorkoutManager
                  key={selectedSeasonGroup}
                  workouts={workouts.filter(w => {
                    if (selectedSeasonGroup === "group1") {
                      return w.group === "1" || w.group === 1;
                    } else {
                      return w.group === "2" || w.group === 2;
                    }
                  })}
                  onAddWorkout={handleAddWorkout}
                  onEditWorkout={handleEditWorkout}
                  onDeleteWorkout={handleDeleteWorkout}
                  defaultGroup={selectedSeasonGroup === "group1" ? 1 : 2}
                />

                {/* Gestión de Días Feriados */}
                <HolidayManager
                  holidays={holidays}
                  onAddHoliday={handleAddHoliday}
                  onEditHoliday={handleEditHoliday}
                  onDeleteHoliday={handleDeleteHoliday}
                />

                {/* Papelera de Reciclaje */}
                <TrashManager />
              </div>
            )}

            {/* Botón para ver estadísticas de entrenamiento */}
            <div className="mb-6">
              <Button
                variant={showTrainingStats ? "default" : "outline"}
                onClick={() => setShowTrainingStats(!showTrainingStats)}
                className="w-full gap-2 h-auto py-3 justify-between bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-green-300 text-green-900"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-semibold">Ver Estadísticas de Entrenamiento</span>
                </div>
                {showTrainingStats ? (
                  <ChevronUp className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                )}
              </Button>
            </div>

            {/* Estadísticas de Entrenamiento */}
            {showTrainingStats && (
              <div className="space-y-6 animate-in slide-in-from-top duration-300">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Sincronización de Tendencia de Volumen</h2>
                  <VolumeTrendSync workouts={workouts} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">Análisis de Volumen de Entrenamiento por Bloques</h2>
                  <TrainingVolumeBloqueCharts sessions={allSessions} />
                </div>
              </div>
            )}
          </TabsContent>

          {/* SECCIÓN 2: PREPARACIÓN FÍSICA */}
          <TabsContent value="preparacion-fisica" className="space-y-8">
            <PhysicalPreparation
              testControls={testControls}
              testResults={testResults}
              swimmers={swimmers}
              onAddTestControl={handleAddTestControl}
              onEditTestControl={handleEditTestControl}
              onDeleteTestControl={handleDeleteTestControl}
              onAddTestResult={handleAddTestResult}
              onEditTestResult={handleEditTestResult}
              onDeleteTestResult={handleDeleteTestResult}
            />
          </TabsContent>

          {/* SECCIÓN 3: CALENDARIO */}
          <TabsContent value="calendario" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Calendario Integrado</h2>
              <IntegratedCalendar
                workouts={workouts}
                competitions={competitions}
                holidays={holidays}
                testControls={testControls}
              />
            </div>
          </TabsContent>

          {/* SECCIÓN 4: NADADORES */}
          <TabsContent value="nadadores" className="space-y-8">
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Nadadores del Club</h2>
                  <p className="text-gray-600">{filteredSwimmers.length} nadadores registrados</p>
                </div>
                {(user?.role === "admin" || user?.role === "coach") && (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <AddSwimmerDialog onAddSwimmer={handleAddSwimmer} />
                    <Button
                      variant="outline"
                      onClick={async () => {
                        try {
                          await generateAllSwimmersPDF(swimmers);
                        } catch (error) {
                          console.error('Error generating PDF:', error);
                          alert('Error al generar el PDF');
                        }
                      }}
                      className="gap-2"
                    >
                      <FileDown className="w-4 h-4" />
                      <span className="hidden sm:inline">Exportar PDF</span>
                      <span className="sm:hidden">PDF</span>
                    </Button>
                  </div>
                )}
              </div>

              {/* Filtros */}
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">Género</label>
                      <Select value={filterGender} onValueChange={setFilterGender}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="M">Masculino</SelectItem>
                          <SelectItem value="F">Femenino</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">Categoría</label>
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          {uniqueCategories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">Grupo</label>
                      <GroupFilterSelector
                        value={filterGroup}
                        onChange={setFilterGroup}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Estadísticas */}
              <SwimmersStats swimmers={filteredSwimmers} />

              {/* Lista de nadadores */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {filteredSwimmers.map((swimmer) => (
                  <SwimmerListItem
                    key={swimmer.id}
                    swimmer={swimmer}
                    onClick={() => {
                      setSelectedSwimmer(swimmer);
                      setSwimmerDialogOpen(true);
                    }}
                  />
                ))}
              </div>

              {/* Dialog de detalles del nadador */}
              {selectedSwimmer && (
                <SwimmerDetailsDialog
                  swimmer={selectedSwimmer}
                  open={swimmerDialogOpen}
                  onOpenChange={setSwimmerDialogOpen}
                  onEdit={handleEditSwimmer}
                  onDelete={handleDeleteSwimmer}
                  onSavePersonalBests={handleSavePersonalBests}
                  onUpdateGoals={handleUpdateGoals}
                  competitions={competitions}
                  swimmerCompetitions={swimmerCompetitions}
                  canEdit={user?.role === "admin" || user?.role === "coach"}
                  attendanceRecords={attendanceRecords}
                />
              )}
            </div>

            {/* Vista de Tiempos Mínimos */}
            {currentSwimmer && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Mis Tiempos vs Mínimos</h2>
                <SwimmerMinimumTimesView swimmer={currentSwimmer} />
              </div>
            )}

            {/* Tabla de Referencia de Tiempos Mínimos */}
            {(user?.role === "admin" || user?.role === "coach") && (
              <div className="mt-8">
                <MinimumTimesReference />
              </div>
            )}

            {/* Verificador de Tiempos Mínimos (Solo Admin/Coach) */}
            {(user?.role === "admin" || user?.role === "coach") && (
              <div className="mt-8">
                <MinimumTimesChecker swimmers={swimmers} />
              </div>
            )}
          </TabsContent>

          {/* SECCIÓN 5: COMPETENCIAS */}
          <TabsContent value="competencias" className="space-y-8">
            {/* Gestión de Competencias (Solo Admin/Coach) */}
            {(user?.role === "admin" || user?.role === "coach") && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Gestión de Competencias</h2>
                <CompetitionManager
                  competitions={competitions}
                  swimmers={swimmers}
                  swimmerCompetitions={swimmerCompetitions}
                  onAddCompetition={handleAddCompetition}
                  onEditCompetition={handleEditCompetition}
                  onDeleteCompetition={handleDeleteCompetition}
                  onToggleParticipation={handleToggleCompetitionParticipation}
                />
              </div>
            )}

            {/* Resultados de Competencias (Para todos) */}
            <div>
              <h2 className="text-2xl font-bold mb-4">
                {user?.role === "swimmer" ? "Mis Competencias" : "Resultados de Competencias"}
              </h2>
              <CompetitionResults
                competitions={competitions}
                swimmers={swimmers}
                swimmerCompetitions={swimmerCompetitions}
                onUpdateResults={handleUpdateCompetitionResults}
                currentSwimmerId={currentSwimmer?.id}
              />
            </div>
          </TabsContent>

          {/* SECCIÓN 6: TEST CONTROL */}
          <TabsContent value="test-control" className="space-y-8">
            <TestControlManager
              testControls={testControls}
              testResults={testResults}
              swimmers={swimmers}
              onAddTestControl={handleAddTestControl}
              onEditTestControl={handleEditTestControl}
              onDeleteTestControl={handleDeleteTestControl}
              onAddTestResult={handleAddTestResult}
              onEditTestResult={handleEditTestResult}
              onDeleteTestResult={handleDeleteTestResult}
            />
          </TabsContent>

          {/* SECCIÓN 7: RÉCORDS DEL EQUIPO */}
          <TabsContent value="records" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Récords del Equipo</h2>
              <TeamRecordsBoard swimmers={swimmers} />
            </div>
          </TabsContent>

          {/* SECCIÓN 8: LOGROS Y MEDALLAS */}
          <TabsContent value="logros" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Logros y Medallas</h2>
              <AchievementsBoard
                swimmers={swimmers}
                swimmerCompetitions={swimmerCompetitions}
                competitions={competitions}
                attendanceRecords={attendanceRecords}
              />
            </div>
          </TabsContent>

          {/* SECCIÓN 9: ASISTENCIA */}
          <TabsContent value="asistencia" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Control de Asistencia</h2>
              <AttendanceManager swimmers={swimmers} workouts={workouts} />
            </div>
          </TabsContent>

          {/* SECCIÓN 10: GESTIÓN DE USUARIOS (Solo Admin) */}
          {user?.role === "admin" && (
            <TabsContent value="usuarios" className="space-y-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Gestión de Usuarios</h2>
                  <p className="text-gray-600 mb-6">
                    Administra las solicitudes de acceso al sistema. Los usuarios se crean automáticamente al aprobar sus solicitudes.
                  </p>
                  <PasswordRequestsManager />
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>

        {/* PWA Installer */}
        <PWAInstaller />
      </div>

      {/* Toaster for notifications */}
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ProtectedRoute>
          <MainApp />
        </ProtectedRoute>
      </AuthProvider>
    </ErrorBoundary>
  );
}