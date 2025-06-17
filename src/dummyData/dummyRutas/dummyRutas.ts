import { Ruta, Novedad } from "@/interfaces"


export const DUMMY_RUTAS: Ruta[] = [
  {
    id: "1",
    nombre: "Ruta Centro - San Judas Tadeo",
    codigo: "R001",
    descripcion: "Ruta que cubre el sector centro hacia I.E. San Judas Tadeo",
    institucionId: "1",
    conductorId: "1",
    vehiculoId: "1",
    horarioSalida: "06:30",
    horarioRegreso: "14:00",
    diasOperacion: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    paradas: [
      {
        id: "1",
        nombre: "Plaza Principal",
        direccion: "Carrera 50 #45-30",
        horario: "06:30",
        orden: 1,
        referencia: "Frente al banco",
      },
      {
        id: "2",
        nombre: "Centro Comercial",
        direccion: "Calle 45 #23-67",
        horario: "06:45",
        orden: 2,
        referencia: "Entrada principal",
      },
      {
        id: "3",
        nombre: "Barrio Los Pinos",
        direccion: "Carrera 30 #15-45",
        horario: "07:00",
        orden: 3,
        referencia: "Parque infantil",
      },
    ],
    estudiantesAsignados: ["1", "5"],
    cuposDisponibles: 23,
    estado: "Activa",
    observaciones: "Ruta principal con mayor demanda",
    fechaCreacion: "2024-01-15T08:00:00Z",
    fechaActualizacion: "2024-01-10T14:30:00Z",
  },
  {
    id: "2",
    nombre: "Ruta Rural - La Esperanza",
    codigo: "R002",
    descripcion: "Ruta rural hacia I.E. Rural La Esperanza",
    institucionId: "2",
    conductorId: "2",
    vehiculoId: "2",
    horarioSalida: "06:00",
    horarioRegreso: "13:30",
    diasOperacion: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    paradas: [
      {
        id: "4",
        nombre: "Vereda El Porvenir",
        direccion: "Km 5 vía rural",
        horario: "06:00",
        orden: 1,
        referencia: "Casa comunal",
      },
      {
        id: "5",
        nombre: "Finca Los Naranjos",
        direccion: "Km 8 vía rural",
        horario: "06:15",
        orden: 2,
        referencia: "Portón principal",
      },
    ],
    estudiantesAsignados: ["2"],
    cuposDisponibles: 34,
    estado: "Activa",
    observaciones: "Ruta rural con terreno irregular",
    fechaCreacion: "2024-01-20T09:00:00Z",
    fechaActualizacion: "2024-01-15T16:45:00Z",
  },
]

export const DUMMY_NOVEDADES: Novedad[] = [
  {
    id: "1",
    rutaId: "1",
    conductorId: "1",
    fecha: "2024-01-15",
    tipo: "Retraso",
    descripcion: "Retraso de 15 minutos por tráfico en el centro",
    estado: "Resuelto",
    fechaCreacion: "2024-01-15T07:00:00Z",
    fechaActualizacion: "2024-01-15T14:30:00Z",
  },
  {
    id: "2",
    rutaId: "2",
    conductorId: "2",
    fecha: "2024-01-18",
    tipo: "Falla mecánica",
    descripcion: "Problema con el sistema de frenos, vehículo enviado a mantenimiento",
    estado: "En proceso",
    fechaCreacion: "2024-01-18T06:30:00Z",
    fechaActualizacion: "2024-01-18T08:00:00Z",
  },
]

export const DIAS_SEMANA = [
  { value: "Lunes", label: "Lunes" },
  { value: "Martes", label: "Martes" },
  { value: "Miércoles", label: "Miércoles" },
  { value: "Jueves", label: "Jueves" },
  { value: "Viernes", label: "Viernes" },
  { value: "Sábado", label: "Sábado" },
  { value: "Domingo", label: "Domingo" },
]

export const TIPOS_NOVEDAD = [
  { value: "Retraso", label: "Retraso" },
  { value: "Falla mecánica", label: "Falla mecánica" },
  { value: "Accidente", label: "Accidente" },
  { value: "Ausencia", label: "Ausencia del conductor" },
  { value: "Otro", label: "Otro" },
]

export const ESTADOS_NOVEDAD = [
  { value: "Pendiente", label: "Pendiente" },
  { value: "En proceso", label: "En proceso" },
  { value: "Resuelto", label: "Resuelto" },
]
