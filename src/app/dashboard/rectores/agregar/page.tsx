"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  ArrowRight,
  Save,
  User,
  GraduationCap,
  Building2,
  MapPin,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { useCrearRectorCompleto, useValidarFlujoRector, useInstitucionesDisponibles } from "@/hooks/useRectores"
import { ICreateRectorCompletoRequest, JORNADAS_DISPONIBLES } from "@/types/rector.types"

type Step = "datos" | "academica" | "institucion" | "sedes" | "resumen"

export default function AgregarRectorPage() {
  const router = useRouter()
  const { crearRector, loading, error: errorCreacion, resultado, reset } = useCrearRectorCompleto()
  const { validar, validando, resultado: validacion } = useValidarFlujoRector()
  const { instituciones, loading: loadingInstituciones } = useInstitucionesDisponibles({
    sinRector: false,
    conSedes: true,
    autoLoad: true,
  })

  const [step, setStep] = useState<Step>("datos")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [mostrarSedesExistentes, setMostrarSedesExistentes] = useState(false)

  // Estado del formulario
  const [formData, setFormData] = useState<ICreateRectorCompletoRequest>({
    empleado: {
      tipo_documento: "CC",
      documento: "",
      nombre: "",
      apellido: "",
      email: "",
      cargo: "Rector",
      direccion: "",
    },
    informacionAcademica: {
      nivel_academico: "magister",
      anos_experiencia: 0,
      institucion: "",
      titulo: "",
    },
    institucion: {
      nombre: "",
    },
    sedes: {
      crear: [],
      asignar_existentes: [],
    },
    fechaAsignacion: new Date().toISOString(),
    observaciones: "",
  })

  // Validar documento y email en tiempo real
  const handleValidarDocumento = async () => {
    if (formData.empleado.documento.length >= 6) {
      await validar(formData.empleado.documento, formData.empleado.email || undefined)
    }
  }

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
      informacionAcademica: { ...prev.informacionAcademica!, [field]: value },
    }))
  }

  // Actualizar institución
  const updateInstitucion = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      institucion: { ...prev.institucion, [field]: value },
    }))
  }

  // Agregar nueva sede
  const agregarSede = () => {
    setFormData((prev) => ({
      ...prev,
      sedes: {
        ...prev.sedes,
        crear: [
          ...(prev.sedes.crear || []),
          {
            nombre: "",
            zona: "urbana",
            direccion: "",
            codigo_DANE: "",
            jornadas: ["Mañana"],
          },
        ],
      },
    }))
  }

  // Actualizar sede
  const updateSede = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      sedes: {
        ...prev.sedes,
        crear: prev.sedes.crear!.map((sede, i) =>
          i === index ? { ...sede, [field]: value } : sede
        ),
      },
    }))
  }

  // Eliminar sede
  const eliminarSede = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sedes: {
        ...prev.sedes,
        crear: prev.sedes.crear!.filter((_, i) => i !== index),
      },
    }))
  }

  // Toggle jornada en sede
  const toggleJornada = (sedeIndex: number, jornada: string) => {
    setFormData((prev) => ({
      ...prev,
      sedes: {
        ...prev.sedes,
        crear: prev.sedes.crear!.map((sede, i) => {
          if (i !== sedeIndex) return sede
          const jornadas = sede.jornadas || []
          const hasJornada = jornadas.includes(jornada)
          return {
            ...sede,
            jornadas: hasJornada
              ? jornadas.filter((j) => j !== jornada)
              : [...jornadas, jornada],
          }
        }),
      },
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
        if (!formData.informacionAcademica?.titulo)
          errors.titulo = "El título es requerido"
        if (!formData.informacionAcademica?.institucion)
          errors.institucion = "La institución educativa es requerida"
        break

      case "institucion":
        if (!formData.institucion.nombre)
          errors.institucion = "El nombre de la institución es requerido"
        break

      case "sedes":
        const tieneSedesCrear = formData.sedes.crear && formData.sedes.crear.length > 0
        const tieneSedesExistentes = formData.sedes.asignar_existentes && formData.sedes.asignar_existentes.length > 0
        
        if (!tieneSedesCrear && !tieneSedesExistentes) {
          errors.sedes = "Debe agregar al menos una sede o seleccionar sedes existentes"
        } else if (tieneSedesCrear) {
          formData.sedes.crear!.forEach((sede, index) => {
            if (!sede.nombre) errors[`sede_${index}_nombre`] = "Nombre requerido"
            if (!sede.direccion) errors[`sede_${index}_direccion`] = "Dirección requerida"
            if (sede.codigo_DANE && sede.codigo_DANE.length !== 12)
              errors[`sede_${index}_dane`] = "El código DANE debe tener 12 dígitos"
          })
        }
        break
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Navegar entre pasos
  const handleNext = () => {
    if (!validateStep(step)) return

    const steps: Step[] = ["datos", "academica", "institucion", "sedes", "resumen"]
    const currentIndex = steps.indexOf(step)
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1])
    }
  }

  const handleBack = () => {
    const steps: Step[] = ["datos", "academica", "institucion", "sedes", "resumen"]
    const currentIndex = steps.indexOf(step)
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1])
    }
  }

  // Enviar formulario
  const handleSubmit = async () => {
    if (!validateStep("sedes")) return

    const resultado = await crearRector(formData)
    
    if (resultado) {
      // Redirigir al detalle del rector
      setTimeout(() => {
        router.push(`/dashboard/rectores/${resultado.data.rector.id}`)
      }, 2000)
    }
  }

  // Steps config
  const steps = [
    { key: "datos" as Step, label: "Datos Personales", icon: User },
    { key: "academica" as Step, label: "Información Académica", icon: GraduationCap },
    { key: "institucion" as Step, label: "Institución", icon: Building2 },
    { key: "sedes" as Step, label: "Sedes", icon: MapPin },
    { key: "resumen" as Step, label: "Resumen", icon: CheckCircle },
  ]

  const currentStepIndex = steps.findIndex((s) => s.key === step)

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/rectores">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Crear Rector Completo</h1>
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
              ¡Rector creado exitosamente! Redirigiendo...
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
                        <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                        <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                        <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
                        <SelectItem value="PEP">Permiso Especial</SelectItem>
                        <SelectItem value="PPT">Permiso Protección Temporal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="documento">Documento *</Label>
                    <Input
                      id="documento"
                      value={formData.empleado.documento}
                      onChange={(e) => updateEmpleado("documento", e.target.value)}
                      onBlur={handleValidarDocumento}
                      placeholder="1548965872"
                      className={formErrors.documento ? "border-red-500" : ""}
                    />
                    {formErrors.documento && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.documento}</p>
                    )}
                    {validando && (
                      <p className="text-sm text-blue-500 mt-1 flex items-center">
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        Validando...
                      </p>
                    )}
                    {validacion && !validacion.documentoDisponible && (
                      <p className="text-sm text-red-500 mt-1">
                        Este documento ya está registrado
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      value={formData.empleado.nombre}
                      onChange={(e) => updateEmpleado("nombre", e.target.value)}
                      placeholder="Andres"
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
                      placeholder="Gomez"
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
                      onBlur={handleValidarDocumento}
                      placeholder="andres.gomez@iejsr.edu.co"
                      className={formErrors.email ? "border-red-500" : ""}
                    />
                    {formErrors.email && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
                    )}
                    {validacion && !validacion.emailDisponible && (
                      <p className="text-sm text-red-500 mt-1">
                        Este email ya está registrado
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      value={formData.empleado.direccion}
                      onChange={(e) => updateEmpleado("direccion", e.target.value)}
                      placeholder="Carrera 8 #35-89, Pereira"
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
                      value={formData.informacionAcademica?.nivel_academico}
                      onValueChange={(value) => updateAcademica("nivel_academico", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bachiller">Bachiller</SelectItem>
                        <SelectItem value="tecnico">Técnico</SelectItem>
                        <SelectItem value="tecnologo">Tecnólogo</SelectItem>
                        <SelectItem value="profesional">Profesional</SelectItem>
                        <SelectItem value="especializacion">Especialización</SelectItem>
                        <SelectItem value="magister">Magíster</SelectItem>
                        <SelectItem value="doctorado">Doctorado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="titulo">Título *</Label>
                    <Input
                      id="titulo"
                      value={formData.informacionAcademica?.titulo}
                      onChange={(e) => updateAcademica("titulo", e.target.value)}
                      placeholder="Magíster en Administración Educativa"
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
                      value={formData.informacionAcademica?.institucion}
                      onChange={(e) => updateAcademica("institucion", e.target.value)}
                      placeholder="Universidad Nacional"
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
                      value={formData.informacionAcademica?.anos_experiencia}
                      onChange={(e) =>
                        updateAcademica("anos_experiencia", parseInt(e.target.value) || 0)
                      }
                      placeholder="20"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PASO 3: Institución */}
            {step === "institucion" && (
              <div className="space-y-6">
                {/* Opciones: Nueva institución o existente */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    ¿Desea crear una nueva institución o usar una existente?
                  </h3>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant={!mostrarSedesExistentes ? "default" : "outline"}
                      onClick={() => {
                        setMostrarSedesExistentes(false)
                        setFormData((prev) => ({
                          ...prev,
                          sedes: { crear: prev.sedes.crear || [], asignar_existentes: [] },
                        }))
                      }}
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      Nueva Institución
                    </Button>
                    <Button
                      type="button"
                      variant={mostrarSedesExistentes ? "default" : "outline"}
                      onClick={() => setMostrarSedesExistentes(true)}
                      disabled={loadingInstituciones || instituciones.length === 0}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Institución Existente con Sedes
                    </Button>
                  </div>
                  {instituciones.length === 0 && !loadingInstituciones && (
                    <p className="text-sm text-gray-600 mt-2">
                      No hay instituciones con sedes disponibles. Cree una nueva institución.
                    </p>
                  )}
                </div>

                {/* Formulario para nueva institución */}
                {!mostrarSedesExistentes && (
                  <div>
                    <Label htmlFor="nombre_institucion">Nombre de la Institución *</Label>
                    <Input
                      id="nombre_institucion"
                      value={formData.institucion.nombre}
                      onChange={(e) => updateInstitucion("nombre", e.target.value)}
                      placeholder="Institución Educativa San José"
                      className={formErrors.institucion ? "border-red-500" : ""}
                    />
                    {formErrors.institucion && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.institucion}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Este será el nombre oficial de la institución educativa
                    </p>
                  </div>
                )}

                {/* Seleccionar institución existente */}
                {mostrarSedesExistentes && (
                  <div className="space-y-4">
                    <div>
                      <Label>Seleccionar Institución con Sedes</Label>
                      {loadingInstituciones ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                          <span className="ml-2 text-gray-600">Cargando instituciones...</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4 mt-2">
                          {instituciones.map((inst) => (
                            <Card
                              key={inst.id}
                              className={`cursor-pointer transition-all ${
                                formData.institucion.nombre === inst.nombre
                                  ? "border-blue-500 bg-blue-50"
                                  : "hover:border-gray-400"
                              }`}
                              onClick={() => {
                                updateInstitucion("nombre", inst.nombre)
                                // Cargar las sedes de esta institución
                                const sedesIds = inst.sedes?.map((s: any) => s.id) || []
                                setFormData((prev) => ({
                                  ...prev,
                                  sedes: {
                                    crear: [],
                                    asignar_existentes: sedesIds,
                                  },
                                }))
                              }}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{inst.nombre}</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {inst._count?.sedes || 0} sede(s) disponible(s)
                                    </p>
                                    {inst.sedes && inst.sedes.length > 0 && (
                                      <div className="mt-3 space-y-2">
                                        <p className="text-xs font-semibold text-gray-700">
                                          Sedes:
                                        </p>
                                        {inst.sedes.map((sede: any) => (
                                          <div
                                            key={sede.id}
                                            className="flex items-center gap-2 text-sm"
                                          >
                                            <MapPin className="h-3 w-3 text-gray-500" />
                                            <span>{sede.nombre}</span>
                                            <Badge variant="outline" className="text-xs">
                                              {sede.zona}
                                            </Badge>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  {formData.institucion.nombre === inst.nombre && (
                                    <CheckCircle className="h-6 w-6 text-blue-600" />
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="fechaAsignacion">Fecha de Asignación</Label>
                  <Input
                    id="fechaAsignacion"
                    type="date"
                    value={formData.fechaAsignacion}
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
                    placeholder="Información adicional sobre el rector..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* PASO 4: Sedes */}
            {step === "sedes" && (
              <div className="space-y-4">
                {mostrarSedesExistentes ? (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Se asignarán las sedes existentes de la institución seleccionada.
                      <br />
                      <strong>
                        {formData.sedes.asignar_existentes?.length || 0} sede(s) seleccionada(s)
                      </strong>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">Sedes de la Institución</h3>
                        <p className="text-sm text-gray-500">
                          Agregue al menos una sede para la nueva institución
                        </p>
                      </div>
                      <Button onClick={agregarSede} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Sede
                      </Button>
                    </div>

                {formErrors.sedes && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{formErrors.sedes}</AlertDescription>
                  </Alert>
                )}

                {formData.sedes.crear?.map((sede, index) => (
                  <Card key={index} className="relative">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Sede {index + 1}</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => eliminarSede(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`sede_${index}_nombre`}>Nombre de la Sede *</Label>
                          <Input
                            id={`sede_${index}_nombre`}
                            value={sede.nombre}
                            onChange={(e) => updateSede(index, "nombre", e.target.value)}
                            placeholder="Sede Principal"
                            className={
                              formErrors[`sede_${index}_nombre`] ? "border-red-500" : ""
                            }
                          />
                          {formErrors[`sede_${index}_nombre`] && (
                            <p className="text-sm text-red-500 mt-1">
                              {formErrors[`sede_${index}_nombre`]}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor={`sede_${index}_zona`}>Zona</Label>
                          <Select
                            value={sede.zona}
                            onValueChange={(value) => updateSede(index, "zona", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="urbana">Urbana</SelectItem>
                              <SelectItem value="rural">Rural</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="md:col-span-2">
                          <Label htmlFor={`sede_${index}_direccion`}>Dirección *</Label>
                          <Input
                            id={`sede_${index}_direccion`}
                            value={sede.direccion}
                            onChange={(e) => updateSede(index, "direccion", e.target.value)}
                            placeholder="Calle 123 #45-67"
                            className={
                              formErrors[`sede_${index}_direccion`] ? "border-red-500" : ""
                            }
                          />
                          {formErrors[`sede_${index}_direccion`] && (
                            <p className="text-sm text-red-500 mt-1">
                              {formErrors[`sede_${index}_direccion`]}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor={`sede_${index}_dane`}>Código DANE</Label>
                          <Input
                            id={`sede_${index}_dane`}
                            value={sede.codigo_DANE}
                            onChange={(e) => updateSede(index, "codigo_DANE", e.target.value)}
                            placeholder="123456789012"
                            maxLength={12}
                            className={
                              formErrors[`sede_${index}_dane`] ? "border-red-500" : ""
                            }
                          />
                          {formErrors[`sede_${index}_dane`] && (
                            <p className="text-sm text-red-500 mt-1">
                              {formErrors[`sede_${index}_dane`]}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 mt-1">12 dígitos</p>
                        </div>
                      </div>

                      <div>
                        <Label>Jornadas</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {JORNADAS_DISPONIBLES.map((jornada) => (
                            <Badge
                              key={jornada.id}
                              variant={
                                sede.jornadas?.includes(jornada.nombre) ? "default" : "outline"
                              }
                              className="cursor-pointer"
                              onClick={() => toggleJornada(index, jornada.nombre)}
                            >
                              {jornada.nombre}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                    {(!formData.sedes.crear || formData.sedes.crear.length === 0) && (
                      <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No hay sedes agregadas</p>
                        <Button onClick={agregarSede}>
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Primera Sede
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* PASO 5: Resumen */}
            {step === "resumen" && (
              <div className="space-y-6">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Revise la información antes de crear el rector
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
                {formData.informacionAcademica && (
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
                )}

                {/* Resumen Institución */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building2 className="h-5 w-5 mr-2" />
                      Institución
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <div>
                      <strong>Nombre:</strong> {formData.institucion.nombre}
                    </div>
                    <div className="mt-2">
                      <strong>Fecha de Asignación:</strong> {formData.fechaAsignacion}
                    </div>
                  </CardContent>
                </Card>

                {/* Resumen Sedes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Sedes ({formData.sedes.crear?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {formData.sedes.crear?.map((sede, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <p className="font-semibold">{sede.nombre}</p>
                        <p className="text-sm text-gray-600">{sede.direccion}</p>
                        <p className="text-sm text-gray-600">
                          Zona: <Badge variant="outline">{sede.zona}</Badge>
                        </p>
                        {sede.codigo_DANE && (
                          <p className="text-sm text-gray-600">DANE: {sede.codigo_DANE}</p>
                        )}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {sede.jornadas?.map((jornada) => (
                            <Badge key={jornada} variant="secondary" className="text-xs">
                              {jornada}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
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
            <Link href="/dashboard/rectores">
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
                    Crear Rector Completo
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
