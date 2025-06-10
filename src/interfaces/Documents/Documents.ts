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
export interface DocumentUploadProps {
  professorId: string
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