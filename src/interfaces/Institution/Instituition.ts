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

export const recentActivity = [
    { action: "Nueva institución registrada", time: "Hace 3 horas", institution: "I.E. San Judas Tadeo" },
    { action: "Información actualizada", time: "Hace 1 día", institution: "I.E. Rural La Esperanza" },
    { action: "Estado cambiado a inactiva", time: "Hace 2 días", institution: "I.E. Técnico Industrial" },
    { action: "Rector actualizado", time: "Hace 3 días", institution: "I.E. San Judas Tadeo" },
  ]
