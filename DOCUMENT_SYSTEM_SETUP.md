# 📁 Sistema de Gestión de Documentos - Configuración

## 🚀 Configuración Inicial

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:12345
NEXT_PUBLIC_DOCUMENT_API_URL=http://localhost:12345/api/retrieval

# Document Upload Configuration
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_ALLOWED_FILE_TYPES=application/pdf,image/jpeg,image/png,image/jpg,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document
```

### 2. Estructura de Archivos Agregados

```
src/
├── config/
│   └── env.ts                     # Configuración de variables de entorno
├── types/
│   └── documentSearch.ts          # Tipos TypeScript para la API
├── hooks/
│   └── useDocumentSearch.ts       # Hook personalizado para búsqueda/carga
├── components/
│   ├── document-search.tsx        # Componente de búsqueda avanzada
│   └── ui/
│       └── collapsible.tsx        # Componente UI faltante
└── lib/
    └── document-store.ts          # Store actualizado con API calls
```

## 🔧 Funcionalidades Implementadas

### ✅ Búsqueda Avanzada de Documentos

- **Búsqueda por texto**: Con autocompletado en tiempo real
- **Filtros múltiples**: Por categoría, tipo de documento, fechas
- **Búsqueda fuzzy**: Tolera errores tipográficos
- **Highlighting**: Resalta coincidencias en los resultados
- **Documentos similares**: Encuentra documentos relacionados
- **Paginación infinita**: Carga más resultados automáticamente

### ✅ Carga de Documentos

- **Upload a API**: Integración con el backend de documentos
- **Progreso de carga**: Indicador visual del progreso
- **Validación de archivos**: Tipos y tamaños permitidos
- **Metadatos**: Categorías, descripciones, palabras clave
- **Fallback local**: Funciona sin conexión a la API

### ✅ Interfaz Mejorada

- **Sistema de pestañas**: Buscar, Subir, Documentos Locales
- **Vista de documentos seleccionados**: Panel lateral informativo
- **Estadísticas**: Contadores y fechas de última actualización
- **Responsive**: Adaptable a diferentes pantallas

## 🎯 Cómo Usar

### En la Página del Profesor

1. **Pestaña "Buscar"**:
   - Escribe términos de búsqueda
   - Usa filtros para refinar resultados
   - Haz clic en documentos para seleccionarlos
   - Descarga o visualiza documentos

2. **Pestaña "Subir"**:
   - Arrastra archivos o selecciona desde el explorador
   - Completa metadatos (categoría, descripción)
   - Monitorea el progreso de carga

3. **Pestaña "Locales"**:
   - Ve documentos almacenados localmente
   - Gestiona documentos existentes

### Tipos de Búsqueda Disponibles

```typescript
// Búsqueda básica
await search({
  query: 'identificación',
  fuzzy: true,
  boost: true
});

// Búsqueda por palabras clave
await searchByKeywords(['rut', 'cedula', 'identificacion']);

// Búsqueda por contenido
await searchByContent('número de identificación', {
  highlight: true
});

// Obtener sugerencias
await getSuggestions('ident'); // Retorna: ['identificacion', 'identidad']

// Encontrar similares
await findSimilar('doc-id', { minScore: 0.7 });
```

## 🔗 Endpoints de API

| Endpoint | Método | Propósito |
|----------|--------|-----------|
| `/api/retrieval/advanced-search` | GET | Búsqueda avanzada con filtros |
| `/api/retrieval/search/keywords` | GET | Búsqueda por palabras clave |
| `/api/retrieval/search/content` | GET | Búsqueda en contenido |
| `/api/retrieval/suggestions` | GET | Autocompletado |
| `/api/retrieval/similar/{id}` | GET | Documentos similares |
| `/api/retrieval/upload` | POST | Subir documentos |
| `/api/retrieval/download/{id}` | GET | Descargar documentos |
| `/api/retrieval/view/{id}` | GET | Visualizar documentos |
| `/api/retrieval/delete/{id}` | DELETE | Eliminar documentos |

## 🛠️ Personalización

### Configurar URL de API

Modifica las variables en `.env.local`:

```env
NEXT_PUBLIC_DOCUMENT_API_URL=https://tu-api.com/api/retrieval
```

### Ajustar Límites de Archivos

```env
NEXT_PUBLIC_MAX_FILE_SIZE=20971520  # 20MB
NEXT_PUBLIC_ALLOWED_FILE_TYPES=application/pdf,image/jpeg,image/png
```

### Personalizar Componente de Búsqueda

```tsx
<DocumentSearch
  professorId={professorId}
  professorName="Nombre del Profesor"
  onDocumentSelect={(doc) => {
    // Tu lógica personalizada
    console.log('Documento seleccionado:', doc);
  }}
/>
```

## 🔧 Troubleshooting

### Problema: Variables de entorno no definidas

**Error**: `NEXT_PUBLIC_API_BASE_URL is required but not defined`

**Solución**: 
1. Verifica que `.env.local` existe en la raíz del proyecto
2. Reinicia el servidor de desarrollo
3. Verifica que las variables empiezan con `NEXT_PUBLIC_`

### Problema: Error de CORS

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solución**: Configura CORS en tu backend para permitir peticiones desde tu frontend.

### Problema: API no disponible

**Comportamiento**: Los documentos se manejan solo localmente

**Solución**: 
1. Verifica que el backend esté ejecutándose
2. Confirma la URL en las variables de entorno
3. Revisa la conectividad de red

### Problema: Archivos muy grandes

**Error**: File size exceeds limit

**Solución**: Ajusta `NEXT_PUBLIC_MAX_FILE_SIZE` en `.env.local`

## 📊 Monitoreo y Logs

### Logs en Consola

El sistema registra automáticamente:
- Errores de API
- Tiempos de respuesta de búsquedas
- Fallbacks a modo local
- Progreso de cargas

### Métricas Disponibles

```typescript
// Desde el hook useDocumentSearch
const {
  results,        // Resultados de búsqueda
  loading,        // Estado de carga
  error,          // Errores
  uploading,      // Estado de carga de archivos
  uploadProgress  // Progreso de carga (0-100)
} = useDocumentSearch();
```

## 🚀 Próximos Pasos

### Mejoras Sugeridas

1. **Cache de búsquedas**: Implementar cache local para mejorar performance
2. **Bulk upload**: Subida múltiple de archivos
3. **Preview de documentos**: Vista previa sin descargar
4. **Categorización automática**: ML para categorizar documentos
5. **Exportación de resultados**: Exportar listas de documentos

### Integración con Otros Módulos

- **Dashboard**: Estadísticas globales de documentos
- **Reportes**: Incluir métricas de documentos
- **Usuarios**: Permisos y accesos por rol

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs de la consola del navegador
2. Verifica la configuración de variables de entorno
3. Confirma que el backend está ejecutándose
4. Revisa la documentación de la API en `SEARCH_DOCUMENTATION_README.md`

¡El sistema está listo para usar! 🎉