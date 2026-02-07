// Main application component with authentication
import React, { useState, useEffect, useMemo } from "react";
import { Toaster } from "@/app/components/ui/sonner";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { AuthProvider, useAuth } from "@/app/contexts/AuthContext";
import { ProtectedRoute } from "@/app/components/ProtectedRoute";
import { ErrorBoundary } from "@/app/components/ErrorBoundary";
import { UserMenu } from "@/app/components/UserMenu";
import { MigrationBanner } from "@/app/components/MigrationBanner";
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
import { GroupMesocicloManager } from "@/app/components/GroupMesocicloManager";
import { TrainingVolumeCharts } from "@/app/components/TrainingVolumeCharts";
import { TrainingStats } from "@/app/components/TrainingStats";
import { IntegratedCalendar } from "@/app/components/IntegratedCalendar";
import { TeamRecordsBoard } from "@/app/components/TeamRecordsBoard";
import { AchievementsBoard } from "@/app/components/AchievementsBoard";
import { AttendanceManager } from "@/app/components/AttendanceManager";
import { TestControlManager } from "@/app/components/TestControlManager";
import { UserManager } from "@/app/components/UserManager";
import { MinimumTimesChecker } from "@/app/components/MinimumTimesChecker";
import { SwimmerMinimumTimesView } from "@/app/components/SwimmerMinimumTimesView";
import { MinimumTimesReference } from "@/app/components/MinimumTimesReference";
import { GroupStatistics } from "@/app/components/GroupStatistics";
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
  Activity
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
import * as api from "@/app/services/apiWithFallback";
import { isTeamRecord } from "@/app/utils/recordsUtils";
import { calculateAge, calculateCategoryFromBirthDate, getTrainingGroupFromBirthDate } from "@/app/utils/swimmerUtils";
// Logo para Vercel deployment
const logo = "/logo.svg";

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
      alert(`Error al actualizar entrenamiento: ${errorMsg}`);
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
      
      // En caso de error, recargar para sincronizar
      try {
        const fresh = await api.fetchTestControls();
        setTestControls(fresh);
      } catch (reloadErr) {
        console.error("❌ Error recargando después de fallo:", reloadErr);
      }
    }
  };

  const handleEditTestControl = async (testControl: TestControl) => {
    try {
      console.log('✅ App: Test control updated from child component:', testControl.id);
      
      // Solo actualizar el estado con el test control ya actualizado
      setTestControls(testControls.map(tc => tc.id === testControl.id ? testControl : tc));
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      alert(`Error al actualizar test control: ${errorMsg}`);
      console.error("❌ Error al actualizar test control:", err);
      
      // En caso de error, recargar para sincronizar
      try {
        const fresh = await api.fetchTestControls();
        setTestControls(fresh);
      } catch (reloadErr) {
        console.error('❌ Error recargando:', reloadErr);
      }
    }
  };

  const handleDeleteTestControl = async (id: string) => {
    try {
      // Eliminar directamente del servidor
      await api.deleteTestControl(id);
      
      // Actualizar el estado local inmediatamente
      setTestControls(prev => prev.filter(tc => tc.id !== id));
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      
      // Si hay un error 404, significa que ya fue eliminado - actualizar estado silenciosamente sin log
      if (errorMsg.toLowerCase().includes('404') || errorMsg.toLowerCase().includes('not found')) {
        setTestControls(prev => prev.filter(tc => tc.id !== id));
        return; // Salir sin mostrar alerta ni ningún mensaje
      }
      
      // Para otros errores, mostrar log de error, alerta e intentar sincronizar
      console.error('❌ Error al eliminar test control:', errorMsg);
      alert(`❌ Error al eliminar test control: ${errorMsg}`);
      
      try {
        const fresh = await api.fetchTestControls();
        setTestControls(fresh);
      } catch (reloadErr) {
        console.error('❌ Error recargando:', reloadErr);
      }
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

  // Función de sincronización para test controls y results
  const handleSyncTestData = async () => {
    try {
      console.log("🔄 Sincronizando datos de test controls...");
      const [freshTestControls, freshTestResults] = await Promise.all([
        api.fetchTestControls(),
        api.fetchTestResults()
      ]);
      setTestControls(freshTestControls);
      setTestResults(freshTestResults);
      console.log("✅ Datos sincronizados:", {
        testControls: freshTestControls.length,
        testResults: freshTestResults.length
      });
    } catch (err) {
      console.error("❌ Error sincronizando datos:", err);
      throw err;
    }
  };

  // Lista de sesiones de entrenamientos (sin desafíos)
  const allSessions = [
    // Filtrar entrenamientos de sábado (solo quedan Lunes, Miércoles, Viernes)
    ...workouts
      .filter(w => w.day !== "Sábado")
      .map((w, idx) => ({ 
        ...w, 
        type: 'workout' as const,
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

  // Calcular estadísticas
  const totalDistance = workouts.reduce((sum, w) => sum + w.distance, 0);
  const totalWorkouts = workouts.length;
  const avgDistance = totalWorkouts > 0 ? Math.round(totalDistance / totalWorkouts) : 0;

  // Estructura de temporada 2026-2027 - 10 BLOQUES
  // Inicio: 9 de febrero 2026
  const bloqueTemporada = [
    {
      name: "Bloque 1",
      weeks: 6,
      dateRange: "9 Feb - 22 Mar 2026",
      description: "Salidas, reacción, subacuático inicial, frecuencia de brazada alta, patada explosiva, posición hidrodinámica",
      competition: "Copas Chile 1 - Velocidad (50m)",
      competitionDate: "21-22 Mar 2026",
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
      weeks: 4,
      dateRange: "14 Sep - 4 Oct 2026",
      description: "Sostener ritmos altos, eficiencia técnica, control de virajes y respiración",
      competition: "Copas Chile 2 - Fondo",
      competitionDate: "2-4 Oct 2026",
      icon: CalendarDays,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      name: "Bloque 8",
      weeks: 5,
      dateRange: "5 Oct - 8 Nov 2026",
      description: "Economía de nado, control técnico en acumulación de pruebas",
      competition: "Copas Chile 3 - Medio Fondo",
      competitionDate: "6-8 Nov 2026",
      icon: Trophy,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      name: "Bloque 9",
      weeks: 9,
      dateRange: "9 Nov 2026 - 9 Ene 2027",
      description: "Reforzamiento técnico general, ajustes individuales. Preparación Nacionales Verano 2027",
      competition: "Preparación Campeonatos",
      competitionDate: "Nov-Dic 2026",
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      name: "Bloque 10",
      weeks: 4,
      dateRange: "10 Ene - 7 Feb 2027",
      description: "Pico competitivo, ejecución técnica óptima, control emocional",
      competition: "Festival Menores (9-10 Ene) | Nacional Desarrollo (14-17 Ene) | Nacional Infantil (21-24 Ene)",
      competitionDate: "9 Ene - 7 Feb 2027",
      icon: Trophy,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  ];

  // Usar la estructura de bloques (sin división por grupos)
  const mesocicloStats = bloqueTemporada;
  const totalWeeksInSeason = mesocicloStats.reduce((sum, m) => sum + m.weeks, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* Header */}
      <header className="bg-black text-white shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <div className="flex items-center justify-between gap-3 sm:gap-6 mb-3 sm:mb-4">
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="bg-white rounded-lg p-1.5 sm:p-2 shadow-md">
                <img
                  src={logo}
                  alt="Club Natación Lo Prado Logo"
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                />
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

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* NAVEGACIÓN PRINCIPAL POR SECCIONES */}
        <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
          <TabsList className={`grid w-full ${user?.role === "admin" ? "grid-cols-5 sm:grid-cols-10" : "grid-cols-5 sm:grid-cols-9"} mb-4 sm:mb-8 h-auto gap-1`}>
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
            {/* Pestaña de Usuarios - Solo para Administradores */}
            {user?.role === "admin" && (
              <TabsTrigger value="usuarios" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Usuarios</span>
              </TabsTrigger>
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
                <WorkoutManager
                  workouts={workouts}
                  onAddWorkout={handleAddWorkout}
                  onEditWorkout={handleEditWorkout}
                  onDeleteWorkout={handleDeleteWorkout}
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

            {/* Resumen de Entrenamientos por Grupo y Mesociclo */}
            <GroupMesocicloManager workouts={workouts} />

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
                  <h2 className="text-2xl font-bold mb-4">Análisis de Volumen de Entrenamiento</h2>
                  <TrainingVolumeCharts sessions={allSessions} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">Estadísticas de Entrenamiento</h2>
                  <TrainingStats sessions={allSessions} />
                </div>

                {/* Estadísticas por Grupo de Entrenamiento */}
                <GroupStatistics swimmers={swimmers} workouts={workouts} />
              </div>
            )}

            {/* Objetivo del campeonato */}
            <Card className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Trophy className="w-8 h-8 text-red-600" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      Campeonato Nacional 2026
                    </h3>
                    <p className="text-gray-700 mb-2">
                      <strong>Fecha:</strong> ultima Semana de junio de 2026
                    </p>
                    <p className="text-gray-700">
                      Después de 20 semanas de preparación sistemática, estaremos listos
                      para competir al más alto nivel. 
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SECCIÓN 1.5: PREPARACIÓN FÍSICA */}
          <TabsContent value="preparacion-fisica" className="space-y-8">
            <PhysicalPreparation />
          </TabsContent>

          {/* SECCIÓN 2: CALENDARIO INTEGRADO */}
          <TabsContent value="calendario" className="space-y-8">
            <IntegratedCalendar
              sessions={allSessionsWithDates.map((s, idx) => ({
                id: `session_${s.week}_${idx}`,
                week: s.week,
                date: s.dateISO,
                mesociclo: s.mesociclo,
                distance: s.distance,
                type: s.type,
                description: s.description
              }))}
              competitions={competitions}
              swimmers={swimmers}
              swimmerCompetitions={swimmerCompetitions}
              attendanceRecords={attendanceRecords}
              currentUser={currentSwimmer}
              holidays={holidays}
            />
          </TabsContent>

          {/* SECCIÓN 2: NADADORES */}
          <TabsContent value="nadadores" className="space-y-4 sm:space-y-8">
            <div className="flex items-center justify-between gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                <h2 className="text-xl sm:text-3xl font-bold">Nadadores</h2>
              </div>
              {(user?.role === "admin" || user?.role === "coach") && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Preparar datos para el PDF
                      const attendanceRecordsBySwimmer = new Map();
                      const teamRecordsBySwimmer = new Map();
                      
                      swimmers.forEach((swimmer) => {
                        // Por ahora, registros vacíos - se pueden llenar con datos reales
                        attendanceRecordsBySwimmer.set(swimmer.id, []);
                        
                        // Contar récords del equipo
                        const personalBestsArray = Array.isArray(swimmer.personalBests) 
                          ? swimmer.personalBests 
                          : [];
                        const recordsCount = personalBestsArray.filter(pb => 
                          isTeamRecord(swimmer, pb, swimmers)
                        ).length || 0;
                        teamRecordsBySwimmer.set(swimmer.id, recordsCount);
                      });
                      
                      generateAllSwimmersPDF(swimmers, attendanceRecordsBySwimmer, teamRecordsBySwimmer);
                    }}
                    disabled={swimmers.length === 0}
                  >
                    <FileDown className="w-4 h-4 mr-2" />
                    
                  </Button>
                  <AddSwimmerDialog onAddSwimmer={handleAddSwimmer} />
                </div>
              )}
            </div>

            {/* Estadísticas Generales */}
            <SwimmersStats swimmers={swimmers} />

            {/* Tabs por horario */}
            <div className="mt-8">
              <Tabs defaultValue="all">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="all">Todos los Nadadores</TabsTrigger>
                  <TabsTrigger value="minimum-times">
                    <Target className="w-4 h-4 mr-2" />
                    Marcas Mínimas
                  </TabsTrigger>
                  <TabsTrigger value="minimum-times-reference">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Tabla de Referencia
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  {/* Filtros */}
                  <Card className="mb-6">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Filter className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold">Filtros</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Filtro por Género */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Género</label>
                          <Select value={filterGender} onValueChange={setFilterGender}>
                            <SelectTrigger>
                              <SelectValue placeholder="Todos los géneros" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todos</SelectItem>
                              <SelectItem value="Masculino">Masculino</SelectItem>
                              <SelectItem value="Femenino">Femenino</SelectItem>
                              <SelectItem value="Otro">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Filtro por Categoría */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Categoría</label>
                          <Select value={filterCategory} onValueChange={setFilterCategory}>
                            <SelectTrigger>
                              <SelectValue placeholder="Todas las categorías" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todas</SelectItem>
                              {uniqueCategories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Filtro por Grupo de Entrenamiento */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Users className="w-4 h-4 text-red-600" />
                            Grupo de Entrenamiento
                          </label>
                          <Select value={String(filterGroup)} onValueChange={(value) => setFilterGroup(value === "all" ? "all" : parseInt(value) as 1 | 2)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Todos los grupos" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">🏊 Todos los Grupos</SelectItem>
                              <SelectItem value="1">👶 Grupo 1 (Menores hasta Inf A)</SelectItem>
                              <SelectItem value="2">🏅 Grupo 2 (Inf B hasta Mayores)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Botón para limpiar filtros */}
                        <div className="space-y-2 flex items-end">
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setFilterGender("all");
                              setFilterCategory("all");
                              setFilterGroup("all");
                            }}
                            className="w-full"
                          >
                            Limpiar Filtros
                          </Button>
                        </div>
                      </div>
                      
                      {/* Contador de resultados */}
                      <div className="mt-4 text-sm text-gray-600">
                        Mostrando <span className="font-semibold text-blue-600">{filteredSwimmers.length}</span> de {swimmers.length} nadadores
                      </div>
                    </CardContent>
                  </Card>

                  {/* Lista de nadadores */}
                  {filteredSwimmers.length === 0 ? (
                    <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
                      <CardContent className="pt-12 pb-12 text-center">
                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                          {swimmers.length === 0 
                            ? "No hay nadadores registrados"
                            : "No hay nadadores que coincidan con los filtros"}
                        </h3>
                        <p className="text-gray-600 mb-6">
                          {swimmers.length === 0
                            ? "Comienza agregando nadadores al equipo usando el botón \"Agregar Nadador\" arriba."
                            : "Intenta ajustar los filtros para ver más resultados."}
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {filteredSwimmers.map((swimmer) => (
                        <SwimmerListItem
                          key={swimmer.id}
                          swimmer={swimmer}
                          allSwimmers={swimmers}
                          onClick={() => {
                            setSelectedSwimmer(swimmer);
                            setSwimmerDialogOpen(true);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Pestaña: Marcas Mínimas por Nadador */}
                <TabsContent value="minimum-times" className="mt-6 space-y-6">
                  {user?.role === "swimmer" && currentSwimmer ? (
                    // Vista para nadadores: solo ver sus propias marcas
                    <SwimmerMinimumTimesView swimmer={currentSwimmer} />
                  ) : (
                    // Vista para admin/coach: selector de nadador
                    <div className="space-y-6">
                      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-3 mb-4">
                            <Target className="w-6 h-6 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-800">
                              Consulta de Marcas Mínimas por Nadador
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600">
                            Selecciona un nadador para ver las marcas mínimas de su categoría y su progreso personal.
                          </p>
                        </CardContent>
                      </Card>

                      {/* Selector de nadador */}
                      <Card>
                        <CardContent className="pt-6">
                          <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Seleccionar Nadador
                            </label>
                            <Select 
                              value={selectedSwimmer?.id || ""} 
                              onValueChange={(value) => {
                                const swimmer = swimmers.find(s => s.id === value);
                                setSelectedSwimmer(swimmer || null);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Elige un nadador..." />
                              </SelectTrigger>
                              <SelectContent>
                                {swimmers
                                  .filter(s => s.gender && s.gender !== "Otro")
                                  .sort((a, b) => a.name.localeCompare(b.name))
                                  .map((swimmer) => (
                                    <SelectItem key={swimmer.id} value={swimmer.id}>
                                      {swimmer.name} - {calculateCategoryFromBirthDate(swimmer.dateOfBirth)} ({swimmer.gender})
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Mostrar marcas del nadador seleccionado */}
                      {selectedSwimmer && (
                        <SwimmerMinimumTimesView swimmer={selectedSwimmer} />
                      )}

                      {!selectedSwimmer && (
                        <Card className="bg-gradient-to-br from-gray-50 to-blue-50">
                          <CardContent className="pt-12 pb-12 text-center">
                            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                              Selecciona un nadador
                            </h3>
                            <p className="text-gray-600">
                              Elige un nadador del menú desplegable para ver sus marcas mínimas y progreso.
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </TabsContent>

                {/* Pestaña: Tabla de Referencia de Marcas Mínimas */}
                <TabsContent value="minimum-times-reference" className="mt-6">
                  <MinimumTimesReference />
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          {/* SECCIÓN 3: COMPETENCIAS */}
          <TabsContent value="competencias" className="space-y-8">
            {/* Verificador de Marcas Mínimas */}
            <div>
              <MinimumTimesChecker swimmers={swimmers} />
            </div>

            {/* Gestión de Competencias - visible para todos */}
            <div>
              <CompetitionManager
                competitions={competitions}
                onAddCompetition={handleAddCompetition}
                onEditCompetition={handleEditCompetition}
                onDeleteCompetition={handleDeleteCompetition}
                weeks={totalWeeksInSeason}
              />
            </div>

            {/* Mis Resultados - solo para nadadores con perfil vinculado */}
            {currentSwimmer && (
              <div className="border-t-4 border-blue-200 pt-8">
                <CompetitionResults
                  swimmer={currentSwimmer}
                  competitions={competitions}
                  swimmerCompetitions={swimmerCompetitions}
                  onUpdateResults={handleUpdateCompetitionResults}
                />
              </div>
            )}
          </TabsContent>

          {/* SECCIÓN 3.5: TEST CONTROL */}
          <TabsContent value="test-control" className="space-y-8">
            <TestControlManager
              testControls={testControls}
              testResults={testResults}
              swimmers={swimmers}
              onTestControlAdded={handleAddTestControl}
              onTestControlUpdated={handleEditTestControl}
              onTestControlDeleted={handleDeleteTestControl}
              onTestResultAdded={handleAddTestResult}
              onTestResultUpdated={handleEditTestResult}
              onTestResultDeleted={handleDeleteTestResult}
              onSyncData={handleSyncTestData}
              userRole={user?.role}
            />
          </TabsContent>

          {/* SECCIÓN 4: RÉCORDS */}
          <TabsContent value="records" className="space-y-8">
            <TeamRecordsBoard swimmers={swimmers} />
          </TabsContent>

          {/* SECCIÓN 5: LOGROS */}
          <TabsContent value="logros" className="space-y-8">
            <AchievementsBoard
              swimmers={swimmers}
              attendanceRecords={attendanceRecords}
              competitions={competitions}
              selectedSwimmerId={currentSwimmer?.id}
            />
          </TabsContent>

          {/* SECCIÓN 6: ASISTENCIA */}
          <TabsContent value="asistencia" className="space-y-8">
            <AttendanceManager 
              swimmers={swimmers} 
              sessions={allSessions.map((s, idx) => ({
                id: `session_${s.week}_${idx}`,
                week: s.week,
                date: s.date,
                mesociclo: s.mesociclo,
                distance: s.distance,
                type: s.type
              }))}
            />
          </TabsContent>

          {/* SECCIÓN 7: USUARIOS */}
          <TabsContent value="usuarios" className="space-y-8">
            <UserManager swimmers={swimmers} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white mt-12 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">
            Club Natación Lo Prado
          </p>
          <p className="text-sm text-red-400 mt-2">
            Haz que todo sea posible | Temporada 2026-2027
          </p>
          <p className="text-xs text-gray-400 mt-2">
            3 entrenamientos semanales | Lunes, Miércoles, Viernes + Sábados de Desafíos
          </p>
        </div>
      </footer>

      {/* Diálogo de detalles del nadador */}
      <SwimmerDetailsDialog
        swimmer={selectedSwimmer}
        open={swimmerDialogOpen}
        onOpenChange={setSwimmerDialogOpen}
        attendanceRecords={selectedSwimmer ? convertAttendanceRecords(selectedSwimmer.id) : []}
        onDelete={handleDeleteSwimmer}
        onEdit={handleEditSwimmer}
        onSavePersonalBests={handleSavePersonalBests}
        swimmerCompetitions={swimmerCompetitions}
        competitions={competitions}
        allSwimmers={swimmers}
        onToggleCompetitionParticipation={handleToggleCompetitionParticipation}
        onUpdateCompetitionResults={handleUpdateCompetitionResults}
        onUpdateGoals={handleUpdateGoals}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <MigrationBanner />
        <ProtectedRoute>
          <MainApp />
        </ProtectedRoute>
        <Toaster />
      </AuthProvider>
    </ErrorBoundary>
  );
}