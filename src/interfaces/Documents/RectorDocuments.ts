export interface RectorDocument {
  id: string
  rectorId: string
  fileName: string
  fileType: string
  fileSize: number
  uploadDate: string
  category: "contrato" | "hoja_vida" | "certificados" | "evaluacion" | "otros"
  description?: string
  fileUrl: string
}

export interface RectorDocumentState {
  documents: RectorDocument[]
  isLoading: boolean

  uploadDocument: (
    rectorId: string,
    file: File,
    category: RectorDocument["category"],
    description?: string
  ) => Promise<boolean>

  deleteDocument: (documentId: string) => Promise<boolean>
  getDocumentsByRector: (rectorId: string) => RectorDocument[]
  setLoading: (loading: boolean) => void
}