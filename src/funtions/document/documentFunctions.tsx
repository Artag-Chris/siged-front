export const getDocumentTypeLabel = (type: string,TIPOS_DOCUMENTO:any) => {
    const docType = TIPOS_DOCUMENTO.find((t:any) => t.value === type)
    return docType ? docType.label : type
  }