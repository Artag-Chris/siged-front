import { ProfessorDocument } from "@/interfaces/Documents/Documents";

export const DUMMY_DOCUMENTS: ProfessorDocument[] = [
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