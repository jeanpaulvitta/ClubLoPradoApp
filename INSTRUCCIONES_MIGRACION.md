# 🔄 Instrucciones de Migración de Datos

## ¿Qué es esto?

La aplicación del Club Natación Lo Prado ahora tiene una **herramienta de migración** para transferir todos los datos de localStorage (navegador) a Supabase (servidor en la nube).

## ¿Por qué necesito esto?

Actualmente, todos tus datos están guardados **solo en tu navegador**. Esto significa:
- ❌ No puedes acceder desde otros dispositivos
- ❌ Si borras el caché del navegador, pierdes todo
- ❌ No hay backup en la nube

Después de migrar a Supabase:
- ✅ Acceso desde cualquier dispositivo
- ✅ Datos seguros en la nube
- ✅ Backup automático
- ✅ Sincronización en tiempo real

## 📋 Pasos para Migrar

### 1. **Iniciar Sesión como Administrador**

Solo los administradores pueden migrar datos.

- Usuario: `admin@loprado.cl`
- Contraseña: (la que configuraste)

### 2. **Ir a la Pestaña "Migración"**

Una vez autenticado como admin, verás una nueva pestaña en la barra superior:

```
[Usuarios] [Migración] 👈 Haz clic aquí
```

### 3. **Verificar el Estado del Backend**

En la pantalla de migración verás:

```
✅ Backend funcionando correctamente
```

Si ves un error rojo, el servidor de Supabase no está configurado. Contacta al soporte técnico.

### 4. **Revisar las Estadísticas**

Verás cuántos datos tienes en localStorage:

```
📊 Datos en localStorage
---------------------------
Nadadores: 15
Competencias: 8
Entrenamientos: 120
Asistencia: 450
Test Controls: 12
etc.
```

### 5. **Ejecutar la Migración**

1. Haz clic en el botón **"Migrar a Supabase"**
2. Confirma la acción en el diálogo que aparece
3. Espera mientras se migran los datos (puede tardar 1-2 minutos)

Verás un mensaje como:

```
✅ Migración exitosa: 605 registros migrados

📊 Resultados de migración:
  • Nadadores: 15
  • Competencias: 8
  • Entrenamientos: 120
  • Asistencia: 450
  ...
```

### 6. **Verificar los Datos**

1. Ve a las diferentes pestañas de la app (Entrenamientos, Nadadores, etc.)
2. Verifica que todos tus datos estén presentes
3. Si algo falta, **NO BORRES** localStorage todavía

### 7. **Limpiar localStorage (Opcional)**

Una vez que confirmes que TODO está correcto:

1. Vuelve a la pestaña "Migración"
2. Haz clic en **"Limpiar localStorage"**
3. Confirma la acción

Esto libera espacio en tu navegador, pero los datos siguen en Supabase.

## ⚠️ Importante

- **NO cierres la pestaña** durante la migración
- **NO borres localStorage** antes de verificar que los datos están en Supabase
- Si hay errores, anota los mensajes y contacta al soporte técnico

## 🔍 Resolución de Problemas

### "Backend no responde"

**Solución:** Verifica que las Edge Functions de Supabase estén desplegadas:

```bash
supabase functions deploy make-server-4909a0bc
```

### "No hay datos para migrar"

**Posibles causas:**
1. Ya migraste los datos anteriormente
2. No tienes datos en localStorage
3. Los datos están en diferentes keys (revisar consola)

### "Error al migrar [tipo de dato]"

**Solución:** Puede ser un problema de permisos o formato de datos. Revisa:

1. Consola del navegador (F12) para ver errores detallados
2. Logs de Supabase Edge Functions
3. Formato de los datos en localStorage

## 🆘 Soporte

Si tienes problemas con la migración:

1. Toma screenshots de los errores
2. Abre la consola del navegador (F12) y copia los mensajes de error
3. Contacta al administrador del sistema

## ✅ Después de Migrar

Una vez completada la migración:

- ✅ Podrás acceder desde cualquier dispositivo
- ✅ Los datos se guardarán automáticamente en Supabase
- ✅ Múltiples usuarios pueden trabajar simultáneamente
- ✅ Tienes backup automático en la nube

---

**Fecha:** Febrero 2026  
**Sistema:** Club Natación Lo Prado - Sistema de Gestión
