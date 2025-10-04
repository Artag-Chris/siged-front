# 🔄 Migración a Axios - JWT Services

## ✅ Cambios Realizados

### 1. **Instalación de Axios**
```bash
npm install axios
```

### 2. **Reescritura completa de `jwt-api.service.ts`**
- ✅ **Fetch → Axios**: Reemplazado completamente
- ✅ **Interceptores**: Request y Response interceptors
- ✅ **Timeout**: 30 segundos por defecto
- ✅ **Logging mejorado**: URLs completas, headers, datos
- ✅ **Manejo de errores**: Centralizado y detallado

### 3. **Mejoras en `jwt-user.service.ts`**
- ✅ **Logs de URL completa**: Para usuario inicial y otros endpoints
- ✅ **Datos detallados**: Sin mostrar contraseñas en logs
- ✅ **Información de respuesta**: IDs, emails, roles, estados

## 🌐 URLs que se Logean

### Usuario Inicial (Público)
```
POST https://demo-facilwhatsappapi.facilcreditos.co/usuarios/create-initial-user
```

### Gestión de Usuarios (Con Auth)
```
GET    https://demo-facilwhatsappapi.facilcreditos.co/usuarios
POST   https://demo-facilwhatsappapi.facilcreditos.co/usuarios
GET    https://demo-facilwhatsappapi.facilcreditos.co/usuarios/inactivos
GET    https://demo-facilwhatsappapi.facilcreditos.co/usuarios/:id
PUT    https://demo-facilwhatsappapi.facilcreditos.co/usuarios/:id
DELETE https://demo-facilwhatsappapi.facilcreditos.co/usuarios/:id
PATCH  https://demo-facilwhatsappapi.facilcreditos.co/usuarios/:id/reactivar
```

## 📊 Logging Detallado

### Request Logs
```javascript
🌐 [JWT-API] POST https://demo-facilwhatsappapi.facilcreditos.co/usuarios/create-initial-user
📊 [JWT-API] Headers: { "Content-Type": "application/json", ... }
📤 [JWT-API] Request Data: { nombre: "...", email: "...", ... }
```

### Response Logs  
```javascript
✅ [JWT-API] Response 200: { ok: true, data: { id: "...", ... } }
🚀 [USER-SERVICE] URL completa: https://demo-facilwhatsappapi.facilcreditos.co/usuarios/create-initial-user
📤 [USER-SERVICE] Datos enviados: { nombre: "...", contrasena: "[OCULTA]" }
✅ [USER-SERVICE] Usuario inicial creado: { id: "...", email: "...", rol: "..." }
```

## 🔧 Características de Axios

### Interceptores Automáticos
- **Request**: Agrega token Bearer automáticamente
- **Response**: Logging de respuestas y errores
- **Error Handling**: Manejo centralizado de errores

### Timeouts y Reintentos
- **Timeout**: 30 segundos por petición
- **Headers**: Content-Type y Accept automáticos
- **Base URL**: Configurada desde environment

### Manejo de Errores
```javascript
// Errores de respuesta (4xx, 5xx)
❌ [JWT-API] Response Error 400: { url: "/usuarios", status: 400, data: {...} }

// Errores de red
❌ [JWT-API] Network Error: Network Error

// Errores de configuración  
❌ [JWT-API] Request Setup Error: Invalid URL
```

## 🧪 Testing

### Consola del Navegador
1. **Abrir DevTools** → Console
2. **Ir a** `/dashboard/usuarios/crear-inicial`
3. **Completar formulario** y enviar
4. **Ver logs** con prefijos `[JWT-API]` y `[USER-SERVICE]`

### URLs Esperadas
- Todas las URLs deben apuntar a `https://demo-facilwhatsappapi.facilcreditos.co`
- Endpoint usuario inicial: `/usuarios/create-initial-user`
- Headers con `Content-Type: application/json`
- Bearer token para rutas autenticadas

## 📝 Notas Importantes

1. **Backward Compatible**: No rompe funcionalidad existente
2. **Headers Automáticos**: Content-Type y Authorization
3. **Error Handling**: Mensajes más claros y específicos
4. **Logging**: Información detallada sin contraseñas
5. **Performance**: Interceptores eficientes con axios

¡Ahora todas las peticiones JWT usan Axios con logging completo! 🎉