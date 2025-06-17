import { Vehiculo } from "@/interfaces"


export const DUMMY_VEHICULOS: Vehiculo[] = [
  {
    id: "1",
    placa: "ABC123",
    marca: "Mercedes Benz",
    modelo: "Sprinter",
    anio: 2020,
    color: "Amarillo",
    cupoMaximo: 25,
    tipoVehiculo: "Buseta",
    numeroInterno: "T001",
    fechaVencimientoTecnomecanica: "2024-12-15",
    fechaVencimientoSoat: "2024-08-20",
    estado: "Activo",
    conductorAsignado: "1",
    observaciones: "Vehículo en excelente estado",
    fechaCreacion: "2020-01-15T08:00:00Z",
    fechaActualizacion: "2024-01-10T14:30:00Z",
  },
  {
    id: "2",
    placa: "DEF456",
    marca: "Chevrolet",
    modelo: "NPR",
    anio: 2019,
    color: "Blanco",
    cupoMaximo: 35,
    tipoVehiculo: "Bus",
    numeroInterno: "T002",
    fechaVencimientoTecnomecanica: "2024-10-30",
    fechaVencimientoSoat: "2024-09-15",
    estado: "Activo",
    conductorAsignado: "2",
    observaciones: "",
    fechaCreacion: "2019-06-01T09:00:00Z",
    fechaActualizacion: "2024-01-08T16:45:00Z",
  },
]

export const TIPOS_VEHICULO = [
  { value: "Bus", label: "Bus (más de 30 pasajeros)" },
  { value: "Buseta", label: "Buseta (20-30 pasajeros)" },
  { value: "Microbus", label: "Microbús (15-20 pasajeros)" },
  { value: "Van", label: "Van (hasta 15 pasajeros)" },
]

export const ESTADOS_VEHICULO = [
  { value: "Activo", label: "Activo" },
  { value: "Mantenimiento", label: "En mantenimiento" },
  { value: "Fuera de servicio", label: "Fuera de servicio" },
]

export const MARCAS_VEHICULO = [
  "Mercedes Benz",
  "Chevrolet",
  "Ford",
  "Volkswagen",
  "Iveco",
  "Hyundai",
  "Mitsubishi",
  "Nissan",
  "Toyota",
  "Otro",
]
