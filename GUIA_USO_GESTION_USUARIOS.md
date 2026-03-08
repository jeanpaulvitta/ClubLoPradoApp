# 📖 Guía de Uso - Gestión de Usuarios

**Sistema:** Club Natación Lo Prado  
**Versión:** 2.0 (Simplificada)  
**Fecha:** Marzo 2026

---

## 🎯 Para Administradores

### ✅ Cómo Aprobar una Solicitud de Acceso

#### Paso 1: Acceder a la Pestaña Usuarios
1. Inicia sesión como **Administrador**
2. Ve a la pestaña **"Usuarios"** en la barra superior
3. Verás las estadísticas de solicitudes (Pendientes/Aprobadas/Rechazadas)

#### Paso 2: Revisar Solicitudes Pendientes
Encontrarás una tabla con:
- **Nombre**: Nombre completo del solicitante
- **Email**: Correo electrónico
- **Rol**: Entrenador o Nadador
- **Fecha**: Cuándo solicitó acceso

#### Paso 3: Aprobar la Solicitud
1. **Verifica** que el servidor esté configurado (debe mostrar "✅ Servidor Configurado")
2. Click en el botón **"Aprobar"** 🟢
3. El sistema automáticamente:
   - ✅ Crea la cuenta en Supabase
   - ✅ Genera una contraseña segura de 15 caracteres
   - ✅ Vincula con el perfil del nadador si existe
   - ✅ Abre el diálogo de credenciales

#### Paso 4: Compartir Credenciales

Se abrirá un diálogo con las credenciales generadas. Tienes **4 opciones**:

##### 🔵 Opción 1: Copiar Todo
- Click en **"Copiar Todo"**
- Se copia un mensaje formateado completo
- Pégalo donde quieras enviarlo (WhatsApp, SMS, etc.)

##### 🟢 Opción 2: WhatsApp (Recomendado)
- Click en **"WhatsApp"**
- Se abre WhatsApp Web o la app
- El mensaje ya está formateado
- Solo elige el contacto y envía

##### 📧 Opción 3: Email
- Click en **"Email"**
- Se abre tu cliente de correo
- El destinatario, asunto y mensaje ya están listos
- Solo click en "Enviar"

##### 📱 Opción 4: Código QR
- Click en **"Mostrar QR"**
- Se genera un código QR
- El usuario puede escanearlo con su teléfono
- Útil si están en persona

#### Paso 5: Cerrar el Diálogo
- Una vez compartidas las credenciales, click en **"Cerrar"**
- La solicitud se moverá a la sección "Solicitudes Aprobadas"

### ❌ Cómo Rechazar una Solicitud

1. Revisa la solicitud en la tabla de "Pendientes"
2. Click en el botón **"Rechazar"** 🔴
3. La solicitud se moverá a "Rechazadas"
4. El usuario **NO** recibirá ninguna notificación automática

---

## 👤 Para Usuarios Nuevos (Nadadores/Entrenadores)

### 📝 Cómo Solicitar Acceso

#### Paso 1: Ir a la Pantalla de Login
1. Abre la aplicación del Club Natación Lo Prado
2. Verás la pantalla de inicio de sesión

#### Paso 2: Solicitar Acceso
1. Click en el botón **"¿No tienes cuenta? Solicitar Acceso"**
2. Se abrirá un formulario

#### Paso 3: Completar el Formulario
Completa los siguientes campos:
- **Nombre Completo**: Tu nombre y apellido
- **Correo Electrónico**: Email válido (donde recibirás las credenciales)
- **Rol**: Selecciona "Nadador" o "Entrenador"

#### Paso 4: Enviar Solicitud
1. Click en **"Enviar Solicitud"**
2. Verás un mensaje de confirmación
3. Ahora debes **esperar** a que un administrador apruebe tu solicitud

#### Paso 5: Recibir Credenciales
El administrador te enviará las credenciales por:
- WhatsApp (más común)
- Email
- QR Code
- Mensaje de texto

Recibirás algo como:
```
🏊‍♂️ CLUB NATACIÓN LO PRADO
Credenciales de Acceso

📧 Email: tunombre@ejemplo.com
🔑 Contraseña: 7hG4kL9mN2pQ5rT

Ingresa a la aplicación con estas credenciales
```

#### Paso 6: Iniciar Sesión
1. Vuelve a la pantalla de inicio
2. Ingresa tu **email** y **contraseña**
3. Click en **"Iniciar Sesión"**
4. ¡Listo! Ya tienes acceso

#### Paso 7: Cambiar Contraseña (Opcional)
Por seguridad, es recomendable cambiar tu contraseña:
1. Ve a tu **Perfil**
2. Busca la opción **"Cambiar Contraseña"**
3. Ingresa la contraseña actual y la nueva
4. Guarda los cambios

