import React, { Component, ReactNode } from 'react';
import { Card, CardContent } from './ui/card';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('❌ Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 flex items-center justify-center p-4">
          <Card className="max-w-md bg-gray-800 border-red-500/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-bold text-red-500 mb-2">Error en la Aplicación</h2>
                  <p className="text-gray-300 mb-4">
                    Ha ocurrido un error inesperado. Por favor, recarga la página.
                  </p>
                  {this.state.error && (
                    <details className="text-xs text-gray-400 mb-4">
                      <summary className="cursor-pointer hover:text-gray-300">Detalles técnicos</summary>
                      <pre className="mt-2 p-2 bg-gray-900 rounded overflow-auto">
                        {this.state.error.toString()}
                      </pre>
                    </details>
                  )}
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                  >
                    Recargar Página
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
