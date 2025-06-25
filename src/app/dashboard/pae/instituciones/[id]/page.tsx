"use client"

import { useParams } from "next/navigation"
import { Building, Users, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useInstitutionStore } from "@/lib/instituition-store"
import { usePAEStore } from "@/lib/pae-store"
import { useStudentStore } from "@/lib/student-store"
import Link from "next/link"

export default function InstitucionPAEDetailPage() {
  const params = useParams()
  const institutionId = params.id as string
  const { getInstitution } = useInstitutionStore()
  const { getBeneficiosByInstitution } = usePAEStore()
  const { getStudent } = useStudentStore()
  const institution = getInstitution(institutionId)
  const beneficios = getBeneficiosByInstitution(institutionId)
  const beneficiosAsignados = beneficios.filter(b => b.estudianteId)
  const beneficiosDisponibles = beneficios.filter(b => !b.estudianteId)
  
  if (!institution) {
    return (
      <div className="container mx-auto py-6 px-4">
        <p>Institución no encontrada</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Cupos PAE - {institution.nombre}</h1>
          <p className="text-gray-600">{institution.direccion}</p>
        </div>
        <Link href={`/dashboard/rectores/${institution.rector}/pae`}>
          <Button variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Gestionar con rector
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Cupos</CardTitle>
            <Building className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{beneficios.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Asignados</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{beneficiosAsignados.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{beneficiosDisponibles.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cupos Asignados */}
        <Card>
          <CardHeader>
            <CardTitle>Beneficiarios Activos</CardTitle>
          </CardHeader>
          <CardContent>
            {beneficiosAsignados.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay beneficiarios activos</p>
            ) : (
              <div className="space-y-3">
                {beneficiosAsignados.map(beneficio => {
                  const estudiante = getStudent(beneficio.estudianteId)
                  
                  return (
                    <div key={beneficio.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">
                            {estudiante?.nombreCompleto || "Estudiante no encontrado"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Grado: {estudiante?.gradoSolicitado || "N/A"}
                          </p>
                        </div>
                        <Badge className="capitalize">
                          {beneficio.tipoBeneficio}
                        </Badge>
                      </div>
                      <div className="mt-2 text-sm">
                        <p>Vence: {new Date(beneficio.fechaVencimiento).toLocaleDateString()}</p>
                        <p>Estado: 
                          <Badge variant={
                            beneficio.estado === "Activo" ? "default" : 
                            beneficio.estado === "Vencido" ? "destructive" : "secondary"
                          } className="ml-2">
                            {beneficio.estado}
                          </Badge>
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Cupos Disponibles */}
        <Card>
          <CardHeader>
            <CardTitle>Cupos Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            {beneficiosDisponibles.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay cupos disponibles</p>
            ) : (
              <div className="space-y-3">
                {beneficiosDisponibles.map(beneficio => (
                  <div key={beneficio.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">Cupo disponible</h3>
                        <p className="text-sm text-gray-600">
                          ID: {beneficio.id}
                        </p>
                      </div>
                      <Badge className="capitalize">
                        {beneficio.tipoBeneficio}
                      </Badge>
                    </div>
                    <div className="mt-2 text-sm">
                      <p>Vence: {new Date(beneficio.fechaVencimiento).toLocaleDateString()}</p>
                      <p>Estado: 
                        <Badge variant="secondary" className="ml-2">
                          Disponible
                        </Badge>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}