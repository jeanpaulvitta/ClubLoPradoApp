@echo off
REM Script automatico de despliegue para Club Natacion Lo Prado
REM Este script despliega la Edge Function a Supabase

echo.
echo ========================================================
echo   Club Natacion Lo Prado - Despliegue Automatico
echo ========================================================
echo.

REM Verificar que Supabase CLI esta instalado
where supabase >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Supabase CLI no esta instalado
    echo.
    echo Opciones de instalacion:
    echo.
    echo OPCION 1 - NPM (Recomendado):
    echo   npm install -g supabase
    echo.
    echo OPCION 2 - Scoop:
    echo   scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
    echo   scoop install supabase
    echo.
    echo OPCION 3 - Descarga manual:
    echo   https://github.com/supabase/cli/releases
    echo.
    pause
    exit /b 1
)

echo [OK] Supabase CLI detectado
echo.

REM Verificar que estamos en el directorio correcto
if not exist "supabase\functions\make-server-4909a0bc" (
    echo [ERROR] No se encuentra la carpeta supabase\functions\make-server-4909a0bc
    echo Asegurate de ejecutar este script desde la raiz del proyecto
    echo.
    pause
    exit /b 1
)

echo [OK] Carpeta del proyecto detectada
echo.

REM Login
echo [Paso 1] Login a Supabase
echo (Se abrira el navegador para autenticacion)
echo.
supabase login

if %errorlevel% neq 0 (
    echo [ERROR] Login fallo
    pause
    exit /b 1
)

echo [OK] Login exitoso
echo.

REM Link
echo [Paso 2] Vinculando proyecto...
echo.
supabase link --project-ref vrclozhgaacehojbnpuo

if %errorlevel% neq 0 (
    echo [WARN] Link fallo. Intentando con credenciales...
    echo Si no tienes la contrasena, presiona Enter
    supabase link --project-ref vrclozhgaacehojbnpuo --password ""
)

echo [OK] Proyecto vinculado
echo.

REM Deploy
echo [Paso 3] Desplegando funcion...
echo.
supabase functions deploy make-server-4909a0bc

if %errorlevel% neq 0 (
    echo [ERROR] Despliegue fallo
    pause
    exit /b 1
)

echo.
echo ========================================================
echo   DESPLIEGUE COMPLETADO EXITOSAMENTE!
echo ========================================================
echo.
echo Proximos pasos:
echo   1. Recarga la aplicacion (F5)
echo   2. Abre QuickFix (boton esquina inferior derecha)
echo   3. Ejecuta los tests
echo   4. Todos deben pasar (OK)
echo.
echo El sistema esta listo para usar!
echo.
pause