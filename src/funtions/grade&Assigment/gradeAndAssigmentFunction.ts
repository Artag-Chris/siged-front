export const getGradoLabel = (grado: string, GRADOS_DISPONIBLES: any) => {
    const gradoObj = GRADOS_DISPONIBLES.find((g: any) => g.value === grado)
    return gradoObj ? gradoObj.label : grado
}
export const getJornadaLabel = (jornada: string) => {
    const labels: Record<string, string> = {
        mañana: "Mañana",
        tarde: "Tarde",
        unica: "Única",
        noche: "Noche",
    }
    return labels[jornada] || jornada
}


export const getModalidadLabel = (modalidad: string) => {
    const labels: Record<string, string> = {
        nueva_matricula: "Nueva Matrícula",
        traslado: "Traslado",
        reintegro: "Reintegro",
    }
    return labels[modalidad] || modalidad
}