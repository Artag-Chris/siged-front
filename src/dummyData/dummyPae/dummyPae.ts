import { PAE } from "@/interfaces";

export const DUMMY_PAE: PAE[] = [
  {
    id: "1",
    estudianteId: "1", // Ana María Gómez Pérez
    institucionId: "1", // I.E. San Judas Tadeo
    fechaAsignacion: "2024-01-10",
    fechaVencimiento: "2024-12-31",
    estado: "Activo",
    tipoBeneficio: "Completo",
    observaciones: "Beneficio asignado al inicio del año escolar",
  },
  {
    id: "2",
    estudianteId: "2", // Juan Pablo Martínez Silva
    institucionId: "2", // I.E. Rural La Esperanza
    fechaAsignacion: "2024-01-15",
    fechaVencimiento: "2024-12-31",
    estado: "Activo",
    tipoBeneficio: "Almuerzo",
    observaciones: "Estudiante de zona rural",
  },
  {
    id: "3",
    estudianteId: "3", // Valentina Rodríguez López
    institucionId: "1", // I.E. San Judas Tadeo
    fechaAsignacion: "2024-02-01",
    fechaVencimiento: "2024-12-31",
    estado: "Vencido",
    tipoBeneficio: "Desayuno",
    observaciones: "Esperando documentación",
  },
  {
    id: "4",
    estudianteId: "4", // Santiago Herrera Duarte
    institucionId: "3", // I.E. Técnico Industrial
    fechaAsignacion: "2023-12-05",
    fechaVencimiento: "2024-06-30",
    estado: "Vencido",
    tipoBeneficio: "Completo",
    observaciones: "Beneficio cancelado por traslado",
  },
  {
    id: "5",
    estudianteId: "5", // Sofía Ramírez Ochoa
    institucionId: "1", // I.E. San Judas Tadeo
    fechaAsignacion: "2024-01-12",
    fechaVencimiento: "2024-12-31",
    estado: "Activo",
    tipoBeneficio: "Completo",
    observaciones: "",
  },
];