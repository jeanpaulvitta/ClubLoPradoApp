import { Users } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface GroupFilterSelectorProps {
  selectedGroup: "all" | 1 | 2;
  onGroupChange: (group: "all" | 1 | 2) => void;
  currentUserGroup?: 1 | 2 | null;
}

export function GroupFilterSelector({ 
  selectedGroup, 
  onGroupChange,
  currentUserGroup 
}: GroupFilterSelectorProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <Users className="w-4 h-4 text-red-600" />
        <span>Filtrar por grupo:</span>
      </div>
      
      <Button
        variant={selectedGroup === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => onGroupChange("all")}
        className={selectedGroup === "all" ? "bg-red-600 hover:bg-red-700" : ""}
      >
        🏊 Todos
      </Button>
      
      <Button
        variant={selectedGroup === 1 ? "default" : "outline"}
        size="sm"
        onClick={() => onGroupChange(1)}
        className={selectedGroup === 1 ? "bg-purple-600 hover:bg-purple-700" : ""}
      >
        👶 Grupo 1
      </Button>
      
      <Button
        variant={selectedGroup === 2 ? "default" : "outline"}
        size="sm"
        onClick={() => onGroupChange(2)}
        className={selectedGroup === 2 ? "bg-green-600 hover:bg-green-700" : ""}
      >
        🏅 Grupo 2
      </Button>

      {currentUserGroup && (
        <Badge 
          variant="outline" 
          className={`ml-2 ${
            currentUserGroup === 1 
              ? "border-purple-500 text-purple-700" 
              : "border-green-500 text-green-700"
          }`}
        >
          Tu grupo: {currentUserGroup === 1 ? "👶 Grupo 1" : "🏅 Grupo 2"}
        </Badge>
      )}
    </div>
  );
}
