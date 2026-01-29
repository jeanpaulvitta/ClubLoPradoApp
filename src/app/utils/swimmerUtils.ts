/**
 * Calcula la edad a partir de la fecha de nacimiento
 * @param dateOfBirth - Fecha de nacimiento en formato YYYY-MM-DD
 * @returns Edad en años
 */
export function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  // Si aún no ha cumplido años este año, restar 1
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Calcula la categoría del nadador según su año de nacimiento
 * @param age - Edad del nadador
 * @returns Categoría (ej: "Inf E", "Juv A1", "Mayores")
 */
export function calculateMasterCategory(age: number): string {
  const currentYear = new Date().getFullYear();
  const birthYear = currentYear - age;
  
  // Categorías basadas en año de nacimiento
  if (birthYear >= 2018) return "Inf E";
  if (birthYear === 2017) return "Inf D";
  if (birthYear === 2016) return "Inf C";
  if (birthYear === 2015) return "Inf A";
  if (birthYear === 2014) return "Inf B1";
  if (birthYear === 2013) return "Inf B2";
  if (birthYear === 2012) return "Juv A1";
  if (birthYear === 2011) return "Juv A2";
  if (birthYear === 2010) return "Juv B1";
  if (birthYear === 2009) return "Juv B2";
  if (birthYear === 2008) return "Juv B3";
  
  // 2007 y anteriores
  return "Mayores";
}

/**
 * Calcula la categoría del nadador directamente desde su fecha de nacimiento
 * Esta función asegura que la categoría se mantenga constante durante todo el año
 * basándose únicamente en el año de nacimiento, no en la edad exacta
 * @param dateOfBirth - Fecha de nacimiento en formato YYYY-MM-DD
 * @returns Categoría (ej: "Inf E", "Juv A1", "Mayores")
 */
export function calculateCategoryFromBirthDate(dateOfBirth: string): string {
  const birthDate = new Date(dateOfBirth);
  const birthYear = birthDate.getFullYear();
  
  // Categorías basadas en año de nacimiento
  if (birthYear >= 2018) return "Inf E";
  if (birthYear === 2017) return "Inf D";
  if (birthYear === 2016) return "Inf C";
  if (birthYear === 2015) return "Inf A";
  if (birthYear === 2014) return "Inf B1";
  if (birthYear === 2013) return "Inf B2";
  if (birthYear === 2012) return "Juv A1";
  if (birthYear === 2011) return "Juv A2";
  if (birthYear === 2010) return "Juv B1";
  if (birthYear === 2009) return "Juv B2";
  if (birthYear === 2008) return "Juv B3";
  
  // 2007 y anteriores
  return "Mayores";
}

/**
 * Formatea la fecha de nacimiento para mostrar
 * @param dateOfBirth - Fecha en formato YYYY-MM-DD
 * @returns Fecha formateada
 */
export function formatDateOfBirth(dateOfBirth: string): string {
  const date = new Date(dateOfBirth);
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('es-CL', options);
}

/**
 * Determina el grupo de entrenamiento según la categoría del nadador
 * Grupo 1: Menores hasta Inf A (Inf E, Inf D, Inf C, Inf A)
 * Grupo 2: Inf B hasta Mayores (Inf B1, Inf B2, Juv A1, Juv A2, Juv B1, Juv B2, Juv B3, Mayores)
 * @param category - Categoría del nadador
 * @returns Número de grupo (1 o 2)
 */
export function getTrainingGroup(category: string): 1 | 2 {
  const grupo1Categories = ["Inf E", "Inf D", "Inf C", "Inf A"];
  return grupo1Categories.includes(category) ? 1 : 2;
}

/**
 * Obtiene el grupo de entrenamiento directamente desde la fecha de nacimiento
 * @param dateOfBirth - Fecha de nacimiento en formato YYYY-MM-DD
 * @returns Número de grupo (1 o 2)
 */
export function getTrainingGroupFromBirthDate(dateOfBirth: string): 1 | 2 {
  const category = calculateCategoryFromBirthDate(dateOfBirth);
  return getTrainingGroup(category);
}

/**
 * Obtiene el nombre descriptivo del grupo
 * @param group - Número de grupo (1 o 2)
 * @returns Nombre del grupo con categorías incluidas
 */
export function getGroupName(group: 1 | 2): string {
  if (group === 1) {
    return "Grupo 1: Menores hasta Inf A";
  }
  return "Grupo 2: Inf B hasta Mayores";
}

/**
 * Obtiene las categorías que pertenecen a cada grupo
 * @param group - Número de grupo (1 o 2)
 * @returns Array de categorías
 */
export function getGroupCategories(group: 1 | 2): string[] {
  if (group === 1) {
    return ["Inf E", "Inf D", "Inf C", "Inf A"];
  }
  return ["Inf B1", "Inf B2", "Juv A1", "Juv A2", "Juv B1", "Juv B2", "Juv B3", "Mayores"];
}
