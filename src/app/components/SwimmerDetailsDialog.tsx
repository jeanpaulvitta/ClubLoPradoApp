import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  User, Mail, Calendar, Trash2, Cake, Crown, CreditCard,
  Phone, Building2, MapPin, Users, FileDown, UserCheck, ChevronLeft,
} from "lucide-react";
import { SwimmerCompetitionsDialog } from "./SwimmerCompetitionsDialog";
import { EditSwimmerDialog } from "./EditSwimmerDialog";
import { PersonalBestsDialog } from "./PersonalBestsDialog";
import { PerformanceDialog } from "./PerformanceDialog";
import { ProgressionDialog } from "./ProgressionDialog";
import { GoalsDialog } from "./GoalsDialog";
import type { Swimmer, AttendanceRecord, SwimmerCompetition, Competition, PersonalBest, PersonalBestHistory } from "../data/swimmers";
import { calculateAge, calculateCategoryFromBirthDate } from "../utils/swimmerUtils";
import { isTeamRecord } from "../utils/recordsUtils";
import { generateSwimmerPDF } from "../utils/pdfGenerator";

// ─── Props ────────────────────────────────────────────────────────────────────

interface SwimmerDetailsDialogProps {
  swimmer: Swimmer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attendanceRecords: AttendanceRecord[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string, updatedSwimmer: Omit<Swimmer, "id">) => void;
  onSavePersonalBests?: (swimmerId: string, personalBests: PersonalBest[], history: PersonalBestHistory[]) => void;
  onUpdateCompetitionResults?: (swimmerId: string, competitionId: string, results: import("../data/swimmers").SwimmerCompetitionResult[]) => void;
  onUpdateGoals?: (swimmerId: string, goals: import("../data/swimmers").SwimmerGoal[]) => void;
  swimmerCompetitions: SwimmerCompetition[];
  competitions: Competition[];
  allSwimmers?: Swimmer[];
  onToggleCompetitionParticipation?: (swimmerId: string, competitionId: string, participates: boolean) => void;
  canEdit?: boolean;
}

// ─── Small helper: data row ───────────────────────────────────────────────────

