import { format } from "date-fns/format"
import type { AssignQuotaParams } from "@/interfaces"

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

export const getEstadoColor = (estado: string) => {
    const colors: Record<string, string> = {
        Activo: "bg-green-100 text-green-800",
        Pendiente: "bg-yellow-100 text-yellow-800",
        Trasladado: "bg-blue-100 text-blue-800",
        Retirado: "bg-red-100 text-red-800",
    }
    return colors[estado] || "bg-gray-100 text-gray-800"
}

export const handleAssignQuota = async ({
  selectedStudent,
  selectedInstitution,
  selectedGrado,
  selectedJornada,
  selectedGrupo,
  selectedModalidad,
  selectedDate,
  observaciones,
  currentAvailableQuotas,
  assignQuota,
  assignInstitution,
  setError,
  setSuccess,
  setIsSubmitting,
  resetForm,
}: AssignQuotaParams): Promise<void> => {
  setError("")
  setSuccess("")
  setIsSubmitting(true)

  // Validaciones
  if (!selectedStudent) {
    setError("Debe seleccionar un estudiante")
    setIsSubmitting(false)
    return
  }

  if (!selectedInstitution) {
    setError("Debe seleccionar una institución")
    setIsSubmitting(false)
    return
  }

  if (!selectedGrado) {
    setError("Debe seleccionar un grado")
    setIsSubmitting(false)
    return
  }

  if (!selectedJornada) {
    setError("Debe seleccionar una jornada")
    setIsSubmitting(false)
    return
  }

  if (!selectedModalidad) {
    setError("Debe seleccionar una modalidad de asignación")
    setIsSubmitting(false)
    return
  }

  if (currentAvailableQuotas <= 0) {
    setError("No hay cupos disponibles para la combinación seleccionada")
    setIsSubmitting(false)
    return
  }

  try {
    // Crear objeto de asignación
    const assignmentData = {
      estudianteId: selectedStudent.id,
      institucionId: selectedInstitution,
      jornada: selectedJornada,
      grado: selectedGrado,
      grupo: selectedGrupo || undefined,
      modalidadAsignacion: selectedModalidad as any,
      fechaAsignacion: format(selectedDate, "yyyy-MM-dd"),
      observaciones: observaciones || undefined,
    }

    // Asignar cupo en el sistema
    const quotaSuccess = await assignQuota({
      ...assignmentData,
      jornada: selectedJornada as "mañana" | "tarde" | "unica" | "noche",
    })

    if (quotaSuccess) {
      // Actualizar estado del estudiante
      const studentSuccess = await assignInstitution(
        selectedStudent.id,
        selectedInstitution,
        format(selectedDate, "yyyy-MM-dd"),
        "Activo"
      )

      if (studentSuccess) {
        setSuccess(`Cupo asignado exitosamente a ${selectedStudent.nombreCompleto}`)
        resetForm()
      } else {
        setError("Error al actualizar el estado del estudiante")
      }
    } else {
      setError("Error al asignar el cupo")
    }
  } catch (error) {
    setError("Error en el proceso de asignación")
    console.error(error)
  } finally {
    setIsSubmitting(false)
  }
}