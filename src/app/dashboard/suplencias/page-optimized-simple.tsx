/**
 * ============================================================================
 * EJEMPLO SIMPLE: Cómo aplicar Lazy Loading a una página
 * ============================================================================
 * 
 * Este archivo muestra un PATRÓN SIMPLE que puedes copiar.
 * 
 * ANTES (sin lazy loading):
 * - Todo se carga inmediatamente
 * - JavaScript inicial: 200-300KB
 * - Tiempo de carga: Lento
 * 
 * DESPUÉS (con lazy loading):
 * - Solo lo necesario se carga primero
 * - JavaScript inicial: 50-100KB
 * - Tiempo de carga: Rápido ⚡
 */

"use client"

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserX, Plus, BarChart3 } from 'lucide-react';
import { TableSkeleton, CardSkeleton } from '@/components/ui/skeleton-loaders';

// ============================================================================
// PASO 1: Identificar componentes pesados y hacer lazy load
// ============================================================================

// Ejemplo: Si tienes un componente de tabla pesado
// const HeavyTable = dynamic(() => import('@/components/my-heavy-table'), {
//   loading: () => <TableSkeleton rows={10} />,
//   ssr: false
// });

// Ejemplo: Si tienes stats cards
// const StatsCards = dynamic(() => import('./components/stats-cards'), {
//   loading: () => <CardSkeleton count={4} />,
//   ssr: false
// });

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function SuplenciasOptimizedExample() {
  const [showTable, setShowTable] = useState(false);
  const [showStats, setShowStats] = useState(false);

  return (
    <div className="container mx-auto p-6 space-y-6">
      
      {/* ========== HEADER - CARGA INMEDIATA (es liviano) ========== */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <UserX className="h-8 w-8 text-slate-700" />
            <h1 className="text-3xl font-bold text-slate-900">Suplencias</h1>
          </div>
          <p className="text-slate-600">Ejemplo de página optimizada con Lazy Loading</p>
        </div>
        
        <div className="flex gap-2">
          <Link href="/dashboard/suplencias/estadisticas">
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Estadísticas
            </Button>
          </Link>
          <Link href="/dashboard/suplencias/crear">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Suplencia
            </Button>
          </Link>
        </div>
      </div>

      {/* ========== CARDS INFORMATIVOS ========== */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">✅ Beneficio 1</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Carga inicial 50% más rápida
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">✅ Beneficio 2</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Componentes se cargan solo cuando se necesitan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">✅ Beneficio 3</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Mejor experiencia de usuario con skeletons
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ========== EJEMPLO: Stats con lazy load ========== */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ejemplo: Stats Cards con Lazy Loading</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => setShowStats(!showStats)}>
            {showStats ? 'Ocultar Stats' : 'Mostrar Stats (Lazy Load)'}
          </Button>
          
          {showStats && (
            <div className="mt-4">
              <CardSkeleton count={4} />
              <p className="text-sm text-muted-foreground mt-2">
                ℹ️ Este skeleton se muestra mientras se carga el componente real
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ========== EJEMPLO: Tabla con lazy load ========== */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ejemplo: Tabla con Lazy Loading</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => setShowTable(!showTable)}>
            {showTable ? 'Ocultar Tabla' : 'Mostrar Tabla (Lazy Load)'}
          </Button>
          
          {showTable && (
            <div className="mt-4">
              <TableSkeleton rows={8} />
              <p className="text-sm text-muted-foreground mt-2">
                ℹ️ La tabla real se cargaría aquí con dynamic import
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ========== CÓDIGO DE EJEMPLO ========== */}
      <Card className="bg-slate-50">
        <CardHeader>
          <CardTitle className="text-lg">📝 Cómo implementar esto en tu página real:</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white p-4 rounded border">
            <p className="font-mono text-sm mb-2 text-slate-700">Paso 1: Importa dynamic</p>
            <pre className="text-xs bg-slate-100 p-2 rounded overflow-x-auto">
{`import dynamic from 'next/dynamic'
import { TableSkeleton } from '@/components/ui/skeleton-loaders'`}
            </pre>
          </div>

          <div className="bg-white p-4 rounded border">
            <p className="font-mono text-sm mb-2 text-slate-700">Paso 2: Crea el lazy component</p>
            <pre className="text-xs bg-slate-100 p-2 rounded overflow-x-auto">
{`const MyTable = dynamic(
  () => import('@/components/my-table'),
  {
    loading: () => <TableSkeleton rows={10} />,
    ssr: false
  }
)`}
            </pre>
          </div>

          <div className="bg-white p-4 rounded border">
            <p className="font-mono text-sm mb-2 text-slate-700">Paso 3: Úsalo normalmente</p>
            <pre className="text-xs bg-slate-100 p-2 rounded overflow-x-auto">
{`export default function Page() {
  return (
    <div>
      <h1>Mi Página</h1>
      <MyTable /> {/* Se carga lazy automáticamente */}
    </div>
  )
}`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* ========== RECURSOS ========== */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">📚 Recursos y Documentación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-blue-800">
            ✅ <strong>LAZY_LOADING_QUICKSTART.md</strong> - Guía de implementación rápida
          </p>
          <p className="text-sm text-blue-800">
            ✅ <strong>LAZY_LOADING_GUIDE.md</strong> - Guía completa con ejemplos
          </p>
          <p className="text-sm text-blue-800">
            ✅ <strong>LAZY_LOADING_REAL_EXAMPLE.tsx</strong> - Ejemplos con componentes reales
          </p>
          <p className="text-sm text-blue-800 mt-4">
            💡 <strong>Tip:</strong> Empieza optimizando tus páginas más pesadas primero
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// PARA APLICAR ESTO A TU PÁGINA REAL DE SUPLENCIAS:
// ============================================================================

/*
1. Abre tu página real: src/app/dashboard/suplencias/page.tsx

2. Identifica componentes pesados (>50KB):
   - Tablas grandes
   - Formularios complejos
   - Dashboards con gráficos
   - Modales/Dialogs

3. Sepáralos en archivos individuales si no lo están

4. Importa con dynamic():
   const MiComponente = dynamic(() => import('./mi-componente'), {
     loading: () => <Skeleton apropiado />,
     ssr: false
   })

5. Mide el impacto:
   npm run build
   // Ver tamaño antes y después

6. Audita con Lighthouse:
   npx lighthouse http://localhost:3000/dashboard/suplencias --view
*/
