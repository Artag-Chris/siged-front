"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, 
  Search, 
  User, 
  Mail, 
  Phone, 
  GraduationCap,
  BookOpen
} from "lucide-react"
import Link from "next/link"
import { useInstitutionStore } from "@/lib/instituition-store"
import { useProfessorStore } from "@/lib/profesor-store"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function InstitutionProfessorsPage() {
  const params = useParams()
  const institutionId = params.id as string
  const [searchTerm, setSearchTerm] = useState("")

  const { getInstitution } = useInstitutionStore()
  const { professors, displayOptions } = useProfessorStore()
  const institution = getInstitution(institutionId)

  // Filtrar profesores por institución y término de búsqueda
  const institutionProfessors = professors.filter((professor) => {
    const searchMatch = 
      professor.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.cedula.includes(searchTerm)
    
    return searchMatch
  })

  if (!institution) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <AlertDescription>Institución no encontrada</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header con navegación */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href={`/dashboard/instituciones/${institutionId}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profesores</h1>
              <p className="text-gray-600">{institution.nombre}</p>
            </div>
          </div>
          <Link href="/dashboard/profesores/nuevo">
            <Button>
              <User className="h-4 w-4 mr-2" />
              Agregar Profesor
            </Button>
          </Link>
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre o documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Grid de profesores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {institutionProfessors.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No hay profesores registrados</h3>
              <p className="text-gray-500">Esta institución aún no tiene profesores asignados.</p>
            </div>
          ) : (
            institutionProfessors.map((professor) => (
              <Card key={professor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {professor.nombres} {professor.apellidos}
                    </CardTitle>
                    <Badge variant={professor.estado === "activa" ? "default" : "secondary"}>
                      {professor.estado}
                    </Badge>
                  </div>
                  <CardDescription>{professor.cargo}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {displayOptions.mostrarCedulas && (
                    <div className="flex items-center text-sm">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      <span>CC: {professor.cedula}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{professor.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{professor.telefono}</span>
                  </div>
                  {displayOptions.mostrarMaterias && (
                    <div className="flex items-start text-sm">
                      <BookOpen className="h-4 w-4 mr-2 text-gray-500 mt-1" />
                      <div>
                        <p className="font-medium mb-1">Materias:</p>
                        <div className="flex flex-wrap gap-1">
                          {professor.materias.map((materia) => (
                            <Badge key={materia} variant="outline" className="text-xs">
                              {materia}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="pt-4">
                    <Link href={`/dashboard/profesores/${professor.id}`}>
                      <Button variant="outline" className="w-full">
                        Ver Perfil Completo
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}