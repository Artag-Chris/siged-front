import { Student } from "@/interfaces/intex"

export const DUMMY_STUDENTS: Student[] = [
  {
    id: "1",
    nombreCompleto: "Ana María Gómez Pérez",
    tipoDocumento: "TI",
    numeroDocumento: "1001234567",
    fechaNacimiento: "2010-05-15",
    direccionResidencia: "Calle 45 #23-67, Barrio Centro",
    telefonoContacto: "3001234567",
    gradoSolicitado: "5",
    institucionAsignada: "1", // ID de la institución San Judas Tadeo
    fechaAsignacion: "2024-01-10",
    estado: "Activo",
    nombreAcudiente: "Carlos Gómez Rodríguez",
    parentescoAcudiente: "Padre",
    telefonoAcudiente: "3109876543",
    observaciones: "Estudiante con buen rendimiento académico",
  },
  {
    id: "2",
    nombreCompleto: "Juan Pablo Martínez Silva",
    tipoDocumento: "TI",
    numeroDocumento: "1002345678",
    fechaNacimiento: "2012-08-20",
    direccionResidencia: "Carrera 30 #15-45, Barrio La Esperanza",
    telefonoContacto: "3112345678",
    gradoSolicitado: "3",
    institucionAsignada: "2", // ID de la institución Rural La Esperanza
    fechaAsignacion: "2024-01-15",
    estado: "Activo",
    nombreAcudiente: "María Silva Ortiz",
    parentescoAcudiente: "Madre",
    telefonoAcudiente: "3203456789",
    observaciones: "Requiere apoyo adicional en matemáticas",
  },
  {
    id: "3",
    nombreCompleto: "Valentina Rodríguez López",
    tipoDocumento: "RC",
    numeroDocumento: "1003456789",
    fechaNacimiento: "2015-03-10",
    direccionResidencia: "Avenida Principal #78-90, Barrio Industrial",
    telefonoContacto: "",
    gradoSolicitado: "Transición",
    estado: "Pendiente",
    nombreAcudiente: "Jorge Rodríguez Mendoza",
    parentescoAcudiente: "Padre",
    telefonoAcudiente: "3154567890",
    observaciones: "Primera vez en el sistema educativo",
  },
  {
    id: "4",
    nombreCompleto: "Santiago Herrera Duarte",
    tipoDocumento: "TI",
    numeroDocumento: "1004567890",
    fechaNacimiento: "2009-11-25",
    direccionResidencia: "Calle 80 #45-12, Barrio Robledo",
    telefonoContacto: "3045678901",
    gradoSolicitado: "6",
    institucionAsignada: "3", // ID de la institución Técnico Industrial
    fechaAsignacion: "2023-12-05",
    estado: "Trasladado",
    nombreAcudiente: "Ana Duarte Pérez",
    parentescoAcudiente: "Madre",
    telefonoAcudiente: "3176789012",
    observaciones: "Trasladado por cambio de residencia",
  },
  {
    id: "5",
    nombreCompleto: "Sofía Ramírez Ochoa",
    tipoDocumento: "TI",
    numeroDocumento: "1005678901",
    fechaNacimiento: "2011-07-08",
    direccionResidencia: "Carrera 65 #23-45, Barrio Laureles",
    telefonoContacto: "3057890123",
    gradoSolicitado: "4",
    institucionAsignada: "1", // ID de la institución San Judas Tadeo
    fechaAsignacion: "2024-01-12",
    estado: "Activo",
    nombreAcudiente: "Roberto Ramírez Gómez",
    parentescoAcudiente: "Padre",
    telefonoAcudiente: "3188901234",
    observaciones: "",
  },
]

// Listas de opciones para los campos
export const TIPOS_DOCUMENTO = [
  { value: "TI", label: "Tarjeta de Identidad" },
  { value: "CC", label: "Cédula de Ciudadanía" },
  { value: "RC", label: "Registro Civil" },
  { value: "CE", label: "Cédula de Extranjería" },
  { value: "PEP", label: "Permiso Especial de Permanencia" },
]

export const GRADOS_DISPONIBLES = [
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

export const PARENTESCOS = [
  { value: "Padre", label: "Padre" },
  { value: "Madre", label: "Madre" },
  { value: "Tío", label: "Tío/Tía" },
  { value: "Abuelo", label: "Abuelo/Abuela" },
  { value: "Tutor", label: "Tutor Legal" },
  { value: "Otro", label: "Otro" },
]

export const ESTADOS_ESTUDIANTE = [
  { value: "Activo", label: "Activo" },
  { value: "Retirado", label: "Retirado" },
  { value: "Trasladado", label: "Trasladado" },
  { value: "Pendiente", label: "Pendiente" },
]