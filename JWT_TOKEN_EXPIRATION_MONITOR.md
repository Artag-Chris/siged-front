# Sistema de Monitoreo de Expiración de Tokens JWT

## 🎯 Objetivo

Implementar un sistema automático que verifique la validez del token JWT periódicamente y cierre sesión automáticamente cuando el token expire o esté próximo a expirar.

## 📋 Características

✅ **Verificación Automática**: Revisa el token cada 1 minuto (configurable)  
✅ **Decodificación JWT**: Sin dependencias externas, usando base64 nativo  
✅ **Advertencia Pre-Expiración**: Alerta al usuario 5 minutos antes de expirar  
✅ **Logout Automático**: Cierra sesión y redirige al login cuando expira  
✅ **Sin Duplicación**: Previene múltiples logout simultáneos  
✅ **Logs Detallados**: Información completa en consola para debugging  
✅ **Integración Transparente**: Se activa automáticamente en el dashboard  

## 🏗️ Arquitectura

### 1. Utilidades JWT (`lib/jwt-utils.ts`)

Funciones puras para manejo de tokens:

```typescript
// Decodificar token JWT (sin verificar firma)
decodeJWT(token: string): any

// Verificar si el token está expirado
isTokenExpired(token: string | null): boolean

// Obtener tiempo restante en segundos
getTokenExpirationTime(token: string | null): number

// Verificar si expirará pronto (por defecto 5 min)
isTokenExpiringSoon(token: string | null, thresholdMinutes?: number): boolean

// Extraer información del usuario del token
getUserFromToken(token: string | null): any

// Formatear tiempo restante (ej: "45m 30s")
formatTimeLeft(seconds: number): string
```

**Ejemplo de uso:**

```typescript
import { isTokenExpired, getTokenExpirationTime } from '@/lib/jwt-utils';

const token = localStorage.getItem('access_token');

if (isTokenExpired(token)) {
  console.log('Token expirado');
} else {
  const timeLeft = getTokenExpirationTime(token);
  console.log(`Token válido por ${timeLeft} segundos más`);
}
```

### 2. Hook de Monitoreo (`hooks/useTokenExpirationMonitor.ts`)

Hook personalizado que activa un intervalo para verificar el token:

```typescript
useTokenExpirationMonitor({
  checkInterval?: number;              // Intervalo de verificación (ms)
  redirectTo?: string;                 // Ruta de redirección
  showWarning?: boolean;               // Mostrar advertencia
  warningThresholdMinutes?: number;    // Umbral de advertencia
  onTokenExpiring?: () => void;        // Callback al expirar pronto
  onTokenExpired?: () => void;         // Callback al expirar
  enabled?: boolean;                   // Activar/desactivar
})
```

**Flujo del Hook:**

1. **Verifica cada X tiempo** (por defecto 1 minuto)
2. **Si no hay token** → Logout automático
3. **Si token expiró** → Logout + redirección al login
4. **Si expirará pronto** → Ejecuta callback de advertencia
5. **Si sigue válido** → Continúa monitoreando

**Características:**

- ✅ Previene múltiples ejecuciones con `useRef`
- ✅ Limpia intervalos al desmontar componente
- ✅ Se resetea al cambiar estado de autenticación
- ✅ Ejecuta verificación inmediata al montar

### 3. Componente Guardia (`components/token-expiration-guard.tsx`)

Componente sin UI que activa el monitor en cualquier parte de la app:

```typescript
<TokenExpirationGuard 
  checkInterval={60000}  // 1 minuto
  redirectTo="/login"
  enableLogs={true}
/>
```

**Características:**

- 🔒 No renderiza nada (return null)
- 🎯 Se activa solo si el usuario está autenticado
- 📊 Logs opcionales para debugging
- 🔄 Se integra fácilmente en layouts

### 4. Integración en Navbar (`components/navbar.tsx`)

El navbar ahora incluye:

#### A. Monitor activo con callbacks

