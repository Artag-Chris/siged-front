import { Institution } from "@/interfaces/Institution"

 export const DUMMY_INSTITUTIONS: Institution[] = [
  {
    id: "1",
    nombre: "I.E. San Judas Tadeo",
    codigoDane: "105001000123",
    direccion: "Calle 45 #23-67, Barrio Centro",
    telefono: "6045551234",
    email: "contacto@sanjudastadeo.edu.co",
    rector: "Dr. María Elena Rodríguez",
    zona: "urbana",
    comuna: "Comuna 1 - Popular",
    jornadas: ["mañana", "tarde"],
    activa: true,
    fechaCreacion: "2020-01-15T08:00:00Z",
    fechaActualizacion: "2024-01-10T14:30:00Z",
    observaciones: "Institución con énfasis en ciencias naturales y matemáticas",
  },
  {
    id: "2",
    nombre: "I.E. Rural La Esperanza",
    codigoDane: "105001000456",
    direccion: "Vereda La Esperanza, Km 15 vía al corregimiento",
    telefono: "6045559876",
    email: "laesperanza@educacion.gov.co",
    rector: "Lic. Carlos Alberto Gómez",
    zona: "rural",
    comuna: "Corregimiento San Antonio",
    jornadas: ["unica"],
    activa: true,
    fechaCreacion: "2018-03-20T09:00:00Z",
    fechaActualizacion: "2024-01-08T16:45:00Z",
    observaciones: "Institución rural con programas agropecuarios",
  },
  {
    id: "3",
    nombre: "I.E. Técnico Industrial",
    codigoDane: "105001000789",
    direccion: "Carrera 80 #45-123, Barrio Industrial",
    telefono: "6045557890",
    email: "tecnicoindustrial@medellin.edu.co",
    rector: "Ing. Ana Patricia Morales",
    zona: "urbana",
    comuna: "Comuna 7 - Robledo",
    jornadas: ["mañana", "tarde"],
    activa: false,
    fechaCreacion: "2015-08-10T10:00:00Z",
    fechaActualizacion: "2023-12-15T11:20:00Z",
    observaciones: "Institución en proceso de reestructuración administrativa",
  },
]

// Listas de opciones para los campos
export const ZONAS_DISPONIBLES = [
  { value: "urbana", label: "Urbana" },
  { value: "rural", label: "Rural" },
]

export const COMUNAS_DISPONIBLES = [
  "Comuna 1 - Popular",
  "Comuna 2 - Santa Cruz",
  "Comuna 3 - Manrique",
  "Comuna 4 - Aranjuez",
  "Comuna 5 - Castilla",
  "Comuna 6 - Doce de Octubre",
  "Comuna 7 - Robledo",
  "Comuna 8 - Villa Hermosa",
  "Comuna 9 - Buenos Aires",
  "Comuna 10 - La Candelaria",
  "Comuna 11 - Laureles",
  "Comuna 12 - La América",
  "Comuna 13 - San Javier",
  "Comuna 14 - El Poblado",
  "Comuna 15 - Guayabal",
  "Comuna 16 - Belén",
  "Corregimiento San Sebastián de Palmitas",
  "Corregimiento San Cristóbal",
  "Corregimiento Altavista",
  "Corregimiento San Antonio de Prado",
  "Corregimiento Santa Elena",
]

export const JORNADAS_DISPONIBLES = [
  { value: "mañana", label: "Mañana" },
  { value: "tarde", label: "Tarde" },
  { value: "unica", label: "Única" },
]
