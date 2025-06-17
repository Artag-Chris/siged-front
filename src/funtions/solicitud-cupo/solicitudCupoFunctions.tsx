import { CheckCircle, XCircle, Clock } from "lucide-react"

export const getEstadoIcon = (estado: string) => {
    switch (estado) {
        case "Aceptado":
            return <CheckCircle className="w-4 h-4 text-green-600" />
        case "Rechazado":
            return <XCircle className="w-4 h-4 text-red-600" />
        default:
            return <Clock className="w-4 h-4 text-yellow-600" />
    }
}

export const getEstadoColor = (estado: string) => {
    switch (estado) {
        case "Aceptado":
            return "bg-green-100 text-green-800 border-green-200"
        case "Rechazado":
            return "bg-red-100 text-red-800 border-red-200"
        default:
            return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
}