import { SolicitudCupo } from "@/interfaces/solicitud-cupo/solicitud-cupo"


export const DUMMY_SOLICITUDES: SolicitudCupo[] = [
  {
    id: "1",
    nombreNino: "María Fernanda López",
    documentoNino: "1098765432",
    tipoDocumentoNino: "TI",
    nombreAcudiente: "Carlos López Mendoza",
    telefonoContacto: "3001234567",
    direccion: "Calle 45 #23-67, Barrio Centro",
    colegioSeleccionado: "1",
    gradoSolicitado: "1",
    jornada: "mañana",
    necesitaTransporte: true,
    documentos: {
      notas: null,
      eps: null,
    },
    estadoCupo: "Pendiente",
    radicado: "RAD-2024-000001",
    fechaCreacion: "2024-01-15T08:30:00Z",
    fechaActualizacion: "2024-01-15T08:30:00Z",
    anioEscolar: new Date().getFullYear(),
    observaciones: "Primera solicitud del año",
  },
  {
    id: "2",
    nombreNino: "Andrés Felipe Gómez",
    documentoNino: "1087654321",
    tipoDocumentoNino: "TI",
    nombreAcudiente: "Ana Gómez Rodríguez",
    telefonoContacto: "3109876543",
    direccion: "Carrera 30 #15-45, Barrio La Esperanza",
    colegioSeleccionado: "2",
    gradoSolicitado: "Transición",
    jornada: "unica",
    necesitaTransporte: false,
    documentos: {
      notas: null,
      eps: null,
    },
    estadoCupo: "Aceptado",
    radicado: "RAD-2024-000002",
    fechaCreacion: "2024-01-20T10:15:00Z",
    fechaActualizacion: "2024-01-25T14:20:00Z",
    anioEscolar: new Date().getFullYear(),
    observaciones: "Solicitud aprobada por disponibilidad de cupos",
  },
]

// Listas de opciones para los campos
export const TIPOS_DOCUMENTO_SOLICITUD = [
  { value: "TI", label: "Tarjeta de Identidad" },
  { value: "CC", label: "Cédula de Ciudadanía" },
  { value: "RC", label: "Registro Civil" },
  { value: "CE", label: "Cédula de Extranjería" },
  { value: "PEP", label: "Permiso Especial de Permanencia" },
]

export const GRADOS_SOLICITUD = [
  { value: "Preescolar", label: "Preescolar" },
  { value: "Transición", label: "Transición" },
  { value: "1", label: "Primero" },
  { value: "2", label: "Segundo" },
  { value: "3", label: "Tercero" },
  { value: "4", label: "Cuarto" },
  { value: "5", label: "Quinto" },
  { value: "6", label: "Sexto" },
  { value: "7", label: "Séptimo" },
  { value: "8", label: "Octavo" },
  { value: "9", label: "Noveno" },
  { value: "10", label: "Décimo" },
  { value: "11", label: "Undécimo" },
]

export const JORNADAS_SOLICITUD = [
  { value: "mañana", label: "Mañana" },
  { value: "tarde", label: "Tarde" },
  { value: "unica", label: "Única" },
]

export const ESTADOS_SOLICITUD = [
  { value: "Pendiente", label: "Pendiente" },
  { value: "Aceptado", label: "Aceptado" },
  { value: "Rechazado", label: "Rechazado" },
]

export const TIPOS_BENEFICIO = [
  { value: "Desayuno", label: "Desayuno", color: "#FFC107" },
  { value: "Almuerzo", label: "Almuerzo", color: "#FF9800" },
  { value: "Completo", label: "Completo", color: "#F44336" },
]

export const TIPOS_AUSENCIA = [
  { value: "Incapacidad EPS", label: "Incapacidad EPS", color: "#3F51B5" },
  { value: "Licencia sin sueldo", label: "Licencia sin sueldo", color: "#2196F3" },
  { value: "Comisión oficial", label: "Comisión oficial", color: "#4CAF50" },
  { value: "Otro", label: "Otro", color: "#9E9E9E" },
]