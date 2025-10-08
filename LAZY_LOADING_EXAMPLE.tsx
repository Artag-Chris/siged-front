/**
 * ⚠️ ARCHIVO DE REFERENCIA - NO ES EJECUTABLE
 * 
 * Este archivo contiene EJEMPLOS de cómo implementar lazy loading.
 * Los componentes aquí son ejemplos, NO componentes reales de tu proyecto.
 * 
 * CÓMO USAR:
 * 1. Lee los comentarios y patrones
 * 2. Copia el patrón que necesites
 * 3. Reemplaza los imports con tus componentes reales
 * 4. Aplica en tus páginas reales
 * 
 * Para ejemplos ejecutables, mira:
 * - src/app/dashboard/suplencias/page-optimized.tsx (ejemplo real)
 * - LAZY_LOADING_QUICKSTART.md (guía paso a paso)
 */

"use client"

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { 
  PageSkeleton, 
  TableSkeleton, 
  FormSkeleton,
  CardSkeleton 
} from '@/components/ui/skeleton-loaders'

// ============================================================================
// LAZY LOADING DE COMPONENTES PESADOS
// ============================================================================

// Ejemplo 1: Componente de tabla (carga diferida)
const HeavyTable = dynamic(
  () => import('@/components/users-management-table').then(mod => ({ default: mod.UsersManagementTable })),
  {
    loading: () => <TableSkeleton rows={10} />,
    ssr: false // No renderizar en servidor si no es necesario
  }
)

// Ejemplo 2: Componente de gráficos (muy pesado)
// NOTA: Reemplaza 'reports-chart' con tu componente real
// const ReportsChart = dynamic(
//   () => import('@/components/tu-componente-de-graficos'),
//   {
//     loading: () => <CardSkeleton count={1} />,
//     ssr: false
//   }
// )

// Ejemplo 3: Formulario complejo
// NOTA: Reemplaza con tu formulario real
// const ComplexForm = dynamic(
//   () => import('@/components/solicitud-cupo-form'),
//   {
//     loading: () => <FormSkeleton fields={8} />,
//     ssr: true // Este sí necesita SSR para SEO
//   }
// )

// Ejemplo 4: Modal/Dialog
const UserEditDialog = dynamic(
  () => import('@/components/user-edit-dialog'),
  {
    loading: () => <div>Cargando...</div>,
    ssr: false
  }
)

// ============================================================================
// COMPONENTE DE PÁGINA OPTIMIZADA
// ============================================================================

export default function OptimizedPageExample() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header - Se carga inmediatamente (es liviano) */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mi Página Optimizada</h1>
        <button className="btn-primary">Acción Rápida</button>
      </div>

      {/* Stats - Se cargan con prioridad */}
      <Suspense fallback={<CardSkeleton count={4} />}>
        <div className="grid gap-4 md:grid-cols-4">
          {/* Stats cards aquí */}
        </div>
      </Suspense>

      {/* Tabla - Lazy loading */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Usuarios</h2>
        <HeavyTable />
      </div>

      {/* Gráficos - Lazy loading (carga después) */}
      {/* <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Reportes</h2>
        <ReportsChart />
      </div> */}

      {/* Formulario - Lazy loading */}
      {/* <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Formulario</h2>
        <ComplexForm />
      </div> */}
    </div>
  )
}

// ============================================================================
// PATRÓN PARA PÁGINAS DE DASHBOARD
// ============================================================================

/*
ESTRUCTURA RECOMENDADA:

1. Header + Breadcrumbs (carga inmediata - son livianos)
2. Stats/Cards principales (Suspense con skeleton)
3. Contenido principal (dynamic import con skeleton)
4. Contenido secundario (dynamic import sin SSR)
5. Modals/Dialogs (dynamic import, solo cuando se abren)

BENEFICIOS:
- First Contentful Paint más rápido
- Mejor Time to Interactive
- Menor JavaScript inicial
- Mejor experiencia de usuario
*/
