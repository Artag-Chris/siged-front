export const getDocumentTypeLabel = (type: string, TIPOS_DOCUMENTO: any) => {
  const docType = TIPOS_DOCUMENTO.find((t: any) => t.value === type)
  return docType ? docType.label : type
}

export const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    contrato: "Contrato",
    hoja_vida: "Hoja de Vida",
    certificados: "Certificados",
    evaluacion: "Evaluación",
    otros: "Otros",
  }
  return labels[category] || category
}

export const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    contrato: "bg-blue-100 text-blue-800",
    hoja_vida: "bg-green-100 text-green-800",
    certificados: "bg-yellow-100 text-yellow-800",
    evaluacion: "bg-purple-100 text-purple-800",
    otros: "bg-gray-100 text-gray-800",
  }
  return colors[category] || "bg-gray-100 text-gray-800"
}