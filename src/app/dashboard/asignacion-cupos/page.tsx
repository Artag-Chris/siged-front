"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Search, CalendarIcon, School, User, CheckCircle, AlertCircle } from "lucide-react"
import { useInstitutionStore } from "@/lib/instituition-store"
import { GRUPOS_DISPONIBLES, MODALIDADES_ASIGNACION } from "@/dummyData"
import { useGradeStore } from "@/lib/grade-store"
import { useStudentStore } from "@/lib/student-store"
import { GRADOS_DISPONIBLES, ESTADOS_ESTUDIANTE } from "@/dummyData/dummyStudents/dummyStudents"
import { getEstadoColor, getGradoLabel, getJornadaLabel, handleAssignQuota } from "@/funtions/grade&Assigment"

export default function AsignacionCuposPage() {

  // Estados para la búsqueda de estudiantes
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstado, setFilterEstado] = useState<string>("Pendiente")
  const [filterGrado, setFilterGrado] = useState<string>("todos")

  // Estados para la asignación de cupos
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [selectedInstitution, setSelectedInstitution] = useState<string>("")
  const [selectedGrado, setSelectedGrado] = useState<string>("")
  const [selectedJornada, setSelectedJornada] = useState<string>("")
  const [selectedGrupo, setSelectedGrupo] = useState<string>("")
  const [selectedModalidad, setSelectedModalidad] = useState<string>("nueva_matricula")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [observaciones, setObservaciones] = useState<string>("")

  // Estados para alertas y carga
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Obtener datos de las stores
  const { students, assignInstitution } = useStudentStore()
  const { institutions } = useInstitutionStore()
  const { getGradeQuotasByInstitution, assignQuota, getAvailableQuotas } = useGradeStore()

  // Estado para almacenar los cupos disponibles por institución
  const [availableQuotas, setAvailableQuotas] = useState<any[]>([])

  // Filtrar estudiantes según los criterios de búsqueda
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.numeroDocumento.includes(searchTerm)

      const matchesEstado = filterEstado === "todos" || student.estado === filterEstado
      const matchesGrado = filterGrado === "todos" || student.gradoSolicitado === filterGrado

      return matchesSearch && matchesEstado && matchesGrado
    })
  }, [students, searchTerm, filterEstado, filterGrado])

  // Filtrar instituciones activas
  const activeInstitutions = useMemo(() => {
    return institutions.filter((institution:any) => institution.activa)
  }, [institutions])

  // Cargar cupos disponibles cuando se selecciona una institución
  useEffect(() => {
  if (selectedInstitution) {
    const quotas = getGradeQuotasByInstitution(selectedInstitution, new Date().getFullYear())
    setAvailableQuotas(quotas)
  }
}, [selectedInstitution, getGradeQuotasByInstitution])

  // Obtener jornadas disponibles para el grado seleccionado
  const availableJornadas = useMemo(() => {
  if (!selectedGrado || !selectedInstitution) return []

  return availableQuotas
    .filter((quota) => quota.grado === selectedGrado)
    .map((quota) => ({
      value: quota.jornada,
      label: getJornadaLabel(quota.jornada),
      available: quota.cuposTotales - quota.cuposAsignados,
    }))
}, [selectedGrado, selectedInstitution, availableQuotas])

  // Obtener cupos disponibles para la combinación seleccionada
  const currentAvailableQuotas = useMemo(() => {
    if (!selectedInstitution || !selectedGrado || !selectedJornada) return 0

    return getAvailableQuotas(selectedInstitution, selectedGrado, selectedJornada, new Date().getFullYear())
  }, [selectedInstitution, selectedGrado, selectedJornada, getAvailableQuotas])

  // Función para seleccionar un estudiante
  const handleSelectStudent = (student: any) => {
    setSelectedStudent(student)
    setSelectedGrado(student.gradoSolicitado)
    setError("")
    setSuccess("")
  }

   const resetForm = () => {
    setSelectedStudent(null)
    setSelectedInstitution("")
    setSelectedGrado("")
    setSelectedJornada("")
    setSelectedGrupo("")
    setSelectedModalidad("nueva_matricula")
    setObservaciones("")
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Asignación de Cupos</h1>
          <p className="text-gray-600">Asigne estudiantes a instituciones educativas</p>
        </div>

        {/* Alertas */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de búsqueda de estudiantes */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Buscar Estudiante</span>
                </CardTitle>
                <CardDescription>Seleccione un estudiante para asignar cupo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filtros de búsqueda */}
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por nombre o documento..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="filterEstado" className="text-xs">
                        Estado
                      </Label>
                      <Select value={filterEstado} onValueChange={setFilterEstado}>
                        <SelectTrigger id="filterEstado">
                          <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos</SelectItem>
                          {ESTADOS_ESTUDIANTE.map((estado) => (
                            <SelectItem key={estado.value} value={estado.value}>
                              {estado.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="filterGrado" className="text-xs">
                        Grado
                      </Label>
                      <Select value={filterGrado} onValueChange={setFilterGrado}>
                        <SelectTrigger id="filterGrado">
                          <SelectValue placeholder="Grado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos</SelectItem>
                          {GRADOS_DISPONIBLES.map((grado) => (
                            <SelectItem key={grado.value} value={grado.value}>
                              {grado.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Lista de estudiantes */}
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {filteredStudents.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No se encontraron estudiantes</p>
                    </div>
                  ) : (
                    filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedStudent?.id === student.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleSelectStudent(student)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{student.nombreCompleto}</p>
                            <p className="text-xs text-gray-600">
                              {student.tipoDocumento}: {student.numeroDocumento}
                            </p>
                            <p className="text-xs text-gray-600">
                              Grado solicitado: {getGradoLabel(student.gradoSolicitado,GRADOS_DISPONIBLES)}
                            </p>
                          </div>
                          <Badge className={getEstadoColor(student.estado)}>{student.estado}</Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panel de asignación de cupo */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <School className="h-5 w-5" />
                  <span>Asignar Cupo</span>
                </CardTitle>
                <CardDescription>Complete la información para asignar un cupo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Información del estudiante seleccionado */}
                {selectedStudent ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-800">Estudiante Seleccionado</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      <div>
                        <p className="text-sm font-medium">Nombre completo:</p>
                        <p className="text-sm">{selectedStudent.nombreCompleto}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Documento:</p>
                        <p className="text-sm">
                          {selectedStudent.tipoDocumento} {selectedStudent.numeroDocumento}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Grado solicitado:</p>
                        <p className="text-sm">{getGradoLabel(selectedStudent.gradoSolicitado,GRADOS_DISPONIBLES)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Acudiente:</p>
                        <p className="text-sm">{selectedStudent.nombreAcudiente}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <p className="text-gray-500">Seleccione un estudiante para continuar</p>
                  </div>
                )}

                {/* Formulario de asignación */}
                <div className="space-y-4">
                  {/* Institución */}
                  <div>
                    <Label htmlFor="institucion">Institución Educativa *</Label>
                    <Select
                      value={selectedInstitution}
                      onValueChange={setSelectedInstitution}
                      disabled={!selectedStudent}
                    >
                      <SelectTrigger id="institucion">
                        <SelectValue placeholder="Seleccione una institución" />
                      </SelectTrigger>
                      <SelectContent>
                        {activeInstitutions.map((institution:any) => (
                          <SelectItem key={institution.id} value={institution.id}>
                            {institution.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Grado */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="grado">Grado *</Label>
                      <Select value={selectedGrado} onValueChange={setSelectedGrado} disabled={!selectedInstitution}>
                        <SelectTrigger id="grado">
                          <SelectValue placeholder="Seleccione un grado" />
                        </SelectTrigger>
                        <SelectContent>
                          {GRADOS_DISPONIBLES.map((grado) => (
                            <SelectItem key={grado.value} value={grado.value}>
                              {grado.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Jornada */}
                    <div>
                      <Label htmlFor="jornada">Jornada *</Label>
                      <Select
                        value={selectedJornada}
                        onValueChange={setSelectedJornada}
                        disabled={!selectedGrado || availableJornadas.length === 0}
                      >
                        <SelectTrigger id="jornada">
                          <SelectValue placeholder="Seleccione una jornada" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableJornadas.map((jornada) => (
                            <SelectItem key={jornada.value} value={jornada.value} disabled={jornada.available <= 0}>
                              {jornada.label} ({jornada.available} cupos)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Grupo y Modalidad */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Grupo */}
                    <div>
                      <Label htmlFor="grupo">Grupo (opcional)</Label>
                      <Select value={selectedGrupo} onValueChange={setSelectedGrupo} disabled={!selectedJornada}>
                        <SelectTrigger id="grupo">
                          <SelectValue placeholder="Seleccione un grupo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ninguno">Sin grupo</SelectItem>
                          {GRUPOS_DISPONIBLES.map((grupo) => (
                            <SelectItem key={grupo} value={grupo}>
                              {grupo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Modalidad de asignación */}
                    <div>
                      <Label htmlFor="modalidad">Modalidad de Asignación *</Label>
                      <Select
                        value={selectedModalidad}
                        onValueChange={setSelectedModalidad}
                        disabled={!selectedJornada}
                      >
                        <SelectTrigger id="modalidad">
                          <SelectValue placeholder="Seleccione una modalidad" />
                        </SelectTrigger>
                        <SelectContent>
                          {MODALIDADES_ASIGNACION.map((modalidad) => (
                            <SelectItem key={modalidad.value} value={modalidad.value}>
                              {modalidad.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Fecha de asignación */}
                  <div>
                    <Label htmlFor="fecha">Fecha de Asignación *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          disabled={!selectedJornada}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? (
                            format(selectedDate, "PPP", { locale: es })
                          ) : (
                            <span>Seleccione una fecha</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => date && setSelectedDate(date)}
                          initialFocus
                          locale={es}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Observaciones */}
                  <div>
                    <Label htmlFor="observaciones">Observaciones</Label>
                    <Input
                      id="observaciones"
                      value={observaciones}
                      onChange={(e) => setObservaciones(e.target.value)}
                      placeholder="Observaciones adicionales"
                      disabled={!selectedJornada}
                    />
                  </div>
                </div>

                {/* Información de cupos disponibles */}
                {selectedInstitution && selectedGrado && selectedJornada && (
                  <div
                    className={`p-3 rounded-lg ${
                      currentAvailableQuotas > 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                    } border`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        Cupos disponibles para {getGradoLabel(selectedGrado,GRADOS_DISPONIBLES)} - {getJornadaLabel(selectedJornada)}:
                      </p>
                      <Badge variant={currentAvailableQuotas > 0 ? "default" : "destructive"}>
                        {currentAvailableQuotas}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  onClick={()=>handleAssignQuota({
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
      assignInstitution: (studentId, institutionId, date, status) =>
        assignInstitution(studentId, institutionId, date, status as "Activo" | "Retirado" | "Trasladado" | "Pendiente"),
      setError,
      setSuccess,
      setIsSubmitting,
      resetForm,
    })}
                  disabled={
                    !selectedStudent ||
                    !selectedInstitution ||
                    !selectedGrado ||
                    !selectedJornada ||
                    !selectedModalidad ||
                    currentAvailableQuotas <= 0 ||
                    isSubmitting
                  }
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Asignando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Asignar Cupo
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
