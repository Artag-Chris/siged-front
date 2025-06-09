import {type QuotaAssignment, type GradeQuota } from "@/interfaces/intex"

export const DUMMY_GRADE_QUOTAS: GradeQuota[] = [
  {
    id: "1",
    institucionId: "1", // I.E. San Judas Tadeo
    anioEscolar: 2024,
    grado: "Transición",
    cuposTotales: 30,
    cuposAsignados: 25,
    jornada: "mañana",
    observaciones: "Grupo completo",
  },
  {
    id: "2",
    institucionId: "1", // I.E. San Judas Tadeo
    anioEscolar: 2024,
    grado: "1",
    cuposTotales: 35,
    cuposAsignados: 30,
    jornada: "mañana",
    observaciones: "",
  },
  {
    id: "3",
    institucionId: "1", // I.E. San Judas Tadeo
    anioEscolar: 2024,
    grado: "2",
    cuposTotales: 35,
    cuposAsignados: 28,
    jornada: "mañana",
    observaciones: "",
  },
  {
    id: "4",
    institucionId: "1", // I.E. San Judas Tadeo
    anioEscolar: 2024,
    grado: "3",
    cuposTotales: 35,
    cuposAsignados: 32,
    jornada: "tarde",
    observaciones: "",
  },
  {
    id: "5",
    institucionId: "1", // I.E. San Judas Tadeo
    anioEscolar: 2024,
    grado: "4",
    cuposTotales: 35,
    cuposAsignados: 30,
    jornada: "tarde",
    observaciones: "",
  },
  {
    id: "6",
    institucionId: "1", // I.E. San Judas Tadeo
    anioEscolar: 2024,
    grado: "5",
    cuposTotales: 35,
    cuposAsignados: 33,
    jornada: "tarde",
    observaciones: "",
  },
  {
    id: "7",
    institucionId: "2", // I.E. Rural La Esperanza
    anioEscolar: 2024,
    grado: "Transición",
    cuposTotales: 20,
    cuposAsignados: 15,
    jornada: "unica",
    observaciones: "Grupo rural",
  },
  {
    id: "8",
    institucionId: "2", // I.E. Rural La Esperanza
    anioEscolar: 2024,
    grado: "1",
    cuposTotales: 25,
    cuposAsignados: 20,
    jornada: "unica",
    observaciones: "",
  },
  {
    id: "9",
    institucionId: "3", // I.E. Técnico Industrial
    anioEscolar: 2024,
    grado: "6",
    cuposTotales: 40,
    cuposAsignados: 38,
    jornada: "mañana",
    sede: "Sede Principal",
    observaciones: "Casi completo",
  },
  {
    id: "10",
    institucionId: "3", // I.E. Técnico Industrial
    anioEscolar: 2024,
    grado: "7",
    cuposTotales: 40,
    cuposAsignados: 35,
    jornada: "mañana",
    sede: "Sede Principal",
    observaciones: "",
  },
]

// Datos dummy para asignaciones de cupos
export const DUMMY_QUOTA_ASSIGNMENTS: QuotaAssignment[] = [
  {
    id: "1",
    estudianteId: "1", // Ana María Gómez
    institucionId: "1", // I.E. San Judas Tadeo
    jornada: "tarde",
    grado: "5",
    grupo: "A",
    modalidadAsignacion: "nueva_matricula",
    fechaAsignacion: "2024-01-10",
    observaciones: "",
  },
  {
    id: "2",
    estudianteId: "2", // Juan Pablo Martínez
    institucionId: "2", // I.E. Rural La Esperanza
    jornada: "unica",
    grado: "3",
    modalidadAsignacion: "traslado",
    fechaAsignacion: "2024-01-15",
    observaciones: "Traslado por cambio de residencia",
  },
  {
    id: "3",
    estudianteId: "4", // Santiago Herrera
    institucionId: "3", // I.E. Técnico Industrial
    jornada: "mañana",
    grado: "6",
    grupo: "B",
    modalidadAsignacion: "traslado",
    fechaAsignacion: "2023-12-05",
    observaciones: "",
  },
  {
    id: "4",
    estudianteId: "5", // Sofía Ramírez
    institucionId: "1", // I.E. San Judas Tadeo
    jornada: "tarde",
    grado: "4",
    grupo: "A",
    modalidadAsignacion: "nueva_matricula",
    fechaAsignacion: "2024-01-12",
    observaciones: "",
  },
]

export const MODALIDADES_ASIGNACION = [
  { value: "nueva_matricula", label: "Nueva Matrícula" },
  { value: "traslado", label: "Traslado" },
  { value: "reintegro", label: "Reintegro" },
]

export const GRUPOS_DISPONIBLES = ["A", "B", "C", "D", "E"]