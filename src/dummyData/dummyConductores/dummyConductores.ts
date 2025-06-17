import { Conductor } from "@/interfaces"


export const DUMMY_CONDUCTORES: Conductor[] = [
  {
    id: "1",
    nombreCompleto: "Carlos Alberto Rodríguez",
    tipoDocumento: "CC",
    numeroDocumento: "12345678",
    telefono: "3001234567",
    email: "carlos.rodriguez@transporte.com",
    direccion: "Calle 45 #23-67, Barrio Centro",
    fechaNacimiento: "1985-03-15",
    licenciaConducir: "12345678901",
    categoriaLicencia: "C2",
    fechaVencimientoLicencia: "2025-03-15",
    experienciaAnios: 8,
    estado: "Activo",
    fechaIngreso: "2020-01-15",
    observaciones: "Conductor experimentado con excelente record",
    fechaCreacion: "2020-01-15T08:00:00Z",
    fechaActualizacion: "2024-01-10T14:30:00Z",
  },
  {
    id: "2",
    nombreCompleto: "María Elena Gómez",
    tipoDocumento: "CC",
    numeroDocumento: "87654321",
    telefono: "3109876543",
    email: "maria.gomez@transporte.com",
    direccion: "Carrera 30 #15-45, Barrio La Esperanza",
    fechaNacimiento: "1990-07-22",
    licenciaConducir: "98765432109",
    categoriaLicencia: "C2",
    fechaVencimientoLicencia: "2025-07-22",
    experienciaAnios: 5,
    estado: "Activo",
    fechaIngreso: "2021-06-01",
    observaciones: "",
    fechaCreacion: "2021-06-01T09:00:00Z",
    fechaActualizacion: "2024-01-08T16:45:00Z",
  },
]

export const TIPOS_DOCUMENTO_CONDUCTOR = [
  { value: "CC", label: "Cédula de Ciudadanía" },
  { value: "CE", label: "Cédula de Extranjería" },
  { value: "PEP", label: "Permiso Especial de Permanencia" },
]

export const CATEGORIAS_LICENCIA = [
  { value: "A1", label: "A1 - Motocicletas hasta 125cc" },
  { value: "A2", label: "A2 - Motocicletas más de 125cc" },
  { value: "B1", label: "B1 - Automóviles, camperos, camionetas" },
  { value: "B2", label: "B2 - Camiones rígidos, buses" },
  { value: "B3", label: "B3 - Vehículos articulados" },
  { value: "C1", label: "C1 - Transporte público colectivo" },
  { value: "C2", label: "C2 - Transporte público masivo" },
  { value: "C3", label: "C3 - Transporte público especial" },
]

export const ESTADOS_CONDUCTOR = [
  { value: "Activo", label: "Activo" },
  { value: "Inactivo", label: "Inactivo" },
  { value: "Suspendido", label: "Suspendido" },
]
