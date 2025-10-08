# 📄 Módulo de Documentos - Sistema SIGED

## 🎯 Descripción

Módulo completo de búsqueda, gestión y análisis de documentos implementado en el sistema SIGED. Utiliza Elasticsearch para búsquedas avanzadas y permite filtrar, descargar y visualizar documentos del sistema.

## 📁 Estructura de Archivos

```
src/
├── app/dashboard/documentos/
│   ├── page.tsx                    # Página principal del módulo
│   └── buscar/
│       └── page.tsx                # Vista de búsqueda avanzada
│
├── services/
│   ├── document-search.service.ts  # Servicio para búsqueda de documentos
│   └── jwt-api.service.ts          # Servicio HTTP con JWT (actualizado)
│
├── hooks/
│   └── useAdvancedDocumentSearch.ts # Hooks personalizados
│
└── interfaces/navbarItems/
    └── menuItems.tsx               # Menú actualizado con subitems
```

## 🚀 Funcionalidades Implementadas

### 1. Página Principal (`/dashboard/documentos`)
- ✅ Dashboard con acceso rápido a todas las funciones
- ✅ Cards informativos de funcionalidades disponibles
- ✅ Indicadores de tipos de documentos soportados
- ✅ Navegación a submódulos

### 2. Búsqueda Avanzada (`/dashboard/documentos/buscar`)

#### Filtros Disponibles:
- **Búsqueda por texto**: En nombre, contenido y palabras clave
- **Categoría**: Contratos, Reportes, Actos Administrativos, etc.
- **Tipo de Documento**: Contrato Laboral, Suplencia, Horas Extra, etc.
- **Rango de Fechas**: Desde/Hasta
- **Búsqueda Fuzzy**: Tolera errores de escritura
- **Ordenamiento**: Por relevancia, fecha, tamaño o nombre

#### Funcionalidades:
- ✅ Búsqueda en tiempo real
- ✅ Paginación de resultados
- ✅ Visualización de documentos en grid
- ✅ Descarga de documentos
- ✅ Vista previa de PDFs en navegador
- ✅ Indicadores de metadata (categoría, tipo, tags)
- ✅ Información de tamaño y fecha

### 3. Tab de Documentos Recientes
- ✅ Últimos 5 documentos subidos
- ✅ Vista en lista con acciones rápidas
- ✅ Formato de fecha legible en español

### 4. Tab de Estadísticas
- ✅ Total de documentos en el sistema
- ✅ Espacio total utilizado
- ✅ Documentos por categoría
- ✅ Documentos por tipo de archivo (MIME)

## 🔧 Servicios Implementados

### DocumentSearchService

```typescript
// Búsqueda simple
search(params: SearchParams): Promise<SearchResponse>

// Búsqueda avanzada con Elasticsearch
advancedSearch(params: AdvancedSearchParams): Promise<SearchResponse>

// Documentos de un empleado
getEmployeeDocuments(employeeUuid, page, limit): Promise<EmployeeDocumentsResponse>

// Buscar en documentos de empleado
searchEmployeeDocuments(employeeUuid, params): Promise<EmployeeDocumentsResponse>

// Obtener URL de descarga
getDownloadUrl(documentId): string

// Obtener URL de visualización
getViewUrl(documentId): string

// Descargar documento
downloadDocument(documentId, fileName): Promise<void>

// Documentos recientes
getRecent(limit): Promise<SearchResponse>

// Estadísticas del sistema
getStats(): Promise<{ stats: DocumentStats }>

// Documentos por categoría
getByCategory(category, page, limit): Promise<SearchResponse>
```

### Tipos de Datos

```typescript
interface Document {
  id: string;
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  path: string;
  uploadDate: Date | string;
  metadata: {
    category?: string;
    documentType?: string;
    employeeUuid?: string;
    employeeName?: string;
    description?: string;
    tags?: string[];
    keywords?: string[];
  };
  extractedText?: string;
  highlights?: string[];
}
```

## 🎣 Hooks Disponibles

### useAdvancedSearch
Búsqueda avanzada de documentos con filtros complejos.

```typescript
const { 
  documents,    // Documentos encontrados
  loading,      // Estado de carga
  error,        // Errores
  total,        // Total de resultados
  took,         // Tiempo de búsqueda (ms)
  facets,       // Facetas de Elasticsearch
  search,       // Función de búsqueda
  reset        // Limpiar resultados
} = useAdvancedSearch();

// Uso
await search({
  query: "contrato",
  category: "contratos",
  fuzzy: true,
  size: 20,
  sortBy: "date"
});
```

### useRecentDocuments
Obtener documentos recientes del sistema.

```typescript
const { 
  documents, 
  loading, 
  error, 
  fetchRecent 
} = useRecentDocuments(5);

// Uso
useEffect(() => {
  fetchRecent();
}, []);
```

### useDocumentStats
Obtener estadísticas del sistema de documentos.

