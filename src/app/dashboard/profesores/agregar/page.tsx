"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Save, ArrowLeft, CheckCircle, AlertCircle, User, GraduationCap, MapPin, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { CreateProfesorConSedeRequest } from '@/types/empleados.types';
import { ProtectedRoute } from '@/components/protected-route';
import { useCrearProfesorConSede } from '@/hooks/useCrearProfesorConSede';
import { useSedes } from '@/hooks/useSedes';

const TIPOS_DOCUMENTO = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'PA', label: 'Pasaporte' }
];

const NIVELES_ACADEMICOS = [
  { value: 'bachiller', label: 'Bachiller' },
  { value: 'tecnico', label: 'Técnico' },
  { value: 'tecnologo', label: 'Tecnólogo' },
  { value: 'licenciado', label: 'Licenciado' },
  { value: 'profesional', label: 'Profesional' },
  { value: 'especialista', label: 'Especialista' },
  { value: 'magister', label: 'Magíster' },
  { value: 'doctorado', label: 'Doctorado' }
];

type Step = "datos" | "academica" | "sede" | "resumen";

function AgregarProfesorContent() {
  const router = useRouter()
  const { crearProfesor, loading, error: errorCreacion, resultado, reset } = useCrearProfesorConSede()
  const { sedes, loading: loadingSedes } = useSedes({ autoLoad: true, estado: 'activa' })

  const [step, setStep] = useState<Step>("datos")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Estado del formulario
  const [formData, setFormData] = useState<CreateProfesorConSedeRequest>({
    empleado: {
      tipo_documento: 'CC',
      documento: '',
      nombre: '',
      apellido: '',
      email: '',
      direccion: '',
      cargo: 'Docente',
    },
    informacionAcademica: {
      nivel_academico: 'licenciado',
      anos_experiencia: 0,
      institucion: '',
      titulo: '',
    },
    sedeId: '',
    fechaAsignacion: new Date().toISOString().split('T')[0],
    observaciones: '',
  })

  // Actualizar datos del empleado
  const updateEmpleado = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      empleado: { ...prev.empleado, [field]: value },
    }))
    setFormErrors((prev) => ({ ...prev, [field]: "" }))
  }

  // Actualizar información académica
  const updateAcademica = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      informacionAcademica: { ...prev.informacionAcademica, [field]: value },
    }))
  }

  // Validar paso actual
  const validateStep = (currentStep: Step): boolean => {
    const errors: Record<string, string> = {}

    switch (currentStep) {
      case "datos":
        if (!formData.empleado.nombre) errors.nombre = "El nombre es requerido"
        if (!formData.empleado.apellido) errors.apellido = "El apellido es requerido"
        if (!formData.empleado.documento) errors.documento = "El documento es requerido"
        if (!formData.empleado.email) errors.email = "El email es requerido"
        if (formData.empleado.documento.length < 6)
          errors.documento = "El documento debe tener al menos 6 dígitos"
        if (formData.empleado.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.empleado.email))
          errors.email = "Email inválido"
        break

      case "academica":
        if (!formData.informacionAcademica.titulo)
          errors.titulo = "El título es requerido"
        if (!formData.informacionAcademica.institucion)
          errors.institucion = "La institución educativa es requerida"
        break

      case "sede":
        if (!formData.sedeId)
          errors.sedeId = "Debe seleccionar una sede"
        break
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Navegar entre pasos
  const handleNext = () => {
    if (!validateStep(step)) return

    const steps: Step[] = ["datos", "academica", "sede", "resumen"]
    const currentIndex = steps.indexOf(step)
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1])
    }
  }

  const handleBack = () => {
    const steps: Step[] = ["datos", "academica", "sede", "resumen"]
    const currentIndex = steps.indexOf(step)
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1])
    }
  }

  // Enviar formulario
  const handleSubmit = async () => {
    if (!validateStep("sede")) return

    const resultado = await crearProfesor(formData)
    
    if (resultado) {
      // Redirigir al listado de profesores
      setTimeout(() => {
        router.push('/dashboard/profesores')
      }, 2000)
    }
  }

  // Steps config
  const steps = [
    { key: "datos" as Step, label: "Datos Personales", icon: User },
    { key: "academica" as Step, label: "Información Académica", icon: GraduationCap },
    { key: "sede" as Step, label: "Asignación de Sede", icon: MapPin },
    { key: "resumen" as Step, label: "Resumen", icon: CheckCircle },
  ]

  const currentStepIndex = steps.findIndex((s) => s.key === step)

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/profesores">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Crear Profesor con Sede</h1>
              <p className="text-gray-600">Complete el formulario paso a paso</p>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => {
              const Icon = s.icon
              const isActive = s.key === step
              const isCompleted = index < currentStepIndex

              return (
                <div key={s.key} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isActive
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 text-center ${
                        isActive ? "text-blue-600 font-semibold" : "text-gray-600"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 ${
                        isCompleted ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Errores */}
        {errorCreacion && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorCreacion}</AlertDescription>
          </Alert>
        )}

        {/* Éxito */}
        {resultado && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ¡Profesor creado exitosamente! Redirigiendo...
            </AlertDescription>
          </Alert>
        )}

        {/* Formulario por pasos */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStepIndex].label}</CardTitle>
            <CardDescription>
              Paso {currentStepIndex + 1} de {steps.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* PASO 1: Datos Personales */}
            {step === "datos" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tipo_documento">Tipo de Documento *</Label>
                    <Select
                      value={formData.empleado.tipo_documento}
                      onValueChange={(value) => updateEmpleado("tipo_documento", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIPOS_DOCUMENTO.map((tipo) => (
                          <SelectItem key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="documento">Documento *</Label>
                    <Input
                      id="documento"
                      value={formData.empleado.documento}
                      onChange={(e) => updateEmpleado("documento", e.target.value)}
                      placeholder="1589635742"
                      className={formErrors.documento ? "border-red-500" : ""}
                    />
                    {formErrors.documento && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.documento}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      value={formData.empleado.nombre}
                      onChange={(e) => updateEmpleado("nombre", e.target.value)}
                      placeholder="Nayibe"
                      className={formErrors.nombre ? "border-red-500" : ""}
                    />
                    {formErrors.nombre && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.nombre}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="apellido">Apellido *</Label>
                    <Input
                      id="apellido"
                      value={formData.empleado.apellido}
                      onChange={(e) => updateEmpleado("apellido", e.target.value)}
                      placeholder="Rodríguez"
                      className={formErrors.apellido ? "border-red-500" : ""}
                    />
                    {formErrors.apellido && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.apellido}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.empleado.email}
                      onChange={(e) => updateEmpleado("email", e.target.value)}
                      placeholder="nayibe.rodriguez@colegio.edu.co"
                      className={formErrors.email ? "border-red-500" : ""}
                    />
                    {formErrors.email && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      value={formData.empleado.direccion}
                      onChange={(e) => updateEmpleado("direccion", e.target.value)}
                      placeholder="Calle 123 #45-67, Pereira"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PASO 2: Información Académica */}
            {step === "academica" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nivel_academico">Nivel Académico *</Label>
                    <Select
                      value={formData.informacionAcademica.nivel_academico}
                      onValueChange={(value) => updateAcademica("nivel_academico", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {NIVELES_ACADEMICOS.map((nivel) => (
                          <SelectItem key={nivel.value} value={nivel.value}>
                            {nivel.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="titulo">Título *</Label>
                    <Input
                      id="titulo"
                      value={formData.informacionAcademica.titulo}
                      onChange={(e) => updateAcademica("titulo", e.target.value)}
                      placeholder="Licenciatura en Matemáticas"
                      className={formErrors.titulo ? "border-red-500" : ""}
                    />
                    {formErrors.titulo && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.titulo}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="institucion">Institución Educativa *</Label>
                    <Input
                      id="institucion"
                      value={formData.informacionAcademica.institucion}
                      onChange={(e) => updateAcademica("institucion", e.target.value)}
                      placeholder="Universidad Tecnológica De Pereira"
                      className={formErrors.institucion ? "border-red-500" : ""}
                    />
                    {formErrors.institucion && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.institucion}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="anos_experiencia">Años de Experiencia *</Label>
                    <Input
                      id="anos_experiencia"
                      type="number"
                      min="0"
                      value={formData.informacionAcademica.anos_experiencia}
                      onChange={(e) =>
                        updateAcademica("anos_experiencia", parseInt(e.target.value) || 0)
                      }
                      placeholder="8"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PASO 3: Asignación de Sede */}
            {step === "sede" && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="sedeId">Seleccionar Sede *</Label>
                  {loadingSedes ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                      <span className="ml-2 text-gray-600">Cargando sedes...</span>
                    </div>
                  ) : (
                    <>
                      <Select
                        value={formData.sedeId}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, sedeId: value }))}
                      >
                        <SelectTrigger className={formErrors.sedeId ? "border-red-500" : ""}>
                          <SelectValue placeholder="Seleccione una sede" />
                        </SelectTrigger>
                        <SelectContent>
                          {sedes.map((sede) => (
                            <SelectItem key={sede.id} value={sede.id}>
                              {sede.nombre} - {sede.zona} ({sede.estado})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.sedeId && (
                        <p className="text-sm text-red-500 mt-1">{formErrors.sedeId}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        {sedes.length} sedes activas disponibles
                      </p>
                    </>
                  )}
                </div>

                <div>
                  <Label htmlFor="fechaAsignacion">Fecha de Asignación *</Label>
                  <Input
                    id="fechaAsignacion"
                    type="date"
                    value={formData.fechaAsignacion.split('T')[0]}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, fechaAsignacion: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <Textarea
                    id="observaciones"
                    value={formData.observaciones}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, observaciones: e.target.value }))
                    }
                    placeholder="Asignación como docente de matemáticas para octavo y décimo"
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* PASO 4: Resumen */}
            {step === "resumen" && (
              <div className="space-y-6">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Revise la información antes de crear el profesor
                  </AlertDescription>
                </Alert>

                {/* Resumen Empleado */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Datos Personales
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <strong>Nombre:</strong> {formData.empleado.nombre}{" "}
                      {formData.empleado.apellido}
                    </div>
                    <div>
                      <strong>Documento:</strong> {formData.empleado.tipo_documento}{" "}
                      {formData.empleado.documento}
                    </div>
                    <div>
                      <strong>Email:</strong> {formData.empleado.email}
                    </div>
                    {formData.empleado.direccion && (
                      <div className="col-span-2">
                        <strong>Dirección:</strong> {formData.empleado.direccion}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Resumen Académica */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2" />
                      Información Académica
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <strong>Nivel:</strong>{" "}
                      {formData.informacionAcademica.nivel_academico}
                    </div>
                    <div>
                      <strong>Título:</strong> {formData.informacionAcademica.titulo}
                    </div>
                    <div>
                      <strong>Institución:</strong>{" "}
                      {formData.informacionAcademica.institucion}
                    </div>
                    <div>
                      <strong>Experiencia:</strong>{" "}
                      {formData.informacionAcademica.anos_experiencia} años
                    </div>
                  </CardContent>
                </Card>

                {/* Resumen Sede */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Asignación
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <div>
                      <strong>Sede:</strong>{" "}
                      {sedes.find((s) => s.id === formData.sedeId)?.nombre || "No seleccionada"}
                    </div>
                    <div>
                      <strong>Fecha:</strong> {formData.fechaAsignacion}
                    </div>
                    {formData.observaciones && (
                      <div>
                        <strong>Observaciones:</strong> {formData.observaciones}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Botones de navegación */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStepIndex === 0 || loading}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>

          <div className="flex gap-2">
            <Link href="/dashboard/profesores">
              <Button variant="ghost" disabled={loading}>
                Cancelar
              </Button>
            </Link>

            {currentStepIndex < steps.length - 1 ? (
              <Button onClick={handleNext} disabled={loading}>
                Siguiente
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Crear Profesor
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AgregarProfesorPage() {
  return (
    <ProtectedRoute requiredRole={['super_admin', 'admin', 'gestor']}>
      <AgregarProfesorContent />
    </ProtectedRoute>
  );
}
