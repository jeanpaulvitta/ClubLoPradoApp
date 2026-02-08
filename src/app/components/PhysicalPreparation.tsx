import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Activity, 
  Users,
  Zap, 
  Heart,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Calendar,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface WeeklySession {
  name: string;
  exercises: string[];
}

interface BlockExercise {
  groupName: string;
  ageRange: string;
  sessionsPerWeek: number;
  focus: string;
  objectives: string[];
  benefit: string;
  sessions: WeeklySession[];
}

interface TrainingBlock {
  number: number;
  name: string;
  color: string;
  group1: BlockExercise;
  group2: BlockExercise;
}

export function PhysicalPreparation() {
  const [selectedGroup, setSelectedGroup] = useState<"group1" | "group2">("group1");
  const [expandedSessions, setExpandedSessions] = useState<{ [key: string]: boolean }>({});

  const toggleSession = (blockId: string) => {
    setExpandedSessions(prev => ({
      ...prev,
      [blockId]: !prev[blockId]
    }));
  };

  // Estructura de 10 bloques con ejercicios específicos por grupo
  const trainingBlocks: TrainingBlock[] = [
    {
      number: 1,
      name: "Velocidad – Salidas – Reacción",
      color: "bg-green-500",
      group1: {
        groupName: "Grupo 1",
        ageRange: "7–10 años",
        sessionsPerWeek: 2,
        focus: "Desarrollo de coordinación explosiva básica",
        objectives: [
          "Reacción motriz lúdica",
          "Saltos y empujes",
          "Control corporal en aceleración",
          "Estabilidad postural"
        ],
        benefit: "Desarrolla reacción + empuje + coordinación",
        sessions: [
          {
            name: "Sesión A",
            exercises: [
              "Juego reacción + sprint 5 m (8 rep)",
              "Saltos rana (3×6)",
              "Escalera coordinación",
              "Plancha 15 s × 3",
              "Juego final rápido"
            ]
          },
          {
            name: "Sesión B",
            exercises: [
              "Salida acostado → sprint",
              "Saltos pies juntos",
              "Carrera zigzag",
              "Equilibrio dinámico",
              "Juego persecución"
            ]
          }
        ]
      },
      group2: {
        groupName: "Grupo 2",
        ageRange: "11–17 años",
        sessionsPerWeek: 3,
        focus: "Potencia neuromuscular aplicada a la salida",
        objectives: [
          "Fuerza explosiva tren inferior",
          "Velocidad de reacción",
          "Potencia de empuje",
          "Frecuencia neuromuscular alta"
        ],
        benefit: "Potencia tren inferior + transferencia a salida",
        sessions: [
          {
            name: "Sesión A",
            exercises: [
              "Sprint 10 m × 6",
              "Pliometría cajón 3×5",
              "Core dinámico",
              "Bandas escapulares"
            ]
          },
          {
            name: "Sesión B",
            exercises: [
              "Salida simulada con banda",
              "Sprint repetidos",
              "Escalera velocidad",
              "Plancha lateral"
            ]
          },
          {
            name: "Sesión C",
            exercises: [
              "Sprint reacción",
              "Saltos reactivos",
              "Core rotacional",
              "Movilidad"
            ]
          }
        ]
      }
    },
    {
      number: 2,
      name: "Base Aeróbica",
      color: "bg-green-500",
      group1: {
        groupName: "Grupo 1",
        ageRange: "7–10 años",
        sessionsPerWeek: 2,
        focus: "Desarrollo aeróbico general",
        objectives: [
          "Resistencia lúdica progresiva",
          "Control respiratorio",
          "Ritmo estable",
          "Economía de movimiento"
        ],
        benefit: "Resistencia general sin fatiga excesiva",
        sessions: [
          {
            name: "Sesión A",
            exercises: [
              "Circuito aeróbico 8 min",
              "Cuerda 2×1 min",
              "Juego continuo"
            ]
          },
          {
            name: "Sesión B",
            exercises: [
              "Carrera suave",
              "Movilidad",
              "Juego grupal aeróbico"
            ]
          }
        ]
      },
      group2: {
        groupName: "Grupo 2",
        ageRange: "11–17 años",
        sessionsPerWeek: 3,
        focus: "Optimización aeróbica específica",
        objectives: [
          "Capacidad aeróbica sostenida",
          "Eficiencia energética",
          "Recuperación entre esfuerzos",
          "Ritmo fisiológico controlado"
        ],
        benefit: "Base aeróbica + control respiratorio",
        sessions: [
          {
            name: "Sesión A",
            exercises: [
              "Carrera 15 min",
              "Core",
              "Movilidad"
            ]
          },
          {
            name: "Sesión B",
            exercises: [
              "Intervalos 2'/1' × 6",
              "Circuito funcional"
            ]
          },
          {
            name: "Sesión C",
            exercises: [
              "Carrera tempo",
              "Estabilidad"
            ]
          }
        ]
      }
    },
    {
      number: 3,
      name: "Ritmos de Prueba",
      color: "bg-green-500",
      group1: {
        groupName: "Grupo 1",
        ageRange: "7–10 años",
        sessionsPerWeek: 2,
        focus: "Coordinación bajo esfuerzo",
        objectives: [
          "Mantener técnica en fatiga leve",
          "Control corporal en velocidad",
          "Agilidad en virajes",
          "Ritmo sostenido"
        ],
        benefit: "Control del esfuerzo + coordinación",
        sessions: [
          {
            name: "Sesión A",
            exercises: [
              "Relevos ritmo",
              "Carreras suaves",
              "Core básico"
            ]
          },
          {
            name: "Sesión B",
            exercises: [
              "Juego mantener velocidad",
              "Equilibrio",
              "Movilidad"
            ]
          }
        ]
      },
      group2: {
        groupName: "Grupo 2",
        ageRange: "11–17 años",
        sessionsPerWeek: 3,
        focus: "Tolerancia al lactato inicial",
        objectives: [
          "Ritmos de competencia",
          "Resistencia anaeróbica",
          "Velocidad sostenida",
          "Recuperación parcial"
        ],
        benefit: "Tolerancia al lactato inicial",
        sessions: [
          {
            name: "Sesión A",
            exercises: [
              "Sprint 20 m × 6",
              "Core dinámico"
            ]
          },
          {
            name: "Sesión B",
            exercises: [
              "Intervalos 40\"/20\"",
              "Estabilidad"
            ]
          },
          {
            name: "Sesión C",
            exercises: [
              "Carrera progresiva",
              "Movilidad"
            ]
          }
        ]
      }
    },
    {
      number: 4,
      name: "Consolidación Técnica",
      color: "bg-green-500",
      group1: {
        groupName: "Grupo 1",
        ageRange: "7–10 años",
        sessionsPerWeek: 2,
        focus: "Fuerza general y postura",
        objectives: [
          "Core básico",
          "Equilibrio corporal",
          "Control postural",
          "Estabilidad dinámica"
        ],
        benefit: "Core básico + control postural",
        sessions: [
          {
            name: "Sesión A",
            exercises: [
              "Plancha",
              "Caminata animal",
              "Equilibrio"
            ]
          },
          {
            name: "Sesión B",
            exercises: [
              "Core básico",
              "Movilidad",
              "Juego técnico"
            ]
          }
        ]
      },
      group2: {
        groupName: "Grupo 2",
        ageRange: "11–17 años",
        sessionsPerWeek: 3,
        focus: "Fuerza específica competitiva",
        objectives: [
          "Core avanzado",
          "Estabilidad escapular",
          "Transferencia fuerza–técnica",
          "Mantenimiento técnico en fatiga"
        ],
        benefit: "Estabilidad + transferencia técnica",
        sessions: [
          {
            name: "Sesión A",
            exercises: [
              "Core avanzado",
              "Bandas escapulares"
            ]
          },
          {
            name: "Sesión B",
            exercises: [
              "Balón medicinal",
              "Estabilidad unilateral"
            ]
          },
          {
            name: "Sesión C",
            exercises: [
              "Core + movilidad"
            ]
          }
        ]
      }
    },
    {
      number: 5,
      name: "Volumen Competitivo",
      color: "bg-green-500",
      group1: {
        groupName: "Grupo 1",
        ageRange: "7–10 años",
        sessionsPerWeek: 2,
        focus: "Adaptación al volumen",
        objectives: [
          "Tolerancia al esfuerzo",
          "Recuperación activa",
          "Resistencia general",
          "Autoconfianza motriz"
        ],
        benefit: "Tolerancia al esfuerzo",
        sessions: [
          {
            name: "Sesión A",
            exercises: [
              "Circuito continuo 10 min",
              "Juego aeróbico"
            ]
          },
          {
            name: "Sesión B",
            exercises: [
              "Carrera suave",
              "Coordinación"
            ]
          }
        ]
      },
      group2: {
        groupName: "Grupo 2",
        ageRange: "11–17 años",
        sessionsPerWeek: 3,
        focus: "Resistencia competitiva",
        objectives: [
          "Multievento",
          "Acumulación de pruebas",
          "Gestión de fatiga",
          "Capacidad de repetición"
        ],
        benefit: "Resistencia competitiva",
        sessions: [
          {
            name: "Sesión A",
            exercises: [
              "Circuito 20 min"
            ]
          },
          {
            name: "Sesión B",
            exercises: [
              "Intervalos largos"
            ]
          },
          {
            name: "Sesión C",
            exercises: [
              "Resistencia acumulada"
            ]
          }
        ]
      }
    },
    {
      number: 6,
      name: "Velocidad Pura",
      color: "bg-green-500",
      group1: {
        groupName: "Grupo 1",
        ageRange: "7–10 años",
        sessionsPerWeek: 2,
        focus: "Explosividad controlada",
        objectives: [
          "Reacción rápida",
          "Coordinación acelerada",
          "Empuje potente",
          "Control corporal"
        ],
        benefit: "Coordinación rápida + explosividad",
        sessions: [
          {
            name: "Sesión A",
            exercises: [
              "Sprint 5 m",
              "Saltos rápidos"
            ]
          },
          {
            name: "Sesión B",
            exercises: [
              "Juego reacción",
              "Coordinación"
            ]
          }
        ]
      },
      group2: {
        groupName: "Grupo 2",
        ageRange: "11–17 años",
        sessionsPerWeek: 3,
        focus: "Máxima potencia aplicada",
        objectives: [
          "Fuerza explosiva máxima",
          "Velocidad pura",
          "Break out potente",
          "Frecuencia máxima"
        ],
        benefit: "Velocidad pura + fuerza aplicada",
        sessions: [
          {
            name: "Sesión A",
            exercises: [
              "Sprint máximos"
            ]
          },
          {
            name: "Sesión B",
            exercises: [
              "Trineo ligero"
            ]
          },
          {
            name: "Sesión C",
            exercises: [
              "Pliometría"
            ]
          }
        ]
      }
    },
    {
      number: 7,
      name: "Sostener Ritmos Altos",
      color: "bg-green-500",
      group1: {
        groupName: "Grupo 1",
        ageRange: "7–10 años",
        sessionsPerWeek: 2,
        focus: "Resistencia coordinativa",
        objectives: [
          "Mantener técnica",
          "Ritmo estable",
          "Control respiratorio",
          "Economía motriz"
        ],
        benefit: "Resistencia coordinativa",
        sessions: [
          {
            name: "Sesión A",
            exercises: [
              "Juego persecución"
            ]
          },
          {
            name: "Sesión B",
            exercises: [
              "Circuito continuo"
            ]
          }
        ]
      },
      group2: {
        groupName: "Grupo 2",
        ageRange: "11–17 años",
        sessionsPerWeek: 3,
        focus: "Resistencia específica alta",
        objectives: [
          "Sostener intensidad",
          "Control fisiológico",
          "Tolerancia al esfuerzo",
          "Recuperación eficiente"
        ],
        benefit: "Resistencia específica",
        sessions: [
          {
            name: "Sesión A",
            exercises: [
              "Intervalos 30/30"
            ]
          },
          {
            name: "Sesión B",
            exercises: [
              "Carrera tempo"
            ]
          },
          {
            name: "Sesión C",
            exercises: [
              "Resistencia específica"
            ]
          }
        ]
      }
    },
    {
      number: 8,
      name: "Economía de Nado",
      color: "bg-green-500",
      group1: {
        groupName: "Grupo 1",
        ageRange: "7–10 años",
        sessionsPerWeek: 2,
        focus: "Eficiencia motriz",
        objectives: [
          "Movimiento económico",
          "Coordinación fina",
          "Ahorro energético",
          "Ritmo técnico"
        ],
        benefit: "Eficiencia motriz",
        sessions: [
          {
            name: "Sesión A",
            exercises: [
              "Carrera técnica"
            ]
          },
          {
            name: "Sesión B",
            exercises: [
              "Coordinación fina"
            ]
          }
        ]
      },
      group2: {
        groupName: "Grupo 2",
        ageRange: "11–17 años",
        sessionsPerWeek: 3,
        focus: "Economía competitiva",
        objectives: [
          "Eficiencia energética avanzada",
          "Técnica bajo acumulación",
          "Resistencia técnica",
          "Control de fatiga"
        ],
        benefit: "Economía energética",
        sessions: [
          {
            name: "Sesión A",
            exercises: [
              "Técnica carrera"
            ]
          },
          {
            name: "Sesión B",
            exercises: [
              "Movilidad activa"
            ]
          },
          {
            name: "Sesión C",
            exercises: [
              "Eficiencia motriz"
            ]
          }
        ]
      }
    },
    {
      number: 9,
      name: "Ajustes Individuales",
      color: "bg-green-500",
      group1: {
        groupName: "Grupo 1",
        ageRange: "7–10 años",
        sessionsPerWeek: 2,
        focus: "Refinamiento motor",
        objectives: [
          "Corrección postural",
          "Coordinación específica",
          "Movilidad",
          "Control corporal"
        ],
        benefit: "Control corporal",
        sessions: [
          {
            name: "Sesión A",
            exercises: [
              "Equilibrio"
            ]
          },
          {
            name: "Sesión B",
            exercises: [
              "Movilidad"
            ]
          }
        ]
      },
      group2: {
        groupName: "Grupo 2",
        ageRange: "11–17 años",
        sessionsPerWeek: 3,
        focus: "Optimización física individual",
        objectives: [
          "Ajustes de fuerza",
          "Prevención lesiones",
          "Estabilidad estructural",
          "Preparación pico"
        ],
        benefit: "Prevención de lesiones",
        sessions: [
          {
            name: "Sesión A",
            exercises: [
              "Correctivo"
            ]
          },
          {
            name: "Sesión B",
            exercises: [
              "Estabilidad"
            ]
          },
          {
            name: "Sesión C",
            exercises: [
              "Prevención lesiones"
            ]
          }
        ]
      }
    },
    {
      number: 10,
      name: "Pico Competitivo",
      color: "bg-green-500",
      group1: {
        groupName: "Grupo 1",
        ageRange: "7–10 años",
        sessionsPerWeek: 2,
        focus: "Preparación física competitiva básica",
        objectives: [
          "Activación neuromotora",
          "Coordinación máxima",
          "Confianza corporal",
          "Recuperación rápida"
        ],
        benefit: "Activación neuromotora",
        sessions: [
          {
            name: "Sesión A",
            exercises: [
              "Activación rápida"
            ]
          },
          {
            name: "Sesión B",
            exercises: [
              "Juegos explosivos"
            ]
          }
        ]
      },
      group2: {
        groupName: "Grupo 2",
        ageRange: "11–17 años",
        sessionsPerWeek: 3,
        focus: "Pico de rendimiento",
        objectives: [
          "Potenciación final",
          "Frescura neuromuscular",
          "Estabilidad técnica",
          "Gestión del estrés físico"
        ],
        benefit: "Frescura neuromuscular",
        sessions: [
          {
            name: "Sesión A",
            exercises: [
              "Activación neural"
            ]
          },
          {
            name: "Sesión B",
            exercises: [
              "Sprint corto"
            ]
          },
          {
            name: "Sesión C",
            exercises: [
              "Pliometría ligera"
            ]
          }
        ]
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <Activity className="w-7 h-7 text-orange-600" />
            Preparación Física por Bloques
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Ejercicios complementarios específicos para cada grupo según los 10 bloques de la temporada 2026-2027
          </p>
        </CardHeader>
      </Card>

      {/* Información importante */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-2">Recomendaciones generales:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Realizar calentamiento previo de 5-10 minutos</li>
                <li>Mantener una técnica correcta en cada ejercicio</li>
                <li>Progresar gradualmente en intensidad y volumen</li>
                <li>Integrar estos ejercicios 2-3 veces por semana fuera del agua</li>
                <li>Consultar al entrenador antes de iniciar cualquier programa</li>
                <li>Los ejercicios están alineados con los objetivos de cada bloque de la temporada</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs por Grupo */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={selectedGroup} onValueChange={(value) => setSelectedGroup(value as "group1" | "group2")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="group1" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Grupo 1 - Menores
              </TabsTrigger>
              <TabsTrigger value="group2" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Grupo 2 - Mayores
              </TabsTrigger>
            </TabsList>

            {/* Contenido Grupo 1 */}
            <TabsContent value="group1" className="space-y-4 mt-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
                <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Enfoque Grupo 1 (Menores)
                </h3>
                <p className="text-sm text-blue-800">
                  Ejercicios adaptados para categorías Inf E '18, Inf D '17, Inf C '16, Inf A '15. 
                  Énfasis en desarrollo de habilidades coordinativas, técnica básica y formación integral.
                </p>
              </div>

              {trainingBlocks.map((block) => {
                const blockId = `group1-${block.number}`;
                const isExpanded = expandedSessions[blockId];
                
                return (
                  <Card key={blockId} className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`${block.color} text-white font-bold text-lg w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}>
                            {block.number}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800 text-lg">Bloque {block.number}</h3>
                            <p className="text-sm text-gray-600 font-semibold">{block.name}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 flex-shrink-0">
                          {block.group1.ageRange}
                        </Badge>
                      </div>

                      {/* Enfoque */}
                      <div className="bg-indigo-50 rounded-lg p-3 mb-4 border border-indigo-200">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-xs font-bold text-indigo-800 uppercase">Enfoque:</span>
                            <p className="text-sm text-indigo-900 mt-1 font-semibold">{block.group1.focus}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        {/* Objetivos */}
                        <div className="bg-amber-50 rounded-md p-3 border border-amber-200">
                          <div className="flex items-start gap-2 mb-2">
                            <Target className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <span className="text-xs font-bold text-amber-800 uppercase">Objetivos:</span>
                          </div>
                          <ul className="ml-6 space-y-1.5">
                            {block.group1.objectives.map((objective, idx) => (
                              <li key={idx} className="text-sm text-amber-900 flex items-start gap-2">
                                <span className="text-amber-600 font-bold mt-0.5">•</span>
                                <span>{objective}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Beneficio */}
                        <div className="bg-green-50 rounded-md p-3 border border-green-200">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="text-xs font-semibold text-green-800 uppercase">Beneficio:</span>
                              <p className="text-sm text-green-900 mt-1">{block.group1.benefit}</p>
                            </div>
                          </div>
                        </div>

                        {/* Sesiones Semanales (Expandible) */}
                        <div className="bg-white rounded-md border border-gray-200">
                          <button
                            onClick={() => toggleSession(blockId)}
                            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors rounded-md"
                          >
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-bold text-gray-800">
                                Sesiones Semanales ({block.group1.sessionsPerWeek} sesiones)
                              </span>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-gray-600" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                          
                          {isExpanded && (
                            <div className="p-3 pt-0 space-y-3">
                              {block.group1.sessions.map((session, idx) => (
                                <div key={idx} className="bg-blue-50 rounded-md p-3 border border-blue-200">
                                  <h5 className="font-bold text-blue-900 mb-2 text-sm">{session.name}</h5>
                                  <ul className="space-y-1.5">
                                    {session.exercises.map((exercise, exIdx) => (
                                      <li key={exIdx} className="text-sm text-blue-800 flex items-start gap-2">
                                        <span className="text-blue-600 font-bold mt-0.5">→</span>
                                        <span>{exercise}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            {/* Contenido Grupo 2 */}
            <TabsContent value="group2" className="space-y-4 mt-6">
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 mb-6">
                <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Enfoque Grupo 2 (Mayores)
                </h3>
                <p className="text-sm text-purple-800">
                  Ejercicios avanzados para categorías Inf B1 '14, Inf B2 '13, Juv A1 '12, Juv A2 '11, Juv B1-B3 '10-'08, Mayores '07. 
                  Énfasis en rendimiento competitivo, potencia y resistencia específica.
                </p>
              </div>

              {trainingBlocks.map((block) => {
                const blockId = `group2-${block.number}`;
                const isExpanded = expandedSessions[blockId];
                
                return (
                  <Card key={blockId} className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`${block.color} text-white font-bold text-lg w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}>
                            {block.number}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800 text-lg">Bloque {block.number}</h3>
                            <p className="text-sm text-gray-600 font-semibold">{block.name}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700 flex-shrink-0">
                          {block.group2.ageRange}
                        </Badge>
                      </div>

                      {/* Enfoque */}
                      <div className="bg-violet-50 rounded-lg p-3 mb-4 border border-violet-200">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-violet-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-xs font-bold text-violet-800 uppercase">Enfoque:</span>
                            <p className="text-sm text-violet-900 mt-1 font-semibold">{block.group2.focus}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        {/* Objetivos */}
                        <div className="bg-amber-50 rounded-md p-3 border border-amber-200">
                          <div className="flex items-start gap-2 mb-2">
                            <Target className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <span className="text-xs font-bold text-amber-800 uppercase">Objetivos:</span>
                          </div>
                          <ul className="ml-6 space-y-1.5">
                            {block.group2.objectives.map((objective, idx) => (
                              <li key={idx} className="text-sm text-amber-900 flex items-start gap-2">
                                <span className="text-amber-600 font-bold mt-0.5">•</span>
                                <span>{objective}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Beneficio */}
                        <div className="bg-green-50 rounded-md p-3 border border-green-200">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="text-xs font-semibold text-green-800 uppercase">Beneficio:</span>
                              <p className="text-sm text-green-900 mt-1">{block.group2.benefit}</p>
                            </div>
                          </div>
                        </div>

                        {/* Sesiones Semanales (Expandible) */}
                        <div className="bg-white rounded-md border border-gray-200">
                          <button
                            onClick={() => toggleSession(blockId)}
                            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors rounded-md"
                          >
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-purple-600" />
                              <span className="text-sm font-bold text-gray-800">
                                Sesiones Semanales ({block.group2.sessionsPerWeek} sesiones)
                              </span>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-gray-600" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                          
                          {isExpanded && (
                            <div className="p-3 pt-0 space-y-3">
                              {block.group2.sessions.map((session, idx) => (
                                <div key={idx} className="bg-purple-50 rounded-md p-3 border border-purple-200">
                                  <h5 className="font-bold text-purple-900 mb-2 text-sm">{session.name}</h5>
                                  <ul className="space-y-1.5">
                                    {session.exercises.map((exercise, exIdx) => (
                                      <li key={exIdx} className="text-sm text-purple-800 flex items-start gap-2">
                                        <span className="text-purple-600 font-bold mt-0.5">→</span>
                                        <span>{exercise}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Beneficios de la preparación física */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <TrendingUp className="w-8 h-8 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Beneficios de la Preparación Física por Bloques
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Alineación perfecta con objetivos de cada bloque de la temporada</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Progresión específica adaptada a cada grupo de edad</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Prevención de lesiones con trabajo correctivo integrado</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Transferencia directa al rendimiento en el agua</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Desarrollo de capacidades físicas complementarias</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Preparación óptima para picos competitivos</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de bloques */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Heart className="w-8 h-8 text-orange-600 flex-shrink-0" />
            <div className="w-full">
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Estructura de 10 Bloques - Temporada 2026-2027
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
                {trainingBlocks.map((block) => (
                  <div key={block.number} className="bg-white rounded-lg border-l-4 border-l-green-500 p-2 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2">
                      <div className={`${block.color} text-white font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0`}>
                        {block.number}
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{block.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}