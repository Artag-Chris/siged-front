import { CheckCircle, XCircle, AlertTriangle, AlertCircle } from "lucide-react"

 export const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "Activo":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "Inactivo":
      case "Suspendido":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "Mantenimiento":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-blue-600" />
    }
  }

  export const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Activo":
        return "bg-green-100 text-green-800 border-green-200"
      case "Inactivo":
      case "Suspendido":
        return "bg-red-100 text-red-800 border-red-200"
      case "Mantenimiento":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }
