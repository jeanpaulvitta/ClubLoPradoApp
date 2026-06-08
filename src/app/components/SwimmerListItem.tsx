import { Badge } from "./ui/badge";
import { User, Crown } from "lucide-react";
import type { Swimmer } from "../data/swimmers";
import { calculateAge, calculateCategoryFromBirthDate } from "../utils/swimmerUtils";
import { isTeamRecord } from "../utils/recordsUtils";

interface SwimmerListItemProps {
  swimmer: Swimmer;
  onClick: () => void;
  allSwimmers?: Swimmer[];
}

const SCHEDULE_COLOR: Record<string, string> = {
  "7am":  "bg-orange-100 text-orange-800 border-orange-200",
  "8am":  "bg-blue-100 text-blue-800 border-blue-200",
  "9pm":  "bg-purple-100 text-purple-800 border-purple-200",
};

const STATUS_COLOR: Record<string, string> = {
  Activo:     "bg-green-100 text-green-700",
  Inactivo:   "bg-gray-100 text-gray-600",
  Suspendido: "bg-red-100 text-red-700",
  Egresado:   "bg-yellow-100 text-yellow-700",
};

export function SwimmerListItem({ swimmer, onClick, allSwimmers = [] }: SwimmerListItemProps) {
  const age = calculateAge(swimmer.dateOfBirth);
  const category = calculateCategoryFromBirthDate(swimmer.dateOfBirth);
  const pbArr = Array.isArray(swimmer.personalBests) ? swimmer.personalBests : [];
  const teamRecordsCount = pbArr.filter(pb => isTeamRecord(swimmer, pb, allSwimmers)).length;
  const isG1 = ["Inf E","Inf D","Inf C","Inf A"].includes(category);
  const status = swimmer.status ?? "Activo";

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 rounded-xl border border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-sm transition-all group"
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white overflow-hidden shadow-sm">
          {swimmer.profileImage
            ? <img src={swimmer.profileImage} alt={swimmer.name} className="w-full h-full object-cover" />
            : <User className="w-5 h-5" />
          }
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Row 1: name + records + arrow */}
          <div className="flex items-center gap-1.5 mb-1">
            <span className="font-semibold text-sm truncate text-gray-900 group-hover:text-blue-900">
              {swimmer.name}
            </span>
            {teamRecordsCount > 0 && (
              <span className="shrink-0 inline-flex items-center gap-0.5 bg-amber-100 text-amber-700 border border-amber-200 rounded-full px-1.5 py-0.5 text-xs font-bold">
                <Crown className="w-2.5 h-2.5" />
                {teamRecordsCount}
              </span>
            )}
            {status !== "Activo" && (
              <span className={`shrink-0 text-xs px-1.5 py-0.5 rounded-full font-medium ${STATUS_COLOR[status]}`}>
                {status}
              </span>
            )}
          </div>

          {/* Row 2: key data chips */}
          <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500">
            {/* Category */}
            <span className={`px-1.5 py-0.5 rounded font-medium ${isG1 ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700"}`}>
              {category}
            </span>
            {/* Gender dot */}
            {swimmer.gender && (
              <span className={`px-1.5 py-0.5 rounded ${swimmer.gender === "Masculino" ? "bg-blue-50 text-blue-600" : swimmer.gender === "Femenino" ? "bg-pink-50 text-pink-600" : "bg-gray-100 text-gray-500"}`}>
                {swimmer.gender === "Masculino" ? "M" : swimmer.gender === "Femenino" ? "F" : "O"}
              </span>
            )}
            {/* Age */}
            <span className="text-gray-400">{age}a</span>
            {/* Schedule */}
            <Badge variant="outline" className={`text-xs h-4 px-1 py-0 border ${SCHEDULE_COLOR[swimmer.schedule] ?? "bg-gray-100 text-gray-600"}`}>
              {swimmer.schedule}
            </Badge>
            {/* PBs */}
            {pbArr.length > 0 && (
              <span className="text-indigo-500 font-medium">{pbArr.length} marcas</span>
            )}
          </div>

          {/* Row 3: secondary info (RUT, school, characteristic) */}
          {(swimmer.rut || swimmer.school || swimmer.characteristic) && (
            <div className="mt-1 text-xs text-gray-400 truncate">
              {[swimmer.rut, swimmer.school, swimmer.characteristic].filter(Boolean).join(" · ")}
            </div>
          )}
        </div>

        {/* Arrow */}
        <div className="shrink-0 self-center text-gray-300 group-hover:text-blue-400 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
}
