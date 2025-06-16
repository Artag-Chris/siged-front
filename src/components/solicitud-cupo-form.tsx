"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Upload,
  AlertCircle,
  School,
  User,
  Phone,
  MapPin,
  GraduationCap,
  Clock,
  Bus,
  Users,
} from "lucide-react"

import { TIPOS_DOCUMENTO_SOLICITUD, GRADOS_SOLICITUD, JORNADAS_SOLICITUD } from "@/dummyData/dummySolicitudes"
import type { SolicitudCupoFormData } from "@/interfaces/solicitud-cupo"
import { useRouter } from "next/navigation"
import { useSolicitudCupoStore } from "@/lib/solicitud-cupo-store"
import { useGradeStore } from "@/lib/grade-store"
import { useInstitutionStore } from "@/lib/instituition-store"

export default function SolicitudCupoForm() {
  const { addSolicitud, isLoading } = useSolicitudCupoStore()
  const { institutions } = useInstitutionStore()
  const { getAvailableQuotas, getGradeQuotasByInstitution } = useGradeStore()
  const router = useRouter()

  const [formData, setFormData] = useState<SolicitudCupoFormData>({
    nombreNino: "",
    documentoNino: "",
    tipoDocumentoNino: "",
    nombreAcudiente: "",
    telefonoContacto: "",
    direccion: "",
    colegioSeleccionado: "",
    gradoSolicitado: "",
    jornada: "",
    necesitaTransporte: false,
    documentos: {
      notas: null,
      eps: null,
    },
    anioEscolar: new Date().getFullYear(),
    observaciones: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [step, setStep] = useState(1)
 

  // Obtener grados y jornadas disponibles basados en la institución seleccionada
  const availableOptions = useMemo(() => {
    if (!formData.colegioSeleccionado) {
      return { grados: [], jornadas: [] }
    }

    const quotas = getGradeQuotasByInstitution(formData.colegioSeleccionado, formData.anioEscolar)

    const gradosConCupos = quotas
      .filter((quota:any) => getAvailableQuotas(quota.institucionId, quota.grado, quota.jornada, quota.anioEscolar) > 0)
      .map((quota:any) => quota.grado)

    const jornadasConCupos = quotas
      .filter((quota:any) =>
        formData.gradoSolicitado
          ? quota.grado === formData.gradoSolicitado &&
            getAvailableQuotas(quota.institucionId, quota.grado, quota.jornada, quota.anioEscolar) > 0
          : getAvailableQuotas(quota.institucionId, quota.grado, quota.jornada, quota.anioEscolar) > 0,
      )
      .map((quota:any) => quota.jornada)

    return {
      grados: [...new Set(gradosConCupos)],
      jornadas: [...new Set(jornadasConCupos)],
    }
  }, [
    formData.colegioSeleccionado,
    formData.gradoSolicitado,
    formData.anioEscolar,
    getGradeQuotasByInstitution,
    getAvailableQuotas,
  ])

  // Obtener cupos disponibles para la combinación seleccionada
  const cuposDisponibles = useMemo(() => {
    if (!formData.colegioSeleccionado || !formData.gradoSolicitado || !formData.jornada) {
      return null
    }
    return getAvailableQuotas(
      formData.colegioSeleccionado,
      formData.gradoSolicitado,
      formData.jornada,
      formData.anioEscolar,
    )
  }, [
    formData.colegioSeleccionado,
    formData.gradoSolicitado,
    formData.jornada,
    formData.anioEscolar,
    getAvailableQuotas,
  ])

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombreNino.trim()) newErrors.nombreNino = "El nombre del niño es obligatorio"
    if (!formData.documentoNino.trim()) newErrors.documentoNino = "El documento del niño es obligatorio"
    if (!formData.tipoDocumentoNino) newErrors.tipoDocumentoNino = "El tipo de documento es obligatorio"
    if (!formData.nombreAcudiente.trim()) newErrors.nombreAcudiente = "El nombre del acudiente es obligatorio"
    if (!formData.telefonoContacto.trim()) newErrors.telefonoContacto = "El teléfono de contacto es obligatorio"
    if (!formData.direccion.trim()) newErrors.direccion = "La dirección es obligatoria"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.colegioSeleccionado) newErrors.colegioSeleccionado = "Debe seleccionar un colegio"
    if (!formData.gradoSolicitado) newErrors.gradoSolicitado = "Debe seleccionar un grado"
    if (!formData.jornada) newErrors.jornada = "Debe seleccionar una jornada"

    // Validar que hay cupos disponibles
    if (cuposDisponibles !== null && cuposDisponibles <= 0) {
      newErrors.cupos = "No hay cupos disponibles para la combinación seleccionada"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.documentos.notas) newErrors.notas = "Debe cargar las notas del estudiante"
    if (!formData.documentos.eps) newErrors.eps = "Debe cargar la información de EPS"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof SolicitudCupoFormData, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value }

      // Limpiar selecciones dependientes cuando cambia la institución
      if (field === "colegioSeleccionado") {
        newData.gradoSolicitado = ""
        newData.jornada = ""
      }

      // Limpiar jornada cuando cambia el grado
      if (field === "gradoSolicitado") {
        newData.jornada = ""
      }

      return newData
    })

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleFileChange = (type: "notas" | "eps", file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      documentos: {
        ...prev.documentos,
        [type]: file,
      },
    }))

    if (errors[type]) {
      setErrors((prev) => ({
        ...prev,
        [type]: "",
      }))
    }
  }

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep3()) return

    try {
      const radicado = await addSolicitud(formData)
      // Redirigir a la página de detalles con el radicado
      router.push(`/solicitud-cupo/detalle/${radicado}`)
    } catch (error) {
      console.error("Error al enviar solicitud:", error)
    }
  }

  // const resetForm = () => {
  //   setFormData({
  //     nombreNino: "",
  //     documentoNino: "",
  //     tipoDocumentoNino: "",
  //     nombreAcudiente: "",
  //     telefonoContacto: "",
  //     direccion: "",
  //     colegioSeleccionado: "",
  //     gradoSolicitado: "",
  //     jornada: "",
  //     necesitaTransporte: false,
  //     documentos: {
  //       notas: null,
  //       eps: null,
  //     },
  //     anioEscolar: new Date().getFullYear(),
  //     observaciones: "",
  //   })
  //   setErrors({})
  //   setStep(1)
  //   setRadicadoGenerado("")
  // }

  const getProgressValue = () => {
    return (step / 4) * 100
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Solicitud de Cupo Escolar</h1>
          <p className="text-gray-600">Complete el formulario para solicitar un cupo en una institución educativa</p>
          <div className="mt-2">
            <Badge variant="outline">Año Escolar: {formData.anioEscolar}</Badge>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Paso {step} de 4</span>
              <span>{Math.round(getProgressValue())}% completado</span>
            </div>
            <Progress value={getProgressValue()} className="h-2" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {step === 1 && (
                <>
                  <User className="w-5 h-5" /> Información Personal
                </>
              )}
              {step === 2 && (
                <>
                  <School className="w-5 h-5" /> Información Académica
                </>
              )}
              {step === 3 && (
                <>
                  <FileText className="w-5 h-5" /> Documentos Requeridos
                </>
              )}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Ingrese los datos del estudiante y acudiente"}
              {step === 2 && "Seleccione la institución y detalles académicos"}
              {step === 3 && "Cargue los documentos necesarios para completar la solicitud"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombreNino" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Nombre del niño *
                    </Label>
                    <Input
                      id="nombreNino"
                      value={formData.nombreNino}
                      onChange={(e) => handleInputChange("nombreNino", e.target.value)}
                      placeholder="Nombre completo del estudiante"
                      className={errors.nombreNino ? "border-red-500" : ""}
                    />
                    {errors.nombreNino && <p className="text-sm text-red-500">{errors.nombreNino}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipoDocumentoNino">Tipo de documento *</Label>
                    <Select
                      value={formData.tipoDocumentoNino}
                      onValueChange={(value) => handleInputChange("tipoDocumentoNino", value)}
                    >
                      <SelectTrigger className={errors.tipoDocumentoNino ? "border-red-500" : ""}>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIPOS_DOCUMENTO_SOLICITUD.map((tipo) => (
                          <SelectItem key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.tipoDocumentoNino && <p className="text-sm text-red-500">{errors.tipoDocumentoNino}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documentoNino">Número de documento *</Label>
                  <Input
                    id="documentoNino"
                    value={formData.documentoNino}
                    onChange={(e) => handleInputChange("documentoNino", e.target.value)}
                    placeholder="Número de documento del estudiante"
                    className={errors.documentoNino ? "border-red-500" : ""}
                  />
                  {errors.documentoNino && <p className="text-sm text-red-500">{errors.documentoNino}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nombreAcudiente" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nombre del acudiente *
                  </Label>
                  <Input
                    id="nombreAcudiente"
                    value={formData.nombreAcudiente}
                    onChange={(e) => handleInputChange("nombreAcudiente", e.target.value)}
                    placeholder="Nombre completo del acudiente"
                    className={errors.nombreAcudiente ? "border-red-500" : ""}
                  />
                  {errors.nombreAcudiente && <p className="text-sm text-red-500">{errors.nombreAcudiente}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefonoContacto" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Teléfono de contacto *
                  </Label>
                  <Input
                    id="telefonoContacto"
                    value={formData.telefonoContacto}
                    onChange={(e) => handleInputChange("telefonoContacto", e.target.value)}
                    placeholder="Número de teléfono"
                    className={errors.telefonoContacto ? "border-red-500" : ""}
                  />
                  {errors.telefonoContacto && <p className="text-sm text-red-500">{errors.telefonoContacto}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Dirección de residencia *
                  </Label>
                  <Textarea
                    id="direccion"
                    value={formData.direccion}
                    onChange={(e) => handleInputChange("direccion", e.target.value)}
                    placeholder="Dirección completa de residencia"
                    className={errors.direccion ? "border-red-500" : ""}
                  />
                  {errors.direccion && <p className="text-sm text-red-500">{errors.direccion}</p>}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="colegioSeleccionado" className="flex items-center gap-2">
                    <School className="w-4 h-4" />
                    Institución educativa *
                  </Label>
                  <Select
                    value={formData.colegioSeleccionado}
                    onValueChange={(value) => handleInputChange("colegioSeleccionado", value)}
                  >
                    <SelectTrigger className={errors.colegioSeleccionado ? "border-red-500" : ""}>
                      <SelectValue placeholder="Seleccionar institución" />
                    </SelectTrigger>
                    <SelectContent>
                      {institutions
                        .filter((inst:any) => inst.activa)
                        .map((institution:any) => (
                          <SelectItem key={institution.id} value={institution.id}>
                            {institution.nombre}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors.colegioSeleccionado && <p className="text-sm text-red-500">{errors.colegioSeleccionado}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gradoSolicitado" className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      Grado solicitado *
                    </Label>
                    <Select
                      value={formData.gradoSolicitado}
                      onValueChange={(value) => handleInputChange("gradoSolicitado", value)}
                      disabled={!formData.colegioSeleccionado}
                    >
                      <SelectTrigger className={errors.gradoSolicitado ? "border-red-500" : ""}>
                        <SelectValue
                          placeholder={
                            formData.colegioSeleccionado ? "Seleccionar grado" : "Primero seleccione institución"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {GRADOS_SOLICITUD.filter((grado) => availableOptions.grados.includes(grado.value)).map(
                          (grado) => (
                            <SelectItem key={grado.value} value={grado.value}>
                              {grado.label}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    {errors.gradoSolicitado && <p className="text-sm text-red-500">{errors.gradoSolicitado}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jornada" className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Jornada *
                    </Label>
                    <Select
                      value={formData.jornada}
                      onValueChange={(value) => handleInputChange("jornada", value)}
                      disabled={!formData.gradoSolicitado}
                    >
                      <SelectTrigger className={errors.jornada ? "border-red-500" : ""}>
                        <SelectValue
                          placeholder={formData.gradoSolicitado ? "Seleccionar jornada" : "Primero seleccione grado"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {JORNADAS_SOLICITUD.filter((jornada) => availableOptions.jornadas.includes(jornada.value)).map(
                          (jornada) => (
                            <SelectItem key={jornada.value} value={jornada.value}>
                              {jornada.label}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    {errors.jornada && <p className="text-sm text-red-500">{errors.jornada}</p>}
                  </div>
                </div>

                {cuposDisponibles !== null && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-800">Cupos disponibles: {cuposDisponibles}</span>
                    </div>
                    {cuposDisponibles <= 5 && cuposDisponibles > 0 && (
                      <p className="text-sm text-orange-600 mt-1">⚠️ Pocos cupos disponibles</p>
                    )}
                    {cuposDisponibles === 0 && <p className="text-sm text-red-600 mt-1">❌ No hay cupos disponibles</p>}
                  </div>
                )}

                {errors.cupos && <p className="text-sm text-red-500">{errors.cupos}</p>}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="necesitaTransporte"
                    checked={formData.necesitaTransporte}
                    onCheckedChange={(checked) => handleInputChange("necesitaTransporte", checked)}
                  />
                  <Label htmlFor="necesitaTransporte" className="flex items-center gap-2">
                    <Bus className="w-4 h-4" />
                    ¿Necesita servicio de transporte escolar?
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observaciones">Observaciones adicionales</Label>
                  <Textarea
                    id="observaciones"
                    value={formData.observaciones || ""}
                    onChange={(e) => handleInputChange("observaciones", e.target.value)}
                    placeholder="Información adicional que considere relevante"
                    rows={3}
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Notas del estudiante *
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileChange("notas", e.target.files?.[0] || null)}
                        className="hidden"
                        id="notas-upload"
                      />
                      <label htmlFor="notas-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          {formData.documentos.notas
                            ? formData.documentos.notas.name
                            : "Haga clic para cargar las notas (PDF)"}
                        </p>
                      </label>
                    </div>
                    {errors.notas && <p className="text-sm text-red-500">{errors.notas}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Información de EPS *
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileChange("eps", e.target.files?.[0] || null)}
                        className="hidden"
                        id="eps-upload"
                      />
                      <label htmlFor="eps-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          {formData.documentos.eps
                            ? formData.documentos.eps.name
                            : "Haga clic para cargar información de EPS (PDF)"}
                        </p>
                      </label>
                    </div>
                    {errors.eps && <p className="text-sm text-red-500">{errors.eps}</p>}
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Ambos documentos son obligatorios para completar la solicitud. Solo se aceptan archivos PDF.
                  </AlertDescription>
                </Alert>
              </>
            )}

            <div className="flex justify-between pt-6">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  Anterior
                </Button>
              )}

              <div className="ml-auto">
                {step < 3 && <Button onClick={handleNextStep}>Siguiente</Button>}

                {step === 3 && (
                  <Button onClick={handleSubmit} >
                    {isLoading ? "Enviando..." : "Enviar Solicitud"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
