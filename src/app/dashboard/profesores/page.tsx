"use client"


import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Users } from "lucide-react"
import Link from "next/link"
import { useProfessorStore } from "@/lib/profesor-store"

export default function ProfesoresPage() {
  const { professors } = useProfessorStore()

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Profesores</h1>
            <p className="text-gray-600">Administra la información de los profesores</p>
          </div>
          <Link href="/dashboard/profesores/agregar">
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Agregar Profesor
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Profesores</p>
                  <p className="text-2xl font-bold text-gray-900">{professors.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profesores Activos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {professors.filter((p) => p.estado === "activa").length}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800">Activos</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profesores Inactivos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {professors.filter((p) => p.estado === "inactiva").length}
                  </p>
                </div>
                <Badge variant="secondary">Inactivos</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de profesores */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Profesores</CardTitle>
            <CardDescription>Información detallada de todos los profesores registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {professors.map((professor) => (
                <div key={professor.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {professor.nombres} {professor.apellidos}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {professor.cargo} • {professor.email}
                          </p>
                        </div>
                        <Badge variant={professor.estado === "activa" ? "default" : "secondary"}>
                          {professor.estado}
                        </Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {professor.materiasAsignadas.slice(0, 3).map((materia) => (
                          <Badge key={materia} variant="outline" className="text-xs">
                            {materia}
                          </Badge>
                        ))}
                        {professor.materiasAsignadas.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{professor.materiasAsignadas.length - 3} más
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Ver Detalles
                      </Button>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
