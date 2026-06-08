import { useState } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Pencil } from "lucide-react";
import type { Swimmer } from "../data/swimmers";
import { calculateAge, calculateCategoryFromBirthDate } from "../utils/swimmerUtils";
import { ProfileImagePicker } from "./ProfileImagePicker";

const SCHEDULES = [
  { value: "6am",    label: "6:00 AM" },
  { value: "6:30am", label: "6:30 AM" },
  { value: "7am",    label: "7:00 AM" },
  { value: "7:30am", label: "7:30 AM" },
  { value: "8am",    label: "8:00 AM" },
  { value: "8:30am", label: "8:30 AM" },
  { value: "9am",    label: "9:00 AM" },
  { value: "10am",   label: "10:00 AM" },
  { value: "5pm",    label: "5:00 PM" },
  { value: "6pm",    label: "6:00 PM" },
  { value: "7pm",    label: "7:00 PM" },
  { value: "7:30pm", label: "7:30 PM" },
  { value: "8pm",    label: "8:00 PM" },
  { value: "9pm",    label: "9:00 PM" },
  { value: "10pm",   label: "10:00 PM" },
];

interface EditSwimmerDialogProps {
  swimmer: Swimmer;
  onEdit: (id: string, updatedSwimmer: Omit<Swimmer, "id">) => void;
}