function DataRow({ label, value, icon: Icon }: { label: string; value?: string | null; icon?: React.ElementType }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-1.5 py-1">
      {Icon && <Icon className="w-3 h-3 text-gray-400 mt-0.5 shrink-0" />}
      <span className="text-[11px] text-gray-500 shrink-0 w-24">{label}</span>
      <span className="text-xs font-medium text-gray-800 break-all leading-relaxed">{value}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-3 mb-0.5 border-t border-gray-100 pt-2.5 first:mt-0 first:border-0 first:pt-0">
      {children}
    </p>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SwimmerDetailsDialog({
  swimmer,
  open,
  onOpenChange,
  attendanceRecords,
  onDelete,
  onEdit,
  onSavePersonalBests,
  onUpdateCompetitionResults,
  onUpdateGoals,
  swimmerCompetitions,
  competitions,
  allSwimmers = [],
  onToggleCompetitionParticipation,
  canEdit,
}: SwimmerDetailsDialogProps) {
  if (!swimmer) return null;

  const age = calculateAge(swimmer.dateOfBirth);
  const category = calculateCategoryFromBirthDate(swimmer.dateOfBirth);
  const pbArr = Array.isArray(swimmer.personalBests) ? swimmer.personalBests : [];
  const teamRecordsCount = pbArr.filter(pb => isTeamRecord(swimmer, pb, allSwimmers)).length;
  const isG1 = ["Inf E","Inf D","Inf C","Inf A"].includes(category);
  const status = swimmer.status ?? "Activo";

  const scheduleColor = {
    "7am": "bg-orange-100 text-orange-800",
    "8am": "bg-blue-100 text-blue-800",
    "9pm": "bg-purple-100 text-purple-800",
  }[swimmer.schedule] ?? "bg-gray-100 text-gray-800";

  const statusColor = {
    Activo:     "bg-green-100 text-green-700",
    Inactivo:   "bg-gray-100 text-gray-600",
    Suspendido: "bg-red-100 text-red-700",
    Egresado:   "bg-yellow-100 text-yellow-700",
  }[status] ?? "bg-gray-100 text-gray-600";

  const dob = new Date(swimmer.dateOfBirth).toLocaleDateString("es-CL");

  const hasContactInfo = swimmer.phone || swimmer.email;
  const hasGuardian    = swimmer.guardianName || swimmer.guardianPhone;
  const hasSchool      = swimmer.school || swimmer.characteristic;
  const hasAddress     = swimmer.commune || swimmer.address;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {/* ── Header ────────────────────────────────────────────────── */}
          <DialogTitle asChild>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white overflow-hidden shrink-0 shadow">
                {swimmer.profileImage
                  ? <img src={swimmer.profileImage} alt={swimmer.name} className="w-full h-full object-cover" />
                  : <User className="w-6 h-6" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-lg font-bold text-gray-900 leading-tight">{swimmer.name}</span>
                  {teamRecordsCount > 0 && (
                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5 text-xs font-bold">
                      <Crown className="w-3 h-3" />
                      {teamRecordsCount} Récord{teamRecordsCount !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge className={scheduleColor}>{swimmer.schedule}</Badge>
                  <Badge className={isG1 ? "bg-purple-100 text-purple-800" : "bg-emerald-100 text-emerald-800"}>
                    {category}
                  </Badge>
                  {swimmer.gender && (
                    <Badge className={swimmer.gender === "Masculino" ? "bg-blue-100 text-blue-800" : swimmer.gender === "Femenino" ? "bg-pink-100 text-pink-800" : "bg-gray-100 text-gray-700"}>
                      {swimmer.gender}
                    </Badge>
                  )}
                  <Badge className={statusColor}>{status}</Badge>
                  {pbArr.length > 0 && (
                    <Badge variant="outline" className="text-indigo-700 border-indigo-200 bg-indigo-50">
                      {pbArr.length} marcas personales
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Ficha de {swimmer.name}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-0">
          {/* Records banner */}
          {teamRecordsCount > 0 && (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <div className="bg-amber-400 rounded-full p-2">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-amber-900 text-sm">
                  ¡Poseedor de {teamRecordsCount} Récord{teamRecordsCount !== 1 ? "s" : ""} del Equipo!
                </p>
                <p className="text-xs text-amber-700">
                  Mejor marca del equipo en {teamRecordsCount} prueba{teamRecordsCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          )}

          {/* ── Two-column info grid ────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            {/* Left column */}
            <div>
              <SectionTitle>Datos personales</SectionTitle>
              <DataRow icon={CreditCard} label="RUT"         value={swimmer.rut} />
              <DataRow icon={Cake}       label="Nacimiento"   value={`${dob}  (${age} años)`} />
              <DataRow icon={Users}      label="Género"       value={swimmer.gender} />
              <DataRow icon={MapPin}     label="Nacionalidad" value={swimmer.nationality} />
              {swimmer.shortName && (
                <DataRow icon={User} label="Nombre corto" value={swimmer.shortName} />
              )}

              {(hasContactInfo) && (
                <>
                  <SectionTitle>Contacto deportista</SectionTitle>
                  <DataRow icon={Mail}  label="Email"     value={swimmer.email && !swimmer.email.includes("@sin-email") ? swimmer.email : undefined} />
                  <DataRow icon={Phone} label="Teléfono"  value={swimmer.phone} />
                </>
              )}

              {hasGuardian && (
                <>
                  <SectionTitle>Apoderado</SectionTitle>
                  <DataRow icon={UserCheck} label="Nombre"    value={swimmer.guardianName} />
                  <DataRow icon={Phone}     label="Teléfono"  value={swimmer.guardianPhone} />
                </>
              )}
            </div>

            {/* Right column */}
            <div>
              <SectionTitle>Información del club</SectionTitle>
              <DataRow icon={Calendar} label="Ingreso"         value={swimmer.joinDate} />
              <DataRow icon={Users}    label="Horario"         value={swimmer.schedule} />
              <DataRow icon={Users}    label="Característica"  value={swimmer.characteristic} />

              {hasSchool && !swimmer.characteristic && (
                <DataRow icon={Building2} label="Colegio" value={swimmer.school} />
              )}
              {hasSchool && swimmer.characteristic && (
                <DataRow icon={Building2} label="Colegio" value={swimmer.school} />
              )}

              {hasAddress && (
                <>
                  <SectionTitle>Dirección</SectionTitle>
                  <DataRow icon={MapPin} label="Comuna"    value={swimmer.commune} />
                  <DataRow icon={MapPin} label="Dirección" value={swimmer.address} />
                </>
              )}

              <SectionTitle>Rendimiento</SectionTitle>
              {pbArr.length > 0 ? (
                <div className="grid grid-cols-2 gap-1 mt-1">
                  {pbArr.slice(0, 6).map((pb, i) => (
                    <div key={i} className="text-xs bg-indigo-50 border border-indigo-100 rounded px-2 py-1">
                      <span className="text-gray-500">{pb.distance}m {pb.style}</span>
                      <br />
                      <span className="font-mono font-semibold text-indigo-700">{pb.time}</span>
                      {pb.location && <span className="text-gray-400 block truncate">{pb.location}</span>}
                    </div>
                  ))}
                  {pbArr.length > 6 && (
                    <div className="text-xs text-indigo-400 flex items-center justify-center">
                      +{pbArr.length - 6} más…
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-400 mt-1">Sin marcas registradas</p>
              )}
            </div>
          </div>

          {/* ── Action buttons ──────────────────────────────────────────── */}
          <div className="flex flex-wrap gap-2 pt-3 mt-3 border-t border-gray-100">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="gap-1 mr-auto">
              <ChevronLeft className="w-3.5 h-3.5" />
              Volver
            </Button>
            {onSavePersonalBests && (
              <PersonalBestsDialog
                swimmerId={swimmer.id}
                swimmerName={swimmer.name}
                swimmer={swimmer}
                personalBests={pbArr}
                onSavePersonalBests={onSavePersonalBests}
                allSwimmers={allSwimmers}
              />
            )}
            <ProgressionDialog swimmer={swimmer} />
            {onUpdateGoals && (
              <GoalsDialog swimmer={swimmer} onUpdateGoals={onUpdateGoals} />
            )}
            <PerformanceDialog swimmer={swimmer} personalBests={pbArr} />
            <SwimmerCompetitionsDialog
              swimmerId={swimmer.id}
              swimmerName={swimmer.name}
              swimmerCompetitions={swimmerCompetitions}
              competitions={competitions}
              onToggleParticipation={(competitionId, participates) => {
                onToggleCompetitionParticipation?.(swimmer.id, competitionId, participates);
              }}
            />
            {(canEdit || onEdit) && onEdit && (
              <EditSwimmerDialog swimmer={swimmer} onEdit={onEdit} />
            )}
            {(canEdit || onDelete) && onDelete && (
              <Button variant="destructive" size="sm" onClick={() => { onOpenChange(false); onDelete(swimmer.id); }}>
                <Trash2 className="w-4 h-4 mr-1" />
                Eliminar
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => generateSwimmerPDF(swimmer, attendanceRecords, teamRecordsCount)}>
              <FileDown className="w-4 h-4 mr-1" />
              PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
