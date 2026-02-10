import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Download, X, Smartphone } from "lucide-react";
import { registerServiceWorker, isServiceWorkerSupported } from "../utils/registerServiceWorker";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Solo intentar registrar Service Worker si está soportado
    if (isServiceWorkerSupported()) {
      // Registro silencioso - no logs si falla
      registerServiceWorker();
    }

    // Detectar si la app ya está instalada
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Capturar el evento de instalación
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      
      // Verificar si el usuario ya rechazó la instalación antes
      const installDismissed = localStorage.getItem('pwa-install-dismissed');
      if (!installDismissed) {
        // Mostrar el prompt después de 3 segundos
        setTimeout(() => {
          setShowInstallPrompt(true);
        }, 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detectar cuando se instala la app
    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA instalada exitosamente');
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Mostrar el prompt de instalación
    deferredPrompt.prompt();

    // Esperar la respuesta del usuario
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Usuario ${outcome === 'accepted' ? 'aceptó' : 'rechazó'} la instalación`);

    if (outcome === 'dismissed') {
      // Guardar que el usuario rechazó (no mostrar de nuevo por 7 días)
      const dismissedUntil = Date.now() + (7 * 24 * 60 * 60 * 1000);
      localStorage.setItem('pwa-install-dismissed', dismissedUntil.toString());
    }

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    const dismissedUntil = Date.now() + (7 * 24 * 60 * 60 * 1000);
    localStorage.setItem('pwa-install-dismissed', dismissedUntil.toString());
  };

  // Si ya está instalada o no hay prompt, no mostrar nada
  if (isInstalled || !showInstallPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:max-w-md animate-in slide-in-from-bottom duration-500">
      <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white border-red-500 shadow-2xl">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <div className="bg-white/20 rounded-full p-2">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base sm:text-lg mb-1">
                ¡Instala nuestra app!
              </h3>
              <p className="text-sm text-white/90 mb-3">
                Accede más rápido a entrenamientos, competencias y más. ¡Funciona sin conexión!
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleInstallClick}
                  className="bg-white text-red-600 hover:bg-gray-100 font-semibold"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Instalar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  className="text-white hover:bg-white/20"
                >
                  Ahora no
                </Button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}