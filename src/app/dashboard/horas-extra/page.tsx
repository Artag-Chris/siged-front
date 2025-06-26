"use client"

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSuplenciaStore } from "@/lib/suplencia-store";
import { useInstitutionStore } from "@/lib/instituition-store";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useProfessorStore } from "@/lib/profesor-store";
import { SuplenciaFormModal } from "./SuplenciaFormModal";

export default function HorasExtraPage() {
  const { suplencias, deleteSuplencia } = useSuplenciaStore();
  const { institutions } = useInstitutionStore();
  const { professors } = useProfessorStore(); // Cambiado de teachers a professors
  const [modalOpen, setModalOpen] = useState(false);

  // Función para obtener el nombre del docente por ID
  const getProfessorName = (id: string) => {
    const professor = professors.find(p => p.id === id);
    return professor ? `${professor.nombres} ${professor.apellidos}` : "Desconocido";
  };

  // Función para obtener el nombre de la institución por ID
  const getInstitutionName = (id: string) => {
    const institution = institutions.find(i => i.id === id);
    return institution ? institution.nombre : "Desconocida";
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta suplencia?")) {
      await deleteSuplencia(id);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Horas Extra/Suplencias</h1>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Suplencia
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registro de Suplencias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Docente Ausente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Ausencia</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Ausencia</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institución</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Docente Reemplazo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha(s) Reemplazo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horas Cubiertas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jornada</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concepto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Soportes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {suplencias.map((sup, index) => (
                  <tr key={sup.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getProfessorName(sup.docenteAusenteId)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{sup.tipoAusencia}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {format(new Date(sup.fechaInicioAusencia), "dd/MM/yyyy", { locale: es })} - 
                      {format(new Date(sup.fechaFinAusencia), "dd/MM/yyyy", { locale: es })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getInstitutionName(sup.institucionId)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getProfessorName(sup.docenteReemplazoId)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {format(new Date(sup.fechaInicioReemplazo), "dd/MM/yyyy", { locale: es })} - 
                      {format(new Date(sup.fechaFinReemplazo), "dd/MM/yyyy", { locale: es })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{sup.horasCubiertas} h</td>
                    <td className="px-6 py-4 whitespace-nowrap">{sup.jornada}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{sup.concepto}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {sup.soporteIncapacidad && (
                          <a
                            href={URL.createObjectURL(sup.soporteIncapacidad)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            Incapacidad
                          </a>
                        )}
                        {sup.soporteHoras && (
                          <a
                            href={URL.createObjectURL(sup.soporteHoras)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            Horas
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(sup.id)}>
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <SuplenciaFormModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}