import { useState } from 'react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { X } from 'lucide-react';

interface DiagnosticToolProps {
  onClose?: () => void;
}

export function DiagnosticTool({ onClose }: DiagnosticToolProps) {
  const [results, setResults] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, message]);
    console.log(message);
  };

  const runDiagnostics = async () => {
    setResults([]);
    setTesting(true);

    addResult('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    addResult('🔍 DIAGNÓSTICO DE EDGE FUNCTIONS');
    addResult('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    addResult(`📋 Project ID: ${projectId}`);
    addResult(`🔑 Anon Key: ${publicAnonKey.substring(0, 20)}...`);
    addResult('');

    // Test 1: public-access/health (sin auth)
    addResult('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    addResult('TEST 1: /public-access/health (SIN AUTH)');
    addResult('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
      const url1 = `https://${projectId}.supabase.co/functions/v1/public-access/health`;
      addResult(`📍 URL: ${url1}`);
      
      const res1 = await fetch(url1, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      addResult(`📡 Status: ${res1.status} ${res1.statusText}`);
      
      const data1 = await res1.json().catch(() => null);
      if (data1) {
        addResult(`✅ Response: ${JSON.stringify(data1, null, 2)}`);
      }
    } catch (error) {
      addResult(`❌ Error: ${error}`);
    }
    addResult('');

    // Test 2: public-access/health (CON anon key)
    addResult('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    addResult('TEST 2: /public-access/health (CON ANON KEY)');
    addResult('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
      const url2 = `https://${projectId}.supabase.co/functions/v1/public-access/health`;
      addResult(`📍 URL: ${url2}`);
      
      const res2 = await fetch(url2, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      addResult(`📡 Status: ${res2.status} ${res2.statusText}`);
      
      const data2 = await res2.json().catch(() => null);
      if (data2) {
        addResult(`✅ Response: ${JSON.stringify(data2, null, 2)}`);
      }
    } catch (error) {
      addResult(`❌ Error: ${error}`);
    }
    addResult('');

    // Test 3: make-server/health-v4 (sin prefijo, sin auth)
    addResult('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    addResult('TEST 3: /make-server-4909a0bc/health-v4 (SIN AUTH)');
    addResult('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
      const url3 = `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc/health-v4`;
      addResult(`📍 URL: ${url3}`);
      
      const res3 = await fetch(url3, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      addResult(`📡 Status: ${res3.status} ${res3.statusText}`);
      
      const data3 = await res3.json().catch(() => null);
      if (data3) {
        addResult(`✅ Response: ${JSON.stringify(data3, null, 2)}`);
      }
    } catch (error) {
      addResult(`❌ Error: ${error}`);
    }
    addResult('');

    // Test 4: Test crear solicitud en public-access
    addResult('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    addResult('TEST 4: /password-requests/create (RUTA CORRECTA)');
    addResult('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
      const url4 = `https://${projectId}.supabase.co/functions/v1/make-server-4909a0bc/password-requests/create`;
      addResult(`📍 URL: ${url4}`);
      
      const testData = {
        name: 'Test Diagnostic',
        email: `test-${Date.now()}@diagnostic.com`,
        role: 'swimmer'
      };
      addResult(`📤 Payload: ${JSON.stringify(testData)}`);
      
      const res4 = await fetch(url4, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(testData)
      });
      
      addResult(`📡 Status: ${res4.status} ${res4.statusText}`);
      
      const data4 = await res4.json().catch(() => null);
      if (data4) {
        addResult(`✅ Response: ${JSON.stringify(data4, null, 2)}`);
      }
    } catch (error) {
      addResult(`❌ Error: ${error}`);
    }
    addResult('');

    addResult('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    addResult('✅ DIAGNÓSTICO COMPLETADO');
    addResult('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    setTesting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col relative">
        {/* Botón de cerrar */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-full p-2 transition-colors"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        )}

        <h2 className="text-2xl font-bold mb-4">🔍 Herramienta de Diagnóstico</h2>
        
        <button
          onClick={runDiagnostics}
          disabled={testing}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed mb-4"
        >
          {testing ? '⏳ Ejecutando diagnóstico...' : '▶️ Ejecutar Diagnóstico Completo'}
        </button>

        <div className="flex-1 overflow-y-auto bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
          {results.length === 0 ? (
            <p className="text-gray-500">Presiona el botón para iniciar el diagnóstico...</p>
          ) : (
            results.map((result, index) => (
              <div key={index} className="whitespace-pre-wrap">
                {result}
              </div>
            ))
          )}
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-semibold text-yellow-900 mb-2">📋 Instrucciones:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-800">
            <li>Ejecuta el diagnóstico completo</li>
            <li>Copia TODA la salida de la consola (texto verde)</li>
            <li>Envíamela para analizar el problema</li>
          </ol>
        </div>
      </div>
    </div>
  );
}