---

## 🔧 Solución de Problemas Comunes

### ⚠️ "Servidor sin configurar"

**Problema:** El botón "Aprobar" está deshabilitado y dice "Servidor sin configurar"

**Solución:**
1. El administrador debe configurar el servidor Edge Function en Supabase
2. Sigue la guía visual que aparece automáticamente
3. Configura las 3 variables de entorno:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Reinicia la función
5. Click en "Verificar de Nuevo"

### ⚠️ "Este usuario ya tiene una cuenta creada"

**Problema:** Al aprobar una solicitud, aparece este error

**Solución:**
- El email ya está registrado en el sistema
- La solicitud se marca como aprobada automáticamente
- Puedes recuperar la contraseña usando el flujo normal de recuperación

### ⚠️ "Ya existe una solicitud pendiente para este correo"

**Problema:** Al intentar solicitar acceso, aparece este mensaje

**Solución:**
- Ya enviaste una solicitud anteriormente
- Espera a que el administrador la procese
- Si ha pasado mucho tiempo, contacta al administrador

### ⚠️ No puedo copiar las credenciales

**Problema:** El botón "Copiar" no funciona

**Solución:**
1. Intenta con otro navegador (Chrome, Firefox, Edge)
2. Asegúrate de que el navegador tenga permisos de portapapeles
3. Como alternativa, usa el botón "WhatsApp" o "Email"
4. O selecciona manualmente el texto y copia (Ctrl+C)

---

## 📊 Estadísticas y Reportes

### Ver Solicitudes Aprobadas
1. Ve a la pestaña "Usuarios"
2. Baja hasta "Solicitudes Aprobadas"
3. Verás una tabla con todos los usuarios creados
4. Puedes:
   - Ver la contraseña generada (preview)
   - Copiar credenciales individuales
   - Ver fecha de aprobación

### Ver Solicitudes Rechazadas
- Aparece en las estadísticas superiores
- Contador en rojo "Rechazadas: [N]"
- Por ahora no hay tabla individual (puede agregarse a futuro)

---

## 🔐 Seguridad y Buenas Prácticas

### Para Administradores:
✅ **SÍ:**
- Verifica la identidad del solicitante antes de aprobar
- Comparte credenciales por canales seguros (WhatsApp personal, email)
- Mantén un registro de quién aprobaste
- Configura correctamente el servidor antes de aprobar solicitudes

❌ **NO:**
- No apruebes solicitudes de emails desconocidos
- No compartas credenciales en grupos públicos
- No dejes contraseñas visibles en pantallas compartidas
- No apruebes solicitudes si el servidor no está configurado

### Para Usuarios:
✅ **SÍ:**
- Usa un email válido y que revises regularmente
- Cambia tu contraseña después de iniciar sesión por primera vez
- Guarda tus credenciales en un lugar seguro
- Contacta al administrador si no recibes las credenciales en 24-48 horas

❌ **NO:**
- No compartas tu contraseña con nadie
- No uses contraseñas obvias o fáciles de adivinar
- No solicites acceso múltiples veces (espera respuesta)
- No uses emails temporales o falsos

---

## 📞 Contacto y Soporte

Si tienes problemas o dudas:

1. **Para usuarios nuevos:**
   - Contacta al administrador del club
   - Asegúrate de haber completado correctamente el formulario

2. **Para administradores:**
   - Revisa la documentación en:
     - `/SOLUCION_MISSING_AUTHORIZATION_HEADER.md`
     - `/GUIA_RAPIDA_SERVIDOR.md`
     - `/CAMBIOS_PESTAÑA_USUARIOS.md`
   - Verifica la consola del navegador para errores
   - Usa el botón "Probar Auth" para diagnóstico

---

## 🎓 Preguntas Frecuentes

### ❓ ¿Cuánto tiempo tarda en aprobarse una solicitud?
Depende del administrador. Puede ser desde minutos hasta 1-2 días hábiles.

### ❓ ¿Puedo cambiar mi rol después de registrarme?
No directamente. Debes contactar al administrador para que actualice tu perfil.

### ❓ ¿Qué pasa si olvido mi contraseña?
Actualmente debes contactar al administrador para que te ayude a recuperarla o crear una nueva.

### ❓ ¿Puedo solicitar acceso para otra persona?
Cada persona debe solicitar su propio acceso con su email personal.

### ❓ ¿Las credenciales expiran?
No, pero es recomendable cambiar la contraseña periódicamente por seguridad.

### ❓ ¿Qué información necesito para solicitar acceso?
Solo tu nombre completo, email válido y seleccionar tu rol (Nadador/Entrenador).

---

**Versión del documento:** 1.0  
**Última actualización:** 8 de marzo de 2026  
**Sistema:** Club Natación Lo Prado - Gestión de Usuarios
