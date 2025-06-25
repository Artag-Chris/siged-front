import { RectorDocument } from "@/interfaces/Documents/RectorDocuments"

export const DUMMY_RECTOR_DOCUMENTS: RectorDocument[] = [
  {
    id: "rdoc1",
    rectorId: "1", // María Elena Rodríguez (San Judas Tadeo)
    fileName: "Nombramiento_Maria_Rodriguez.pdf",
    fileType: "application/pdf",
    fileSize: 320000,
    uploadDate: "2024-01-15T09:15:00Z",
    category: "contrato",
    description: "Documento de nombramiento como rectora",
    fileUrl: "/placeholder-pdf.pdf",
  },
  {
    id: "rdoc2",
    rectorId: "1",
    fileName: "CV_Maria_Rodriguez.pdf",
    fileType: "application/pdf",
    fileSize: 450000,
    uploadDate: "2024-01-16T11:20:00Z",
    category: "hoja_vida",
    description: "Curriculum vitae completo",
    fileUrl: "/placeholder-pdf.pdf",
  },
  {
    id: "rdoc3",
    rectorId: "2", // Carlos Alberto Gómez (Rural La Esperanza)
    fileName: "Certificado_Gestion_Educativa.pdf",
    fileType: "application/pdf",
    fileSize: 280000,
    uploadDate: "2024-01-18T14:30:00Z",
    category: "certificados",
    description: "Certificación en gestión educativa rural",
    fileUrl: "/placeholder-pdf.pdf",
  },
  {
    id: "rdoc4",
    rectorId: "3", // Ana Patricia Morales (Técnico Industrial)
    fileName: "Plan_Mejora_Institucional.pdf",
    fileType: "application/pdf",
    fileSize: 380000,
    uploadDate: "2024-01-20T16:45:00Z",
    category: "otros",
    description: "Plan de mejora para la institución",
    fileUrl: "/placeholder-pdf.pdf",
  },
  {
    id: "rdoc5",
    rectorId: "4", // Juan Pablo Restrepo (Bicentenario del Saber)
    fileName: "Informe_Gestion_2023.pdf",
    fileType: "application/pdf",
    fileSize: 520000,
    uploadDate: "2024-01-22T10:00:00Z",
    category: "evaluacion",
    description: "Informe anual de gestión institucional",
    fileUrl: "/placeholder-pdf.pdf",
  },
]