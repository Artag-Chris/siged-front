# 🛠️ Scripts de Utilidad - SIGED Front

## 📜 Scripts Disponibles

### 1. 🧹 Clean Build (`clean-build.sh`)

**Descripción**: Limpia completamente el proyecto y realiza un nuevo build optimizado para producción.

**Uso**:
```bash
./scripts/clean-build.sh
```

**Qué hace:**
- ✅ Elimina la carpeta `.next`
- ✅ Elimina el caché de `node_modules/.cache`
- ✅ Corrige permisos de archivos y directorios
- ✅ Ejecuta `npm run build`

**Cuándo usarlo:**
- Cuando tengas problemas de permisos con la carpeta `.next`
- Antes de hacer deploy a producción
- Cuando el build falle por caché corrupta
- Después de cambios importantes en configuración

---

### 2. 🚀 Dev Server (`dev.sh`)

**Descripción**: Inicia el servidor de desarrollo con verificación automática de permisos.

**Uso**:
```bash
./scripts/dev.sh
```

**Qué hace:**
- ✅ Verifica que `node_modules` existe
- ✅ Corrige permisos de `.next` si es necesario
- ✅ Inicia el servidor en `http://localhost:6170`

**Cuándo usarlo:**
- Para desarrollo diario
- Cuando tengas problemas de permisos en desarrollo

---

## 🔧 Solución de Problemas Comunes

### Problema: No puedo borrar `.next`

**Solución 1 - Usar el script**:
```bash
./scripts/clean-build.sh
```

**Solución 2 - Manual**:
```bash
# Cambiar permisos
sudo chown -R $USER:programadores .next
sudo chmod -R 775 .next

# Borrar
rm -rf .next
```

### Problema: Error de permisos al hacer build

**Solución**:
```bash
# Opción 1: Usar el script
./scripts/clean-build.sh

# Opción 2: Manual
sudo rm -rf .next
npm run build
```

### Problema: Archivos creados con usuario root

**Solución**:
```bash
# Cambiar propietario de todo el proyecto
sudo chown -R $USER:programadores /mnt/storage/SIGED/SIGED_FRONT_NEXT

# Cambiar permisos
sudo chmod -R 775 /mnt/storage/SIGED/SIGED_FRONT_NEXT
```

---

## 📦 Comandos NPM

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo

# Producción
npm run build        # Construir para producción
npm start            # Iniciar servidor de producción

# Utilidades
npm run lint         # Verificar código con ESLint
```

---

## 🎯 Flujo de Trabajo Recomendado

### Para Desarrollo Diario:
```bash
./scripts/dev.sh
```

### Antes de Commit:
```bash
git status
git add .
git commit -m "descripción"
git push
```

### Para Deploy a Producción:
```bash
# 1. Limpiar y construir
./scripts/clean-build.sh

# 2. Verificar que funciona
npm start

# 3. Deploy (según tu plataforma)
# Vercel: vercel --prod
# Docker: docker build -t siged-front .
```

---

## 🔐 Permisos Correctos

```bash
# Archivos: 664 (rw-rw-r--)
# Directorios: 775 (rwxrwxr-x)
# Usuario: tu-usuario
# Grupo: programadores
```

---

## 💡 Tips

1. **Siempre usa los scripts** en lugar de comandos manuales
2. **No uses sudo npm** - puede crear problemas de permisos
3. **Si algo falla**, ejecuta `./scripts/clean-build.sh`
4. **Antes de pedir ayuda**, verifica los logs del build

---

## 📝 Notas de Producción

El build de producción:
- ✅ Ignora errores de TypeScript/ESLint (configurado en `next.config.ts`)
- ✅ Optimiza imágenes (AVIF/WebP)
- ✅ Comprime archivos
- ✅ Aplica headers de seguridad
- ✅ Deshabilita source maps

Para habilitar validaciones estrictas, edita `next.config.ts`:
```typescript
eslint: {
  ignoreDuringBuilds: false, // Cambiar a false
},
typescript: {
  ignoreBuildErrors: false, // Cambiar a false
},
```

---

**Última actualización**: 8 de octubre de 2025
