import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

import { RectorDocument, RectorDocumentState } from "@/interfaces/Documents/RectorDocuments"
import { DUMMY_RECTOR_DOCUMENTS } from "@/dummyData/dummyRectorDocuments.ts"

export const useRectorDocumentStore = create<RectorDocumentState>()(
  persist(
    (set, get) => ({
      documents: DUMMY_RECTOR_DOCUMENTS,
      isLoading: false,

      uploadDocument: async (
        rectorId: string,
        file: File,
        category: RectorDocument["category"],
        description?: string
      ): Promise<boolean> => {
        set({ isLoading: true })

        try {
          // Simular upload del archivo
          await new Promise((resolve) => setTimeout(resolve, 2000))

          const newDocument: RectorDocument = {
            id: Date.now().toString(),
            rectorId,
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

      getDocumentsByRector: (rectorId: string) => {
        return get().documents.filter((doc) => doc.rectorId === rectorId)
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
    }),
    {
      name: "rector-document-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        documents: state.documents,
      }),
    },
  ),
)