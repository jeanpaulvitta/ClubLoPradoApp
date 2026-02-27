// Main application component with authentication
import React, { useState, useEffect, useMemo } from "react";
import { Toaster } from "@/app/components/ui/sonner";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
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
import { MesocicloDialog } from "@/app/components/MesocicloDialog";

import { TrainingVolumeBloqueCharts } from "@/app/components/TrainingVolumeBloqueCharts";
import { TrainingStats } from "@/app/components/TrainingStats";
import { VolumeTrendSync } from "@/app/components/VolumeTrendSync";
import { IntegratedCalendar } from "@/app/components/IntegratedCalendar";
import { TeamRecordsBoard } from "@/app/components/TeamRecordsBoard";
import { AchievementsBoard } from "@/app/components/AchievementsBoard";
import { AttendanceManager } from "@/app/components/AttendanceManager";
import { TestControlManager } from "@/app/components/TestControlManager";
import { UserManager } from "@/app/components/UserManager";
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
  Info as InfoIcon,
  Activity,
  Upload,
  Info,
  CheckCircle
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
          group: w.group
        })));
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

  // Lista de sesiones de entrenamientos (sin desafíos)
  const allSessions = [
    // Mapear todos los entrenamientos (sin filtros restrictivos)
    ...workouts
      .filter(w => !w.deleted) // Solo excluir los explícitamente eliminados
      .map((w, idx) => ({ 
        ...w, 
        type: 'workout' as const,
        mesociclo: w.bloque || w.mesociclo || "Bloque 1", // Mapear bloque a mesociclo
        // Si week no existe, calcularlo basado en el índice (3 entrenamientos por semana)
        week: w.week || Math.floor(idx / 3) + 1
      }))
  ];

  // Debug: Log para verificar entrenamientos
  console.log("🏊 Entrenamientos procesados:", {
    totalWorkouts: workouts.length,
    afterFilter: allSessions.length,
    sample: allSessions.slice(0, 3).map(s => ({ 
      bloque: s.mesociclo, 
      week: s.week, 
      day: s.day,
      distance: s.distance 
    }))
  });

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

  // Calcular estadísticas
  const totalDistance = workouts.reduce((sum, w) => sum + w.distance, 0);
  const totalWorkouts = workouts.length;
  const avgDistance = totalWorkouts > 0 ? Math.round(totalDistance / totalWorkouts) : 0;

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
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 mt-4 sm:mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-2 sm:px-4 py-1.5 sm:py-2 border border-white/20">
              <p className="text-xs sm:text-sm text-gray-300">Temporada 2026-2027</p>
              <p className="font-semibold text-xs sm:text-base">9 Feb 2026 - 7 Feb 2027</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-2 sm:px-4 py-1.5 sm:py-2 border border-white/20">
              <p className="text-xs sm:text-sm text-gray-300">Entrenamientos</p>
              <p className="font-semibold text-xs sm:text-base">{totalWorkouts} sesiones</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-2 sm:px-4 py-1.5 sm:py-2 border border-white/20">
              <p className="text-xs sm:text-sm text-gray-300">Distancia Total</p>
              <p className="font-semibold text-xs sm:text-base">{(totalDistance / 1000).toFixed(1)} km</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-2 sm:px-4 py-1.5 sm:py-2 border border-white/20">
              <p className="text-xs sm:text-sm text-gray-300">Promedio por Sesión</p>
              <p className="font-semibold text-xs sm:text-base">{avgDistance > 0 ? `${avgDistance} m` : 'N/A'}</p>
            </div>
          </div>
        </div>
      </header>

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

            {/* Alerta de Estado de Entrenamientos */}
            {workouts.length > 0 && (
              <Alert className="bg-gradient-to-r from-green-50 to-blue-50 border-green-300">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <AlertDescription>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-green-900 mb-1">
                        ✅ Sistema de Entrenamientos Activo
                      </p>
                      <p className="text-sm text-green-800">
                        📊 {workouts.length} entrenamientos cargados en la base de datos
                        {workouts.filter(w => w.bloque || w.mesociclo).length > 0 && (
                          <span className="ml-2">
                            • {workouts.filter(w => w.bloque || w.mesociclo).length} con bloque asignado
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

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
                    10 Bloques · {totalWeeksInSeason} semanas · Haz clic en cada bloque para ver detalles
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {mesocicloStats.map((mesociclo) => (
                  <MesocicloDialog
                    key={mesociclo.name}
                    mesociclo={mesociclo}
                    sessions={allSessions}
                    selectedGroup={selectedSeasonGroup}
                  />
                ))}
              </div>
            </div>

            {/* Gestión de Entrenamientos (solo para admins/coaches) */}
            {(user?.role === "admin" || user?.role === "coach") && (
              <div className="space-y-4">
                {/* Indicador de Grupo Activo */}
                <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
                  <CardContent className="pt-4">
                    <p className="text-sm font-semibold text-gray-700">
                      📝 Gestionando entrenamientos de: <span className="text-red-600">
                        {selectedSeasonGroup === "group1" ? "Grupo 1 - Menores (E-D-C-A)" : "Grupo 2 - Mayores (Inf B - Juvenil - Mayores)"}
                      </span>
                    </p>
                  </CardContent>
                </Card>

                <WorkoutManager
                  key={selectedSeasonGroup}
                  workouts={workouts.filter(w => {
                    if (selectedSeasonGroup === "group1") {
                      return w.group === "1" || w.group === 1 || w.group === "Ambos";
                    } else {
                      return w.group === "2" || w.group === 2 || w.group === "Ambos";
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
            <TabsContent value="usuarios" className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>
                <UserManager swimmers={swimmers} onSwimmerUpdate={loadData} />
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