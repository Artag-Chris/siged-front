/**
 * Utilidad para Lazy Loading con mejores prácticas
 * Uso: envuelve tus componentes pesados para carga diferida automática
 */

import dynamic from 'next/dynamic'
import { ComponentType } from 'react'
import { PageSkeleton } from '@/components/ui/skeleton-loaders'

// ============================================================================
// TIPOS
// ============================================================================

interface LazyLoadOptions {
  /** Mostrar en servidor (SSR) */
  ssr?: boolean
  /** Componente de carga personalizado */
  loading?: ComponentType
  /** Prefetch al hacer hover */
  prefetch?: boolean
}

// ============================================================================
// FUNCIÓN HELPER PARA LAZY LOADING
// ============================================================================

/**
 * Crea un componente con lazy loading
 * @param importFunc - Función que retorna el import dinámico
 * @param options - Opciones de lazy loading
 */
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
) {
  const {
    ssr = false,
    loading: LoadingComponent = PageSkeleton,
  } = options

  return dynamic(importFunc, {
    loading: () => <LoadingComponent />,
    ssr,
  })
}

// ============================================================================
// PRESETS COMUNES
// ============================================================================

/**
 * Para componentes de tabla
 */
export function lazyTable<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  return dynamic(importFunc, {
    loading: () => (
      <div className="space-y-3">
        <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 w-full bg-gray-100 animate-pulse rounded" />
        ))}
      </div>
    ),
    ssr: false,
  })
}

/**
 * Para componentes de formulario
 */
export function lazyForm<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  return dynamic(importFunc, {
    loading: () => (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
            <div className="h-10 w-full bg-gray-100 animate-pulse rounded" />
          </div>
        ))}
      </div>
    ),
    ssr: true, // Formularios suelen necesitar SSR
  })
}

/**
 * Para modales/dialogs (solo se cargan cuando se necesitan)
 */
export function lazyModal<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  return dynamic(importFunc, {
    loading: () => null, // Los modales no necesitan loader
    ssr: false,
  })
}

/**
 * Para dashboards completos
 */
export function lazyDashboard<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  return dynamic(importFunc, {
    loading: () => <PageSkeleton />,
    ssr: false,
  })
}

// ============================================================================
// EJEMPLO DE USO
// ============================================================================

/*
// En tu archivo de página o componente:

import { lazyTable, lazyForm, lazyModal } from '@/utils/lazy-load'

// Lazy load de tabla
const UsersTable = lazyTable(() => import('@/components/users-management-table'))

// Lazy load de formulario
const CreateUserForm = lazyForm(() => import('@/components/user-form'))

// Lazy load de modal
const EditUserModal = lazyModal(() => import('@/components/user-edit-dialog'))

// En tu componente:
export default function UsersPage() {
  return (
    <div>
      <h1>Usuarios</h1>
      <UsersTable />
      <CreateUserForm />
      {showModal && <EditUserModal />}
    </div>
  )
}
*/

// ============================================================================
// PREFETCH COMPONENT
// ============================================================================

/**
 * Componente que hace prefetch de módulos cuando son visibles
 */
export function PrefetchOnView({ 
  children, 
  modules 
}: { 
  children: React.ReactNode
  modules: (() => Promise<any>)[]
}) {
  // TODO: Implementar IntersectionObserver para prefetch
  return <>{children}</>
}
