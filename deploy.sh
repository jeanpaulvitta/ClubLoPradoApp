#!/bin/bash

# 🚀 Script automático de despliegue para Club Natación Lo Prado
# Este script despliega la Edge Function a Supabase

echo "🏊 Club Natación Lo Prado - Despliegue Automático"
echo "=================================================="
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar que Supabase CLI está instalado
if ! command -v supabase &> /dev/null
then
    echo -e "${RED}❌ ERROR: Supabase CLI no está instalado${NC}"
    echo ""
    echo "📥 Instala Supabase CLI:"
    echo "   Mac:     brew install supabase/tap/supabase"
    echo "   Windows: https://github.com/supabase/cli/releases/latest/download/supabase_windows_amd64.msi"
    echo "   Linux:   brew install supabase/tap/supabase"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ Supabase CLI detectado${NC}"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -d "supabase/functions/make-server-4909a0bc" ]; then
    echo -e "${RED}❌ ERROR: No se encuentra la carpeta supabase/functions/make-server-4909a0bc${NC}"
    echo "   Asegúrate de ejecutar este script desde la raíz del proyecto"
    exit 1
fi

echo -e "${GREEN}✅ Carpeta del proyecto detectada${NC}"
echo ""

# Login
echo "🔐 Paso 1: Login a Supabase"
echo "   (Se abrirá el navegador para autenticación)"
echo ""
supabase login

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Login falló${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Login exitoso${NC}"
echo ""

# Link
echo "🔗 Paso 2: Vinculando proyecto..."
echo ""
supabase link --project-ref vrclozhgaacehojbnpuo

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Link falló. Intentando con credenciales...${NC}"
    echo "   Si no tienes la contraseña, presiona Enter"
    supabase link --project-ref vrclozhgaacehojbnpuo --password ""
fi

echo -e "${GREEN}✅ Proyecto vinculado${NC}"
echo ""

# Deploy
echo "🚀 Paso 3: Desplegando función..."
echo ""
supabase functions deploy make-server-4909a0bc

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Despliegue falló${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ ¡DESPLIEGUE COMPLETADO EXITOSAMENTE!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "📋 Próximos pasos:"
echo "   1. Recarga la aplicación (F5)"
echo "   2. Abre QuickFix (botón esquina inferior derecha)"
echo "   3. Ejecuta los tests"
echo "   4. Todos deben pasar (✅ OK)"
echo ""
echo "🎉 ¡El sistema está listo para usar!"