```typescript
const handleTokenExpiring = useCallback(() => {
  console.log('⚠️ Token está por expirar');
  setShowExpirationWarning(true);
  
  // Auto-ocultar después de 30 segundos
  setTimeout(() => {
    setShowExpirationWarning(false);
  }, 30000);
}, []);

useTokenExpirationMonitor({
  checkInterval: 60000,
  warningThresholdMinutes: 5,
  onTokenExpiring: handleTokenExpiring,
  enabled: isAuthenticated
});
```

#### B. Alerta visual de expiración

Cuando el token está por expirar (5 minutos antes), aparece una alerta amarilla en la parte superior:

```tsx
{showExpirationWarning && (
  <Alert variant="default" className="border-yellow-400">
    <AlertTriangle className="h-4 w-4 text-yellow-600" />
    <AlertTitle>Sesión próxima a expirar</AlertTitle>
    <AlertDescription>
      Tu sesión expirará en menos de 5 minutos. 
      Guarda tu trabajo.
    </AlertDescription>
  </Alert>
)}
```

### 5. Integración en Layout (`app/dashboard/layout.tsx`)

El layout principal del dashboard activa el guardian:

```typescript
<ProtectedRoute>
  <TokenExpirationGuard 
    checkInterval={60000}
    redirectTo="/login"
  />
  
  <Navbar />
  <AdminSidebar />
  <main>{children}</main>
</ProtectedRoute>
```

## 🔄 Flujo Completo del Sistema

```
Usuario autenticado
       ↓
TokenExpirationGuard se activa
       ↓
Cada 60 segundos verifica:
       ↓
   ¿Token existe?
       ↓ No → Logout + /login
       ↓ Yes
   ¿Token expirado?
       ↓ Yes → Logout + /login
       ↓ No
   ¿Expira en < 5min?
       ↓ Yes → Mostrar alerta amarilla
       ↓ No
   Continuar monitoreando
       ↓
   (Volver a verificar en 60s)
```

## ⚙️ Configuración

### Cambiar intervalo de verificación

```typescript
// Verificar cada 30 segundos
<TokenExpirationGuard checkInterval={30000} />

// Verificar cada 2 minutos
<TokenExpirationGuard checkInterval={120000} />
```

### Cambiar umbral de advertencia

```typescript
// Advertir 10 minutos antes
useTokenExpirationMonitor({
  warningThresholdMinutes: 10
})

// Advertir 2 minutos antes
useTokenExpirationMonitor({
  warningThresholdMinutes: 2
})
```

### Desactivar advertencias

```typescript
useTokenExpirationMonitor({
  showWarning: false
})
```

### Ruta personalizada de redirección

```typescript
<TokenExpirationGuard redirectTo="/auth/login" />
```

## 📊 Logs en Consola

El sistema genera logs detallados:

```
✅ [JWT-UTILS] Token válido. Expira en 45 minutos (8/10/2025 14:30:00)
🔍 [TOKEN-MONITOR] Monitor iniciado (verificando cada 60s)
⚠️ [TOKEN-MONITOR] Token expirará en 4 minutos
⏰ [TOKEN-MONITOR] Token expirado detectado
🔄 [TOKEN-MONITOR] Cerrando sesión por token expirado...
🛑 [TOKEN-MONITOR] Monitor detenido
```

## 🎨 Componentes UI Utilizados

- **Alert** (shadcn/ui): Alerta de advertencia
- **AlertTitle**: Título de la alerta
- **AlertDescription**: Descripción de la alerta
- **AlertTriangle** (Lucide): Icono de advertencia
- **Clock** (Lucide): Icono de tiempo

## 🔐 Seguridad

### ¿Por qué es seguro?

1. **Decodificación sin verificación**: Solo lee el payload para obtener `exp`, no valida la firma (eso lo hace el backend)
2. **No expone datos sensibles**: Solo muestra información ya presente en el token
3. **Previene sesiones zombie**: Cierra sesiones expiradas aunque el usuario esté activo
4. **Sin almacenamiento adicional**: Usa el token que ya está en localStorage

