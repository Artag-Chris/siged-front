export const getEstadoColor = (estado: string) => {
    const colors: Record<string, string> = {
      Activo: "bg-green-100 text-green-800",
      Pendiente: "bg-yellow-100 text-yellow-800",
      Trasladado: "bg-blue-100 text-blue-800",
      Retirado: "bg-red-100 text-red-800",
    }
    return colors[estado] || "bg-gray-100 text-gray-800"
  }
