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
  Trophy, Users, CheckCircle2, Loader2, Edit3, Waves, Flag, X,
  PlayCircle, StopCircle,
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
  elapsed: number;        // ms accumulated before last start
  startedAt: number | null; // performance.now() when started
  running: boolean;
  editingTime: string;    // editable after stop
  saved: boolean;
  saving: boolean;
  laps: string[];         // parciales: formatted times at each lap press
}

interface CronometrarManagerProps {
  competitions: Competition[];
  swimmers: Swimmer[];
  swimmerCompetitions: SwimmerCompetition[];
  onSaveResult: (
    swimmerId: string,
    competitionId: string | null,
    event: string,
    time: string
  ) => Promise<void>;
}

// ─── Time helpers ─────────────────────────────────────────────────────────────

function msToDisplay(ms: number): string {
  const cs = Math.floor(ms / 10);
  const h  = cs % 100;
  const s  = Math.floor(cs / 100) % 60;
  const m  = Math.floor(cs / 6000);
  return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}.${String(h).padStart(2,"0")}`;
}

function displayToMs(val: string): number | null {
  const m = val.match(/^(\d{1,2}):(\d{2})\.(\d{2})$/);
  if (!m) return null;
  const [, mm, ss, cc] = m;
  return (parseInt(mm) * 6000 + parseInt(ss) * 100 + parseInt(cc)) * 10;
}

/** Delta between two "MM:SS.cc" strings, returned as "+SS.cc" or "+MM:SS.cc" */
function lapDelta(prev: string, curr: string): string {
  const p = displayToMs(prev) ?? 0;
  const c = displayToMs(curr) ?? 0;
  return `+${msToDisplay(c - p)}`;
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
  const [eventMap, setEventMap]     = useState<Record<string, string>>({});
  const [lapDist, setLapDist]       = useState<LapDist>(50);
  const [timers, setTimers]         = useState<Record<string, SwimmerTimer>>({});
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const competition = competitions.find(c => c.id === selectedCompId) ?? null;

  const convocadoIds = new Set(
    swimmerCompetitions
      .filter(sc => sc.competitionId === selectedCompId && sc.participates)
      .map(sc => sc.swimmerId)
  );
  const availableSwimmers = mode === "competition"
    ? swimmers.filter(s => convocadoIds.has(s.id))
    : swimmers;

  // ── Global tick (50ms) ───────────────────────────────────────────────────────
  useEffect(() => {
    tickRef.current = setInterval(() => {
      setTimers(prev => {
        const now = performance.now();
        let changed = false;
        const next = { ...prev };
        Object.keys(next).forEach(id => {
          const t = next[id];
          if (t.running && t.startedAt !== null) {
            next[id] = { ...t, elapsed: t.elapsed + (now - t.startedAt), startedAt: now };
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }, 50);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, []);

  // ── Individual timer controls ─────────────────────────────────────────────────
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
        laps: [],
      },
    }));
  }, []);

  /** Record a lap (partial time) without stopping the timer */
  const recordLap = useCallback((swimmerId: string) => {
    setTimers(prev => {
      const t = prev[swimmerId];
      if (!t || !t.running) return prev;
      const now = performance.now();
      const currentMs = t.elapsed + (t.startedAt !== null ? now - t.startedAt : 0);
      return {
        ...prev,
        [swimmerId]: { ...t, laps: [...t.laps, msToDisplay(currentMs)] },
      };
    });
  }, []);

  const clearLaps = useCallback((swimmerId: string) => {
    setTimers(prev => ({ ...prev, [swimmerId]: { ...prev[swimmerId], laps: [] } }));
  }, []);

  // ── Global controls (all timers simultaneously) ───────────────────────────────
  const startAllTimers = useCallback(() => {
    const now = performance.now();
    setTimers(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(id => {
        const t = next[id];
        if (!t.running && !t.saved) {
          next[id] = { ...t, running: true, startedAt: now };
        }
      });
      return next;
    });
  }, []);

  const stopAllTimers = useCallback(() => {
    const now = performance.now();
    setTimers(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(id => {
        const t = next[id];
        if (t.running) {
          const finalElapsed = t.elapsed + (t.startedAt !== null ? now - t.startedAt : 0);
          next[id] = {
            ...t,
            running: false,
            elapsed: finalElapsed,
            startedAt: null,
            editingTime: msToDisplay(finalElapsed),
          };
        }
      });
      return next;
    });
  }, []);

  const recordLapAll = useCallback(() => {
    const now = performance.now();
    setTimers(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(id => {
        const t = next[id];
        if (t.running && t.startedAt !== null) {
          const currentMs = t.elapsed + (now - t.startedAt);
          next[id] = { ...t, laps: [...t.laps, msToDisplay(currentMs)] };
        }
      });
      return next;
    });
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
        [swimmerId]: { ...prev[swimmerId], saving: false, saved: true, editingTime: finalTime },
      }));
      toast.success(`Marca guardada: ${finalTime}`);
    } catch {
      setTimers(prev => ({ ...prev, [swimmerId]: { ...prev[swimmerId], saving: false } }));
      toast.error("Error al guardar la marca");
    }
  }, [timers, mode, selectedCompId, onSaveResult]);

  // ── Setup → Timing ────────────────────────────────────────────────────────────
  const handleStartTiming = () => {
    if (selectedSwimmerIds.size === 0) { toast.error("Selecciona al menos un nadador"); return; }
    const initial: Record<string, SwimmerTimer> = {};
    selectedSwimmerIds.forEach(id => {
      initial[id] = {
        swimmerId: id,
        event: eventMap[id] || "50m Libre",
        lapDist,
        elapsed: 0,
        startedAt: null,
        running: false,
        editingTime: "00:00.00",
        saved: false,
        saving: false,
        laps: [],
      };
    });
    setTimers(initial);
    setPhase("timing");
  };

  const handleBack = () => { setPhase("setup"); setTimers({}); };

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

  // ─────────────────────────────────────────────────────────────────────────────
  // SETUP PHASE
  // ─────────────────────────────────────────────────────────────────────────────
  if (phase === "setup") {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Timer className="w-5 h-5 text-blue-500" />
              Configurar Sesión de Cronometraje
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                    <AlertDescription>No hay competencias. Agrégalas en la sección Competencias.</AlertDescription>
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
                      className={`flex items-center gap-3 px-4 py-3 transition-colors ${selected ? "bg-emerald-50" : "hover:bg-gray-50"}`}
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

  // ─────────────────────────────────────────────────────────────────────────────
  // TIMING PHASE
  // ─────────────────────────────────────────────────────────────────────────────
  const timerList = Object.values(timers).sort((a, b) => {
    const sa = swimmers.find(s => s.id === a.swimmerId);
    const sb = swimmers.find(s => s.id === b.swimmerId);
    return (sa?.name ?? "").localeCompare(sb?.name ?? "");
  });

  const allSaved    = timerList.length > 0 && timerList.every(t => t.saved);
  const anyRunning  = timerList.some(t => t.running);
  const anyReady    = timerList.some(t => !t.running && !t.saved); // can be started
  const multiSwimmers = timerList.length > 1;

  return (
    <div className="space-y-4">
      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Timer className="w-5 h-5 text-blue-500" />
            Cronometrando
            {competition && (
              <span className="text-gray-500 font-normal text-sm">— {competition.name}</span>
            )}
            {mode === "trial" && (
              <Badge className="bg-amber-100 text-amber-800 ml-1">Control</Badge>
            )}
          </h3>
          <p className="text-sm text-gray-500">{timerList.length} nadadores activos</p>
        </div>
        <div className="flex flex-wrap gap-2">
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

      {/* ── Global controls (shown only when ≥ 2 swimmers) ────────────────────── */}
      {multiSwimmers && (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <span className="text-xs font-medium text-slate-500 mr-1">Control general:</span>

          {anyReady && !anyRunning && (
            <Button
              size="sm"
              onClick={startAllTimers}
              className="bg-green-600 hover:bg-green-700 gap-1.5"
            >
              <PlayCircle className="w-4 h-4" />
              Iniciar todos
            </Button>
          )}

          {anyRunning && (
            <>
              <Button
                size="sm"
                onClick={stopAllTimers}
                className="bg-red-600 hover:bg-red-700 gap-1.5"
              >
                <StopCircle className="w-4 h-4" />
                Detener todos
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={recordLapAll}
                className="gap-1.5 border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                <Flag className="w-4 h-4" />
                Vuelta todos
              </Button>
            </>
          )}

          {anyReady && anyRunning && (
            <Button
              size="sm"
              variant="outline"
              onClick={startAllTimers}
              className="gap-1.5"
            >
              <PlayCircle className="w-4 h-4" />
              Iniciar pendientes
            </Button>
          )}
        </div>
      )}

      {/* ── Timer cards ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {timerList.map(t => {
          const swimmer = swimmers.find(s => s.id === t.swimmerId);
          if (!swimmer) return null;
          const cat = calculateCategoryFromBirthDate(swimmer.dateOfBirth);
          const isG1 = ["Inf E","Inf D","Inf C","Inf A"].includes(cat);
          const currentMs = t.running && t.startedAt
            ? t.elapsed + (performance.now() - t.startedAt)
            : t.elapsed;

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
                  {t.saved && <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />}
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
                  {t.elapsed > 0 || t.running ? msToDisplay(currentMs) : "00:00.00"}
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
                      <>
                        <Button
                          size="sm"
                          onClick={() => recordLap(t.swimmerId)}
                          variant="outline"
                          className="gap-1 border-amber-300 text-amber-700 hover:bg-amber-50"
                          title={`Registrar parcial #${t.laps.length + 1}`}
                        >
                          <Flag className="w-4 h-4" />
                          Vuelta
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => stopTimer(t.swimmerId)}
                          className="flex-1 bg-red-600 hover:bg-red-700 gap-1"
                        >
                          <Square className="w-4 h-4" />
                          Detener
                        </Button>
                      </>
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

                {/* Lap list */}
                {t.laps.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 space-y-0.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                        <Flag className="w-3 h-3" />
                        Parciales ({t.laps.length})
                      </span>
                      {!t.saved && (
                        <button
                          onClick={() => clearLaps(t.swimmerId)}
                          className="text-amber-400 hover:text-amber-700 transition-colors"
                          title="Borrar parciales"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    {t.laps.map((lapTime, idx) => {
                      const delta = idx === 0 ? lapTime : lapDelta(t.laps[idx - 1], lapTime);
                      return (
                        <div key={idx} className="flex justify-between items-center text-xs font-mono px-1">
                          <span className="text-amber-600 font-medium">
                            {`${(idx + 1) * t.lapDist}m`}
                          </span>
                          <span className="text-gray-700 font-semibold">{lapTime}</span>
                          <span className="text-gray-400">
                            {idx === 0 ? "" : delta}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Manual edit + Save */}
                {!t.running && t.elapsed > 0 && !t.saved && (
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <Label className="text-xs text-gray-500 shrink-0">Corregir:</Label>
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
                      <span className="text-xs text-gray-400">MM:SS.cc</span>
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
