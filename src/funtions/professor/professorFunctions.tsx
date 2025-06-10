 export const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      contrato: "Contrato",
      hoja_vida: "Hoja de Vida",
      certificados: "Certificados",
      evaluaciones: "Evaluaciones",
      otros: "Otros",
    }
    return categories[category] || category
  }
  export const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      contrato: "bg-blue-100 text-blue-800",
      hoja_vida: "bg-green-100 text-green-800",
      certificados: "bg-purple-100 text-purple-800",
      evaluaciones: "bg-orange-100 text-orange-800",
      otros: "bg-gray-100 text-gray-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  