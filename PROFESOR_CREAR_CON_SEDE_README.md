# Módulo de Creación de Profesor con Sede

## 📋 Descripción General

Este módulo implementa un formulario mejorado para crear profesores con asignación automática a una sede, siguiendo la misma arquitectura de pasos (wizard) usada en el módulo de rectores.

## 🔗 API Endpoint

**URL:** `https://demo-api-user.facilcreditos.co/api/empleado/normal/crear-con-sede`

**Método:** `POST`

**Headers:**
```json
{
  "Authorization": "Bearer <JWT_TOKEN>",
  "Content-Type": "application/json"
}
```

## 📦 Estructura del Cuerpo de la Petición

```typescript
{
  "empleado": {
    "tipo_documento": "CC" | "CE" | "PA" | "TI" | "RC" | "NIT",
    "documento": "1589635742",
    "nombre": "Nayibe",
    "apellido": "Rodríguez",
    "email": "nayibe.rodriguez@colegio.edu.co",
    "direccion": "Calle 123 #45-67, Pereira",
    "cargo": "Docente"
  },
  "informacionAcademica": {
    "nivel_academico": "licenciado" | "bachiller" | "tecnico" | "tecnologo" | "profesional" | "especialista" | "magister" | "doctorado",
    "anos_experiencia": 8,
    "institucion": "Universidad Tecnologica De Pereira",
    "titulo": "Licenciatura en Matemáticas"
  },
  "sedeId": "47c2ad3e-c6c7-4b4f-9a66-086fc4f2a360",
  "fechaAsignacion": "2025-01-15T00:00:00.000Z",
  "observaciones": "Asignación como docente de matemáticas para octavo y décimo"
}
```

## 📁 Archivos del Módulo

### 1. Tipos (Types)

**Archivo:** `/src/types/empleados.types.ts`

```typescript
export interface CreateProfesorConSedeRequest {
  empleado: {
    tipo_documento: 'CC' | 'CE' | 'PA' | 'TI' | 'RC' | 'NIT';
    documento: string;
    nombre: string;
    apellido: string;
    email: string;
    direccion: string;
    cargo: 'Docente';
  };
  informacionAcademica: {
    nivel_academico: 'bachiller' | 'tecnico' | 'tecnologo' | 'licenciado' | 'profesional' | 'especialista' | 'magister' | 'doctorado';
    anos_experiencia: number;
    institucion: string;
    titulo: string;
  };
  sedeId: string;
  fechaAsignacion: string;
  observaciones?: string;
}

export interface CreateProfesorConSedeResponse {
  success: boolean;
  message: string;
  data: {
    empleado: Empleado;
    informacionAcademica: {
      id: string;
      nivel_academico: string;
      anos_experiencia: number;
      institucion: string;
      titulo: string;
    };
    asignacion: {
      id: string;
      sede_id: string;
      fecha_asignacion: string;
      observaciones?: string;
    };
  };
}
```

### 2. Servicio (Service)

**Archivo:** `/src/services/empleados.service.ts`

**Método agregado:**

```typescript
static async createProfesorConSede(
  data: CreateProfesorConSedeRequest
): Promise<CreateProfesorConSedeResponse> {
  const endpoint = '/api/empleado/normal/crear-con-sede';
  const response = await JwtApiService.post<CreateProfesorConSedeResponse>(endpoint, data);
  return response;
}
```

### 3. Hook Personalizado

**Archivo:** `/src/hooks/useCrearProfesorConSede.ts`

**Exporta:**
```typescript
{
  loading: boolean;
  error: string | null;
  resultado: CreateProfesorConSedeResponse | null;
  crearProfesor: (data: CreateProfesorConSedeRequest) => Promise<CreateProfesorConSedeResponse | null>;
  reset: () => void;
}
```

**Uso:**
```typescript
const { crearProfesor, loading, error, resultado } = useCrearProfesorConSede();

// Crear profesor
const response = await crearProfesor({
  empleado: { ... },
  informacionAcademica: { ... },
  sedeId: "uuid-de-sede",
  fechaAsignacion: "2025-01-15T00:00:00.000Z"
});
```

### 4. Componente de Formulario

