import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "./ui/select";
import {
  Timer, Play, Square, RotateCcw, Save, ChevronRight, ChevronLeft,
  Trophy, Users, CheckCircle2, Loader2, Edit3, Waves,
} from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "sonner";
import type { Competition, Swimmer, SwimmerCompetition } from "../data/swimmers";
import { calculateCategoryFromBirthDate } from "../utils/swimmerUtils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "setup" | "timing";
type LapDist = 25 | 50 | 100;

interface SwimmerTimer {
  swimmerId: string;
  event: string;
  lapDist: LapDist;
  elapsed: number;    // ms accumulated before last start
  startedAt: number | null; // performance.now() when started
  running: boolean;
  editingTime: string; // user-editable formatted time
  saved: boolean;
  saving: boolean;
}

interface CronometrarManagerProps {
  competitions: Competition[];
  swimmers: Swimmer[];
  swimmerCompetitions: SwimmerCompetition[];
  onSaveResult: (swimmerId: string, competitionId: string | null, event: string, time: string) => Promise<void>;
}

// ─── Time helpers ─────────────────────────────────────────────────────────────

function msToDisplay(ms: number): string {
  const cs = Math.floor(ms / 10);
  const h  = cs % 100;
  const s  = Math.floor(cs / 100) % 60;
  const m  = Math.floor(cs / 6000);
  return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}.${String(h).padStart(2,"0")}`;
}

/** Parse "MM:SS.cc" → ms, returns null if invalid */
function displayToMs(val: string): number | null {
  const m = val.match(/^(\d{1,2}):(\d{2})\.(\d{2})$/);
  if (!m) return null;
  const [, mm, ss, cc] = m;
  return (parseInt(mm) * 6000 + parseInt(ss) * 100 + parseInt(cc)) * 10;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CronometrarManager({
  competitions,
  swimmers,
  swimmerCompetitions,
  onSaveResult,
}: CronometrarManagerProps) {
  const [phase, setPhase]           = useState<Phase>("setup");
  const [mode, setMode]             = useState<"competition" | "trial">("competition");
  const [selectedCompId, setSelectedCompId] = useState<string>("");
  const [selectedSwimmerIds, setSelectedSwimmerIds] = useState<Set<string>>(new Set());
  // event assignment: swimmerId → event string
  const [eventMap, setEventMap]     = useState<Record<string, string>>({});
  const [lapDist, setLapDist]       = useState<LapDist>(50);
  const [timers, setTimers]         = useState<Record<string, SwimmerTimer>>({});
  const tickRef                     = useRef<ReturnType<typeof setInterval> | null>(null);

  const competition = competitions.find(c => c.id === selectedCompId) ?? null;

  // Convocatoria swimmers (those with participates=true for selected comp)
  const convocadoIds = new Set(
    swimmerCompetitions
      .filter(sc => sc.competitionId === selectedCompId && sc.participates)
      .map(sc => sc.swimmerId)
  );

  const availableSwimmers = mode === "competition"
    ? swimmers.filter(s => convocadoIds.has(s.id))
    : swimmers;

  // ── Global tick ──────────────────────────────────────────────────────────────
  useEffect(() => {
    tickRef.current = setInterval(() => {
      setTimers(prev => {
        const now = performance.now();
        let changed = false;
        const next = { ...prev };
        Object.keys(next).forEach(id => {
          const t = next[id];
          if (t.running && t.startedAt !== null) {
            const newElapsed = t.elapsed + (now - t.startedAt);
            next[id] = { ...t, elapsed: newElapsed, startedAt: now };
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }, 50);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, []);

  // ── Timer controls ───────────────────────────────────────────────────────────
  const startTimer = useCallback((swimmerId: string) => {
    setTimers(prev => ({
      ...prev,
      [swimmerId]: { ...prev[swimmerId], running: true, startedAt: performance.now() },
    }));
  }, []);

  const stopTimer = useCallback((swimmerId: string) => {
    setTimers(prev => {
      const t = prev[swimmerId];
      if (!t) return prev;
      const now = performance.now();
      const finalElapsed = t.elapsed + (t.startedAt !== null ? now - t.startedAt : 0);
      return {
        ...prev,
        [swimmerId]: {
          ...t,
          running: false,
          elapsed: finalElapsed,
          startedAt: null,
          editingTime: msToDisplay(finalElapsed),
        },
      };
    });
  }, []);

  const resetTimer = useCallback((swimmerId: string) => {
    setTimers(prev => ({
      ...prev,
      [swimmerId]: {
        ...prev[swimmerId],
        running: false,
        elapsed: 0,
        startedAt: null,
        editingTime: "00:00.00",
        saved: false,
      },
    }));
  }, []);

  const saveResult = useCallback(async (swimmerId: string) => {
    const t = timers[swimmerId];
    if (!t) return;
    const parsedMs = displayToMs(t.editingTime);
    const finalTime = parsedMs !== null ? msToDisplay(parsedMs) : msToDisplay(t.elapsed);

    setTimers(prev => ({ ...prev, [swimmerId]: { ...prev[swimmerId], saving: true } }));
    try {
      await onSaveResult(
        swimmerId,
        mode === "competition" ? selectedCompId : null,
        t.event,
        finalTime
      );
      setTimers(prev => ({
        ...prev,
        [swimmerId]: { ...prev[swimmerId], saving: false, saved: true },
      }));
      toast.success(`Marca guardada: ${finalTime}`);
    } catch (err) {
      setTimers(prev => ({ ...prev, [swimmerId]: { ...prev[swimmerId], saving: false } }));
      toast.error("Error al guardar la marca");
    }
  }, [timers, mode, selectedCompId, onSaveResult]);

  // ── Setup → Timing transition ─────────────────────────────────────────────────
  const handleStartTiming = () => {
    if (selectedSwimmerIds.size === 0) {
      toast.error("Selecciona al menos un nadador");
      return;
    }
    // Initialize timers
    const initialTimers: Record<string, SwimmerTimer> = {};
    selectedSwimmerIds.forEach(id => {
      initialTimers[id] = {
        swimmerId: id,
        event: eventMap[id] || "50m Libre",
        lapDist,
        elapsed: 0,
        startedAt: null,
        running: false,
        editingTime: "00:00.00",
        saved: false,
        saving: false,
      };
    });
    setTimers(initialTimers);
    setPhase("timing");
  };

  const handleBack = () => {
    setPhase("setup");
    setTimers({});
  };

  const toggleSwimmer = (id: string) => {
    setSelectedSwimmerIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const events = competition?.events ?? [
    "50m Libre","100m Libre","200m Libre","400m Libre",
    "50m Espalda","100m Espalda",
    "50m Pecho","100m Pecho",
    "50m Mariposa","100m Mariposa",
    "200m Combinado","400m Combinado",
  ];

  const sortedCompetitions = [...competitions].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  // ── Render: SETUP phase ───────────────────────────────────────────────────────
  if (phase === "setup") {
    return (
      <div className="space-y-6">
        {/* Mode + Competition */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Timer className="w-5 h-5 text-blue-500" />
              Configurar Sesión de Cronometraje
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Mode toggle */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Tipo de sesión</Label>
              <div className="flex gap-2">
                <Button
                  variant={mode === "competition" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode("competition")}
                  className={mode === "competition" ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  <Trophy className="w-4 h-4 mr-1" />
                  Competencia
                </Button>
                <Button
                  variant={mode === "trial" ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setMode("trial"); setSelectedCompId(""); }}
                  className={mode === "trial" ? "bg-amber-600 hover:bg-amber-700" : ""}
                >
                  <Waves className="w-4 h-4 mr-1" />
                  Control / Tiempo de Prueba
                </Button>
              </div>
            </div>

            {mode === "competition" && (
              <div>
                <Label className="text-sm font-medium mb-2 block">Competencia</Label>
                {competitions.length === 0 ? (
                  <Alert>
                    <AlertDescription>
                      No hay competencias. Agrégalas en la sección Competencias.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Select value={selectedCompId} onValueChange={setSelectedCompId}>
                    <SelectTrigger className="max-w-md">
                      <SelectValue placeholder="Selecciona la competencia…" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortedCompetitions.map(c => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} — {new Date(c.startDate).toLocaleDateString("es-CL")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}

            {/* Lap distance */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Distancia de vuelta por defecto</Label>
              <div className="flex gap-2">
                {([25, 50, 100] as LapDist[]).map(d => (
                  <Button
                    key={d}
                    variant={lapDist === d ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLapDist(d)}
                    className={lapDist === d ? "bg-slate-700 hover:bg-slate-800" : ""}
                  >
                    {d}m
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Swimmer selection */}
        {(mode === "trial" || (mode === "competition" && selectedCompId)) && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-emerald-500" />
                  Nadadores a Cronometrar
                  <Badge className="bg-emerald-100 text-emerald-800">
                    {selectedSwimmerIds.size} seleccionados
                  </Badge>
                </CardTitle>
                {mode === "competition" && availableSwimmers.length === 0 && (
                  <span className="text-xs text-amber-600">
                    No hay nadadores en la convocatoria de esta competencia
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {availableSwimmers.map(s => {
                  const cat = calculateCategoryFromBirthDate(s.dateOfBirth);
                  const selected = selectedSwimmerIds.has(s.id);
                  const sc = swimmerCompetitions.find(
                    x => x.swimmerId === s.id && x.competitionId === selectedCompId
                  );
                  const defaultEvent = sc?.events?.[0]?.event ?? events[0] ?? "50m Libre";

                  return (
                    <div
                      key={s.id}
                      className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                        selected ? "bg-emerald-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleSwimmer(s.id)}
                        className="w-4 h-4 rounded accent-emerald-600 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{s.name}</p>
                        <p className="text-xs text-gray-400">{cat}</p>
                      </div>
                      {selected && (
                        <Select
                          value={eventMap[s.id] ?? defaultEvent}
                          onValueChange={v => setEventMap(prev => ({ ...prev, [s.id]: v }))}
                        >
                          <SelectTrigger className="w-44 h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {events.map(e => (
                              <SelectItem key={e} value={e} className="text-xs">{e}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Start button */}
        <div className="flex justify-end">
          <Button
            size="lg"
            onClick={handleStartTiming}
            disabled={selectedSwimmerIds.size === 0}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
          >
            Iniciar Cronometraje
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  // ── Render: TIMING phase ──────────────────────────────────────────────────────
  const timerList = Object.values(timers).sort((a, b) => {
    const sa = swimmers.find(s => s.id === a.swimmerId);
    const sb = swimmers.find(s => s.id === b.swimmerId);
    return (sa?.name ?? "").localeCompare(sb?.name ?? "");
  });

  const allSaved = timerList.every(t => t.saved);

  return (
    <div className="space-y-4">
      {/* Timing header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Timer className="w-5 h-5 text-blue-500" />
            Cronometrando
            {competition && <span className="text-gray-500 font-normal text-sm">— {competition.name}</span>}
            {mode === "trial" && <Badge className="bg-amber-100 text-amber-800 ml-1">Control</Badge>}
          </h3>
          <p className="text-sm text-gray-500">{timerList.length} nadadores activos</p>
        </div>
        <div className="flex gap-2">
          {allSaved && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleBack}
              className="gap-1 text-green-700 border-green-300"
            >
              <CheckCircle2 className="w-4 h-4" />
              Finalizar sesión
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={handleBack} className="gap-1">
            <ChevronLeft className="w-4 h-4" />
            Volver
          </Button>
        </div>
      </div>

      {/* Swimmer timer cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {timerList.map(t => {
          const swimmer = swimmers.find(s => s.id === t.swimmerId);
          if (!swimmer) return null;
          const cat = calculateCategoryFromBirthDate(swimmer.dateOfBirth);
          const isG1 = ["Inf E","Inf D","Inf C","Inf A"].includes(cat);
          const currentMs = t.running && t.startedAt
            ? t.elapsed + (performance.now() - t.startedAt)
            : t.elapsed;
          const displayTime = msToDisplay(currentMs);

          return (
            <Card
              key={t.swimmerId}
              className={`transition-all ${
                t.saved
                  ? "border-green-300 bg-green-50"
                  : t.running
                  ? "border-blue-400 shadow-md"
                  : ""
              }`}
            >
              <CardContent className="pt-4 pb-4 space-y-3">
                {/* Swimmer info */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{swimmer.name}</p>
                    <div className="flex gap-1 mt-0.5">
                      <Badge
                        className={`text-xs ${isG1 ? "bg-purple-100 text-purple-800" : "bg-emerald-100 text-emerald-800"}`}
                      >
                        {cat}
                      </Badge>
                      <Badge variant="outline" className="text-xs">{t.event}</Badge>
                      <Badge variant="outline" className="text-xs">{t.lapDist}m/vuelta</Badge>
                    </div>
                  </div>
                  {t.saved && (
                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                  )}
                </div>

                {/* Stopwatch display */}
                <div
                  className={`text-center font-mono font-bold rounded-lg py-3 transition-colors ${
                    t.running
                      ? "text-blue-700 bg-blue-50 text-4xl"
                      : t.elapsed > 0
                      ? "text-gray-800 bg-gray-100 text-4xl"
                      : "text-gray-300 bg-gray-50 text-3xl"
                  }`}
                >
                  {t.running ? displayTime : (t.elapsed > 0 ? msToDisplay(t.elapsed) : "00:00.00")}
                </div>

                {/* Controls */}
                {!t.saved && (
                  <div className="flex gap-2">
                    {!t.running && t.elapsed === 0 && (
                      <Button
                        size="sm"
                        onClick={() => startTimer(t.swimmerId)}
                        className="flex-1 bg-green-600 hover:bg-green-700 gap-1"
                      >
                        <Play className="w-4 h-4" />
                        Iniciar
                      </Button>
                    )}
                    {t.running && (
                      <Button
                        size="sm"
                        onClick={() => stopTimer(t.swimmerId)}
                        className="flex-1 bg-red-600 hover:bg-red-700 gap-1"
                      >
                        <Square className="w-4 h-4" />
                        Detener
                      </Button>
                    )}
                    {!t.running && t.elapsed > 0 && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startTimer(t.swimmerId)}
                          className="gap-1"
                          title="Reanudar"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resetTimer(t.swimmerId)}
                          className="gap-1"
                          title="Reiniciar"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                )}

                {/* Manual time edit + Save */}
                {!t.running && t.elapsed > 0 && !t.saved && (
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <Label className="text-xs text-gray-500 shrink-0">Corregir tiempo:</Label>
                      <Input
                        value={t.editingTime}
                        onChange={e =>
                          setTimers(prev => ({
                            ...prev,
                            [t.swimmerId]: { ...prev[t.swimmerId], editingTime: e.target.value },
                          }))
                        }
                        placeholder="MM:SS.cc"
                        className="h-7 text-sm font-mono w-28"
                      />
                      <span className="text-xs text-gray-400">(MM:SS.cc)</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => saveResult(t.swimmerId)}
                      disabled={t.saving}
                      className="w-full bg-blue-600 hover:bg-blue-700 gap-1"
                    >
                      {t.saving
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando…</>
                        : <><Save className="w-4 h-4" /> Guardar marca</>
                      }
                    </Button>
                  </div>
                )}

                {t.saved && (
                  <p className="text-center text-sm text-green-600 font-medium">
                    ✓ Guardado: {t.editingTime}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
