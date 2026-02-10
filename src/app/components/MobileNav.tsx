import { useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Menu, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface MobileNavProps {
  tabs: Array<{ value: string; label: string; icon: React.ComponentType<{ className?: string }> }>;
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function MobileNav({ tabs, activeTab, onTabChange }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const handleTabClick = (value: string) => {
    onTabChange(value);
    setOpen(false);
  };

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] sm:w-[320px] bg-black text-white border-r-gray-800">
          <SheetHeader className="border-b border-gray-800 pb-4 mb-4">
            <SheetTitle className="text-white text-left">Navegación</SheetTitle>
          </SheetHeader>
          
          <nav className="flex flex-col gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.value;
              
              return (
                <button
                  key={tab.value}
                  onClick={() => handleTabClick(tab.value)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive
                      ? "bg-red-600 text-white"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="text-sm text-gray-400">
              <p className="font-semibold text-white mb-1">
                {user?.name || "Usuario"}
              </p>
              <p className="text-xs capitalize">{user?.role || "nadador"}</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
