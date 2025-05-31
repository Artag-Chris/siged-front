import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

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

interface DocumentState {
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

// Datos dummy de documentos
const DUMMY_DOCUMENTS: ProfessorDocument[] = [
  {
    id: "doc1",
    professorId: "1",
    fileName: "Contrato_Maria_Gonzalez.pdf",
    fileType: "application/pdf",
    fileSize: 245760,
    uploadDate: "2024-01-10T10:30:00Z",
    category: "contrato",
    description: "Contrato de trabajo inicial",
    fileUrl: "/placeholder-pdf.pdf",
  },
  {
    id: "doc2",
    professorId: "1",
    fileName: "Hoja_Vida_Maria_Gonzalez.pdf",
    fileType: "application/pdf",
    fileSize: 512000,
    uploadDate: "2024-01-10T10:35:00Z",
    category: "hoja_vida",
    description: "Curriculum vitae actualizado",
    fileUrl: "/placeholder-pdf.pdf",
  },
  {
    id: "doc3",
    professorId: "2",
    fileName: "Certificado_Pedagogia_Carlos.pdf",
    fileType: "application/pdf",
    fileSize: 180000,
    uploadDate: "2024-01-12T14:20:00Z",
    category: "certificados",
    description: "Certificado en pedagogía moderna",
    fileUrl: "/placeholder-pdf.pdf",
  },
]

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set, get) => ({
      documents: DUMMY_DOCUMENTS,
      isLoading: false,

      uploadDocument: async (
        professorId: string,
        file: File,
        category: ProfessorDocument["category"],
        description?: string,
      ): Promise<boolean> => {
        set({ isLoading: true })

        try {
          // Simular upload del archivo
          await new Promise((resolve) => setTimeout(resolve, 2000))

          const newDocument: ProfessorDocument = {
            id: Date.now().toString(),
            professorId,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            uploadDate: new Date().toISOString(),
            category,
            description,
            fileUrl: URL.createObjectURL(file), // En producción sería la URL del servidor
          }

          set((state) => ({
            documents: [...state.documents, newDocument],
            isLoading: false,
          }))

          return true
        } catch (error: any) {
          set({ isLoading: false })
          return false
        }
      },

      deleteDocument: async (documentId: string): Promise<boolean> => {
        set({ isLoading: true })

        try {
          await new Promise((resolve) => setTimeout(resolve, 500))

          set((state) => ({
            documents: state.documents.filter((doc) => doc.id !== documentId),
            isLoading: false,
          }))

          return true
        } catch (error) {
          set({ isLoading: false })
          return false
        }
      },

      getDocumentsByProfessor: (professorId: string) => {
        return get().documents.filter((doc) => doc.professorId === professorId)
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
    }),
    {
      name: "document-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        documents: state.documents,
      }),
    },
  ),
)