```typescript
const { 
  stats,      // Objeto con estadísticas
  loading, 
  error, 
  fetchStats 
} = useDocumentStats();

// stats contiene:
// - totalDocuments: number
// - totalSize: number
// - categories: Record<string, number>
// - documentTypes: Record<string, number>
// - mimeTypes: Record<string, number>
```

### useDocumentDownload
Descargar documentos con estado de progreso.

```typescript
const { 
  downloading, 
  error, 
  download 
} = useDocumentDownload();

// Uso
await download(documentId, "mi-documento.pdf");
```

## 📋 Categorías Soportadas

```typescript
const CATEGORIES = [
  'contratos',
  'documentos',
  'reportes',
  'actos_administrativos',
  'suplencias',
  'horas_extra',
];
```

## 📝 Tipos de Documento

```typescript
const DOCUMENT_TYPES = [
  'contrato_laboral',
  'acto_administrativo',
  'suplencia',
  'horas_extra',
  'reporte',
  'certificado',
];
```

## 🔐 Permisos

El módulo está protegido con `ProtectedRoute` y requiere uno de los siguientes roles:
- `super_admin`
- `admin`
- `gestor`

## 🌐 Endpoints del API

Base URL: `https://demo-facilwhatsappapi.facilcreditos.co/api/retrieval`

### Búsqueda Simple
```
GET /api/retrieval/search?text=contrato&category=contratos
```

### Búsqueda Avanzada
```
GET /api/retrieval/advanced-search?query=contrato&fuzzy=true&size=20
```

### Documentos de Empleado
```
GET /api/retrieval/employee/{employeeUuid}?page=1&limit=20
```

### Descargar Documento
```
GET /api/retrieval/download/{documentId}
```

### Ver Documento
```
GET /api/retrieval/view/{documentId}
```

### Documentos Recientes
```
GET /api/retrieval/recent?limit=10
```

### Estadísticas
```
GET /api/retrieval/stats
```

## 🎨 Componentes UI Utilizados

- `Card`, `CardContent`, `CardHeader`, `CardTitle`, `CardDescription`
- `Button`
- `Input`
- `Label`
- `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`
- `Badge`
- `Alert`, `AlertDescription`
- `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`

## 📦 Dependencias

```json
{
  "lucide-react": "Iconos",
  "@/components/ui": "Componentes UI de shadcn",
  "@/components/protected-route": "Protección de rutas",
  "axios": "Cliente HTTP (en JwtApiService)"
}
```

## 🚀 Próximas Funcionalidades (Pendientes)

- [ ] **Subir Documentos**: Formulario para cargar nuevos documentos
- [ ] **Vista de Categorías**: Explorar documentos por categorías
- [ ] **Vista de Empleado**: Ver todos los documentos de un empleado específico
- [ ] **Documentos Similares**: Sugerencias basadas en contenido
- [ ] **Autocompletado**: Sugerencias en búsqueda
- [ ] **Export**: Exportar resultados a CSV/Excel
- [ ] **Compartir**: Compartir documentos con otros usuarios

## 📚 Documentación Adicional

Para más detalles sobre la API, consulta:
- `ADMIN_SEARCH_MODULE_DOCUMENTATION.md` - Documentación completa del API

## 🐛 Troubleshooting

### Error: "Module has no exported member"
✅ Resuelto - Creado hook `useAdvancedDocumentSearch.ts` con exports correctos

### Error: "Property 'getBlob' does not exist"
✅ Resuelto - Agregado método `getBlob` a `JwtApiService`

### Error: "Parameter implicitly has 'any' type"
✅ Resuelto - Agregado tipado explícito `Document` en maps

## 👥 Uso en Otros Módulos

Este módulo puede integrarse fácilmente en:
- ✅ **Profesores**: Ya implementado en `/dashboard/profesores/[id]`
- ✅ **Rectores**: Ya implementado en `/dashboard/rectores/[id]`
- 🔄 **Actos Administrativos**: Pendiente
- 🔄 **Suplencias**: Pendiente
- 🔄 **Horas Extra**: Pendiente

## 📅 Fecha de Implementación

**8 de octubre de 2025**

## ✅ Checklist de Implementación

- [x] Crear estructura de carpetas
- [x] Implementar servicio de búsqueda
- [x] Crear hooks personalizados
- [x] Página principal de documentos
- [x] Página de búsqueda avanzada
- [x] Tab de documentos recientes
- [x] Tab de estadísticas
- [x] Integración con sidebar
- [x] Agregar método getBlob al servicio JWT
- [x] Protección de rutas
- [x] Tipado TypeScript completo
- [x] Documentación README

---

**Estado**: ✅ **COMPLETADO Y FUNCIONAL**

El módulo está listo para usar. Los usuarios con permisos de `admin`, `super_admin` o `gestor` pueden acceder desde el menú lateral "Documentos" > "Buscar Documentos".
