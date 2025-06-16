export interface SolicitudCupo {
  id: string
  nombreNino: string
  documentoNino: string
  tipoDocumentoNino: string
  nombreAcudiente: string
  telefonoContacto: string
  direccion: string
  colegioSeleccionado: string
  gradoSolicitado: string
  jornada: string
  necesitaTransporte: boolean
  documentos: {
    notas?: File | null
    eps?: File | null
  }
  estadoCupo: "Pendiente" | "Aceptado" | "Rechazado"
  radicado: string
  fechaCreacion: string
  fechaActualizacion: string
  anioEscolar: number
  observaciones?: string
}

export interface SolicitudCupoFormData {
  nombreNino: string
  documentoNino: string
  tipoDocumentoNino: string
  nombreAcudiente: string
  telefonoContacto: string
  direccion: string
  colegioSeleccionado: string
  gradoSolicitado: string
  jornada: string
  necesitaTransporte: boolean
  documentos: {
    notas?: File | null
    eps?: File | null
  }
  anioEscolar: number
  observaciones?: string
}

export interface SolicitudCupoState {
  solicitudes: SolicitudCupo[]
  isLoading: Boolean
  currentSolicitud: SolicitudCupo | null

  addSolicitud: (solicitudData: SolicitudCupoFormData) => Promise<string>
  updateSolicitud: (id: string, solicitudData: Partial<SolicitudCupoFormData>) => Promise<boolean>
  deleteSolicitud: (id: string) => Promise<boolean>
  getSolicitud: (id: string) => SolicitudCupo | undefined
  getSolicitudByRadicado: (radicado: string) => SolicitudCupo | undefined
  getSolicitudesByInstitution: (institucionId: string) => SolicitudCupo[]
  getSolicitudesByEstado: (estado: "Pendiente" | "Aceptado" | "Rechazado") => SolicitudCupo[]
  setCurrentSolicitud: (solicitud: SolicitudCupo | null) => void
  setLoading: (loading: boolean) => void
  updateEstadoCupo: (id: string, estado: "Pendiente" | "Aceptado" | "Rechazado") => Promise<boolean>
  searchSolicitudes: (query: string) => SolicitudCupo[]
  getAllSolicitudes: () => SolicitudCupo[]
}
