# 🔧 Configuración API JWT - Nueva URL de Autenticación

## ✅ Cambios Realizados

### 1. **Nueva Variable de Entorno**
```bash
# JWT Authentication API Configuration
NEXT_PUBLIC_JWT_API_BASE_URL=https://demo-api-user.facilcreditos.co
```

### 2. **Separación de APIs**
```bash
# API de Documentos (anterior)
NEXT_PUBLIC_API_BASE_URL=https://demo-facilwhatsappapi.facilcreditos.co
NEXT_PUBLIC_DOCUMENT_API_URL=https://demo-facilwhatsappapi.facilcreditos.co/api/retrieval
NEXT_PUBLIC_CV_UPLOAD_API_URL=https://demo-facilwhatsappapi.facilcreditos.co/api/documents

# API de Autenticación JWT (nueva)
NEXT_PUBLIC_JWT_API_BASE_URL=https://demo-api-user.facilcreditos.co
```

### 3. **Archivos Actualizados**

#### `/src/services/jwt-api.service.ts`
- ✅ Cambio de `NEXT_PUBLIC_API_BASE_URL` → `NEXT_PUBLIC_JWT_API_BASE_URL`
- ✅ URL por defecto: `https://demo-api-user.facilcreditos.co`

#### `/src/services/jwt-user.service.ts`  
- ✅ Corrección del endpoint: `/usuarios/create-initial-user`
- ✅ Logs muestran URL completa: `https://demo-api-user.facilcreditos.co/usuarios/create-initial-user`

#### `/src/config/env.ts`
- ✅ Agregada validación de `NEXT_PUBLIC_JWT_API_BASE_URL`
- ✅ Variable requerida al iniciar la aplicación
- ✅ Exportación individual disponible

## 🌐 URLs Resultantes

### API de Autenticación JWT (Nueva)
```
Base URL: https://demo-api-user.facilcreditos.co

Endpoints:
POST   /usuarios/create-initial-user    - Crear usuario inicial
POST   /auth/login                      - Login JWT
POST   /auth/refresh                    - Renovar token  
GET    /auth/me                         - Perfil usuario
POST   /auth/logout                     - Logout
GET    /usuarios                        - Listar usuarios
POST   /usuarios                        - Crear usuario
```

### API de Documentos (Existente)
```
Base URL: https://demo-facilwhatsappapi.facilcreditos.co

Endpoints:
/api/retrieval/*                        - Búsqueda documentos
/api/documents/*                        - Upload documentos CV
```

## 🔍 Verificación

### Logs en Consola
```javascript
🌐 [USER-SERVICE] URL completa: https://demo-api-user.facilcreditos.co/usuarios/create-initial-user
🌐 [JWT-API] POST https://demo-api-user.facilcreditos.co/usuarios/create-initial-user
```

### Variables de Entorno
```javascript
// Acceso en código
console.log(process.env.NEXT_PUBLIC_JWT_API_BASE_URL);
// Output: "https://demo-api-user.facilcreditos.co"
```

## 🧪 Testing

### 1. Verificar Variables
```bash
# En terminal del proyecto
echo $NEXT_PUBLIC_JWT_API_BASE_URL
# Debería mostrar: https://demo-api-user.facilcreditos.co
```

### 2. Probar Creación de Usuario
1. Ir a `/dashboard/usuarios/crear-inicial`
2. Completar formulario
3. Verificar en DevTools → Console
4. Buscar logs con la nueva URL

### 3. Verificar Separación de APIs
- **JWT/Auth**: `demo-api-user.facilcreditos.co`
- **Documentos**: `demo-facilwhatsappapi.facilcreditos.co`

## 📝 Estructura Final

```
Servicios:
├── jwt-api.service.ts       → demo-api-user.facilcreditos.co
├── jwt-user.service.ts      → Usa jwt-api.service.ts
├── useDocumentSearch.ts     → demo-facilwhatsappapi.facilcreditos.co
└── cv-upload-form.tsx       → demo-facilwhatsappapi.facilcreditos.co
```

## 🚨 Importante

1. **Reiniciar servidor**: Las variables de entorno requieren restart
2. **Validación automática**: El sistema valida que la variable exista
3. **Fallback**: Si no existe, usa el valor por defecto
4. **Separación clara**: JWT ≠ Documentos (diferentes APIs)

¡La configuración está lista para usar la nueva API de autenticación! 🎉