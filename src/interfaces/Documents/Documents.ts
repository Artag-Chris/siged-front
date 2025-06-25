export interface ProfessorDocument {
  id: string
  professorId: string
  fileName: string
  fileType: string
  fileSize: number
  uploadDate: string
  category: "contrato" | "hoja_vida" | "certificados" | "evaluaciones" | "otros"
  description?: string
  fileUrl: string // En producción sería la URL real del archivo
}

export interface DocumentState {
  documents: ProfessorDocument[]
  isLoading: boolean

  // Actions
  uploadDocument: (
    professorId: string,
    file: File,
    category: ProfessorDocument["category"],
    description?: string,
  ) => Promise<boolean>
  deleteDocument: (documentId: string) => Promise<boolean>
  getDocumentsByProfessor: (professorId: string) => ProfessorDocument[]
  setLoading: (loading: boolean) => void
}
//en el software de verdad esta seria la oficioal en lugar de la otra pero por razon de maquetacion
//se queda asi
export interface DocumentStateProfesor {
  documents: AppDocument[]
  isLoading: boolean

  uploadDocument: (
    entityId: string,
    entityType: "professor" | "rector",
    file: File,
    category: AppDocument["category"],
    description?: string
  ) => Promise<boolean>

  deleteDocument: (documentId: string) => Promise<boolean>
  getDocumentsByEntity: (entityId: string, entityType?: "professor" | "rector") => AppDocument[]
  setLoading: (loading: boolean) => void
}

export interface DocumentUploadProps {
  professorId?: string;
  rectorId?: string;
  onUploadSuccess?: () => void
}
export interface DocumentViewerProps {
  fileName: string
  fileType: string
}
export const DOCUMENT_CATEGORIES = [
  { value: "contrato", label: "Contrato" },
  { value: "hoja_vida", label: "Hoja de Vida" },
  { value: "certificados", label: "Certificados" },
  { value: "evaluaciones", label: "Evaluaciones" },
  { value: "otros", label: "Otros" },
]

export interface AppDocument {
  id: string
  entityId: string // Ahora será genérico (puede ser profesorId o rectorId)
  entityType: "professor" | "rector" // Nuevo campo para identificar el tipo
  fileName: string
  fileType: string
  fileSize: number
  uploadDate: string
  category: "contrato" | "hoja_vida" | "certificados" | "evaluacion" | "otros"
  description?: string
  fileUrl: string
}

