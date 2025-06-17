import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Activa":
        return "bg-green-100 text-green-800 border-green-200"
      case "Inactiva":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "Suspendida":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }
export   const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "Activa":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "Inactiva":
        return <XCircle className="w-4 h-4 text-gray-600" />
      case "Suspendida":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return <CheckCircle className="w-4 h-4 text-blue-600" />
    }
  }
