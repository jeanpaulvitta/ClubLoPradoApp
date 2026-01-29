/**
 * Marcas mínimas por categoría, género y prueba
 * Formato de tiempo: "MM:SS,MS" o "M:SS,MS"
 */

export interface MinimumTime {
  event: string;
  infE?: string;
  infD?: string;
  infC?: string;
  infA?: string;
  infB1?: string;
  infB2?: string;
  juvA1?: string;
  juvA2?: string;
  juvB?: string;
  mayores?: string;
}

// Marcas mínimas para DAMAS
export const minimumTimesFemale: MinimumTime[] = [
  { event: "50 LIBRE", juvA1: "00:35,17", juvA2: "00:33,35", juvB: "0:30,94", mayores: "00:30,94" },
  { event: "100 LIBRE", juvA1: "01:16,82", juvA2: "01:12,20", juvB: "01:09,65", mayores: "01:09,65" },
  { event: "200 LIBRE", juvA1: "02:47,79", juvA2: "02:45,82", juvB: "02:38,90", mayores: "02:38,90" },
  { event: "400 LIBRE", infA: "6:25.00", infB1: "6:15.00", infB2: "5:58.68", juvA1: "05:48,91", juvA2: "05:35,99", juvB: "5:23,06", mayores: "05:10,14" },
  { event: "800 LIBRE", juvA1: "12:01,14", juvA2: "11:34,43", juvB: "11:07,73", mayores: "10:41,02" },
  { event: "1500 LIBRE", juvA1: "22:52,90", juvA2: "22:02,05", juvB: "21:11,20", mayores: "20:20,35" },
  { event: "50 ESPALDA", juvA1: "00:39,50", juvA2: "00:38,90", juvB: "00:35,17", mayores: "00:35,17" },
  { event: "100 ESPALDA", juvA1: "01:26,05", juvA2: "01:22,86", juvB: "01:19,68", mayores: "01:16,49" },
  { event: "200 ESPALDA", juvA1: "03:08,03", juvA2: "03:01,06", juvB: "02:54,10", mayores: "02:47,14" },
  { event: "50 PECHO", juvA1: "00:47,61", juvA2: "00:44,91", juvB: "00:40,42", mayores: "00:40,42" },
  { event: "100 PECHO", juvA1: "01:36,58", juvA2: "01:33,00", juvB: "01:29,42", mayores: "01:25,85" },
  { event: "200 PECHO", juvA1: "03:29,74", juvA2: "03:21,97", juvB: "03:14,20", mayores: "03:06,43" },
  { event: "50 MARIPOSA", juvA1: "00:39,10", juvA2: "00:34,85", juvB: "00:32,74", mayores: "00:32,74" },
  { event: "100 MARIPOSA", juvA1: "01:23,19", juvA2: "01:20,11", juvB: "01:17,02", mayores: "01:13,94" },
  { event: "200 MARIPOSA", juvA1: "S/MM", juvA2: "S/MM", juvB: "S/MM", mayores: "S/MM" },
  { event: "200 COMBINADO", infC: "3:40.0", infA: "3:30.0", infB1: "3:25.0", juvA1: "03:10,12", juvA2: "03:03,08", juvB: "02:56,04", mayores: "02:49,00" },
  { event: "400 COMBINADO", juvA1: "06:44,70", juvA2: "06:29,71", juvB: "06:14,73", mayores: "05:59,74" },
];

