# 🎯 Implementación Rápida de Lazy Loading - SIGED

## ⚡ Quick Start (15 minutos)

### Paso 1: Archivos ya creados ✅

```
✅ src/components/ui/skeleton-loaders.tsx
✅ src/utils/lazy-load.tsx
✅ LAZY_LOADING_GUIDE.md (guía completa)
✅ LAZY_LOADING_EXAMPLE.tsx (ejemplo de referencia)
✅ next.config.ts (optimizado con optimizePackageImports)
```

### Paso 2: Aplicar a tus páginas existentes

#### 🔥 PRIORIDAD ALTA - Páginas más pesadas primero:

1. **`/dashboard/reportes`** (512 KB) ⚠️ MÁS URGENTE
2. **`/dashboard/estudiantes`** (392 KB)
3. **`/dashboard/instituciones/[id]`** (366 KB)

---

## 📝 Receta Rápida por Tipo de Componente

### 1. Para TABLAS grandes:

```typescript
// Antes ❌
import { UsersManagementTable } from '@/components/users-management-table'

// Después ✅
import dynamic from 'next/dynamic'
import { TableSkeleton } from '@/components/ui/skeleton-loaders'

const UsersManagementTable = dynamic(
  () => import('@/components/users-management-table'),
  {
    loading: () => <TableSkeleton rows={10} />,
    ssr: false
  }
)
```

### 2. Para FORMULARIOS:

```typescript
// Antes ❌
import { SolicitudCupoForm } from '@/components/solicitud-cupo-form'

// Después ✅
import dynamic from 'next/dynamic'
import { FormSkeleton } from '@/components/ui/skeleton-loaders'

const SolicitudCupoForm = dynamic(
  () => import('@/components/solicitud-cupo-form'),
  {
    loading: () => <FormSkeleton fields={8} />,
    ssr: true // Formularios SÍ necesitan SSR
  }
)
```

### 3. Para MODALES/DIALOGS:

```typescript
// Antes ❌
import { UserEditDialog } from '@/components/user-edit-dialog'

export function Page() {
  const [showModal, setShowModal] = useState(false)
  
  return (
    <>
      <button onClick={() => setShowModal(true)}>Editar</button>
      {showModal && <UserEditDialog />}
    </>
  )
}

// Después ✅
import dynamic from 'next/dynamic'

const UserEditDialog = dynamic(
  () => import('@/components/user-edit-dialog'),
  { ssr: false }
)

export function Page() {
  const [showModal, setShowModal] = useState(false)
  
  return (
    <>
      <button onClick={() => setShowModal(true)}>Editar</button>
      {showModal && <UserEditDialog />} {/* Solo se carga cuando showModal = true */}
    </>
  )
}
```

### 4. Para DASHBOARDS completos:

```typescript
// Antes ❌
import { ConductorDashboard } from '@/components/conductor-dashboard'

// Después ✅
import dynamic from 'next/dynamic'
import { PageSkeleton } from '@/components/ui/skeleton-loaders'

const ConductorDashboard = dynamic(
  () => import('@/components/conductor-dashboard'),
  {
    loading: () => <PageSkeleton />,
    ssr: false
  }
)
```

---

## 🎯 Plan de Acción - 3 Fases

### FASE 1: QUICK WINS (1 hora) 🚀

Aplicar lazy loading a componentes que se usan condicionalmente:

**Archivos a modificar:**
```bash
src/components/user-edit-dialog.tsx (usar en modales)
src/components/document-viewer.tsx (PDF viewer)
src/components/exportMenu.tsx (solo cuando se exporta)
```

**Cómo:**
```typescript
// En el componente padre que usa estos:
const UserEditDialog = dynamic(() => import('@/components/user-edit-dialog'), { ssr: false })
const DocumentViewer = dynamic(() => import('@/components/document-viewer'), { ssr: false })
const ExportMenu = dynamic(() => import('@/components/exportMenu'), { ssr: false })
```

### FASE 2: PÁGINAS PESADAS (2 horas) 💪

**1. Optimizar `/dashboard/reportes`** (la más pesada):

```typescript
// src/app/dashboard/reportes/page.tsx
import dynamic from 'next/dynamic'
import { PageSkeleton } from '@/components/ui/skeleton-loaders'

const ReportsContent = dynamic(
  () => import('./reports-content'),
  {
    loading: () => <PageSkeleton />,
    ssr: false
  }
)

export default function ReportsPage() {
  return (
    <div>
      <h1>Reportes</h1>
      <ReportsContent />
    </div>
  )
}
```

**2. Optimizar `/dashboard/estudiantes`:**

Separar en componentes:
- `estudiantes-stats.tsx` (stats cards)
- `estudiantes-table.tsx` (tabla)
- `estudiantes-filters.tsx` (filtros)

Luego lazy load cada uno.

**3. Optimizar `/dashboard/instituciones/[id]`:**

Similar al anterior.

### FASE 3: REFINAMIENTO (1 hora) ✨

