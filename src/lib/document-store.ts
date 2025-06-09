
import { DUMMY_DOCUMENTS } from "@/dummyData/dummyDocuments"
import { ProfessorDocument, DocumentState } from "@/interfaces/Documents/Documents"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"


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
          console.error("Error uploading document:", error)
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
          console.error("Error deleting document:", error)
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
