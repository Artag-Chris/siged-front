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