**Archivo:** `/src/app/dashboard/profesores/agregar/page.tsx`

## 🎯 Características Principales

### ✅ Arquitectura de Pasos (Wizard)

El formulario está dividido en **4 pasos**:

1. **Datos Personales**: Información básica del profesor (documento, nombre, email, dirección)
2. **Información Académica**: Nivel académico, título, institución, años de experiencia
3. **Asignación de Sede**: Selección de sede activa, fecha de asignación y observaciones
4. **Resumen**: Vista previa de todos los datos antes de enviar

### 🎨 Indicador Visual de Progreso

- **Stepper horizontal** con iconos
- Estados: Pendiente (gris), Activo (azul), Completado (verde con checkmark)
- Navegación entre pasos con validación

### ✔️ Validaciones por Paso

**Paso 1 - Datos Personales:**
- Nombre obligatorio
- Apellido obligatorio
- Documento obligatorio (mínimo 6 dígitos)
- Email obligatorio y válido (formato email)
- Dirección opcional

**Paso 2 - Información Académica:**
- Título obligatorio
- Institución educativa obligatoria
- Nivel académico (selección de 8 opciones)
- Años de experiencia (numérico, mínimo 0)

**Paso 3 - Asignación:**
- Sede obligatoria (selección de sedes activas cargadas dinámicamente)
- Fecha de asignación (por defecto fecha actual)
- Observaciones opcionales

### 🔄 Flujo de Usuario

1. Usuario completa **Paso 1** → Click en "Siguiente"
2. Validación automática del paso actual
3. Si es válido → Avanza al **Paso 2**
4. Usuario puede volver atrás con "Anterior"
5. En el **Paso 4 (Resumen)** → Muestra todos los datos organizados en cards
6. Click en "Crear Profesor" → Envía datos a la API
7. Éxito → Redirige a `/dashboard/profesores` después de 2 segundos

## 🔐 Permisos y Protección

**Protected Route:**
```typescript
<ProtectedRoute requiredRole={['super_admin', 'admin', 'gestor']}>
  <AgregarProfesorContent />
</ProtectedRoute>
```

Solo usuarios con roles `super_admin`, `admin` o `gestor` pueden acceder.

## 📊 Estados del Componente

```typescript
const [step, setStep] = useState<Step>("datos");
const [formErrors, setFormErrors] = useState<Record<string, string>>({});
const [formData, setFormData] = useState<CreateProfesorConSedeRequest>({
  empleado: {
    tipo_documento: 'CC',
    documento: '',
    nombre: '',
    apellido: '',
    email: '',
    direccion: '',
    cargo: 'Docente',
  },
  informacionAcademica: {
    nivel_academico: 'licenciado',
    anos_experiencia: 0,
    institucion: '',
    titulo: '',
  },
  sedeId: '',
  fechaAsignacion: new Date().toISOString().split('T')[0],
  observaciones: '',
});
```

## 🎨 Componentes UI Utilizados

- **shadcn/ui:** Card, Button, Input, Label, Select, Textarea, Alert, Badge
- **Lucide Icons:** User, GraduationCap, MapPin, CheckCircle, ArrowLeft, ArrowRight, Save, Loader2, AlertCircle

## 🔄 Comparación con Formulario Anterior

| Aspecto | Formulario Antiguo | Formulario Nuevo |
|---------|-------------------|------------------|
| **Endpoint** | `/api/empleado/` | `/api/empleado/normal/crear-con-sede` |
| **Arquitectura** | Formulario simple de 1 página | Wizard de 4 pasos |
| **Asignación de Sede** | ❌ No incluida | ✅ Integrada en el flujo |
| **Información Académica** | ❌ No incluida | ✅ Captura completa |
| **Validación** | ✅ Al final del formulario | ✅ Por cada paso |
| **UX** | Formulario largo | Pasos guiados |
| **Resumen** | ❌ No | ✅ Vista previa antes de enviar |
| **Navegación** | ❌ No | ✅ Anterior/Siguiente |
| **Indicador de Progreso** | ❌ No | ✅ Stepper visual |

## 🚀 Ejemplo de Uso Completo

