# 🔍 DOCUMENTACIÓN COMPLETA: Módulo de Búsqueda y Administración de Documentos

## 📋 Índice
1. [Descripción General](#descripción-general)
2. [Endpoints Disponibles](#endpoints-disponibles)
3. [Búsqueda Simple](#búsqueda-simple)
4. [Búsqueda Avanzada](#búsqueda-avanzada)
5. [Búsqueda por Empleado](#búsqueda-por-empleado)
6. [Descarga y Visualización](#descarga-y-visualización)
7. [Estadísticas y Analíticas](#estadísticas-y-analíticas)
8. [Implementación en Next.js](#implementación-en-nextjs)
9. [Componentes React Ejemplo](#componentes-react-ejemplo)
10. [Tipos TypeScript](#tipos-typescript)
11. [Casos de Uso](#casos-de-uso)
12. [Manejo de Errores](#manejo-de-errores)

---

## 📌 Descripción General

Este módulo proporciona una API completa para buscar, filtrar, descargar y visualizar documentos almacenados en el sistema SIGED. Utiliza:

- **Multer**: Para gestión de archivos en el sistema
- **Elasticsearch**: Para búsquedas rápidas y complejas en el contenido
- **Express**: API REST para acceso desde frontend

### Base URL
```
https://demo-facilwhatsappapi.facilcreditos.co/api/retrieval
```

### Autenticación
```typescript
headers: {
  'Authorization': `Bearer ${token}`
}
```

---

## 🌐 Endpoints Disponibles

### Tabla Resumen de Endpoints

| Método | Endpoint | Descripción | Uso Principal |
|--------|----------|-------------|---------------|
| GET | `/search` | Búsqueda básica de documentos | Búsqueda simple por texto |
| GET | `/advanced-search` | Búsqueda avanzada con filtros | Admin: búsqueda compleja |
| GET | `/search/keywords` | Búsqueda por palabras clave | Búsqueda específica |
| GET | `/search/content` | Búsqueda en contenido de PDFs | Búsqueda de texto dentro de docs |
| GET | `/employee/:employeeUuid` | Docs de un empleado | Ver todos los docs de una persona |
| GET | `/employee/:employeeUuid/search` | Buscar en docs de empleado | Filtrar docs de un empleado |
| GET | `/download/:id` | Descargar documento | Descarga directa |
| GET | `/view/:id` | Visualizar documento | Ver PDF en navegador |
| GET | `/recent` | Documentos recientes | Dashboard admin |
| GET | `/category/:category` | Docs por categoría | Filtrar por tipo |
| GET | `/tags` | Docs por etiquetas | Filtrar por tags |
| GET | `/similar/:id` | Documentos similares | Sugerencias |
| GET | `/suggestions` | Autocompletado | Barra de búsqueda |
| GET | `/stats` | Estadísticas del sistema | Dashboard analytics |

---

## 🔍 Búsqueda Simple

### Endpoint: `/search`

Búsqueda básica por texto, categoría, tags y fechas.

#### Request
```typescript
GET /api/retrieval/search?text=contrato&category=contratos&includeContent=false
```

#### Query Parameters

| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|-----------|-------------|---------|
| `text` | string | No | Texto a buscar en título y keywords | `"contrato"` |
| `category` | string | No | Categoría del documento | `"contratos"` |
| `tags` | string[] | No | Etiquetas (puede ser múltiple) | `["activo", "2025"]` |
| `dateFrom` | string | No | Fecha inicial (ISO 8601) | `"2025-01-01"` |
| `dateTo` | string | No | Fecha final (ISO 8601) | `"2025-12-31"` |
| `includeContent` | boolean | No | Incluir contenido extraído | `true` |

#### Response
```json
{
  "documents": [
    {
      "id": "doc_123456",
      "title": "Contrato Laboral",
      "filename": "1728123456_contrato.pdf",
      "originalName": "contrato.pdf",
      "size": 245678,
      "mimetype": "application/pdf",
      "uploadDate": "2025-10-07T14:30:00Z",
      "description": "Contrato de trabajo",
      "category": "contratos",
      "tags": ["activo", "2025"],
      "keywords": ["contrato", "laboral", "trabajo"],
      "employeeUuid": "uuid-empleado-123",
      "employeeName": "Juan Pérez",
      "documentType": "contrato_laboral",
      "downloadUrl": "https://demo-facilwhatsappapi.facilcreditos.co/api/retrieval/download/doc_123456",
      "viewUrl": "https://demo-facilwhatsappapi.facilcreditos.co/api/retrieval/view/doc_123456",
      "extractedText": "Contenido del PDF..." // Solo si includeContent=true
    }
  ],
  "count": 1,
  "query": {
    "text": "contrato",
    "category": "contratos",
    "includeContent": false
  }
}
```

#### Ejemplo Next.js
```typescript
// services/documentService.ts
export async function searchDocuments(params: {
  text?: string;
  category?: string;
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  includeContent?: boolean;
}) {
  const queryParams = new URLSearchParams();
  
  if (params.text) queryParams.append('text', params.text);
  if (params.category) queryParams.append('category', params.category);
  if (params.tags) {
    params.tags.forEach(tag => queryParams.append('tags', tag));
  }
  if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom.toISOString());
  if (params.dateTo) queryParams.append('dateTo', params.dateTo.toISOString());
  if (params.includeContent) queryParams.append('includeContent', 'true');

  const response = await fetch(
    `${API_URL}/api/retrieval/search?${queryParams}`,
    {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    }
  );

  if (!response.ok) {
    throw new Error('Error al buscar documentos');
  }

  return response.json();
}
```

---

## 🎯 Búsqueda Avanzada

### Endpoint: `/advanced-search`

Búsqueda con filtros complejos, paginación, ordenamiento y destacado de resultados.

#### Request
```typescript
GET /api/retrieval/advanced-search?query=contrato&fuzzy=true&size=20&from=0&sortBy=date&sortOrder=desc
```

#### Query Parameters

| Parámetro | Tipo | Requerido | Descripción | Valores | Default |
|-----------|------|-----------|-------------|---------|---------|
| `query` | string | No | Texto general a buscar | Cualquier texto | - |
| `keywords` | string[] | No | Palabras clave específicas | Array de strings | - |
| `content` | string | No | Buscar en contenido de PDFs | Texto a buscar | - |
| `fuzzy` | boolean | No | Búsqueda aproximada (typos) | `true/false` | `false` |
| `boost` | boolean | No | Aumentar relevancia de keywords | `true/false` | `false` |
| `size` | number | No | Cantidad de resultados | 1-100 | `10` |
| `from` | number | No | Offset para paginación | ≥0 | `0` |
| `category` | string | No | Filtrar por categoría | Ver categorías | - |
| `documentType` | string | No | Tipo de documento | Ver tipos | - |
| `employeeUuid` | string | No | UUID del empleado | UUID válido | - |
| `dateFrom` | string | No | Fecha inicio (ISO 8601) | `YYYY-MM-DD` | - |
| `dateTo` | string | No | Fecha fin (ISO 8601) | `YYYY-MM-DD` | - |
| `fileType` | string | No | Tipo MIME | `pdf`, `docx`, etc | - |
| `sortBy` | string | No | Campo de ordenamiento | `relevance`, `date`, `size`, `filename` | `relevance` |
| `sortOrder` | string | No | Dirección de orden | `asc`, `desc` | `desc` |

#### Categorías Disponibles
- `contratos`
- `documentos`
- `reportes`
- `actos_administrativos`
- `suplencias`
- `horas_extra`
- Otros definidos en el sistema

#### Tipos de Documento
- `contrato_laboral`
- `acto_administrativo`
- `suplencia`
- `horas_extra`
- `reporte`
- `certificado`
- Otros definidos en el sistema

#### Response
```json
{
  "documents": [
    {
      "id": "doc_123456",
      "title": "Contrato Laboral 2025",
      "filename": "1728123456_contrato.pdf",
      "originalName": "contrato.pdf",
      "size": 245678,
      "mimetype": "application/pdf",
      "uploadDate": "2025-10-07T14:30:00Z",
      "description": "Contrato de trabajo 2025",
      "category": "contratos",
      "tags": ["activo", "2025", "definitivo"],
      "keywords": ["contrato", "laboral", "trabajo", "definitivo"],
      "employeeUuid": "uuid-123",
      "employeeName": "Juan Pérez",
      "documentType": "contrato_laboral",
      "downloadUrl": "https://.../download/doc_123456",
      "viewUrl": "https://.../view/doc_123456",
      "score": 15.234,
      "highlights": {
        "title": ["<em>Contrato</em> Laboral 2025"],
        "content": ["Este <em>contrato</em> de trabajo..."]
      }
    }
  ],
  "total": 45,
  "took": 23,
  "facets": {
    "categories": {
      "contratos": 25,
      "documentos": 15,
      "reportes": 5
    },
    "documentTypes": {
      "contrato_laboral": 20,
      "acto_administrativo": 10,
      "suplencia": 15
    },
    "years": {
      "2025": 30,
      "2024": 15
    }
  },
  "query": {
    "query": "contrato",
    "fuzzy": true,
    "size": 20,
    "from": 0,
    "sortBy": "date",
    "sortOrder": "desc"
  }
}
```

#### Ejemplo Next.js con Hook
```typescript
// hooks/useAdvancedSearch.ts
import { useState, useEffect } from 'react';

interface SearchParams {
  query?: string;
  fuzzy?: boolean;
  size?: number;
  from?: number;
  category?: string;
  documentType?: string;
  employeeUuid?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: 'relevance' | 'date' | 'size' | 'filename';
  sortOrder?: 'asc' | 'desc';
}

export function useAdvancedSearch(params: SearchParams) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (value instanceof Date) {
              queryParams.append(key, value.toISOString());
            } else {
              queryParams.append(key, String(value));
            }
          }
        });

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/retrieval/advanced-search?${queryParams}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (!response.ok) throw new Error('Error en búsqueda');
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (params.query || params.category || params.documentType) {
      fetchData();
    }
  }, [params]);

  return { data, loading, error };
}
```

---

## 👤 Búsqueda por Empleado

### Endpoint 1: `/employee/:employeeUuid`

Obtener todos los documentos de un empleado específico.

#### Request
```typescript
GET /api/retrieval/employee/uuid-empleado-123?page=1&limit=20&sortBy=date
```

#### Path Parameters
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `employeeUuid` | string | UUID del empleado |

#### Query Parameters
| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `page` | number | `1` | Número de página |
| `limit` | number | `20` | Docs por página |
| `sortBy` | string | `date` | Campo de orden |
| `sortOrder` | string | `desc` | Dirección |

#### Response
```json
{
  "employeeUuid": "uuid-empleado-123",
  "documents": [
    {
      "id": "doc_456",
      "title": "Contrato Laboral",
      "filename": "1728123456_contrato.pdf",
      "originalName": "contrato.pdf",
      "size": 245678,
      "mimetype": "application/pdf",
      "uploadDate": "2025-10-07T14:30:00Z",
      "category": "contratos",
      "tags": ["activo"],
      "keywords": ["contrato"],
      "employeeUuid": "uuid-empleado-123",
      "employeeName": "Juan Pérez",
      "employeeCedula": "12345678",
      "documentType": "contrato_laboral",
      "year": 2025,
      "downloadUrl": "https://.../download/doc_456",
      "viewUrl": "https://.../view/doc_456"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 35
  },
  "meta": {
    "employeeInfo": {
      "employeeName": "Juan Pérez",
      "employeeCedula": "12345678"
    }
  }
}
```

### Endpoint 2: `/employee/:employeeUuid/search`

Buscar dentro de los documentos de un empleado específico.

#### Request
```typescript
GET /api/retrieval/employee/uuid-123/search?text=contrato&documentType=contrato_laboral&page=1&limit=10
```

#### Query Parameters
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `text` | string | Texto a buscar |
| `category` | string | Categoría |
| `tags` | string[] | Etiquetas |
| `documentType` | string | Tipo de documento |
| `dateFrom` | string | Fecha inicio |
| `dateTo` | string | Fecha fin |
| `page` | number | Página |
| `limit` | number | Límite |

#### Response
```json
{
  "employeeUuid": "uuid-123",
  "searchQuery": {
    "text": "contrato",
    "category": null,
    "documentType": "contrato_laboral",
    "tags": null,
    "dateRange": {
      "from": null,
      "to": null
    }
  },
  "documents": [
    {
      "id": "doc_789",
      "title": "Contrato Laboral Definitivo",
      "score": 12.5,
      "highlights": {
        "title": ["<em>Contrato</em> Laboral"]
      },
      // ... resto de campos
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3
  },
  "meta": {
    "took": 15,
    "employeeInfo": {
      "employeeName": "Juan Pérez",
      "employeeCedula": "12345678"
    }
  }
}
```

#### Ejemplo Next.js
```typescript
// components/EmployeeDocuments.tsx
'use client';

import { useState, useEffect } from 'react';

interface Props {
  employeeUuid: string;
}

export default function EmployeeDocuments({ employeeUuid }: Props) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadDocuments();
  }, [employeeUuid, searchText, page]);

  async function loadDocuments() {
    setLoading(true);
    try {
      const endpoint = searchText
        ? `/api/retrieval/employee/${employeeUuid}/search?text=${searchText}&page=${page}&limit=20`
        : `/api/retrieval/employee/${employeeUuid}?page=${page}&limit=20`;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const data = await response.json();
      setDocuments(data.documents);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="employee-documents">
      <input
        type="text"
        placeholder="Buscar en documentos..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="search-input"
      />

      {loading ? (
        <div>Cargando...</div>
      ) : (
        <div className="documents-grid">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      )}

      <Pagination page={page} onPageChange={setPage} />
    </div>
  );
}
```

---

## 📥 Descarga y Visualización

### Endpoint 1: `/download/:id`

Descargar un documento directamente.

#### Request
```typescript
GET /api/retrieval/download/doc_123456
```

#### Response
- Content-Type: `application/pdf` (o el tipo MIME del archivo)
- Content-Disposition: `attachment; filename="documento.pdf"`
- El archivo se descarga automáticamente

#### Ejemplo Next.js
```typescript
async function downloadDocument(documentId: string, fileName: string) {
  try {
    const response = await fetch(
      `${API_URL}/api/retrieval/download/${documentId}`,
      {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      }
    );

    if (!response.ok) throw new Error('Error al descargar');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error:', error);
    alert('Error al descargar el documento');
  }
}
```

### Endpoint 2: `/view/:id`

Visualizar documento en el navegador (ideal para PDFs).

#### Request
```typescript
GET /api/retrieval/view/doc_123456
```

#### Response
- Content-Type: `application/pdf`
- Content-Disposition: `inline; filename="documento.pdf"`
- El PDF se muestra en el navegador

#### Ejemplo Next.js
```typescript
// components/DocumentViewer.tsx
'use client';

interface Props {
  documentId: string;
}

export default function DocumentViewer({ documentId }: Props) {
  const viewUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/retrieval/view/${documentId}`;
  const token = localStorage.getItem('token');

  return (
    <div className="document-viewer">
      <iframe
        src={`${viewUrl}?token=${token}`}
        width="100%"
        height="800px"
        title="Document Viewer"
      />
    </div>
  );
}
```

---

## 📊 Estadísticas y Analíticas

### Endpoint: `/stats`

Obtener estadísticas generales del sistema de documentos.

#### Request
```typescript
GET /api/retrieval/stats
```

#### Response
```json
{
  "stats": {
    "totalDocuments": 1245,
    "totalSize": 524288000,
    "averageSize": 420943,
    "categories": {
      "contratos": 350,
      "documentos": 450,
      "reportes": 200,
      "actos_administrativos": 145,
      "suplencias": 100
    },
    "mimeTypes": {
      "application/pdf": 1000,
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": 150,
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": 95
    }
  }
}
```

### Endpoint: `/recent`

Obtener documentos recientes.

#### Request
```typescript
GET /api/retrieval/recent?limit=10
```

#### Query Parameters
| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `limit` | number | `10` | Cantidad de documentos |

#### Response
```json
{
  "documents": [
    {
      "id": "doc_latest",
      "title": "Reporte Mensual Octubre",
      "uploadDate": "2025-10-08T10:15:00Z",
      // ... resto de campos
    }
  ],
  "count": 10
}
```

### Endpoint: `/category/:category`

Obtener documentos por categoría.

#### Request
```typescript
GET /api/retrieval/category/contratos?page=1&limit=20
```

#### Response
Similar a búsqueda básica pero filtrado por categoría.

### Endpoint: `/tags`

Obtener documentos por etiquetas.

#### Request
```typescript
GET /api/retrieval/tags?tags=activo&tags=2025&page=1&limit=20
```

#### Response
Similar a búsqueda básica pero filtrado por tags.

---

## 🔧 Implementación en Next.js

### Estructura de Proyecto Recomendada

```
app/
├── admin/
│   └── documents/
│       ├── page.tsx                    # Vista principal de admin
│       ├── [id]/
│       │   └── page.tsx               # Vista detalle documento
│       └── components/
│           ├── SearchBar.tsx          # Barra de búsqueda
│           ├── FilterPanel.tsx        # Panel de filtros
│           ├── DocumentGrid.tsx       # Grid de documentos
│           ├── DocumentCard.tsx       # Card individual
│           ├── DocumentViewer.tsx     # Visor de PDFs
│           ├── AdvancedSearch.tsx     # Búsqueda avanzada
│           └── StatsWidget.tsx        # Widget de estadísticas
├── services/
│   └── documentService.ts             # Servicios API
├── hooks/
│   ├── useDocumentSearch.ts           # Hook búsqueda
│   ├── useAdvancedSearch.ts           # Hook búsqueda avanzada
│   └── useDocumentStats.ts            # Hook estadísticas
└── types/
    └── document.ts                     # Tipos TypeScript
```

### Service Principal
```typescript
// services/documentService.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

export const documentService = {
  // Búsqueda simple
  async search(params: SearchParams) {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, v]) => v != null)
        .map(([k, v]) => [k, String(v)])
    ).toString();

    const response = await fetch(
      `${API_URL}/api/retrieval/search?${queryString}`,
      { headers: getAuthHeaders() }
    );

    if (!response.ok) throw new Error('Search failed');
    return response.json();
  },

  // Búsqueda avanzada
  async advancedSearch(params: AdvancedSearchParams) {
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, v]) => v != null)
        .map(([k, v]) => [k, String(v)])
    ).toString();

    const response = await fetch(
      `${API_URL}/api/retrieval/advanced-search?${queryString}`,
      { headers: getAuthHeaders() }
    );

    if (!response.ok) throw new Error('Advanced search failed');
    return response.json();
  },

  // Descargar documento
  async download(documentId: string, fileName: string) {
    const response = await fetch(
      `${API_URL}/api/retrieval/download/${documentId}`,
      { headers: getAuthHeaders() }
    );

    if (!response.ok) throw new Error('Download failed');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  // Ver documento
  getViewUrl(documentId: string) {
    return `${API_URL}/api/retrieval/view/${documentId}`;
  },

  // Estadísticas
  async getStats() {
    const response = await fetch(
      `${API_URL}/api/retrieval/stats`,
      { headers: getAuthHeaders() }
    );

    if (!response.ok) throw new Error('Stats failed');
    return response.json();
  },

  // Documentos recientes
  async getRecent(limit: number = 10) {
    const response = await fetch(
      `${API_URL}/api/retrieval/recent?limit=${limit}`,
      { headers: getAuthHeaders() }
    );

    if (!response.ok) throw new Error('Recent docs failed');
    return response.json();
  },

  // Documentos de empleado
  async getEmployeeDocuments(employeeUuid: string, page: number = 1, limit: number = 20) {
    const response = await fetch(
      `${API_URL}/api/retrieval/employee/${employeeUuid}?page=${page}&limit=${limit}`,
      { headers: getAuthHeaders() }
    );

    if (!response.ok) throw new Error('Employee docs failed');
    return response.json();
  },

  // Buscar en documentos de empleado
  async searchEmployeeDocuments(employeeUuid: string, searchParams: any) {
    const queryString = new URLSearchParams(searchParams).toString();
    const response = await fetch(
      `${API_URL}/api/retrieval/employee/${employeeUuid}/search?${queryString}`,
      { headers: getAuthHeaders() }
    );

    if (!response.ok) throw new Error('Employee search failed');
    return response.json();
  }
};
```

---

## ⚛️ Componentes React Ejemplo

### Componente: Barra de Búsqueda
```typescript
// components/SearchBar.tsx
'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface Props {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = 'Buscar documentos...' }: Props) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </form>
  );
}
```

### Componente: Panel de Filtros
```typescript
// components/FilterPanel.tsx
'use client';

import { useState } from 'react';

interface FilterState {
  category?: string;
  documentType?: string;
  dateFrom?: string;
  dateTo?: string;
  fileType?: string;
}

interface Props {
  onFilterChange: (filters: FilterState) => void;
}

export default function FilterPanel({ onFilterChange }: Props) {
  const [filters, setFilters] = useState<FilterState>({});

  const handleChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filtros</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Limpiar
        </button>
      </div>

      {/* Categoría */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Categoría
        </label>
        <select
          value={filters.category || ''}
          onChange={(e) => handleChange('category', e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-2"
        >
          <option value="">Todas</option>
          <option value="contratos">Contratos</option>
          <option value="documentos">Documentos</option>
          <option value="reportes">Reportes</option>
          <option value="actos_administrativos">Actos Administrativos</option>
          <option value="suplencias">Suplencias</option>
          <option value="horas_extra">Horas Extra</option>
        </select>
      </div>

      {/* Tipo de Documento */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Tipo de Documento
        </label>
        <select
          value={filters.documentType || ''}
          onChange={(e) => handleChange('documentType', e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-2"
        >
          <option value="">Todos</option>
          <option value="contrato_laboral">Contrato Laboral</option>
          <option value="acto_administrativo">Acto Administrativo</option>
          <option value="suplencia">Suplencia</option>
          <option value="horas_extra">Horas Extra</option>
        </select>
      </div>

      {/* Fecha Desde */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Fecha Desde
        </label>
        <input
          type="date"
          value={filters.dateFrom || ''}
          onChange={(e) => handleChange('dateFrom', e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-2"
        />
      </div>

      {/* Fecha Hasta */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Fecha Hasta
        </label>
        <input
          type="date"
          value={filters.dateTo || ''}
          onChange={(e) => handleChange('dateTo', e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-2"
        />
      </div>

      {/* Tipo de Archivo */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Tipo de Archivo
        </label>
        <select
          value={filters.fileType || ''}
          onChange={(e) => handleChange('fileType', e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-2"
        >
          <option value="">Todos</option>
          <option value="pdf">PDF</option>
          <option value="docx">Word</option>
          <option value="xlsx">Excel</option>
        </select>
      </div>
    </div>
  );
}
```

### Componente: Card de Documento
```typescript
// components/DocumentCard.tsx
'use client';

import { DocumentIcon, ArrowDownTrayIcon, EyeIcon } from '@heroicons/react/24/outline';
import { formatBytes, formatDate } from '@/lib/utils';
import type { Document } from '@/types/document';

interface Props {
  document: Document;
  onDownload: (doc: Document) => void;
  onView: (doc: Document) => void;
}

export default function DocumentCard({ document, onDownload, onView }: Props) {
  const getFileIcon = (mimetype: string) => {
    if (mimetype.includes('pdf')) return '📄';
    if (mimetype.includes('word')) return '📝';
    if (mimetype.includes('excel')) return '📊';
    return '📎';
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
      {/* Icono del archivo */}
      <div className="mb-3 flex items-start justify-between">
        <div className="text-4xl">{getFileIcon(document.mimetype)}</div>
        <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onView(document)}
            className="rounded-full bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
            title="Ver documento"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDownload(document)}
            className="rounded-full bg-green-100 p-2 text-green-600 hover:bg-green-200"
            title="Descargar"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Título */}
      <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900">
        {document.title}
      </h3>

      {/* Metadata */}
      <div className="space-y-1 text-xs text-gray-500">
        <p className="line-clamp-1">{document.originalName}</p>
        <p>{formatBytes(document.size)}</p>
        <p>{formatDate(document.uploadDate)}</p>
        {document.employeeName && (
          <p className="font-medium text-gray-700">{document.employeeName}</p>
        )}
      </div>

      {/* Tags */}
      {document.tags && document.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {document.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Categoría */}
      <div className="mt-2">
        <span className="inline-block rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
          {document.category}
        </span>
      </div>
    </div>
  );
}
```

### Componente: Vista Principal Admin
```typescript
// app/admin/documents/page.tsx
'use client';

import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import DocumentGrid from './components/DocumentGrid';
import DocumentCard from './components/DocumentCard';
import StatsWidget from './components/StatsWidget';
import { documentService } from '@/services/documentService';
import type { Document } from '@/types/document';

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    searchDocuments();
  }, [searchQuery, filters]);

  async function loadStats() {
    try {
      const data = await documentService.getStats();
      setStats(data.stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  async function searchDocuments() {
    setLoading(true);
    try {
      const params = {
        query: searchQuery,
        fuzzy: true,
        size: 50,
        ...filters
      };

      const data = await documentService.advancedSearch(params);
      setDocuments(data.documents);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDownload = async (doc: Document) => {
    try {
      await documentService.download(doc.id, doc.originalName);
    } catch (error) {
      console.error('Error downloading:', error);
      alert('Error al descargar el documento');
    }
  };

  const handleView = (doc: Document) => {
    window.open(documentService.getViewUrl(doc.id), '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Administración de Documentos
          </h1>
          <p className="mt-2 text-gray-600">
            Busca, filtra y gestiona todos los documentos del sistema
          </p>
        </div>

        {/* Estadísticas */}
        {stats && <StatsWidget stats={stats} />}

        {/* Layout Principal */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sidebar con Filtros */}
          <div className="lg:col-span-1">
            <FilterPanel onFilterChange={setFilters} />
          </div>

          {/* Contenido Principal */}
          <div className="lg:col-span-3">
            {/* Barra de Búsqueda */}
            <div className="mb-6">
              <SearchBar
                onSearch={setSearchQuery}
                placeholder="Buscar por título, contenido, empleado..."
              />
            </div>

            {/* Resultados */}
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="text-gray-500">Cargando documentos...</div>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  {documents.length} documentos encontrados
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {documents.map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      document={doc}
                      onDownload={handleDownload}
                      onView={handleView}
                    />
                  ))}
                </div>

                {documents.length === 0 && !loading && (
                  <div className="flex h-64 flex-col items-center justify-center text-gray-500">
                    <DocumentIcon className="mb-4 h-16 w-16" />
                    <p>No se encontraron documentos</p>
                    <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 📘 Tipos TypeScript

```typescript
// types/document.ts

export interface Document {
  id: string;
  title: string;
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
  uploadDate: string;
  description?: string;
  category: string;
  tags: string[];
  keywords: string[];
  employeeUuid: string;
  employeeName?: string;
  employeeCedula?: string;
  documentType: string;
  year?: number;
  downloadUrl: string;
  viewUrl: string;
  score?: number;
  highlights?: {
    title?: string[];
    content?: string[];
    [key: string]: string[] | undefined;
  };
  extractedText?: string;
}

export interface SearchParams {
  text?: string;
  category?: string;
  tags?: string[];
  dateFrom?: Date | string;
  dateTo?: Date | string;
  includeContent?: boolean;
}

export interface AdvancedSearchParams extends SearchParams {
  query?: string;
  keywords?: string[];
  content?: string;
  fuzzy?: boolean;
  boost?: boolean;
  size?: number;
  from?: number;
  documentType?: string;
  employeeUuid?: string;
  fileType?: string;
  sortBy?: 'relevance' | 'date' | 'size' | 'filename';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResponse {
  documents: Document[];
  count?: number;
  total?: number;
  took?: number;
  facets?: {
    categories?: Record<string, number>;
    documentTypes?: Record<string, number>;
    years?: Record<string, number>;
  };
  query: SearchParams | AdvancedSearchParams;
}

export interface EmployeeDocumentsResponse {
  employeeUuid: string;
  documents: Document[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  meta: {
    employeeInfo?: {
      employeeName: string;
      employeeCedula: string;
    };
    took?: number;
  };
  searchQuery?: any;
}

export interface DocumentStats {
  totalDocuments: number;
  totalSize: number;
  averageSize: number;
  categories: Record<string, number>;
  mimeTypes: Record<string, number>;
}

// Utilidades
export const CATEGORIES = [
  'contratos',
  'documentos',
  'reportes',
  'actos_administrativos',
  'suplencias',
  'horas_extra'
] as const;

export const DOCUMENT_TYPES = [
  'contrato_laboral',
  'acto_administrativo',
  'suplencia',
  'horas_extra',
  'reporte',
  'certificado'
] as const;

export type Category = typeof CATEGORIES[number];
export type DocumentType = typeof DOCUMENT_TYPES[number];
```

---

## 🎯 Casos de Uso

### Caso 1: Administrador busca todos los contratos de 2025

```typescript
const results = await documentService.advancedSearch({
  category: 'contratos',
  dateFrom: '2025-01-01',
  dateTo: '2025-12-31',
  sortBy: 'date',
  sortOrder: 'desc',
  size: 100
});
```

### Caso 2: Buscar documentos que contengan "renuncia"

```typescript
const results = await documentService.advancedSearch({
  content: 'renuncia',
  fuzzy: true,
  highlight: true
});
```

### Caso 3: Ver todos los documentos de un empleado

```typescript
const results = await documentService.getEmployeeDocuments(
  'uuid-empleado-123',
  1,
  20
);
```

### Caso 4: Buscar en documentos de un empleado

```typescript
const results = await documentService.searchEmployeeDocuments(
  'uuid-empleado-123',
  {
    text: 'contrato',
    documentType: 'contrato_laboral'
  }
);
```

### Caso 5: Dashboard con estadísticas

```typescript
const stats = await documentService.getStats();
const recent = await documentService.getRecent(5);

// Mostrar:
// - Total de documentos
// - Espacio usado
// - Documentos por categoría
// - Últimos 5 documentos subidos
```

---

## ⚠️ Manejo de Errores

### Errores Comunes

```typescript
// services/documentService.ts

export class DocumentServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: any
  ) {
    super(message);
    this.name = 'DocumentServiceError';
  }
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    
    switch (response.status) {
      case 400:
        throw new DocumentServiceError(
          'Parámetros de búsqueda inválidos',
          400,
          error
        );
      case 401:
        throw new DocumentServiceError(
          'No autorizado. Por favor inicia sesión',
          401
        );
      case 404:
        throw new DocumentServiceError(
          'Documento no encontrado',
          404
        );
      case 500:
        throw new DocumentServiceError(
          'Error del servidor. Por favor intenta más tarde',
          500,
          error
        );
      default:
        throw new DocumentServiceError(
          'Error desconocido',
          response.status,
          error
        );
    }
  }
  
  return response.json();
}

// Uso en componentes
try {
  const results = await documentService.search(params);
  setDocuments(results.documents);
} catch (error) {
  if (error instanceof DocumentServiceError) {
    if (error.statusCode === 401) {
      // Redirigir al login
      router.push('/login');
    } else {
      // Mostrar mensaje de error
      toast.error(error.message);
    }
  } else {
    toast.error('Error inesperado');
  }
}
```

### Componente de Error

```typescript
// components/ErrorBoundary.tsx
'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold">Algo salió mal</h2>
      <p className="mb-4 text-gray-600">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}
```

---

## 🚀 Optimizaciones y Mejores Prácticas

### 1. Caché de Búsquedas
```typescript
// lib/cache.ts
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export function getCached(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

export function setCache(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}
```

### 2. Debounce en Búsqueda
```typescript
import { useDebounce } from '@/hooks/useDebounce';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchDocuments(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
}
```

### 3. Paginación Infinita
```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

function useInfiniteDocuments(filters: any) {
  return useInfiniteQuery({
    queryKey: ['documents', filters],
    queryFn: ({ pageParam = 0 }) =>
      documentService.advancedSearch({
        ...filters,
        from: pageParam,
        size: 20
      }),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.documents.length < 20) return undefined;
      return pages.length * 20;
    }
  });
}
```

---

## 📚 Recursos Adicionales

### Variables de Entorno
```env
# .env.local
NEXT_PUBLIC_API_URL=https://demo-facilwhatsappapi.facilcreditos.co
NEXT_PUBLIC_API_TIMEOUT=30000
```

### Utilidades
```typescript
// lib/utils.ts

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}

export function highlightText(text: string, highlights: string[]): string {
  if (!highlights || highlights.length === 0) return text;
  
  let result = text;
  highlights.forEach(highlight => {
    const regex = new RegExp(highlight, 'gi');
    result = result.replace(regex, '<mark>$&</mark>');
  });
  
  return result;
}
```

---

## ✅ Checklist de Implementación

- [ ] Configurar variables de entorno
- [ ] Crear servicio de documentos (`documentService.ts`)
- [ ] Definir tipos TypeScript
- [ ] Implementar componente SearchBar
- [ ] Implementar componente FilterPanel
- [ ] Implementar componente DocumentCard
- [ ] Implementar componente DocumentGrid
- [ ] Crear página principal de admin
- [ ] Implementar descarga de documentos
- [ ] Implementar visualización de PDFs
- [ ] Agregar manejo de errores
- [ ] Implementar paginación
- [ ] Agregar loading states
- [ ] Implementar caché de búsquedas
- [ ] Agregar debounce a búsqueda
- [ ] Implementar estadísticas en dashboard
- [ ] Testing de componentes
- [ ] Optimización de rendimiento

---

## 🔒 Seguridad

### Headers de Autenticación
Siempre incluir el token JWT en todas las peticiones:

```typescript
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Validación de Permisos
Solo administradores deben tener acceso:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const user = verifyToken(token);
  
  if (!user || user.role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
}

export const config = {
  matcher: '/admin/:path*'
};
```

---

## 📞 Soporte

**API Base URL**: `https://demo-facilwhatsappapi.facilcreditos.co`  
**Puerto Interno**: `6133`  
**Documentación Elasticsearch**: Ver `ELASTICSEARCH_GUIDE.md`  

Para más información sobre otros módulos, consultar:
- `PROMESA_2_*.md` - Documentación de subida de archivos
- `FRONTEND_EXAMPLES.md` - Ejemplos adicionales de frontend
- `TESTING.md` - Guías de testing

---

**Última actualización**: 8 de octubre de 2025  
**Versión**: 1.0.0  
**Estado**: ✅ Documentación Completa
