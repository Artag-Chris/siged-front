"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Check, X, User, } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useInstitutionStore } from "@/lib/instituition-store"
import { useRectorStore } from "@/lib/principals-store"
import { useStudentStore } from "@/lib/student-store"
import { usePAEStore } from "@/lib/pae-store"
import { PAEFormData, Student } from "@/interfaces"

export default function PAEManagementPage() {
    const params = useParams()
    const rectorId = params.id as string
    const { getRector } = useRectorStore()
    const { getInstitution } = useInstitutionStore()
    const { getStudentsByInstitution, assignPAE, removePAE } = useStudentStore()
    const { beneficios, addBeneficio, deleteBeneficio } = usePAEStore()
    const [rector, setRector] = useState<any>(null)
    const [institution, setInstitution] = useState<any>(null)
    const [institutionStudents, setInstitutionStudents] = useState<Student[]>([])
    const [paeBeneficiaries, setPaeBeneficiaries] = useState<any[]>([])

    // Obtener información del rector e institución
    useEffect(() => {
        const rect = getRector(rectorId)
        if (rect) {
            setRector(rect)
            const inst = getInstitution(rect.institucionId)
            setInstitution(inst)
        }
    }, [rectorId, getRector, getInstitution])

    // Obtener estudiantes de la institución
    useEffect(() => {
        if (institution?.id) {
            const instStudents = getStudentsByInstitution(institution.id)
            setInstitutionStudents(instStudents)
        }
    }, [institution, getStudentsByInstitution])

    // Obtener beneficiarios PAE
    useEffect(() => {
        if (institution?.id) {
            const paeBeneficiaries = beneficios.filter(ben =>
                ben.institucionId === institution.id && ben.estado === "Activo"
            )
            setPaeBeneficiaries(paeBeneficiaries)
        }
    }, [institution, beneficios])

    // Asignar PAE a un estudiante
    const handleAssignPAE = async (studentId: string) => {
        if (!institution?.id) return

        // Crear nuevo beneficio PAE
        const newBeneficio: PAEFormData = {
            estudianteId: studentId,
            institucionId: institution.id,
            fechaAsignacion: new Date().toISOString(),
            fechaVencimiento: new Date(new Date().getFullYear(), 11, 31).toISOString(),
            estado: "Activo" as const,
            tipoBeneficio: "Completo" as const
        };

        try {
            // Guardar en store de PAE
            const beneficioId = await addBeneficio(newBeneficio)

            // Actualizar estudiante
            await assignPAE(studentId, beneficioId)

            // Actualizar lista de estudiantes
            const updatedStudents = getStudentsByInstitution(institution.id)
            setInstitutionStudents(updatedStudents)

            // Actualizar lista de beneficiarios
            const updatedBeneficiaries = [...paeBeneficiaries, {
                id: beneficioId,
                ...newBeneficio
            }]
            setPaeBeneficiaries(updatedBeneficiaries)
        } catch (error) {
            console.error("Error asignando PAE:", error)
        }
    }

    // Quitar PAE a un estudiante
    const handleRemovePAE = async (studentId: string, beneficioId: string) => {
        if (!institution?.id) return

        try {
            // Eliminar de store de PAE
            await deleteBeneficio(beneficioId)

            // Actualizar estudiante
            await removePAE(studentId)

            // Actualizar lista de estudiantes
            const updatedStudents = getStudentsByInstitution(institution.id)
            setInstitutionStudents(updatedStudents)

            // Actualizar lista de beneficiarios
            const updatedBeneficiaries = paeBeneficiaries.filter(b => b.id !== beneficioId)
            setPaeBeneficiaries(updatedBeneficiaries)
        } catch (error) {
            console.error("Error quitando PAE:", error)
        }
    }

    if (!rector || !institution) {
        return (
            <div className="container mx-auto py-6 px-4">
                <p>Cargando...</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <Link href={`/dashboard/rectores/${rectorId}`}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Volver al detalle
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Gestión de PAE - {institution.nombre}
                            </h1>
                            <p className="text-gray-600">Rector: {rector.nombres} {rector.apellidos}</p>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="font-medium">Cupos disponibles: {institutionStudents.length - paeBeneficiaries.length}</p>
                        <p className="text-sm">Total estudiantes: {institutionStudents.length}</p>
                        <p className="text-sm">Beneficiarios PAE: {paeBeneficiaries.length}</p>
                    </div>
                </div>

                {/* Lista de estudiantes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Estudiantes de la Institución</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {institutionStudents.length === 0 ? (
                            <p>No hay estudiantes asignados a esta institución.</p>
                        ) : (
                            <div className="space-y-4">
                                {institutionStudents.map((student) => {
                                    const hasPAE = paeBeneficiaries.some(b => b.estudianteId === student.id)
                                    const paeBeneficio = paeBeneficiaries.find(b => b.estudianteId === student.id)

                                    return (
                                        <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div>
                                                <h3 className="font-medium">{student.nombreCompleto}</h3>
                                                <p className="text-sm text-gray-600">
                                                    {student.tipoDocumento}: {student.numeroDocumento} - Grado: {student.gradoSolicitado}
                                                </p>
                                                <Badge variant={student.estado === "Activo" ? "default" : "secondary"} className="mt-1">
                                                    {student.estado}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                {hasPAE ? (
                                                    <>
                                                        <Badge className="bg-green-500">
                                                            <Check className="h-4 w-4 mr-1" />
                                                            Beneficiario PAE
                                                        </Badge>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleRemovePAE(student.id, paeBeneficio.id)}
                                                        >
                                                            <X className="h-4 w-4 mr-1" />
                                                            Quitar PAE
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleAssignPAE(student.id)}
                                                        disabled={student.estado !== "Activo"}
                                                    >
                                                        <User className="h-4 w-4 mr-1" />
                                                        Asignar PAE
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}