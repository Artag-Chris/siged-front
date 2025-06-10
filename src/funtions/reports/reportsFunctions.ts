export function getStatusColor(status: string) {
    const colors: Record<string, string> = {
        Activo: "#10b981",
        Pendiente: "#f59e0b",
        Trasladado: "#3b82f6",
        Retirado: "#ef4444",
    }
    return colors[status] || "#6b7280"
}

export const exportData = () => {
    
    //Todo Implementar exportación de datos excel o pdf 
    console.log("Exportando datos...")
}