export function EditSwimmerDialog({ swimmer, onEdit }: EditSwimmerDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name:          swimmer.name,
    email:         swimmer.email,
    rut:           swimmer.rut ?? "",
    gender:        (swimmer.gender ?? "Masculino") as "Masculino" | "Femenino" | "Otro",
    schedule:      swimmer.schedule,
    dateOfBirth:   swimmer.dateOfBirth,
    joinDate:      swimmer.joinDate,
    profileImage:  swimmer.profileImage,
    status:        swimmer.status ?? "Activo",
    phone:         swimmer.phone ?? "",
    guardianName:  swimmer.guardianName ?? "",
    guardianPhone: swimmer.guardianPhone ?? "",
    school:        swimmer.school ?? "",
    nationality:   swimmer.nationality ?? "",
    commune:       swimmer.commune ?? "",
    address:       swimmer.address ?? "",
    characteristic: swimmer.characteristic ?? "",
  });

  const calculatedCategory = formData.dateOfBirth
    ? calculateCategoryFromBirthDate(formData.dateOfBirth)
    : "";
  const calculatedAge = formData.dateOfBirth ? calculateAge(formData.dateOfBirth) : null;

  const set = (k: keyof typeof formData, v: string) =>
    setFormData(prev => ({ ...prev, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(swimmer.id, {
      // Preserve all existing fields then override with form values
      ...swimmer,
      name:          formData.name,
      email:         formData.email,
      rut:           formData.rut || undefined,
      gender:        formData.gender,
      schedule:      formData.schedule,
      dateOfBirth:   formData.dateOfBirth,
      joinDate:      formData.joinDate,
      profileImage:  formData.profileImage,
      status:        formData.status as Swimmer["status"],
      phone:         formData.phone || undefined,
      guardianName:  formData.guardianName || undefined,
      guardianPhone: formData.guardianPhone || undefined,
      school:        formData.school || undefined,
      nationality:   formData.nationality || undefined,
      commune:       formData.commune || undefined,
      address:       formData.address || undefined,
      characteristic: formData.characteristic || undefined,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Pencil className="w-4 h-4" />
          Editar Ficha
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Editar Nadador</DialogTitle>
          <DialogDescription>Modifica la información del nadador</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="space-y-3 overflow-y-auto pr-1 flex-1 py-1">

            {/* ── Identificación ─────────────────────────────────── */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Identificación</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1">
                <Label htmlFor="e-name" className="text-xs">Nombre Completo *</Label>
                <Input id="e-name" value={formData.name} onChange={e => set("name", e.target.value)} required className="h-8 text-sm" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="e-rut" className="text-xs">RUT</Label>
                <Input id="e-rut" value={formData.rut} onChange={e => set("rut", e.target.value)} placeholder="12.345.678-9" className="h-8 text-sm" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="e-gender" className="text-xs">Género</Label>
                <Select value={formData.gender} onValueChange={v => set("gender", v)}>
                  <SelectTrigger id="e-gender" className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Femenino">Femenino</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="e-dob" className="text-xs">Fecha de Nacimiento *</Label>
                <Input id="e-dob" value={formData.dateOfBirth} onChange={e => set("dateOfBirth", e.target.value)} placeholder="YYYY-MM-DD" required className="h-8 text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Categoría / Edad</Label>
                <Input value={calculatedCategory ? `${calculatedCategory} · ${calculatedAge}a` : "—"} readOnly className="h-8 text-sm bg-gray-50" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="e-nationality" className="text-xs">Nacionalidad</Label>
                <Input id="e-nationality" value={formData.nationality} onChange={e => set("nationality", e.target.value)} placeholder="Chilena" className="h-8 text-sm" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="e-status" className="text-xs">Estado</Label>
                <Select value={formData.status} onValueChange={v => set("status", v)}>
                  <SelectTrigger id="e-status" className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                    <SelectItem value="Suspendido">Suspendido</SelectItem>
                    <SelectItem value="Egresado">Egresado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ── Contacto deportista ─────────────────────────────── */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-2">Contacto deportista</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1">
                <Label htmlFor="e-email" className="text-xs">Email</Label>
                <Input id="e-email" type="email" value={formData.email} onChange={e => set("email", e.target.value)} className="h-8 text-sm" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="e-phone" className="text-xs">Teléfono</Label>
                <Input id="e-phone" value={formData.phone} onChange={e => set("phone", e.target.value)} placeholder="+56 9 1234 5678" className="h-8 text-sm" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="e-school" className="text-xs">Colegio</Label>
                <Input id="e-school" value={formData.school} onChange={e => set("school", e.target.value)} className="h-8 text-sm" />
              </div>
            </div>

            {/* ── Apoderado ───────────────────────────────────────── */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-2">Apoderado</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1">
                <Label htmlFor="e-guardian" className="text-xs">Nombre apoderado</Label>
                <Input id="e-guardian" value={formData.guardianName} onChange={e => set("guardianName", e.target.value)} className="h-8 text-sm" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="e-gphone" className="text-xs">Teléfono apoderado</Label>
                <Input id="e-gphone" value={formData.guardianPhone} onChange={e => set("guardianPhone", e.target.value)} placeholder="+56 9 8765 4321" className="h-8 text-sm" />
              </div>
            </div>

            {/* ── Dirección ───────────────────────────────────────── */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-2">Dirección</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="e-commune" className="text-xs">Comuna</Label>
                <Input id="e-commune" value={formData.commune} onChange={e => set("commune", e.target.value)} className="h-8 text-sm" />
              </div>
              <div className="col-span-2 space-y-1">
                <Label htmlFor="e-address" className="text-xs">Dirección</Label>
                <Input id="e-address" value={formData.address} onChange={e => set("address", e.target.value)} className="h-8 text-sm" />
              </div>
            </div>

            {/* ── Club ────────────────────────────────────────────── */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-2">Club</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="e-schedule" className="text-xs">Horario</Label>
                <Select value={formData.schedule} onValueChange={v => set("schedule", v)}>
                  <SelectTrigger id="e-schedule" className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SCHEDULES.map(s => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="e-joinDate" className="text-xs">Fecha de ingreso</Label>
                <Input id="e-joinDate" value={formData.joinDate} onChange={e => set("joinDate", e.target.value)} className="h-8 text-sm" />
              </div>
              <div className="col-span-2 space-y-1">
                <Label htmlFor="e-char" className="text-xs">Característica</Label>
                <Input id="e-char" value={formData.characteristic} onChange={e => set("characteristic", e.target.value)} placeholder="Velocista, Fondista, etc." className="h-8 text-sm" />
              </div>
            </div>

            {/* ── Foto ────────────────────────────────────────────── */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-2">Foto de perfil</p>
            <ProfileImagePicker
              currentImage={formData.profileImage}
              onImageChange={img => setFormData(prev => ({ ...prev, profileImage: img }))}
              size="medium"
            />
          </div>

          <DialogFooter className="flex-shrink-0 pt-3 border-t mt-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Guardar Cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