### ¿Qué pasa si manipulan el token?

El frontend **solo verifica la fecha de expiración**. La validación real de la firma JWT la hace el **backend** en cada petición. Si alguien manipula el token:

- Frontend puede pensar que es válido
- Backend rechazará todas las peticiones (401 Unauthorized)
- Usuario no podrá hacer nada útil

## 🧪 Testing

### Probar expiración manual

1. Obtén un token JWT de desarrollo
2. Edita el payload manualmente para que `exp` sea en el pasado
3. Guárdalo en localStorage
4. Recarga la página
5. Deberías ser deslogueado inmediatamente

### Simular token próximo a expirar

```typescript
// En jwt-utils.ts, temporalmente cambia:
const thresholdSeconds = thresholdMinutes * 60;

// Por:
const thresholdSeconds = thresholdMinutes * 3600; // Horas en vez de minutos
```

Esto hará que la advertencia aparezca cuando falten 5 horas, no 5 minutos.

## 📈 Ventajas del Sistema

| Aspecto | Sin Monitor | Con Monitor |
|---------|-------------|-------------|
| **Seguridad** | Usuario puede quedar con sesión expirada | Logout automático al expirar |
| **UX** | Errores 401 inesperados | Advertencia anticipada |
| **Datos** | Pérdida de cambios no guardados | Tiempo para guardar |
| **Backend** | Sobrecarga de requests inválidos | Menos peticiones con tokens expirados |
| **Debugging** | Difícil saber si token expiró | Logs claros de estado del token |

## 🚀 Mejoras Futuras (Opcionales)

### 1. Refresh Token Automático

Si el backend soporta refresh tokens, podrías intentar renovar antes de expirar:

```typescript
const handleTokenExpiring = async () => {
  const { refreshTokens } = useJwtAuthStore.getState();
  const renewed = await refreshTokens();
  
  if (!renewed) {
    setShowExpirationWarning(true);
  }
};
```

### 2. Mostrar contador regresivo

```typescript
const [timeLeft, setTimeLeft] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    const token = getAccessToken();
    setTimeLeft(getTokenExpirationTime(token));
  }, 1000);
  
  return () => clearInterval(interval);
}, []);

// En el UI:
<Badge>Sesión expira en: {formatTimeLeft(timeLeft)}</Badge>
```

### 3. Persistir actividad del usuario

```typescript
// Extender sesión si hay actividad reciente
useEffect(() => {
  const handleActivity = () => {
    localStorage.setItem('last_activity', Date.now().toString());
  };
  
  window.addEventListener('click', handleActivity);
  window.addEventListener('keypress', handleActivity);
  
  return () => {
    window.removeEventListener('click', handleActivity);
    window.removeEventListener('keypress', handleActivity);
  };
}, []);
```

## 📝 Archivos Modificados/Creados

### Nuevos Archivos

1. ✅ `src/lib/jwt-utils.ts` - Utilidades de JWT
2. ✅ `src/hooks/useTokenExpirationMonitor.ts` - Hook de monitoreo
3. ✅ `src/components/token-expiration-guard.tsx` - Componente guardian

### Archivos Modificados

1. ✅ `src/components/navbar.tsx` - Agregado monitor + alerta
2. ✅ `src/app/dashboard/layout.tsx` - Integrado TokenExpirationGuard

## 🎯 Resultado Final

El sistema ahora:

✅ **Revisa el token cada 1 minuto automáticamente**  
✅ **Muestra advertencia 5 minutos antes de expirar**  
✅ **Cierra sesión automáticamente cuando expira**  
✅ **Redirige al login después de logout**  
✅ **Funciona en todo el dashboard sin configuración adicional**  
✅ **No requiere cambios en componentes existentes**  
✅ **Logs detallados para debugging**  
✅ **Sin dependencias externas (jwt-decode, etc.)**  

---

**Última actualización:** 8 de octubre de 2025  
**Autor:** Sistema de IA - GitHub Copilot  
**Integración:** Transparente y automática en todo el dashboard
