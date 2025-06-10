"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGradeStore } from "@/lib/grade-store"
import { useInstitutionStore } from "@/lib/instituition-store"
import { Badge } from "@/components/ui/badge"

export default function InstitucionCuposPage() {
  const params = useParams()
  const institutionId = params.id as string

  const { getInstitution } = useInstitutionStore()
  const { getGradeQuotasByInstitution } = useGradeStore()

  const institution = getInstitution(institutionId)
  const institutionQuotas = getGradeQuotasByInstitution(institutionId, new Date().getFullYear())

  if (!institution) {
    return (
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold text-red-600">Institución no encontrada</h1>
      </div>
    )
  }

  // Agrupar cupos por grado
  const quotasByGrade = institutionQuotas.reduce((acc, quota) => {
    if (!acc[quota.grado]) {
      acc[quota.grado] = []
    }
    acc[quota.grado].push(quota)
    return acc
  }, {} as Record<string, typeof institutionQuotas>)

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cupos Disponibles</h1>
        <p className="text-gray-600">{institution.nombre}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(quotasByGrade).map(([grado, quotas]) => (
          <Card key={grado}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Grado {grado}</span>
                <Badge variant="outline">
                  {quotas.reduce((sum, q) => sum + (q.cuposTotales - q.cuposAsignados), 0)} cupos
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
                        Año escolar {quota.anioEscolar}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {quota.cuposTotales - quota.cuposAsignados}/{quota.cuposTotales}
                      </p>
                      <p className="text-sm text-gray-500">Disponibles</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}