1. **Agregar prefetch inteligente:**

```typescript
// En links a páginas pesadas, deshabilitar prefetch:
<Link href="/dashboard/reportes" prefetch={false}>
  Reportes
</Link>
```

2. **Medir impacto:**

```bash
npm run build
# Comparar tamaños antes y después
```

3. **Lighthouse audit:**

```bash
npx lighthouse http://localhost:3000/dashboard/reportes --view
```

---

## 📊 Checklist de Implementación

### Componentes a Optimizar:

- [ ] `user-edit-dialog.tsx` → Lazy modal
- [ ] `document-viewer.tsx` → Lazy viewer
- [ ] `exportMenu.tsx` → Lazy menu
- [ ] `users-management-table.tsx` → Lazy table
- [ ] `conductor-dashboard.tsx` → Lazy dashboard
- [ ] `rutas-dashboard.tsx` → Lazy dashboard
- [ ] `asignaciones-dashboard.tsx` → Lazy dashboard
- [ ] `vehiclesAdminDashboard.tsx` → Lazy dashboard
- [ ] `conductorAdminDashboard.tsx` → Lazy dashboard
- [ ] `employee-document-search.tsx` → Lazy search
- [ ] `employee-document-stats.tsx` → Lazy stats
- [ ] `document-search.tsx` → Lazy search
- [ ] `solicitud-cupo-form.tsx` → Lazy form

### Páginas a Optimizar:

- [ ] `/dashboard/reportes/page.tsx`
- [ ] `/dashboard/estudiantes/page.tsx`
- [ ] `/dashboard/instituciones/[id]/page.tsx`
- [ ] `/dashboard/profesores/page.tsx`
- [ ] `/dashboard/usuarios/page.tsx`
- [ ] `/dashboard/suplencias/page.tsx`
- [ ] `/dashboard/horas-extra/page.tsx`
- [ ] `/dashboard/actos-administrativos/page.tsx`

---

## 🧪 Cómo Testear

### 1. Visual (Chrome DevTools):

```bash
# Abrir DevTools
# Network tab → Disable cache
# Recargar página
# Ver cómo se cargan los componentes en partes
```

### 2. Métricas (Lighthouse):

```bash
# Antes de optimizar
npx lighthouse http://localhost:3000/dashboard/reportes --output html --output-path ./before.html

# Después de optimizar
npx lighthouse http://localhost:3000/dashboard/reportes --output html --output-path ./after.html

# Comparar los dos reportes
```

### 3. Bundle Size:

```bash
npm run build

# Ver el output, buscar:
# First Load JS - debe ser menor después de lazy loading
```

---

## 💡 Tips de Implementación

### ✅ DO:

1. **Lazy load componentes grandes** (>50KB)
2. **Usar buenos skeletons** para mejor UX
3. **Lazy load modales/dialogs** (solo cuando se abren)
4. **Medir el impacto** con Lighthouse
5. **Hacer commits pequeños** por página/componente

### ❌ DON'T:

1. **No lazy load todo** - header/navbar/footer deben ser inmediatos
2. **No lazy load texto simple** - solo componentes complejos
3. **No olvidar SSR** para contenido que necesita SEO
4. **No usar spinners genéricos** - usa skeletons
5. **No hacer sin medir** - usa Lighthouse para ver mejoras reales

---

## 🎁 Bonus: Utilidad Helper

Ya creamos `src/utils/lazy-load.tsx` con funciones helper:

```typescript
import { lazyTable, lazyForm, lazyModal } from '@/utils/lazy-load'

// Uso simple:
const UsersTable = lazyTable(() => import('@/components/users-table'))
const CreateForm = lazyForm(() => import('@/components/create-form'))
const EditModal = lazyModal(() => import('@/components/edit-modal'))
```

---

## 📈 Resultados Esperados

**Antes:**
```
Route                                    Size  First Load JS
┌ ○ /dashboard/reportes                121 kB        512 kB ❌
├ ○ /dashboard/estudiantes             3.96 kB       392 kB ❌
├ ○ /dashboard/instituciones/[id]      3.23 kB       366 kB ❌
```

**Después (estimado):**
```
Route                                    Size  First Load JS
┌ ○ /dashboard/reportes                 15 kB        140 kB ✅ (-72%)
├ ○ /dashboard/estudiantes              12 kB        120 kB ✅ (-69%)
├ ○ /dashboard/instituciones/[id]       10 kB        110 kB ✅ (-70%)
```

---

## 🚀 Empezar AHORA

### Comando 1: Optimizar página más pesada

```bash
# Edita src/app/dashboard/reportes/page.tsx
# Aplica el patrón de lazy loading del ejemplo
```

### Comando 2: Medir antes

```bash
npm run build
# Anota el tamaño de /dashboard/reportes
```

### Comando 3: Medir después

```bash
npm run build
# Compara el nuevo tamaño
```

---

¿Necesitas ayuda con una página específica? Dime cuál y te ayudo a optimizarla paso a paso. 🎯
