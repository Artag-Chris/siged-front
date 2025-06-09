export interface Institution {
  id: string
  nombre: string
  codigoDane?: string
  direccion: string
  telefono?: string
  email?: string
  rector?: string
  zona: "urbana" | "rural"
  comuna: string
  jornadas: ("mañana" | "tarde" | "unica")[]
  activa: boolean
  fechaCreacion: string
  fechaActualizacion: string
  observaciones?: string
}

export interface InstitutionFormData {
  nombre: string
  codigoDane?: string
  direccion: string
  telefono?: string
  email?: string
  rector?: string
  zona: "urbana" | "rural"
  comuna: string
  jornadas: ("mañana" | "tarde" | "unica")[]
  activa: boolean
  observaciones?: string
}

export interface InstitutionState {
  institutions: Institution[]
  isLoading: boolean
  currentInstitution: Institution | null

  // Actions
  addInstitution: (institution: InstitutionFormData) => Promise<boolean>
  updateInstitution: (id: string, institution: Partial<InstitutionFormData>) => Promise<boolean>
  deleteInstitution: (id: string) => Promise<boolean>
  getInstitution: (id: string) => Institution | undefined
  setCurrentInstitution: (institution: Institution | null) => void
  setLoading: (loading: boolean) => void
}