"use client"

import { useState, useMemo } from "react"

import { useGradeStore } from "@/lib/grade-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Users, School, TrendingUp, TrendingDown, Download, Filter } from "lucide-react"
import { useInstitutionStore } from "@/lib/instituition-store"
import { useStudentStore } from "@/lib/student-store"
import { GRADOS_DISPONIBLES, ESTADOS_ESTUDIANTE } from "@/dummyData"

export default function ReportesPage() {
  const { students } = useStudentStore()
  const { institutions } = useInstitutionStore()
  const { getAllQuotaAssignments, getAllGradeQuotas } = useGradeStore()

  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())
  const [selectedInstitution, setSelectedInstitution] = useState<string>("todas")

  // Obtener datos para reportes
  const assignments = getAllQuotaAssignments()
  const gradeQuotas = getAllGradeQuotas()

  // Filtrar datos por año y institución
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const yearMatch =
        !student.fechaAsignacion || new Date(student.fechaAsignacion).getFullYear().toString() === selectedYear
      const institutionMatch = selectedInstitution === "todas" || student.institucionAsignada === selectedInstitution
      return yearMatch && institutionMatch
    })
  }, [students, selectedYear, selectedInstitution])

  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment:any) => {
      const yearMatch = new Date(assignment.fechaAsignacion).getFullYear().toString() === selectedYear
      const institutionMatch = selectedInstitution === "todas" || assignment.institucionId === selectedInstitution
      return yearMatch && institutionMatch
    })
  }, [assignments, selectedYear, selectedInstitution])

  // Estadísticas generales
  const generalStats = useMemo(() => {
    const totalStudents = filteredStudents.length
    const activeStudents = filteredStudents.filter((s) => s.estado === "Activo").length
    const pendingStudents = filteredStudents.filter((s) => s.estado === "Pendiente").length
    const assignedStudents = filteredStudents.filter((s) => s.institucionAsignada).length

    const totalQuotas = gradeQuotas.reduce((sum:any, quota:any) => sum + quota.cuposTotales, 0)
    const assignedQuotas = gradeQuotas.reduce((sum:any, quota:any) => sum + quota.cuposAsignados, 0)
    const availableQuotas = totalQuotas - assignedQuotas

    return {
      totalStudents,
      activeStudents,
      pendingStudents,
      assignedStudents,
      totalQuotas,
      assignedQuotas,
      availableQuotas,
      occupancyRate: totalQuotas > 0 ? (assignedQuotas / totalQuotas) * 100 : 0,
      assignmentRate: totalStudents > 0 ? (assignedStudents / totalStudents) * 100 : 0,
    }
  }, [filteredStudents, gradeQuotas])

  // Datos para gráficos
  const studentsByGrade = useMemo(() => {
    const gradeCount = GRADOS_DISPONIBLES.map((grado:any) => ({
      grado: grado.label,
      estudiantes: filteredStudents.filter((s) => s.gradoSolicitado === grado.value).length,
    }))
    return gradeCount.filter((item:any) => item.estudiantes > 0)
  }, [filteredStudents])

  const studentsByStatus = useMemo(() => {
    return ESTADOS_ESTUDIANTE.map((estado:any) => ({
      estado: estado.label,
      cantidad: filteredStudents.filter((s) => s.estado === estado.value).length,
      color: getStatusColor(estado.value),
    })).filter((item:any) => item.cantidad > 0)
  }, [filteredStudents])

  const quotasByInstitution = useMemo(() => {
    const institutionData = institutions.map((institution:any) => {
      const institutionQuotas = gradeQuotas.filter((q:any) => q.institucionId === institution.id)
      const total = institutionQuotas.reduce((sum:any, q:any) => sum + q.cuposTotales, 0)
      const assigned = institutionQuotas.reduce((sum:any, q:any) => sum + q.cuposAsignados, 0)

      return {
        nombre: institution.nombre,
        total,
        asignados: assigned,
        disponibles: total - assigned,
        ocupacion: total > 0 ? (assigned / total) * 100 : 0,
      }
    })
    return institutionData.filter((item:any) => item.total > 0)
  }, [institutions, gradeQuotas])

  const monthlyAssignments = useMemo(() => {
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      mes: new Date(0, i).toLocaleDateString("es", { month: "short" }),
      asignaciones: 0,
    }))

    filteredAssignments.forEach((assignment:any) => {
      const month = new Date(assignment.fechaAsignacion).getMonth()
      monthlyData[month].asignaciones++
    })

    return monthlyData
  }, [filteredAssignments])

  function getStatusColor(status: string) {
    const colors: Record<string, string> = {
      Activo: "#10b981",
      Pendiente: "#f59e0b",
      Trasladado: "#3b82f6",
      Retirado: "#ef4444",
    }
    return colors[status] || "#6b7280"
  }

  const exportData = () => {
    // Implementar exportación de datos
    console.log("Exportando datos...")
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reportes y Analytics</h1>
            <p className="text-gray-600">Análisis detallado del sistema educativo</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filtros</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Año Académico</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un año" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Institución</label>
                <Select value={selectedInstitution} onValueChange={setSelectedInstitution}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una institución" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las instituciones</SelectItem>
                    {institutions.map((institution:any) => (
                      <SelectItem key={institution.id} value={institution.id}>
                        {institution.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="estudiantes">Estudiantes</TabsTrigger>
            <TabsTrigger value="cupos">Cupos</TabsTrigger>
            <TabsTrigger value="instituciones">Instituciones</TabsTrigger>
          </TabsList>

          {/* Tab General */}
          <TabsContent value="general" className="space-y-6">
            {/* Métricas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Estudiantes</p>
                      <p className="text-2xl font-bold text-gray-900">{generalStats.totalStudents}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      {generalStats.assignmentRate.toFixed(1)}% asignados
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Cupos Totales</p>
                      <p className="text-2xl font-bold text-gray-900">{generalStats.totalQuotas}</p>
                    </div>
                    <School className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      {generalStats.occupancyRate.toFixed(1)}% ocupación
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Estudiantes Activos</p>
                      <p className="text-2xl font-bold text-green-600">{generalStats.activeStudents}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pendientes</p>
                      <p className="text-2xl font-bold text-yellow-600">{generalStats.pendingStudents}</p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gráfico de asignaciones mensuales */}
            <Card>
              <CardHeader>
                <CardTitle>Asignaciones por Mes</CardTitle>
                <CardDescription>Tendencia de asignaciones durante el año {selectedYear}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyAssignments}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="asignaciones" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Estudiantes */}
          <TabsContent value="estudiantes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Estudiantes por grado */}
              <Card>
                <CardHeader>
                  <CardTitle>Estudiantes por Grado</CardTitle>
                  <CardDescription>Distribución de estudiantes según el grado solicitado</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={studentsByGrade}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="grado" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="estudiantes" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Estudiantes por estado */}
              <Card>
                <CardHeader>
                  <CardTitle>Estudiantes por Estado</CardTitle>
                  <CardDescription>Distribución según el estado actual</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={studentsByStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ estado, cantidad }:any) => `${estado}: ${cantidad}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="cantidad"
                      >
                        {studentsByStatus.map((entry:any, index:any) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab Cupos */}
          <TabsContent value="cupos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ocupación de Cupos por Institución</CardTitle>
                <CardDescription>Análisis de la ocupación de cupos en cada institución</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quotasByInstitution.map((institution:any) => (
                    <div key={institution.nombre} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-gray-900">{institution.nombre}</h3>
                        <div className="text-sm text-gray-600">
                          {institution.asignados}/{institution.total} ({institution.ocupacion.toFixed(1)}%)
                        </div>
                      </div>
                      <Progress value={institution.ocupacion} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Asignados: {institution.asignados}</span>
                        <span>Disponibles: {institution.disponibles}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Instituciones */}
          <TabsContent value="instituciones" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {institutions.map((institution:any) => {
                const institutionQuotas = gradeQuotas.filter((q:any) => q.institucionId === institution.id)
                const totalQuotas = institutionQuotas.reduce((sum:any, q:any) => sum + q.cuposTotales, 0)
                const assignedQuotas = institutionQuotas.reduce((sum:any, q:any) => sum + q.cuposAsignados, 0)
                const institutionStudents = filteredStudents.filter((s) => s.institucionAsignada === institution.id)

                return (
                  <Card key={institution.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{institution.nombre}</CardTitle>
                      <CardDescription>{institution.direccion}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Estudiantes:</span>
                          <Badge variant="outline">{institutionStudents.length}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Cupos totales:</span>
                          <Badge variant="outline">{totalQuotas}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Cupos asignados:</span>
                          <Badge variant="outline">{assignedQuotas}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Ocupación:</span>
                          <Badge
                            variant={totalQuotas > 0 && assignedQuotas / totalQuotas > 0.8 ? "destructive" : "default"}
                          >
                            {totalQuotas > 0 ? ((assignedQuotas / totalQuotas) * 100).toFixed(1) : 0}%
                          </Badge>
                        </div>
                        <Progress value={totalQuotas > 0 ? (assignedQuotas / totalQuotas) * 100 : 0} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
