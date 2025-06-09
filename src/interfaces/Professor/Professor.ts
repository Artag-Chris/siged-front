export interface Professor {
  id: string
  nombres: string
  apellidos: string
  cedula: string
  email: string
  telefono: string
  cargo: string
  estado: "activa" | "inactiva"
  nivelEducativo: "preescolar" | "basica_primaria" | "basica_secundaria" | "media" | "superior"
  materias: string[]
  materiasAsignadas: string[]
  institucionGraduacion: string
  fechaVinculacion: string
  fechaNacimiento: string
  direccion: string
  experienciaAnios: number
  observaciones?: string
}

export interface ProfessorFormData {
  nombres: string
  apellidos: string
  cedula: string
  email: string
  telefono: string
  cargo: string
  estado: "activa" | "inactiva"
  nivelEducativo: "preescolar" | "basica_primaria" | "basica_secundaria" | "media" | "superior"
  materias: string[]
  materiasAsignadas: string[]
  institucionGraduacion: string
  fechaVinculacion: string
  fechaNacimiento: string
  direccion: string
  experienciaAnios: number
  observaciones?: string
}

export interface ProfessorState {
  professors: Professor[]
  isLoading: boolean
  currentProfessor: Professor | null

  // Actions
  addProfessor: (professor: ProfessorFormData) => Promise<boolean>
  updateProfessor: (id: string, professor: Partial<ProfessorFormData>) => Promise<boolean>
  deleteProfessor: (id: string) => Promise<boolean>
  getProfessor: (id: string) => Professor | undefined
  setCurrentProfessor: (professor: Professor | null) => void
  setLoading: (loading: boolean) => void

  // Filters and display options
  displayOptions: {
    mostrarNombres: boolean
    mostrarCedulas: boolean
    mostrarMaterias: boolean
    mostrarCargoActual: boolean
    mostrarMateriasAsignadas: boolean
    mostrarInstitucion: boolean
    mostrarEstados: boolean
    mostrarNivelEducativo: boolean
    mostrarFechaVinculacion: boolean
    botonEditarPerfil: boolean
  }
  updateDisplayOptions: (options: Partial<ProfessorState["displayOptions"]>) => void
}