```typescript
// 1. Usuario accede a /dashboard/profesores/agregar

// 2. Paso 1: Completa datos personales
{
  tipo_documento: "CC",
  documento: "1589635742",
  nombre: "Nayibe",
  apellido: "Rodríguez",
  email: "nayibe.rodriguez@colegio.edu.co",
  direccion: "Calle 123 #45-67, Pereira"
}

// 3. Paso 2: Información académica
{
  nivel_academico: "licenciado",
  anos_experiencia: 8,
  institucion: "Universidad Tecnológica De Pereira",
  titulo: "Licenciatura en Matemáticas"
}

// 4. Paso 3: Selecciona sede y completa asignación
{
  sedeId: "47c2ad3e-c6c7-4b4f-9a66-086fc4f2a360",
  fechaAsignacion: "2025-01-15",
  observaciones: "Asignación como docente de matemáticas para octavo y décimo"
}

// 5. Paso 4: Revisa resumen en cards organizadas

// 6. Click en "Crear Profesor"
// → POST a /api/empleado/normal/crear-con-sede
// → Respuesta exitosa
// → Alerta verde: "¡Profesor creado exitosamente! Redirigiendo..."
// → Redirección a /dashboard/profesores (2 seg)
```

## 🔧 Hooks Adicionales Utilizados

### useSedes

Carga las sedes activas para el select del Paso 3:

```typescript
const { sedes, loading: loadingSedes } = useSedes({ 
  autoLoad: true, 
  estado: 'activa' 
});
```

**Retorna:**
- `sedes`: Array de sedes activas
- `loading`: Estado de carga
- `error`: Errores si existen

## 🎯 Mejoras Implementadas

1. **✅ Experiencia de Usuario:** Formulario dividido en pasos lógicos y manejables
2. **✅ Validación Progressive:** Valida cada paso antes de avanzar
3. **✅ Vista Previa:** El usuario revisa todos los datos antes de enviar
4. **✅ Feedback Visual:** Stepper con estados (pendiente, activo, completado)
5. **✅ Carga Dinámica:** Sedes se cargan automáticamente desde la API
6. **✅ Información Completa:** Captura datos académicos y asignación de sede
7. **✅ Reutilización de Componentes:** Usa los mismos componentes que el módulo de rectores
8. **✅ TypeScript Completo:** Todo tipado con interfaces claras

## 📝 Notas Importantes

1. **Cargo Fijo:** El campo `cargo` siempre es `"Docente"` para este formulario
2. **Fecha ISO:** La fecha de asignación se envía en formato ISO 8601
3. **Observaciones Opcionales:** El campo `observaciones` no es obligatorio
4. **Sedes Activas:** Solo se muestran sedes con `estado: 'activa'`
5. **JWT Automático:** El token de autenticación se agrega automáticamente en `JwtApiService`

## 🐛 Manejo de Errores

**Errores de API:**
```typescript
if (error) {
  // Muestra alerta roja con mensaje de error
  <Alert variant="destructive">
    <AlertCircle />
    <AlertDescription>{error}</AlertDescription>
  </Alert>
}
```

**Errores de Validación:**
```typescript
if (formErrors.nombre) {
  // Borde rojo en input + mensaje debajo
  <Input className="border-red-500" />
  <p className="text-sm text-red-500">{formErrors.nombre}</p>
}
```

## ✨ Resultado Final

Al completar exitosamente el formulario:

1. **API Response:**
```json
{
  "success": true,
  "message": "Profesor creado y asignado exitosamente",
  "data": {
    "empleado": { "id": "uuid", "nombre": "Nayibe", ... },
    "informacionAcademica": { "id": "uuid", "titulo": "Licenciatura...", ... },
    "asignacion": { "id": "uuid", "sede_id": "uuid", ... }
  }
}
```

2. **UI:**
   - Alerta verde con checkmark
   - Mensaje: "¡Profesor creado exitosamente! Redirigiendo..."
   - Redirección automática a listado de profesores

---

**Última actualización:** 8 de octubre de 2025  
**Autor:** Sistema de IA - GitHub Copilot  
**Basado en:** Arquitectura del módulo de rectores (`/dashboard/rectores/agregar`)
