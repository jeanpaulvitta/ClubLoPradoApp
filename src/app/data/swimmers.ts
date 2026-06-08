export interface Swimmer {
  id: string;
  name: string;
  email: string;
  rut?: string;
  gender?: "Masculino" | "Femenino" | "Otro";
  schedule: string; // e.g. "7am", "8am", "7:30am", "6pm", etc.
  dateOfBirth: string;
  joinDate: string;
  personalBests?: PersonalBest[];
  personalBestsHistory?: PersonalBestHistory[];
  profileImage?: string;
  goals?: SwimmerGoal[];
  // ── Campos extendidos (importados desde Excel) ────────────────────────────
  status?: "Activo" | "Inactivo" | "Suspendido" | "Egresado";
  phone?: string;           // Fono deportista
  guardianName?: string;    // Nombre apoderado
  guardianPhone?: string;   // Fono apoderado
  school?: string;          // Colegio
  nationality?: string;     // Nacionalidad
  commune?: string;         // Comuna
  address?: string;         // Dirección particular
  shortName?: string;       // Nombre corto para listas
  characteristic?: string;  // Velocista, Fondista, etc.
}

export interface PersonalBest {
  distance: number; // 50, 100, 200, 400, 800, 1500
  style: "Libre" | "Espalda" | "Pecho" | "Mariposa" | "Combinado";
  time: string; // Formato MM:SS.SS
  date: string; // Fecha de la marca
  location?: string; // Opcional: dónde se logró
}

// Historial completo de marcas personales para gráficos de progresión
export interface PersonalBestHistory {
  id: string; // ID único para cada entrada
  distance: number; // 50, 100, 200, 400, 800, 1500
  style: "Libre" | "Espalda" | "Pecho" | "Mariposa" | "Combinado";
  time: string; // Formato MM:SS.SS
  timeInSeconds: number; // Tiempo convertido a segundos para gráficos
  date: string; // Fecha de la marca
  location?: string; // Opcional: dónde se logró
  isPersonalBest?: boolean; // Si esta marca fue récord personal en su momento
}

export interface AttendanceRecord {
  swimmerId: string;
  date: string;
  attended: boolean;
  volumeCompleted: number; // metros completados
  volumeAssigned: number; // metros asignados
  notes?: string;
}

export interface Competition {
  id: string;
  name: string;
  week: number; // Semana del mesociclo donde ocurre la competencia
  startDate: string; // Fecha de inicio (formato YYYY-MM-DD)
  endDate: string; // Fecha de fin (formato YYYY-MM-DD)
  schedule: string; // Horarios (ej: "09:00 - 18:00")
  cost: string; // Valor de inscripción (ej: "$15.000")
  location: string; // Lugar (ej: "Centro Acuático Estadio Nacional")
  poolType: "25m" | "50m"; // Tipo de piscina
  type: "Local" | "Regional" | "Nacional" | "Internacional"; // Tipo de competencia
  events: string[]; // Pruebas disponibles (ej: ["50m Libre", "100m Espalda", "200m Combinado"])
  categories?: string[]; // Categorías permitidas (ej: ["Inf A", "Inf B1", "Juv A1"]) - si está vacío o undefined, todas las categorías pueden participar
  description?: string; // Descripción adicional opcional
  pdfUrl?: string; // URL del PDF adjunto (información oficial de la competencia)
  pdfFileName?: string; // Nombre del archivo PDF
}

export interface SwimmerCompetition {
  id: string;
  swimmerId: string;
  competitionId: string;
  participates: boolean; // Si el nadador participará en esta competencia
  events?: {
    event: string; // Ej: "50m Libre", "100m Pecho"
    time?: string; // Tiempo registrado (opcional hasta después de la competencia)
    position?: number; // Posición en la prueba (opcional)
    points?: number; // Puntos FINA si aplica (opcional)
  }[];
  notes?: string;
}

// Competencias iniciales - se cargarán desde el servidor
export const competitions: Competition[] = [];

// Iniciar con arrays vacíos - los datos se agregan dinámicamente
export const swimmers: Swimmer[] = [];
export const swimmerCompetitions: SwimmerCompetition[] = [];

export interface SwimmerGoal {
  id: string;
  distance: number; // 50, 100, 200, 400, 800, 1500
  style: "Libre" | "Espalda" | "Pecho" | "Mariposa" | "Combinado";
  targetTime: string; // Tiempo objetivo (formato MM:SS.SS)
  targetTimeInSeconds: number; // Tiempo objetivo en segundos
  targetDate: string; // Fecha objetivo (formato YYYY-MM-DD)
  createdAt: string; // Fecha de creación
  achieved: boolean; // Si ya se logró la meta
  achievedAt?: string; // Fecha en que se logró
  notes?: string; // Notas adicionales (ej: "Para el campeonato nacional")
}