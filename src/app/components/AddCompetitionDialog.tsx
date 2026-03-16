import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Plus, Trophy, Users, FileText, Upload, X } from "lucide-react";
import type { Competition } from "../data/swimmers";

// Categorías disponibles
const AVAILABLE_CATEGORIES = [
  "Inf E 2018",
  "Inf D 2017",
  "Inf C 2016",
  "Inf A 2015",
  "Inf B1 2014",
  "Inf B2 2013",
  "Juv A1 2012",
  "Juv A2 2011",
  "Juv B1 2010",
  "Juv B2 2009",
  "Juv B3 2008",
  "Mayores 2007",
];

interface AddCompetitionDialogProps {
  onAddCompetition: (competition: Omit<Competition, "id">) => void;
  weekNumber: number;
}

export function AddCompetitionDialog({
  onAddCompetition,
  weekNumber,
}: AddCompetitionDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    week: weekNumber,
    startDate: "",
    endDate: "",
    schedule: "",
    cost: "",
    location: "",
    poolType: "50m" as "25m" | "50m",
    type: "Regional" as "Local" | "Regional" | "Nacional" | "Internacional",
    events: [] as string[],
    description: "",
    categories: [] as string[],
  });
  const [eventInput, setEventInput] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.startDate || !formData.location) {
      alert("Por favor completa los campos obligatorios (Nombre, Fecha de inicio, Ubicación)");
      return;
    }

    // Normalizar fechas para evitar problemas de zona horaria
    // Agregar "T12:00:00" para que se interprete como mediodía y no medianoche UTC
    const normalizedStartDate = formData.startDate ? `${formData.startDate}T12:00:00` : "";
    const normalizedEndDate = formData.endDate ? `${formData.endDate}T12:00:00` : "";

    onAddCompetition({
      ...formData,
      startDate: normalizedStartDate,
      endDate: normalizedEndDate,
      week: weekNumber,
    });

    // Reset form
    setFormData({
      name: "",
      week: weekNumber,
      startDate: "",
      endDate: "",
      schedule: "",
      cost: "",
      location: "",
      poolType: "50m",
      type: "Regional",
      events: [],
      description: "",
      categories: [],
    });
    setEventInput("");
    setPdfFile(null);
    setOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Solo se permiten archivos PDF');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('El archivo no puede superar los 10MB');
        return;
      }
      setPdfFile(file);
    }
  };

  const handleAddEvent = () => {
    if (eventInput.trim()) {
      setFormData({
        ...formData,
        events: [...formData.events, eventInput.trim()],
      });
      setEventInput("");
    }
  };

  const handleRemoveEvent = (index: number) => {
    setFormData({
      ...formData,
      events: formData.events.filter((_, i) => i !== index),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Agregar Competencia
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Nueva Competencia - Semana {weekNumber}
          </DialogTitle>
          <DialogDescription>
            Agrega una nueva competencia a esta semana del plan de entrenamiento
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-gray-700">Información Básica</h3>
            
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Competencia *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Campeonato Regional Master"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Competencia</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "Local" | "Regional" | "Nacional" | "Internacional") =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Local">Local</SelectItem>
                    <SelectItem value="Regional">Regional</SelectItem>
                    <SelectItem value="Nacional">Nacional</SelectItem>
                    <SelectItem value="Internacional">Internacional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="poolType">Tipo de Piscina</Label>
                <Select
                  value={formData.poolType}
                  onValueChange={(value: "25m" | "50m") =>
                    setFormData({ ...formData, poolType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50m">Piscina 50m</SelectItem>
                    <SelectItem value="25m">Piscina 25m</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Fechas y Horarios */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-gray-700">Fechas y Horarios</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Fecha de Inicio *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Fecha de Fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="schedule">Horarios</Label>
              <Input
                id="schedule"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                placeholder="Ej: 09:00 - 18:00"
              />
            </div>
          </div>

          {/* Ubicación e Inscripción */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-gray-700">Ubicación e Inscripción</h3>
            
            <div className="space-y-2">
              <Label htmlFor="location">Lugar *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ej: Centro Acuático Estadio Nacional"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Valor de Inscripción</Label>
              <Input
                id="cost"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                placeholder="Ej: $15.000"
              />
            </div>
          </div>

          {/* Pruebas Disponibles */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-gray-700">Pruebas Disponibles</h3>
            
            <div className="flex gap-2">
              <Input
                value={eventInput}
                onChange={(e) => setEventInput(e.target.value)}
                placeholder="Ej: 50m Libre, 100m Espalda"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddEvent();
                  }
                }}
              />
              <Button type="button" onClick={handleAddEvent} variant="outline">
                Agregar
              </Button>
            </div>

            {formData.events.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.events.map((event, index) => (
                  <div
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {event}
                    <button
                      type="button"
                      onClick={() => handleRemoveEvent(index)}
                      className="hover:text-blue-900"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Categorías */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                <Users className="w-4 h-4 text-red-600" />
                Categorías Permitidas
              </h3>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData({ ...formData, categories: [...AVAILABLE_CATEGORIES] })}
                >
                  Seleccionar Todas
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData({ ...formData, categories: [] })}
                >
                  Limpiar
                </Button>
              </div>
            </div>
            
            <p className="text-xs text-gray-600">
              {formData.categories.length === 0 
                ? "⚠️ Sin categorías seleccionadas = Todas las categorías pueden participar" 
                : `✓ ${formData.categories.length} categoría(s) seleccionada(s)`}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 bg-gray-50 rounded-lg border">
              {AVAILABLE_CATEGORIES.map((category) => {
                const isSelected = formData.categories.includes(category);
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setFormData({
                          ...formData,
                          categories: formData.categories.filter((c) => c !== category),
                        });
                      } else {
                        setFormData({
                          ...formData,
                          categories: [...formData.categories, category],
                        });
                      }
                    }}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors border ${
                      isSelected
                        ? "bg-red-600 text-white border-red-700 hover:bg-red-700"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {isSelected && "✓ "}
                    {category.replace(" 20", " '")}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Descripción Adicional */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción Adicional</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Información adicional sobre la competencia..."
              rows={3}
            />
          </div>

          {/* Adjuntar PDF */}
          <div className="space-y-2">
            <Label htmlFor="pdfFile" className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Adjuntar PDF (Opcional)
            </Label>
            <p className="text-xs text-gray-500 mb-2">
              Sube un archivo PDF con información oficial de la competencia (máx. 10MB)
            </p>
            <div className="flex items-center gap-2">
              <Input
                id="pdfFile"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="flex-1"
              />
              {pdfFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setPdfFile(null)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            {pdfFile && (
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-md border border-blue-200">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700 flex-1">{pdfFile.name}</span>
                <span className="text-xs text-gray-500">
                  {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar Competencia</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}