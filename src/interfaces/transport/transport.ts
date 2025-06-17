export interface Conductor {
  id: string
  nombreCompleto: string
  tipoDocumento: string
  numeroDocumento: string
  telefono: string
  email?: string
  direccion: string
  fechaNacimiento: string
  licenciaConducir: string
  categoriaLicencia: string
  fechaVencimientoLicencia: string
  experienciaAnios: number
  estado: "Activo" | "Inactivo" | "Suspendido"
  fechaIngreso: string
  observaciones?: string
  fechaCreacion: string
  fechaActualizacion: string
}

export interface ConductorFormData {
  nombreCompleto: string
  tipoDocumento: string
  numeroDocumento: string
  telefono: string
  email?: string
  direccion: string
  fechaNacimiento: string
  licenciaConducir: string
  categoriaLicencia: string
  fechaVencimientoLicencia: string
  experienciaAnios: number
  observaciones?: string
}

export interface Vehiculo {
  id: string
  placa: string
  marca: string
  modelo: string
  anio: number
  color: string
  cupoMaximo: number
  tipoVehiculo: "Bus" | "Buseta" | "Microbus" | "Van"
  numeroInterno?: string
  fechaVencimientoTecnomecanica: string
  fechaVencimientoSoat: string
  estado: "Activo" | "Mantenimiento" | "Fuera de servicio"
  conductorAsignado?: string
  observaciones?: string
  fechaCreacion: string
  fechaActualizacion: string
}

export interface VehiculoFormData {
  placa: string
  marca: string
  modelo: string
  anio: number
  color: string
  cupoMaximo: number
  tipoVehiculo: "Bus" | "Buseta" | "Microbus" | "Van"
  numeroInterno?: string
  fechaVencimientoTecnomecanica: string
  fechaVencimientoSoat: string
  conductorAsignado?: string
  observaciones?: string
}

export interface Ruta {
  id: string
  nombre: string
  codigo: string
  descripcion?: string
  institucionId: string
  conductorId: string
  vehiculoId: string
  horarioSalida: string
  horarioRegreso: string
  diasOperacion: string[]
  paradas: Parada[]
  estudiantesAsignados: string[]
  cuposDisponibles: number
  estado: "Activa" | "Inactiva" | "Suspendida"
  observaciones?: string
  fechaCreacion: string
  fechaActualizacion: string
}

export interface Parada {
  id: string
  nombre: string
  direccion: string
  horario: string
  orden: number
  referencia?: string
}

export interface RutaFormData {
  nombre: string
  codigo: string
  descripcion?: string
  institucionId: string
  conductorId: string
  vehiculoId: string
  horarioSalida: string
  horarioRegreso: string
  diasOperacion: string[]
  paradas: Parada[]
  observaciones?: string
}

export interface Novedad {
  id: string
  rutaId: string
  conductorId: string
  fecha: string
  tipo: "Retraso" | "Falla mecánica" | "Accidente" | "Ausencia" | "Otro"
  descripcion: string
  estado: "Pendiente" | "En proceso" | "Resuelto"
  fechaCreacion: string
  fechaActualizacion: string
}

export interface ConductorState {
  conductores: Conductor[]
  isLoading: boolean
  currentConductor: Conductor | null

  addConductor: (conductorData: ConductorFormData) => Promise<string>
  updateConductor: (id: string, conductorData: Partial<ConductorFormData>) => Promise<boolean>
  deleteConductor: (id: string) => Promise<boolean>
  getConductor: (id: string) => Conductor | undefined
  getConductorByDocument: (tipoDocumento: string, numeroDocumento: string) => Conductor | undefined
  setCurrentConductor: (conductor: Conductor | null) => void
  setLoading: (loading: boolean) => void
  searchConductores: (query: string) => Conductor[]
  getAllConductores: () => Conductor[]
  getConductoresActivos: () => Conductor[]
}

export interface VehiculoState {
  vehiculos: Vehiculo[]
  isLoading: boolean
  currentVehiculo: Vehiculo | null

  addVehiculo: (vehiculoData: VehiculoFormData) => Promise<string>
  updateVehiculo: (id: string, vehiculoData: Partial<VehiculoFormData>) => Promise<boolean>
  deleteVehiculo: (id: string) => Promise<boolean>
  getVehiculo: (id: string) => Vehiculo | undefined
  getVehiculoByPlaca: (placa: string) => Vehiculo | undefined
  setCurrentVehiculo: (vehiculo: Vehiculo | null) => void
  setLoading: (loading: boolean) => void
  searchVehiculos: (query: string) => Vehiculo[]
  getAllVehiculos: () => Vehiculo[]
  getVehiculosDisponibles: () => Vehiculo[]
  assignConductor: (vehiculoId: string, conductorId: string) => Promise<boolean>
}

export interface RutaState {
  rutas: Ruta[]
  novedades: Novedad[]
  isLoading: boolean
  currentRuta: Ruta | null

  addRuta: (rutaData: RutaFormData) => Promise<string>
  updateRuta: (id: string, rutaData: Partial<RutaFormData>) => Promise<boolean>
  deleteRuta: (id: string) => Promise<boolean>
  getRuta: (id: string) => Ruta | undefined
  getRutasByConductor: (conductorId: string) => Ruta[]
  getRutasByInstitucion: (institucionId: string) => Ruta[]
  setCurrentRuta: (ruta: Ruta | null) => void
  setLoading: (loading: boolean) => void
  searchRutas: (query: string) => Ruta[]
  getAllRutas: () => Ruta[]
  assignEstudiante: (rutaId: string, estudianteId: string) => Promise<boolean>
  removeEstudiante: (rutaId: string, estudianteId: string) => Promise<boolean>
  addNovedad: (novedad: Omit<Novedad, "id" | "fechaCreacion" | "fechaActualizacion">) => Promise<string>
  updateNovedad: (id: string, novedad: Partial<Novedad>) => Promise<boolean>
  getNovedadesByRuta: (rutaId: string) => Novedad[]
}
