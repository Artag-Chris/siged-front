 export const getJornadaLabel = (jornadas: string[]) => {
    return jornadas.map((j) => j.charAt(0).toUpperCase() + j.slice(1)).join(", ")
  }

export const getZonaLabel = (zona: string) => {
    return zona === "urbana" ? "Urbana" : "Rural"
  }

  