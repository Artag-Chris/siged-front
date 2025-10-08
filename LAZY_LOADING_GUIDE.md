# 🚀 Guía Completa de Lazy Loading para Next.js

## 📋 Índice

1. [¿Qué es Lazy Loading?](#qué-es-lazy-loading)
2. [Beneficios](#beneficios)
3. [Estrategias de Implementación](#estrategias)
4. [Ejemplos Prácticos](#ejemplos)
5. [Optimizaciones Avanzadas](#avanzado)

---

## 🎯 ¿Qué es Lazy Loading?

Lazy Loading (carga diferida) es una técnica que **retrasa la carga de componentes** hasta que realmente se necesitan, mejorando dramáticamente el rendimiento inicial.

### Antes vs Después

**❌ SIN Lazy Loading:**
```typescript
import HeavyComponent from '@/components/heavy-component'
// Se carga TODO inmediatamente (500KB de JavaScript)
```

**✅ CON Lazy Loading:**
```typescript
const HeavyComponent = dynamic(() => import('@/components/heavy-component'))
// Solo se carga cuando se necesita (JavaScript inicial: 50KB)
```

---

## 💪 Beneficios

- ✅ **First Load más rápido**: 60-70% menos JavaScript inicial
- ✅ **Better TTI**: Time to Interactive mejorado
- ✅ **Mejor UX**: Páginas responden más rápido
- ✅ **Menor uso de datos**: Solo carga lo necesario
- ✅ **Mejor SEO**: Google premia sitios rápidos

---

## 📚 Estrategias de Implementación

### 1. **Componentes Pesados (Tablas, Gráficos)**

```typescript
import dynamic from 'next/dynamic'
import { TableSkeleton } from '@/components/ui/skeleton-loaders'

// ✅ RECOMENDADO: Con skeleton loader
const UsersTable = dynamic(
  () => import('@/components/users-management-table'),
  {
    loading: () => <TableSkeleton rows={10} />,
    ssr: false // No renderizar en servidor
  }
)

export default function UsersPage() {
  return (
    <div>
      <h1>Usuarios</h1>
      <UsersTable /> {/* Se carga solo cuando se renderiza */}
    </div>
  )
}
```

### 2. **Modales y Dialogs**

```typescript
import { useState } from 'react'
import dynamic from 'next/dynamic'

// Solo se carga cuando showModal = true
const EditUserModal = dynamic(() => import('@/components/user-edit-dialog'), {
  ssr: false
})

export default function Page() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button onClick={() => setShowModal(true)}>Editar</button>
      {showModal && <EditUserModal onClose={() => setShowModal(false)} />}
    </>
  )
}
```

### 3. **Tabs y Acordeones**

```typescript
import dynamic from 'next/dynamic'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Cada tab se carga solo cuando se activa
const TabUsuarios = dynamic(() => import('./tabs/usuarios'))
const TabInstituciones = dynamic(() => import('./tabs/instituciones'))
const TabReportes = dynamic(() => import('./tabs/reportes'))

export default function DashboardTabs() {
  return (
    <Tabs defaultValue="usuarios">
      <TabsList>
        <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
        <TabsTrigger value="instituciones">Instituciones</TabsTrigger>
        <TabsTrigger value="reportes">Reportes</TabsTrigger>
      </TabsList>
      
      <TabsContent value="usuarios">
        <TabUsuarios />
      </TabsContent>
      <TabsContent value="instituciones">
        <TabInstituciones />
      </TabsContent>
      <TabsContent value="reportes">
        <TabReportes />
      </TabsContent>
    </Tabs>
  )
}
```

### 4. **Rutas de Next.js (App Router)**

```typescript
// app/dashboard/usuarios/page.tsx
import dynamic from 'next/dynamic'
import { PageSkeleton } from '@/components/ui/skeleton-loaders'

// Lazy load del contenido principal
const UsersContent = dynamic(() => import('./users-content'), {
  loading: () => <PageSkeleton />
})

export default function UsersPage() {
  return (
    <div>
      {/* Header se carga inmediatamente (es liviano) */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Usuarios</h1>
        <p className="text-muted-foreground">Gestión de usuarios del sistema</p>
      </div>
      
      {/* Contenido pesado se carga después */}
      <UsersContent />
    </div>
  )
}
```

---

## 🎨 Ejemplos Prácticos para SIGED

### Ejemplo 1: Dashboard de Suplencias

```typescript
// src/app/dashboard/suplencias/page.tsx
"use client"

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { StatsSkeleton, TableSkeleton } from '@/components/ui/skeleton-loaders'

// Lazy load de componentes pesados
const SuplenciasStats = dynamic(() => import('@/components/suplencias-stats'), {
  loading: () => <StatsSkeleton count={4} />
})

const SuplenciasTable = dynamic(() => import('@/components/suplencias-table'), {
  loading: () => <TableSkeleton rows={10} />
})

const SuplenciasFilters = dynamic(() => import('@/components/suplencias-filters'), {
  ssr: false
})

export default function SuplenciasPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header - Carga inmediata */}
      <div>
        <h1 className="text-3xl font-bold">Suplencias</h1>
        <p className="text-muted-foreground">Gestión de suplencias docentes</p>
      </div>

      {/* Stats - Lazy con skeleton */}
      <SuplenciasStats />

      {/* Filtros - Lazy sin SSR */}
      <SuplenciasFilters />

      {/* Tabla principal - Lazy con skeleton */}
      <SuplenciasTable />
    </div>
  )
}
```

### Ejemplo 2: Formulario de Creación

```typescript
// src/app/dashboard/suplencias/crear/page.tsx
"use client"

import dynamic from 'next/dynamic'
import { FormSkeleton } from '@/components/ui/skeleton-loaders'

// El formulario es pesado, se carga después
const CreateSuplenciaForm = dynamic(
  () => import('@/components/suplencia-form'),
  {
    loading: () => <FormSkeleton fields={8} />,
    ssr: true // Mantener SSR para formularios
  }
)

export default function CrearSuplenciaPage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Nueva Suplencia</h1>
      <CreateSuplenciaForm />
    </div>
  )
}
```

### Ejemplo 3: Página de Detalle

```typescript
// src/app/dashboard/suplencias/[id]/page.tsx
"use client"

import dynamic from 'next/dynamic'
import { DocumentDetailSkeleton } from '@/components/ui/skeleton-loaders'

// Componente de documentos (pesado)
const DocumentsSection = dynamic(
  () => import('./documents-section'),
  {
    loading: () => <DocumentDetailSkeleton />
  }
)

// Componente de historial (opcional, se carga después)
const HistorySection = dynamic(
  () => import('./history-section'),
  {
    loading: () => <div>Cargando historial...</div>,
    ssr: false
  }
)

export default function SuplenciaDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Info básica - Carga inmediata */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Suplencia #{params.id}</h1>
        <p className="text-muted-foreground">Detalles de la suplencia</p>
      </div>

      {/* Documentos - Lazy */}
      <DocumentsSection id={params.id} />

      {/* Historial - Lazy sin SSR */}
      <HistorySection id={params.id} />
    </div>
  )
}
```

---

## 🔥 Optimizaciones Avanzadas

### 1. **Prefetch on Hover**

```typescript
import Link from 'next/link'

// Next.js hace prefetch automático de links en viewport
// Puedes deshabilitarlo para rutas pesadas:
<Link href="/dashboard/reportes" prefetch={false}>
  Reportes
</Link>
```

### 2. **Intersection Observer (Lazy Load al Scroll)**

```typescript
"use client"

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('@/components/heavy-chart'))

export function LazyChart() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref}>
      {isVisible ? <HeavyChart /> : <div className="h-96">Scroll para cargar...</div>}
    </div>
  )
}
```

### 3. **React.lazy con Suspense**

```typescript
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./heavy-component'))

export function MyPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <HeavyComponent />
    </Suspense>
  )
}
```

### 4. **Code Splitting por Ruta**

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
}
```

---

## 📊 Checklist de Optimización

### Componentes a Lazy Load en SIGED:

- [ ] `UsersManagementTable` - Tabla pesada
- [ ] `SolicitudCupoForm` - Formulario complejo
- [ ] `DocumentSearch` - Búsqueda avanzada
- [ ] `DocumentViewer` - Visor de PDFs
- [ ] `ExportMenu` - Exportación de datos
- [ ] `ConductorDashboard` - Dashboard completo
- [ ] `RutasDashboard` - Dashboard de rutas
- [ ] `AsignacionesDashboard` - Dashboard de asignaciones
- [ ] `EmployeeDocumentSearch` - Búsqueda de empleados
- [ ] `EmployeeDocumentStats` - Estadísticas

### Páginas a Optimizar:

- [ ] `/dashboard/reportes` (la más pesada: 512 KB)
- [ ] `/dashboard/estudiantes` (392 KB)
- [ ] `/dashboard/instituciones/[id]` (366 KB)
- [ ] `/dashboard/profesores` (174 KB)
- [ ] `/dashboard/usuarios` (181 KB)

---

## 🎯 Plan de Acción

### Fase 1: Quick Wins (1-2 horas)
1. Agregar lazy loading a modales y dialogs
2. Implementar skeletons básicos
3. Optimizar `/dashboard/reportes`

### Fase 2: Componentes Críticos (2-3 horas)
1. Lazy load de tablas grandes
2. Lazy load de formularios complejos
3. Optimizar dashboards

### Fase 3: Refinamiento (1-2 horas)
1. Implementar Intersection Observer
2. Optimizar prefetch de rutas
3. Medir con Lighthouse

---

## 📈 Métricas Esperadas

**Antes:**
- First Load: 500-600ms
- Time to Interactive: 2-3s
- Lighthouse: 70-80

**Después:**
- First Load: 200-300ms ⚡ (-50%)
- Time to Interactive: 1-1.5s ⚡ (-50%)
- Lighthouse: 90-95 ⚡ (+15-20)

---

## 💡 Tips Finales

1. **No hagas lazy loading de todo**: Header, navbar, footer deben ser inmediatos
2. **Usa buenos skeletons**: Mejor UX que spinners genéricos
3. **Mide con Lighthouse**: Usa Chrome DevTools para ver el impacto
4. **Prioriza lo visible**: Lazy load de lo que no está en viewport inicial
5. **Cuidado con SEO**: Contenido crítico debe tener SSR

---

## 🛠️ Herramientas

```bash
# Analizar bundle
npm install -D @next/bundle-analyzer

# Ver tamaños
npm run build

# Lighthouse audit
npx lighthouse http://localhost:3000 --view
```

---

**¿Necesitas ayuda implementando esto?** Empieza por los ejemplos prácticos y ve paso a paso. 🚀
