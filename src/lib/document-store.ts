
import axios, { AxiosResponse } from 'axios';
import { DUMMY_DOCUMENTS } from "@/dummyData/dummyDocuments"
import { ProfessorDocument, DocumentState } from "@/interfaces/Documents/Documents"
import { DocumentUploadParams, DocumentUploadResponse } from "@/types/documentSearch"
import { CV_UPLOAD_API_URL, DOCUMENT_API_URL } from "@/config/env"
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
        professorData?: { name: string; cedula: string } // Agregar datos del profesor
      ): Promise<boolean> => {
        set({ isLoading: true })

        try {
          // Si no se proporcionan datos del profesor, usar datos dummy
          const employeeName = professorData?.name || `Profesor ${professorId.slice(-4)}`;
          const employeeCedula = professorData?.cedula || `123456789${professorId.slice(-1)}`;

          // Preparar parámetros para la nueva API de CV
          const uploadParams: DocumentUploadParams = {
            file,
            employeeUuid: professorId,
            employeeName,
            employeeCedula,
            category: category as string,
            description,
            documentType: 'hojas-de-vida',
            tags: category ? [category, 'docente', 'profesor'] : ['docente', 'profesor'],
            title: `Documento - ${employeeName}`,
          }

          // Crear FormData según la estructura de la CV API
          const formData = new FormData()
          formData.append('document', file)
          
          // ✅ USAR UUID REAL DEL PROFESOR/EMPLEADO (ya no datos dummy)
          if (!professorId || professorId === 'uuid-placeholder') {
            throw new Error('UUID del profesor/empleado es requerido y debe ser válido');
          }
          
          console.log('📎 [DOCUMENT-STORE] Usando UUID real del empleado:', professorId);
          formData.append('employeeUuid', professorId) // UUID REAL del empleado seleccionado
          formData.append('employeeName', employeeName)
          formData.append('employeeCedula', employeeCedula)
          formData.append('documentType', 'hojas-de-vida')
          formData.append('category', category || 'curriculum-vitae')
          
          if (description) formData.append('description', description)
          if (uploadParams.title) formData.append('title', uploadParams.title)
          if (uploadParams.tags) formData.append('tags', JSON.stringify(uploadParams.tags))

          // Llamada a la nueva API de documentos CV
          const response: AxiosResponse<DocumentUploadResponse> = await axios.post(
            `${CV_UPLOAD_API_URL}/upload`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              timeout: 60000 // 60 segundos para uploads
            }
          );

          const result = response.data;

          if (result.success && result.document) {
            // Convertir el documento de la API al formato local
            const newDocument: ProfessorDocument = {
              id: result.document.id,
              professorId,
              fileName: result.document.originalName,
              fileType: result.document.mimetype,
              fileSize: result.document.size,
              uploadDate: result.document.uploadDate,
              category,
              description: result.document.description,
              fileUrl: result.document.downloadUrl,
            }

            set((state) => ({
              documents: [...state.documents, newDocument],
              isLoading: false,
            }))

            console.log('✅ [API SUCCESS] Documento subido y almacenado localmente:', {
              id: result.document.id,
              filename: result.document.filename,
              keywords: result.extractedData.keywordCount,
              elasticsearch: result.elasticsearch.indexed
            });

            return true
          } else {
            throw new Error(result.message || 'Error uploading document')
          }
        } catch (error: any) {
          console.error("❌ [API ERROR] Error subiendo documento:", error.message)
          set({ isLoading: false })
          throw error
        }
      },

      deleteDocument: async (documentId: string): Promise<boolean> => {
        set({ isLoading: true })

        try {
          // Llamada a la API para eliminar documento
          const response: AxiosResponse = await axios.delete(`${DOCUMENT_API_URL}/delete/${documentId}`, {
            timeout: 30000
          });

          set((state) => ({
            documents: state.documents.filter((doc) => doc.id !== documentId),
            isLoading: false,
          }))

          return true
        } catch (error: any) {
          console.error("❌ [API ERROR] Error eliminando documento:", error.message)
          set({ isLoading: false })
          throw error
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