// Marcas mínimas para VARONES
export const minimumTimesMale: MinimumTime[] = [
  { event: "50 LIBRE", juvA1: "00:30,81", juvA2: "00:29,52", juvB: "00:27,01", mayores: "00:27,01" },
  { event: "100 LIBRE", juvA1: "01:07,64", juvA2: "01:03,37", juvB: "00:59,37", mayores: "00:59,37" },
  { event: "200 LIBRE", juvA1: "02:28,93", juvA2: "02:23,05", juvB: "2:16,18", mayores: "2:16,18" },
  { event: "400 LIBRE", infA: "6:20.00", infB1: "6:10.00", infB2: "5:55.84", juvA1: "05:18,07", juvA2: "05:06,29", juvB: "04:54,51", mayores: "04:42,73" },
  { event: "800 LIBRE", juvA1: "11:05,73", juvA2: "10:41,07", juvB: "10:16,41", mayores: "9:51,76" },
  { event: "1500 LIBRE", juvA1: "21:21,18", juvA2: "20:33,3", juvB: "19:46,28", mayores: "18:58,82" },
  { event: "50 ESPALDA", juvA1: "00:38,45", juvA2: "00:35,15", juvB: "00:31,08", mayores: "00:31,06" },
  { event: "100 ESPALDA", juvA1: "01:16,72", juvA2: "01:13,88", juvB: "01:11,04", mayores: "1:08,20" },
  { event: "200 ESPALDA", juvA1: "02:46,90", juvA2: "02:40,72", juvB: "02:34,54", mayores: "2:28,36" },
  { event: "50 PECHO", juvA1: "00:42,98", juvA2: "00:37,88", juvB: "00:33,30", mayores: "00:33,30" },
  { event: "100 PECHO", juvA1: "01:24,55", juvA2: "01:21,42", juvB: "1:18,29", mayores: "01:15,16" },
  { event: "200 PECHO", juvA1: "03:06,77", juvA2: "02:59,85", juvB: "02:52,94", mayores: "02:46,02" },
  { event: "50 MARIPOSA", juvA1: "00:33,38", juvA2: "00:31,00", juvB: "00:27,67", mayores: "0:27,67" },
  { event: "100 MARIPOSA", juvA1: "01:12,97", juvA2: "01:10,27", juvB: "01:07,56", mayores: "01:04,86" },
  { event: "200 MARIPOSA", juvA1: "S/MM", juvA2: "S/MM", juvB: "S/MM", mayores: "S/MM" },
  { event: "200 COMBINADO", infC: "3:30.00", infA: "3:25.00", infB1: "3:20.00", juvA1: "02:48,99", juvA2: "02:42,73", juvB: "02:36,48", mayores: "02:30,22" },
  { event: "400 COMBINADO", juvA1: "06:03,56", juvA2: "05:50,09", juvB: "05:36,63", mayores: "05:23,16" },
];

/**
 * Convierte tiempo en formato MM:SS,MS o M:SS,MS a segundos
 */
export function timeToSeconds(time: string): number {
  if (!time || time === "S/MM") return Infinity;
  
  // Normalizar formato: reemplazar punto por coma y limpiar
  time = time.replace(/\./g, ":").replace(/,/g, ".");
  
  const parts = time.split(":");
  if (parts.length === 2) {
    // Formato M:SS.MS o MM:SS.MS
    const minutes = parseInt(parts[0]);
    const seconds = parseFloat(parts[1]);
    return minutes * 60 + seconds;
  }
  
  return parseFloat(time);
}

/**
 * Obtiene la marca mínima para una categoría específica
 */
export function getMinimumTimeForCategory(
  event: string,
  category: string,
  gender: "Masculino" | "Femenino"
): string | null {
  const times = gender === "Femenino" ? minimumTimesFemale : minimumTimesMale;
  const eventData = times.find(t => t.event === event);
  
  if (!eventData) return null;
  
  // Mapear categoría a campo
  const categoryMap: Record<string, keyof MinimumTime> = {
    "Inf E": "infE",
    "Inf D": "infD",
    "Inf C": "infC",
    "Inf A": "infA",
    "Inf B1": "infB1",
    "Inf B2": "infB2",
    "Juv A1": "juvA1",
    "Juv A2": "juvA2",
    "Juv B": "juvB",
    "Juv B1": "juvB",
    "Juv B2": "juvB",
    "Juv B3": "juvB",
    "Mayores": "mayores",
  };
  
  const field = categoryMap[category];
  return field ? (eventData[field] || null) : null;
}

/**
 * Objeto organizado por categorías para visualización en tablas
 */
export const minimumTimesByCategory = {
  female: minimumTimesFemale,
  male: minimumTimesMale,
};