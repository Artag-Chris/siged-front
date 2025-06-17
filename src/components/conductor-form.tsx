"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { User, Phone, MapPin, Calendar, CreditCard, CheckCircle, FileText, Car } from "lucide-react"
import { TIPOS_DOCUMENTO_CONDUCTOR, CATEGORIAS_LICENCIA } from "@/dummyData/dummyConductores"
import { ConductorFormData } from "@/interfaces"
import { useConductorStore } from "@/lib/conductor-store"


export default function ConductorForm() {
  const { addConductor, isLoading } = useConductorStore()
  const router = useRouter()

  const [formData, setFormData] = useState<ConductorFormData>({
    nombreCompleto: "",
    tipoDocumento: "",
    numeroDocumento: "",
    telefono: "",
    email: "",
    direccion: "",
    fechaNacimiento: "",
    licenciaConducir: "",
    categoriaLicencia: "",
    fechaVencimientoLicencia: "",
    experienciaAnios: 0,
    observaciones: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [step, setStep] = useState(1)
  const [conductorId, setConductorId] = useState<string>("")

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombreCompleto.trim()) newErrors.nombreCompleto = "El nombre completo es obligatorio"
    if (!formData.tipoDocumento) newErrors.tipoDocumento = "El tipo de documento es obligatorio"
    if (!formData.numeroDocumento.trim()) newErrors.numeroDocumento = "El número de documento es obligatorio"
    if (!formData.telefono.trim()) newErrors.telefono = "El teléfono es obligatorio"
    if (!formData.direccion.trim()) newErrors.direccion = "La dirección es obligatoria"
    if (!formData.fechaNacimiento) newErrors.fechaNacimiento = "La fecha de nacimiento es obligatoria"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.licenciaConducir.trim()) newErrors.licenciaConducir = "El número de licencia es obligatorio"
    if (!formData.categoriaLicencia) newErrors.categoriaLicencia = "La categoría de licencia es obligatoria"
    if (!formData.fechaVencimientoLicencia)
      newErrors.fechaVencimientoLicencia = "La fecha de vencimiento es obligatoria"
    if (formData.experienciaAnios < 0) newErrors.experienciaAnios = "Los años de experiencia no pueden ser negativos"

    // Validar que la licencia no esté vencida
    if (formData.fechaVencimientoLicencia) {
      const fechaVencimiento = new Date(formData.fechaVencimientoLicencia)
      const hoy = new Date()
      if (fechaVencimiento <= hoy) {
        newErrors.fechaVencimientoLicencia = "La licencia no puede estar vencida"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof ConductorFormData, value: any) => {
    setFormData((prev:any) => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep2()) return

    try {
      const id = await addConductor(formData)
      setConductorId(id)
      setStep(3)
    } catch (error) {
      console.error("Error al registrar conductor:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      nombreCompleto: "",
      tipoDocumento: "",
      numeroDocumento: "",
      telefono: "",
      email: "",
      direccion: "",
      fechaNacimiento: "",
      licenciaConducir: "",
      categoriaLicencia: "",
      fechaVencimientoLicencia: "",
      experienciaAnios: 0,
      observaciones: "",
    })
    setErrors({})
    setStep(1)
    setConductorId("")
  }

  const getProgressValue = () => {
    return (step / 3) * 100
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">¡Conductor Registrado!</CardTitle>
            <CardDescription>El conductor ha sido registrado exitosamente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600 font-medium">ID del Conductor:</p>
              <p className="text-xl font-bold text-blue-800">{conductorId}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Button onClick={() => router.push("/transporte/conductores")} className="w-full">
                Ver Lista de Conductores
              </Button>
              <Button onClick={resetForm} variant="outline" className="w-full">
                Registrar Otro Conductor
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Registrar Conductor</h1>
          <p className="text-gray-600">Complete la información del conductor de transporte escolar</p>

          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Paso {step} de 3</span>
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
                  <Car className="w-5 h-5" /> Información de Licencia
                </>
              )}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Ingrese los datos personales del conductor"}
              {step === 2 && "Información sobre la licencia de conducir y experiencia"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="nombreCompleto" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nombre completo *
                  </Label>
                  <Input
                    id="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={(e) => handleInputChange("nombreCompleto", e.target.value)}
                    placeholder="Nombre completo del conductor"
                    className={errors.nombreCompleto ? "border-red-500" : ""}
                  />
                  {errors.nombreCompleto && <p className="text-sm text-red-500">{errors.nombreCompleto}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipoDocumento">Tipo de documento *</Label>
                    <Select
                      value={formData.tipoDocumento}
                      onValueChange={(value) => handleInputChange("tipoDocumento", value)}
                    >
                      <SelectTrigger className={errors.tipoDocumento ? "border-red-500" : ""}>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIPOS_DOCUMENTO_CONDUCTOR.map((tipo) => (
                          <SelectItem key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.tipoDocumento && <p className="text-sm text-red-500">{errors.tipoDocumento}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numeroDocumento">Número de documento *</Label>
                    <Input
                      id="numeroDocumento"
                      value={formData.numeroDocumento}
                      onChange={(e) => handleInputChange("numeroDocumento", e.target.value)}
                      placeholder="Número de documento"
                      className={errors.numeroDocumento ? "border-red-500" : ""}
                    />
                    {errors.numeroDocumento && <p className="text-sm text-red-500">{errors.numeroDocumento}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefono" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Teléfono *
                    </Label>
                    <Input
                      id="telefono"
                      value={formData.telefono}
                      onChange={(e) => handleInputChange("telefono", e.target.value)}
                      placeholder="Número de teléfono"
                      className={errors.telefono ? "border-red-500" : ""}
                    />
                    {errors.telefono && <p className="text-sm text-red-500">{errors.telefono}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email (opcional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Correo electrónico"
                    />
                  </div>
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

                <div className="space-y-2">
                  <Label htmlFor="fechaNacimiento" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Fecha de nacimiento *
                  </Label>
                  <Input
                    id="fechaNacimiento"
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={(e) => handleInputChange("fechaNacimiento", e.target.value)}
                    className={errors.fechaNacimiento ? "border-red-500" : ""}
                  />
                  {errors.fechaNacimiento && <p className="text-sm text-red-500">{errors.fechaNacimiento}</p>}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="licenciaConducir" className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Número de licencia de conducir *
                  </Label>
                  <Input
                    id="licenciaConducir"
                    value={formData.licenciaConducir}
                    onChange={(e) => handleInputChange("licenciaConducir", e.target.value)}
                    placeholder="Número de licencia"
                    className={errors.licenciaConducir ? "border-red-500" : ""}
                  />
                  {errors.licenciaConducir && <p className="text-sm text-red-500">{errors.licenciaConducir}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoriaLicencia">Categoría de licencia *</Label>
                    <Select
                      value={formData.categoriaLicencia}
                      onValueChange={(value) => handleInputChange("categoriaLicencia", value)}
                    >
                      <SelectTrigger className={errors.categoriaLicencia ? "border-red-500" : ""}>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIAS_LICENCIA.map((categoria) => (
                          <SelectItem key={categoria.value} value={categoria.value}>
                            {categoria.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.categoriaLicencia && <p className="text-sm text-red-500">{errors.categoriaLicencia}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fechaVencimientoLicencia">Fecha de vencimiento *</Label>
                    <Input
                      id="fechaVencimientoLicencia"
                      type="date"
                      value={formData.fechaVencimientoLicencia}
                      onChange={(e) => handleInputChange("fechaVencimientoLicencia", e.target.value)}
                      className={errors.fechaVencimientoLicencia ? "border-red-500" : ""}
                    />
                    {errors.fechaVencimientoLicencia && (
                      <p className="text-sm text-red-500">{errors.fechaVencimientoLicencia}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experienciaAnios">Años de experiencia conduciendo</Label>
                  <Input
                    id="experienciaAnios"
                    type="number"
                    min="0"
                    value={formData.experienciaAnios}
                    onChange={(e) => handleInputChange("experienciaAnios", Number.parseInt(e.target.value) || 0)}
                    placeholder="Años de experiencia"
                    className={errors.experienciaAnios ? "border-red-500" : ""}
                  />
                  {errors.experienciaAnios && <p className="text-sm text-red-500">{errors.experienciaAnios}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observaciones" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Observaciones adicionales
                  </Label>
                  <Textarea
                    id="observaciones"
                    value={formData.observaciones || ""}
                    onChange={(e) => handleInputChange("observaciones", e.target.value)}
                    placeholder="Información adicional sobre el conductor"
                    rows={3}
                  />
                </div>
              </>
            )}

            <div className="flex justify-between pt-6">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  Anterior
                </Button>
              )}

              <div className="ml-auto">
                {step < 2 && <Button onClick={handleNextStep}>Siguiente</Button>}

                {step === 2 && (
                  <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? "Registrando..." : "Registrar Conductor"}
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
