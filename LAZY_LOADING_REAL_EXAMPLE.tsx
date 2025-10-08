/**
 * ✅ EJEMPLO REAL Y EJECUTABLE DE LAZY LOADING
 * 
 * Este archivo demuestra lazy loading con componentes que EXISTEN en tu proyecto.
 * Puedes copiar este código directamente a tus páginas.
 */

"use client"

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  TableSkeleton, 
  FormSkeleton,
  CardSkeleton,
  PageSkeleton 
} from '@/components/ui/skeleton-loaders'

// ============================================================================
// EJEMPLO 1: TABLA CON LAZY LOADING
// ============================================================================

// Componente real de tu proyecto - Users Management Table
const UsersTable = dynamic(
  () => import('@/components/users-management-table').then(mod => ({ 
    default: mod.UsersManagementTable 
  })),
  {
    loading: () => <TableSkeleton rows={8} />,
    ssr: false // No necesita SSR
  }
)

// ============================================================================
// EJEMPLO 2: FORMULARIO CON LAZY LOADING
// ============================================================================

// Componente real - Formulario de solicitud de cupo
const SolicitudForm = dynamic(
  () => import('@/components/solicitud-cupo-form'),
  {
    loading: () => <FormSkeleton fields={10} />,
    ssr: true // Formularios SÍ necesitan SSR
  }
)

// ============================================================================
// EJEMPLO 3: MODAL/DIALOG CON LAZY LOADING
// ============================================================================

// El modal solo se carga cuando se necesita (cuando showModal = true)
const UserEditDialog = dynamic(
  () => import('@/components/user-edit-dialog'),
  {
    loading: () => <div className="text-center p-4">Cargando modal...</div>,
    ssr: false
  }
)

// ============================================================================
// EJEMPLO 4: DASHBOARD CON LAZY LOADING
// ============================================================================

// Dashboard de conductor - componente pesado
const ConductorDashboard = dynamic(
  () => import('@/components/conductor-dashboard'),
  {
    loading: () => <PageSkeleton />,
    ssr: false
  }
)

// ============================================================================
// EJEMPLO 5: BÚSQUEDA DE DOCUMENTOS CON LAZY LOADING
// ============================================================================

const DocumentSearch = dynamic(
  () => import('@/components/document-search'),
  {
    loading: () => (
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 animate-pulse rounded" />
        <TableSkeleton rows={5} />
      </div>
    ),
    ssr: false
  }
)

// ============================================================================
// PÁGINA DE DEMOSTRACIÓN
// ============================================================================

export default function LazyLoadingRealExample() {
  const [showUsersTable, setShowUsersTable] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header - Carga inmediata */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Ejemplos Reales de Lazy Loading</h1>
        <p className="text-muted-foreground">
          Componentes que SÍ existen en tu proyecto SIGED
        </p>
      </div>

      {/* Cards de ejemplo */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Ejemplo 1: Tabla */}
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">1. Tabla de Usuarios</h2>
          <p className="text-sm text-muted-foreground">
            La tabla solo se carga cuando haces clic en el botón
          </p>
          <Button onClick={() => setShowUsersTable(!showUsersTable)}>
            {showUsersTable ? 'Ocultar Tabla' : 'Mostrar Tabla'}
          </Button>
          {showUsersTable && (
            <div className="mt-4">
              <UsersTable />
            </div>
          )}
        </div>

        {/* Ejemplo 2: Formulario */}
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">2. Formulario de Solicitud</h2>
          <p className="text-sm text-muted-foreground">
            El formulario se carga al hacer clic
          </p>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Ocultar Formulario' : 'Mostrar Formulario'}
          </Button>
          {showForm && (
            <div className="mt-4">
              <SolicitudForm />
            </div>
          )}
        </div>

        {/* Ejemplo 3: Modal */}
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">3. Modal de Edición</h2>
          <p className="text-sm text-muted-foreground">
            El modal solo se carga cuando lo abres
          </p>
          <Button onClick={() => setShowModal(true)}>
            Abrir Modal
          </Button>
          {showModal && (
            <UserEditDialog 
              open={showModal}
              onOpenChange={setShowModal}
              user={null}
            />
          )}
        </div>

        {/* Ejemplo 4: Dashboard */}
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">4. Dashboard Conductor</h2>
          <p className="text-sm text-muted-foreground">
            Dashboard completo con lazy loading
          </p>
          <Button onClick={() => setShowDashboard(!showDashboard)}>
            {showDashboard ? 'Ocultar Dashboard' : 'Mostrar Dashboard'}
          </Button>
          {showDashboard && (
            <div className="mt-4">
              <ConductorDashboard conductorId="demo-123" />
            </div>
          )}
        </div>

        {/* Ejemplo 5: Búsqueda */}
        <div className="border rounded-lg p-6 space-y-4 md:col-span-2">
          <h2 className="text-xl font-semibold">5. Búsqueda de Documentos</h2>
          <p className="text-sm text-muted-foreground">
            Búsqueda avanzada con lazy loading
          </p>
          <Button onClick={() => setShowSearch(!showSearch)}>
            {showSearch ? 'Ocultar Búsqueda' : 'Mostrar Búsqueda'}
          </Button>
          {showSearch && (
            <div className="mt-4">
              <DocumentSearch professorId="demo-prof-123" />
            </div>
          )}
        </div>
      </div>

      {/* Información adicional */}
      <div className="border-t pt-6 space-y-4">
        <h3 className="text-lg font-semibold">💡 Beneficios observables:</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
          <li>El JavaScript inicial es mucho menor</li>
          <li>Los componentes se cargan solo cuando se necesitan</li>
          <li>Ves el skeleton mientras se carga</li>
          <li>La página responde instantáneamente</li>
          <li>Mejor experiencia de usuario</li>
        </ul>
        
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-4">
          <p className="text-sm font-medium text-blue-900">
            🎯 Copia este patrón para tus páginas:
          </p>
          <pre className="text-xs mt-2 bg-blue-100 p-2 rounded overflow-x-auto">
{`const MyComponent = dynamic(
  () => import('@/components/my-component'),
  {
    loading: () => <TableSkeleton />,
    ssr: false
  }
)`}
          </pre>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// CÓMO USAR ESTE EJEMPLO
// ============================================================================

/*
1. Este archivo usa componentes REALES de tu proyecto
2. Puedes ejecutarlo directamente navegando a esta ruta
3. Observa cómo los componentes se cargan solo cuando los necesitas
4. Copia el patrón para tus propias páginas

COMPONENTES USADOS (todos existen en tu proyecto):
- UsersManagementTable
- SolicitudCupoForm
- UserEditDialog
- ConductorDashboard
- DocumentSearch

Para agregar esta página a tu app:
1. Mueve este archivo a: src/app/examples/lazy-loading/page.tsx
2. Navega a: http://localhost:6170/examples/lazy-loading
3. Observa el lazy loading en acción
*/
