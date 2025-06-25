"use client"

import { useState } from "react"
import { Plus, Users, Building, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePAEStore } from "@/lib/pae-store"
import { useInstitutionStore } from "@/lib/instituition-store"
import { useStudentStore } from "@/lib/student-store"
import { AsignacionCuposModal } from "./asignacionCuposModal"
import { Badge } from "@/components/ui/badge"


export default function AdminPAEPage() {
  const { beneficios, getBeneficiosByInstitution } = usePAEStore()
  const { institutions } = useInstitutionStore()
 
  const [modalOpen, setModalOpen] = useState(false)
  
  // Obtener estadísticas
  const institucionesConPAE = institutions.filter(inst => {
    const beneficiosInst = getBeneficiosByInstitution(inst.id)
    return beneficiosInst.length > 0
  }).length

  const totalBeneficiarios = beneficios.length
  const activos = beneficios.filter(b => b.estado === "Activo").length
  const vencidos = beneficios.filter(b => b.estado === "Vencido").length

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión del Programa de Alimentación Escolar (PAE)</h1>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Asignar Cupos
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Instituciones con PAE</CardTitle>
            <Building className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{institucionesConPAE}</div>
            <p className="text-xs text-gray-500">de {institutions.length} instituciones</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Beneficiarios</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBeneficiarios}</div>
            <p className="text-xs text-gray-500">estudiantes beneficiados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activos}</div>
            <p className="text-xs text-gray-500">beneficios vigentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
            <FileText className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vencidos}</div>
            <p className="text-xs text-gray-500">beneficios vencidos</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para diferentes vistas */}
      <Tabs defaultValue="instituciones">
        <TabsList>
          <TabsTrigger value="instituciones">Instituciones</TabsTrigger>
          <TabsTrigger value="beneficiarios">Beneficiarios</TabsTrigger>
          <TabsTrigger value="solicitudes">Solicitudes</TabsTrigger>
        </TabsList>

        <TabsContent value="instituciones">
          <InstitucionesPAE />
        </TabsContent>

        <TabsContent value="beneficiarios">
          <BeneficiariosPAE />
        </TabsContent>

        <TabsContent value="solicitudes">
          <SolicitudesPAE />
        </TabsContent>
      </Tabs>

      <AsignacionCuposModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </div>
  )
}

function InstitucionesPAE() {
  const { institutions } = useInstitutionStore()
  const { getBeneficiosByInstitution } = usePAEStore()

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {institutions.map(institution => {
          const beneficios = getBeneficiosByInstitution(institution.id)
          const activos = beneficios.filter(b => b.estado === "Activo").length
          
          return (
            <Card key={institution.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{institution.nombre}</CardTitle>
                <p className="text-sm text-gray-600">{institution.direccion}</p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm">Cupos asignados: {beneficios.length}</p>
                    <p className="text-sm">Beneficiarios activos: {activos}</p>
                  </div>
                  <Link href={`/dashboard/pae/instituciones/${institution.id}`}>
                    <Button size="sm" variant="outline">
                      Ver detalle
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function BeneficiariosPAE() {
  const { beneficios } = usePAEStore()
  const { getStudent } = useStudentStore()
  const { getInstitution } = useInstitutionStore()

  return (
    <div className="mt-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estudiante</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institución</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Beneficio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vence</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {beneficios.map(beneficio => {
              const estudiante = getStudent(beneficio.estudianteId)
              const institucion = getInstitution(beneficio.institucionId)
              
              return (
                <tr key={beneficio.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {estudiante ? (
                      <div>
                        <div className="font-medium">{estudiante.nombreCompleto}</div>
                        <div className="text-sm text-gray-500">{estudiante.gradoSolicitado}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Estudiante no encontrado</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {institucion ? (
                      <div className="text-sm">{institucion.nombre}</div>
                    ) : (
                      <span className="text-gray-400">Institución no encontrada</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                    {beneficio.tipoBeneficio}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={
                      beneficio.estado === "Activo" ? "default" : 
                      beneficio.estado === "Vencido" ? "destructive" : "secondary"
                    }>
                      {beneficio.estado}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(beneficio.fechaVencimiento).toLocaleDateString()}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SolicitudesPAE() {
  // Implementar lógica para solicitudes pendientes
  return (
    <div className="mt-6">
      <p className="text-gray-600">Módulo de solicitudes pendientes de aprobación.</p>
    </div>
  )
}