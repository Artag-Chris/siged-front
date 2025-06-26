// page.tsx
"use client"

import { useState, useMemo } from "react"
import { useGradeStore } from "@/lib/grade-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { 
  Users, School, TrendingUp, TrendingDown, Filter, 
  Bus, Sandwich, Route, UserCog 
} from "lucide-react"
import { useInstitutionStore } from "@/lib/instituition-store"
import { useStudentStore } from "@/lib/student-store"
import { useConductorStore } from "@/lib/conductor-store"
import { usePAEStore } from "@/lib/pae-store"
import { useRutaStore } from "@/lib/ruta-store"
import { useSuplenciaStore } from "@/lib/suplencia-store"
import { GRADOS_DISPONIBLES, ESTADOS_ESTUDIANTE, TIPOS_BENEFICIO, TIPOS_AUSENCIA } from "@/dummyData"
import { getStatusColor } from "@/funtions"
import { ExportMenu } from "@/components/exportMenu"

export default function ReportesPage() {

  const { students } = useStudentStore()
  const { institutions } = useInstitutionStore()
  const { getAllQuotaAssignments, getAllGradeQuotas } = useGradeStore()
  const { conductores } = useConductorStore()
  const { beneficios } = usePAEStore()
  const { rutas } = useRutaStore()
  const { suplencias } = useSuplenciaStore()
  
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
    return assignments.filter((assignment: any) => {
      const yearMatch = new Date(assignment.fechaAsignacion).getFullYear().toString() === selectedYear
      const institutionMatch = selectedInstitution === "todas" || assignment.institucionId === selectedInstitution
      return yearMatch && institutionMatch
    })
  }, [assignments, selectedYear, selectedInstitution])

  const filteredConductores = useMemo(() => {
    return conductores.filter((conductor) => {
      const yearMatch = new Date(conductor.fechaIngreso).getFullYear().toString() === selectedYear
      // No aplicamos filtro de institución para conductores
      return yearMatch
    })
  }, [conductores, selectedYear])

  const filteredPAE = useMemo(() => {
    return beneficios.filter((beneficio) => {
      const yearMatch = new Date(beneficio.fechaAsignacion).getFullYear().toString() === selectedYear
      const institutionMatch = selectedInstitution === "todas" || beneficio.institucionId === selectedInstitution
      return yearMatch && institutionMatch
    })
  }, [beneficios, selectedYear, selectedInstitution])

  const filteredRutas = useMemo(() => {
    return rutas.filter((ruta) => {
      const yearMatch = new Date(ruta.fechaCreacion).getFullYear().toString() === selectedYear
      const institutionMatch = selectedInstitution === "todas" || ruta.institucionId === selectedInstitution
      return yearMatch && institutionMatch
    })
  }, [rutas, selectedYear, selectedInstitution])

  const filteredSuplencias = useMemo(() => {
    return suplencias.filter((suplencia) => {
      const yearMatch = new Date(suplencia.fechaInicioAusencia).getFullYear().toString() === selectedYear
      const institutionMatch = selectedInstitution === "todas" || suplencia.institucionId === selectedInstitution
      return yearMatch && institutionMatch
    })
  }, [suplencias, selectedYear, selectedInstitution])

  // Estadísticas generales
  const generalStats = useMemo(() => {
    const totalStudents = filteredStudents.length
    const activeStudents = filteredStudents.filter((s) => s.estado === "Activo").length
    const pendingStudents = filteredStudents.filter((s) => s.estado === "Pendiente").length
    const assignedStudents = filteredStudents.filter((s) => s.institucionAsignada).length

    const totalQuotas = gradeQuotas.reduce((sum: any, quota: any) => sum + quota.cuposTotales, 0)
    const assignedQuotas = gradeQuotas.reduce((sum: any, quota: any) => sum + quota.cuposAsignados, 0)
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
      totalConductores: filteredConductores.length,
      activeConductores: filteredConductores.filter(c => c.estado === "Activo").length,
      totalBeneficios: filteredPAE.length,
      activeBeneficios: filteredPAE.filter(b => b.estado === "Activo").length,
      totalRutas: filteredRutas.length,
      activeRutas: filteredRutas.filter(r => r.estado === "Activa").length,
      totalSuplencias: filteredSuplencias.length
    }
  }, [filteredStudents, gradeQuotas, filteredConductores, filteredPAE, filteredRutas, filteredSuplencias])

  // Datos para gráficos
  const studentsByGrade = useMemo(() => {
    const gradeCount = GRADOS_DISPONIBLES.map((grado: any) => ({
      grado: grado.label,
      estudiantes: filteredStudents.filter((s) => s.gradoSolicitado === grado.value).length,
    }))
    return gradeCount.filter((item: any) => item.estudiantes > 0)
  }, [filteredStudents])

  const studentsByStatus = useMemo(() => {
    return ESTADOS_ESTUDIANTE.map((estado: any) => ({
      estado: estado.label,
      cantidad: filteredStudents.filter((s) => s.estado === estado.value).length,
      color: getStatusColor(estado.value),
    })).filter((item: any) => item.cantidad > 0)
  }, [filteredStudents])

  const quotasByInstitution = useMemo(() => {
    const institutionData = institutions.map((institution: any) => {
      const institutionQuotas = gradeQuotas.filter((q: any) => q.institucionId === institution.id)
      const total = institutionQuotas.reduce((sum: any, q: any) => sum + q.cuposTotales, 0)
      const assigned = institutionQuotas.reduce((sum: any, q: any) => sum + q.cuposAsignados, 0)

      return {
        nombre: institution.nombre,
        total,
        asignados: assigned,
        disponibles: total - assigned,
        ocupacion: total > 0 ? (assigned / total) * 100 : 0,
      }
    })
    return institutionData.filter((item: any) => item.total > 0)
  }, [institutions, gradeQuotas])

  const monthlyAssignments = useMemo(() => {
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      mes: new Date(0, i).toLocaleDateString("es", { month: "short" }),
      asignaciones: 0,
    }))

    filteredAssignments.forEach((assignment: any) => {
      const month = new Date(assignment.fechaAsignacion).getMonth()
      monthlyData[month].asignaciones++
    })

    return monthlyData
  }, [filteredAssignments])

  // Nuevos datos para gráficos
  const conductoresByStatus = useMemo(() => {
    const statusCounts = filteredConductores.reduce((acc: Record<string, number>, conductor) => {
      acc[conductor.estado] = (acc[conductor.estado] || 0) + 1
      return acc
    }, {})

    return Object.entries(statusCounts).map(([estado, cantidad]) => ({
      estado,
      cantidad,
      color: getStatusColor(estado)
    }))
  }, [filteredConductores])

  const beneficiosByType = useMemo(() => {
    return TIPOS_BENEFICIO.map((tipo: any) => ({
      tipo: tipo.label,
      cantidad: filteredPAE.filter((b) => b.tipoBeneficio === tipo.value).length,
      color: tipo.color
    })).filter(item => item.cantidad > 0)
  }, [filteredPAE])

  const beneficiosByStatus = useMemo(() => {
    return filteredPAE.reduce((acc: Record<string, number>, beneficio) => {
      acc[beneficio.estado] = (acc[beneficio.estado] || 0) + 1
      return acc
    }, {})
  }, [filteredPAE])

  const rutasByEstado = useMemo(() => {
    return filteredRutas.reduce((acc: Record<string, number>, ruta) => {
      acc[ruta.estado] = (acc[ruta.estado] || 0) + 1
      return acc
    }, {})
  }, [filteredRutas])

  const suplenciasByType = useMemo(() => {
    return TIPOS_AUSENCIA.map((tipo: any) => ({
      tipo: tipo.label,
      cantidad: filteredSuplencias.filter((s) => s.tipoAusencia === tipo.value).length,
      color: tipo.color
    })).filter(item => item.cantidad > 0)
  }, [filteredSuplencias])

  const suplenciasByInstitution = useMemo(() => {
    const institutionCounts = filteredSuplencias.reduce((acc: Record<string, number>, suplencia) => {
      const institution = institutions.find(i => i.id === suplencia.institucionId)
      const name = institution ? institution.nombre : 'Desconocida'
      acc[name] = (acc[name] || 0) + 1
      return acc
    }, {})
    
    return Object.entries(institutionCounts).map(([nombre, cantidad]) => ({
      nombre,
      cantidad
    })).sort((a, b) => b.cantidad - a.cantidad).slice(0, 10)
  }, [filteredSuplencias, institutions])

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reportes y Analiticas</h1>
            <p className="text-gray-600">Análisis detallado del sistema educativo</p>
          </div>
          <div className="flex flex-wrap gap-2">
          <ExportMenu />
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
                    {institutions.map((institution: any) => (
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
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="estudiantes">Estudiantes</TabsTrigger>
            <TabsTrigger value="cupos">Cupos</TabsTrigger>
            <TabsTrigger value="instituciones">Instituciones</TabsTrigger>
            <TabsTrigger value="conductores">Conductores</TabsTrigger>
            <TabsTrigger value="pae">PAE</TabsTrigger>
            <TabsTrigger value="rutas">Rutas</TabsTrigger>
            <TabsTrigger value="suplencias">Suplencias</TabsTrigger>
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
                      <p className="text-sm font-medium text-gray-600">Conductores Activos</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {generalStats.activeConductores}/{generalStats.totalConductores}
                      </p>
                    </div>
                    <Bus className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Beneficios PAE</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {generalStats.activeBeneficios}/{generalStats.totalBeneficios}
                      </p>
                    </div>
                    <Sandwich className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Segunda fila de métricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Rutas Activas</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {generalStats.activeRutas}/{generalStats.totalRutas}
                      </p>
                    </div>
                    <Route className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Suplencias</p>
                      <p className="text-2xl font-bold text-gray-900">{generalStats.totalSuplencias}</p>
                    </div>
                    <UserCog className="h-8 w-8 text-red-600" />
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
                        label={({ estado, cantidad }: any) => `${estado}: ${cantidad}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="cantidad"
                      >
                        {studentsByStatus.map((entry: any, index: any) => (
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
                  {quotasByInstitution.map((institution: any) => (
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
              {institutions.map((institution: any) => {
                const institutionQuotas = gradeQuotas.filter((q: any) => q.institucionId === institution.id)
                const totalQuotas = institutionQuotas.reduce((sum: any, q: any) => sum + q.cuposTotales, 0)
                const assignedQuotas = institutionQuotas.reduce((sum: any, q: any) => sum + q.cuposAsignados, 0)
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
          
          {/* Tab Conductores */}
          <TabsContent value="conductores" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Conductores por estado */}
              <Card>
                <CardHeader>
                  <CardTitle>Conductores por Estado</CardTitle>
                  <CardDescription>Distribución de conductores según su estado actual</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={conductoresByStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ estado, cantidad }) => `${estado}: ${cantidad}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="cantidad"
                      >
                        {conductoresByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              {/* Licencias próximas a vencer */}
              <Card>
                <CardHeader>
                  <CardTitle>Licencias Próximas a Vencer</CardTitle>
                  <CardDescription>Conductores con licencias que expiran en los próximos 90 días</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredConductores
                      .filter(conductor => {
                        if (!conductor.fechaVencimientoLicencia) return false;
                        const expiration = new Date(conductor.fechaVencimientoLicencia);
                        const today = new Date();
                        const diffDays = Math.ceil((expiration.getTime() - today.getTime()) / (1000 * 3600 * 24));
                        return diffDays > 0 && diffDays <= 90;
                      })
                      .map(conductor => (
                        <div key={conductor.id} className="flex items-center justify-between p-3 border-b">
                          <div>
                            <p className="font-medium">{conductor.nombreCompleto}</p>
                            <p className="text-sm text-gray-600">
                              Licencia: {conductor.licenciaConducir}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            {new Date(conductor.fechaVencimientoLicencia).toLocaleDateString()}
                          </Badge>
                        </div>
                      ))}
                    
                    {filteredConductores.filter(conductor => {
                      if (!conductor.fechaVencimientoLicencia) return false;
                      const expiration = new Date(conductor.fechaVencimientoLicencia);
                      const today = new Date();
                      return expiration.getTime() < today.getTime();
                    }).length > 0 && (
                      <div className="mt-4">
                        <h3 className="font-medium text-red-600 mb-2">Licencias Vencidas</h3>
                        {filteredConductores
                          .filter(conductor => {
                            if (!conductor.fechaVencimientoLicencia) return false;
                            const expiration = new Date(conductor.fechaVencimientoLicencia);
                            const today = new Date();
                            return expiration.getTime() < today.getTime();
                          })
                          .map(conductor => (
                            <div key={conductor.id} className="flex items-center justify-between p-3 border-b">
                              <div>
                                <p className="font-medium">{conductor.nombreCompleto}</p>
                                <p className="text-sm text-gray-600">
                                  Licencia: {conductor.licenciaConducir}
                                </p>
                              </div>
                              <Badge variant="destructive">
                                {new Date(conductor.fechaVencimientoLicencia).toLocaleDateString()}
                              </Badge>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Tab PAE */}
          <TabsContent value="pae" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Beneficios por tipo */}
              <Card>
                <CardHeader>
                  <CardTitle>Beneficios por Tipo</CardTitle>
                  <CardDescription>Distribución de los tipos de beneficios PAE asignados</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={beneficiosByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ tipo, cantidad }) => `${tipo}: ${cantidad}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="cantidad"
                      >
                        {beneficiosByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              {/* Beneficios por estado */}
              <Card>
                <CardHeader>
                  <CardTitle>Beneficios por Estado</CardTitle>
                  <CardDescription>Distribución de beneficios según su estado actual</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={Object.entries(beneficiosByStatus).map(([estado, cantidad]) => ({ estado, cantidad }))}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="estado" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="cantidad" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            {/* Beneficios próximos a vencer */}
            <Card>
              <CardHeader>
                <CardTitle>Beneficios Próximos a Vencer</CardTitle>
                <CardDescription>Beneficios PAE que expiran en los próximos 30 días</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredPAE
                    .filter(beneficio => {
                      if (!beneficio.fechaVencimiento) return false;
                      const expiration = new Date(beneficio.fechaVencimiento);
                      const today = new Date();
                      const diffDays = Math.ceil((expiration.getTime() - today.getTime()) / (1000 * 3600 * 24));
                      return diffDays > 0 && diffDays <= 30;
                    })
                    .map(beneficio => {
                      const estudiante = students.find(s => s.id === beneficio.estudianteId);
                      const institucion = institutions.find(i => i.id === beneficio.institucionId);
                      
                      return (
                        <div key={beneficio.id} className="flex items-center justify-between p-3 border-b">
                          <div>
                            <p className="font-medium">{estudiante?.nombreCompleto || 'Estudiante no encontrado'}</p>
                            <p className="text-sm text-gray-600">
                              {institucion?.nombre || 'Institución no encontrada'} - {beneficio.tipoBeneficio}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            {new Date(beneficio.fechaVencimiento).toLocaleDateString()}
                          </Badge>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tab Rutas */}
          <TabsContent value="rutas" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Rutas por estado */}
              <Card>
                <CardHeader>
                  <CardTitle>Rutas por Estado</CardTitle>
                  <CardDescription>Distribución de rutas según su estado actual</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={Object.entries(rutasByEstado).map(([estado, cantidad]) => ({ estado, cantidad }))}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="estado" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="cantidad" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              {/* Cupos disponibles */}
              <Card>
                <CardHeader>
                  <CardTitle>Cupos Disponibles</CardTitle>
                  <CardDescription>Porcentaje de cupos disponibles en rutas activas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredRutas
                      .filter(ruta => ruta.estado === "Activa")
                      .map(ruta => {
                        const institucion = institutions.find(i => i.id === ruta.institucionId);
                        const porcentaje = ruta.cuposDisponibles > 0 ? 
                          Math.round((ruta.cuposDisponibles / (ruta.estudiantesAsignados.length + ruta.cuposDisponibles)) * 100) : 0;
                        
                        return (
                          <div key={ruta.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium text-gray-900">
                                {ruta.nombre} ({institucion?.nombre || 'N/A'})
                              </h3>
                              <div className="text-sm text-gray-600">
                                {ruta.cuposDisponibles}/{ruta.estudiantesAsignados.length + ruta.cuposDisponibles} 
                                ({porcentaje}%)
                              </div>
                            </div>
                            <Progress value={porcentaje} className="h-2" />
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Tab Suplencias */}
          <TabsContent value="suplencias" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Suplencias por tipo de ausencia */}
              <Card>
                <CardHeader>
                  <CardTitle>Suplencias por Tipo</CardTitle>
                  <CardDescription>Distribución según el motivo de la ausencia</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={suplenciasByType}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="tipo" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="cantidad" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              {/* Suplencias por institución */}
              <Card>
                <CardHeader>
                  <CardTitle>Suplencias por Institución</CardTitle>
                  <CardDescription>Instituciones con más suplencias registradas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={suplenciasByInstitution}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="nombre" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="cantidad" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            {/* Total horas cubiertas */}
            <Card>
              <CardHeader>
                <CardTitle>Horas Cubiertas</CardTitle>
                <CardDescription>Total de horas cubiertas por suplencias en el año</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-40">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-blue-600">
                      {filteredSuplencias.reduce((sum, s) => sum + s.horasCubiertas, 0)}
                    </p>
                    <p className="text-lg text-gray-600 mt-2">Horas de suplencia</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}