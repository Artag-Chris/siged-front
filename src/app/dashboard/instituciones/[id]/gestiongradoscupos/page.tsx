"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { useInstitutionStore } from "@/lib/instituition-store"
import { useGradeStore } from "@/lib/grade-store"
import { GRADOS_DISPONIBLES } from "@/dummyData"

export default function InstitucionCuposPage() {
  const params = useParams()
  const institutionId = params.id as string

  const { getInstitution } = useInstitutionStore()
  const { gradeQuotas, addGradeQuota, updateGradeQuota, deleteGradeQuota } = useGradeStore()
  const institution = getInstitution(institutionId)

  // Estado para el formulario de nuevo cupo
  const [isAddingQuota, setIsAddingQuota] = useState(false)
  const [newQuota, setNewQuota] = useState({
    grado: "",
    jornada: "",
    cuposTotales: 0,
    observaciones: ""
  })

  // Obtener cupos de la institución agrupados por grado
  const institutionQuotas = gradeQuotas.filter(quota => 
    quota.institucionId === institutionId && 
    quota.anioEscolar === new Date().getFullYear()
  )

  const quotasByGrade = institutionQuotas.reduce((acc, quota) => {
    if (!acc[quota.grado]) {
      acc[quota.grado] = []
    }
    acc[quota.grado].push(quota)
    return acc
  }, {} as Record<string, typeof institutionQuotas>)

  const handleAddQuota = async () => {
    if (!newQuota.grado || !newQuota.jornada || newQuota.cuposTotales <= 0) {
      return
    }

    await addGradeQuota({
      institucionId: institutionId,
      anioEscolar: new Date().getFullYear(),
      grado: newQuota.grado,
      jornada: newQuota.jornada as "mañana" | "tarde" | "unica" | "noche",
      cuposTotales: newQuota.cuposTotales,
      observaciones: newQuota.observaciones
    })

    setIsAddingQuota(false)
    setNewQuota({
      grado: "",
      jornada: "",
      cuposTotales: 0,
      observaciones: ""
    })
  }

  const handleUpdateQuota = async (quotaId: string, newTotal: number) => {
    await updateGradeQuota(quotaId, { cuposTotales: newTotal })
  }

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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href={`/dashboard/instituciones/${institutionId}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Cupos</h1>
              <p className="text-gray-600">{institution.nombre}</p>
            </div>
          </div>
          <Button onClick={() => setIsAddingQuota(true)} disabled={isAddingQuota}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Cupos
          </Button>
        </div>

        {/* Formulario para agregar cupos */}
        {isAddingQuota && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Agregar Nuevos Cupos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select
                  value={newQuota.grado}
                  onValueChange={(value) => setNewQuota({...newQuota, grado: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar grado" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADOS_DISPONIBLES.map((grado) => (
                      <SelectItem key={grado.value} value={grado.value}>
                        {grado.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={newQuota.jornada}
                  onValueChange={(value) => setNewQuota({...newQuota, jornada: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar jornada" />
                  </SelectTrigger>
                  <SelectContent>
                    {institution.jornadas.map((jornada) => (
                      <SelectItem key={jornada} value={jornada}>
                        {jornada.charAt(0).toUpperCase() + jornada.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  placeholder="Cupos totales"
                  value={newQuota.cuposTotales}
                  onChange={(e) => setNewQuota({...newQuota, cuposTotales: parseInt(e.target.value)})}
                  min={1}
                />

                <div className="flex space-x-2">
                  <Button onClick={handleAddQuota} className="flex-1">
                    Guardar
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddingQuota(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de cupos por grado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(quotasByGrade).map(([grado, quotas]) => (
            <Card key={grado} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Grado {grado}</span>
                  <Badge variant="outline">
                    {quotas.reduce((sum, q) => sum + (q.cuposTotales - q.cuposAsignados), 0)} disponibles
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quotas.map((quota) => (
                    <div
                      key={quota.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium capitalize">{quota.jornada}</p>
                        <p className="text-sm text-gray-500">
                          {quota.cuposAsignados} asignados
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={quota.cuposTotales}
                          onChange={(e) => handleUpdateQuota(quota.id, parseInt(e.target.value))}
                          className="w-20"
                          min={quota.cuposAsignados}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteGradeQuota(quota.id)}
                          disabled={quota.cuposAsignados > 0}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}