import { Tag } from "lucide-react";
import { Button } from "./ui/button";

const ALL_CATEGORIES = [
  "Inf E", "Inf D", "Inf C", "Inf A",
  "Inf B1", "Inf B2",
  "Juv A1", "Juv A2",
  "Juv B1", "Juv B2", "Juv B3",
  "Mayores",
] as const;

const GRUPO1_CATEGORIES = new Set(["Inf E", "Inf D", "Inf C", "Inf A"]);

interface CategoryFilterSelectorProps {
  value: string[];
  onChange: (categories: string[]) => void;
}

export function CategoryFilterSelector({ value, onChange }: CategoryFilterSelectorProps) {
  const toggleCategory = (cat: string) => {
    if (value.includes(cat)) {
      onChange(value.filter((c) => c !== cat));
    } else {
      onChange([...value, cat]);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 shrink-0">
        <Tag className="w-4 h-4 text-red-600" />
        <span>Categoría:</span>
      </div>

      <Button
        variant={value.length === 0 ? "default" : "outline"}
        size="sm"
        onClick={() => onChange([])}
        className={value.length === 0 ? "bg-red-600 hover:bg-red-700" : ""}
      >
        Todas
      </Button>

      {ALL_CATEGORIES.map((cat) => {
        const isSelected = value.includes(cat);
        const isGrupo1 = GRUPO1_CATEGORIES.has(cat);
        return (
          <Button
            key={cat}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => toggleCategory(cat)}
            className={
              isSelected
                ? isGrupo1
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
                : isGrupo1
                ? "border-purple-300 text-purple-700 hover:bg-purple-50"
                : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            }
          >
            {cat}
          </Button>
        );
      })}
    </div>
  );
}
