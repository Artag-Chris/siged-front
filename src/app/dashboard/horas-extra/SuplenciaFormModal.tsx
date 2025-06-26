"use client"

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInstitutionStore } from "@/lib/instituition-store";
import { useSuplenciaStore } from "@/lib/suplencia-store";
import { SuplenciaFormData } from "@/interfaces/suplencia";
import { useProfessorStore } from "@/lib/profesor-store";

interface SuplenciaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SuplenciaFormModal({ isOpen, onClose }: SuplenciaFormModalProps) {
  const { institutions } = useInstitutionStore();
  const { professors } = useProfessorStore(); 
   const { currentSuplencia, addSuplencia, updateSuplencia, setCurrentSuplencia } = useSuplenciaStore();
  
  const [formData, setFormData] = useState<SuplenciaFormData>({
    docenteAusenteId: "",
    tipoAusencia: "Incapacidad EPS",
    fechaInicioAusencia: "",
    fechaFinAusencia: "",
    institucionId: "",
    docenteReemplazoId: "",
    fechaInicioReemplazo: "",
    fechaFinReemplazo: "",
    horasCubiertas: 0,
    jornada: "Mañana",
    concepto: "",
  });
  const incapacidadRef = useRef<HTMLInputElement>(null);
  const horasRef = useRef<HTMLInputElement>(null);
useEffect(() => {
    if (currentSuplencia) {
      setFormData({
        docenteAusenteId: currentSuplencia.docenteAusenteId,
        tipoAusencia: currentSuplencia.tipoAusencia,
        fechaInicioAusencia: currentSuplencia.fechaInicioAusencia,
        fechaFinAusencia: currentSuplencia.fechaFinAusencia,
        institucionId: currentSuplencia.institucionId,
        docenteReemplazoId: currentSuplencia.docenteReemplazoId,
        fechaInicioReemplazo: currentSuplencia.fechaInicioReemplazo,
        fechaFinReemplazo: currentSuplencia.fechaFinReemplazo,
        horasCubiertas: currentSuplencia.horasCubiertas,
        jornada: currentSuplencia.jornada,
        concepto: currentSuplencia.concepto,
        observaciones: currentSuplencia.observaciones,
      });
    } else {
      setFormData({
        docenteAusenteId: "",
        tipoAusencia: "Incapacidad EPS",
        fechaInicioAusencia: "",
        fechaFinAusencia: "",
        institucionId: "",
        docenteReemplazoId: "",
        fechaInicioReemplazo: "",
        fechaFinReemplazo: "",
        horasCubiertas: 0,
        jornada: "Mañana",
        concepto: "",
      });
    }
  }, [currentSuplencia]);

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'soporteIncapacidad' | 'soporteHoras') => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        [field]: e.target.files[0]
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      
      // Agregar todos los campos al FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });

      if (currentSuplencia) {
        await updateSuplencia(currentSuplencia.id, formDataToSend);
      } else {
        await addSuplencia(formDataToSend);
      }
      
      onClose();
      setCurrentSuplencia(null);
    } catch (error) {
      console.error("Error al guardar la suplencia:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => { onClose(); setCurrentSuplencia(null); }}>
      <DialogContent className="max-w-4xl overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>
            {currentSuplencia ? "Editar Suplencia" : "Nueva Suplencia"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {/* Docente Ausente */}
          <div className="space-y-2">
            <Label>Docente Ausente</Label>
            <Select 
              value={formData.docenteAusenteId} 
              onValueChange={(value) => setFormData({...formData, docenteAusenteId: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione docente" />
              </SelectTrigger>
              <SelectContent>
                {professors.map(professor => (
                  <SelectItem key={professor.id} value={professor.id}>
                    {professor.nombres} {professor.apellidos}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Tipo de Ausencia */}
          <div className="space-y-2">
            <Label>Tipo de Ausencia</Label>
            <Select 
              value={formData.tipoAusencia} 
              onValueChange={(value) => setFormData({...formData, tipoAusencia: value as any})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Incapacidad EPS">Incapacidad EPS</SelectItem>
                <SelectItem value="Licencia sin sueldo">Licencia sin sueldo</SelectItem>
                <SelectItem value="Comisión oficial">Comisión oficial</SelectItem>
                <SelectItem value="Otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Fechas Ausencia */}
          <div className="space-y-2">
            <Label>Fecha Inicio Ausencia</Label>
            <Input
              type="date"
              value={formData.fechaInicioAusencia}
              onChange={(e) => setFormData({...formData, fechaInicioAusencia: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label>Fecha Fin Ausencia</Label>
            <Input
              type="date"
              value={formData.fechaFinAusencia}
              onChange={(e) => setFormData({...formData, fechaFinAusencia: e.target.value})}
            />
          </div>
          
          {/* Institución */}
          <div className="space-y-2">
            <Label>Institución</Label>
            <Select 
              value={formData.institucionId} 
              onValueChange={(value) => setFormData({...formData, institucionId: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione institución" />
              </SelectTrigger>
              <SelectContent>
                {institutions.map(institution => (
                  <SelectItem key={institution.id} value={institution.id}>
                    {institution.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Docente Reemplazo */}
          <div className="space-y-2">
            <Label>Docente Reemplazo</Label>
            <Select 
              value={formData.docenteReemplazoId} 
              onValueChange={(value) => setFormData({...formData, docenteReemplazoId: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione docente" />
              </SelectTrigger>
              <SelectContent>
                {professors.map(professor => (
                  <SelectItem key={professor.id} value={professor.id}>
                    {professor.nombres} {professor.apellidos}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Fechas Reemplazo */}
          <div className="space-y-2">
            <Label>Fecha Inicio Reemplazo</Label>
            <Input
              type="date"
              value={formData.fechaInicioReemplazo}
              onChange={(e) => setFormData({...formData, fechaInicioReemplazo: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label>Fecha Fin Reemplazo</Label>
            <Input
              type="date"
              value={formData.fechaFinReemplazo}
              onChange={(e) => setFormData({...formData, fechaFinReemplazo: e.target.value})}
            />
          </div>
          
          {/* Horas Cubiertas */}
          <div className="space-y-2">
            <Label>Horas Cubiertas</Label>
            <Input
              type="number"
              value={formData.horasCubiertas}
              onChange={(e) => setFormData({...formData, horasCubiertas: parseInt(e.target.value) || 0})}
            />
          </div>
          
          {/* Jornada */}
          <div className="space-y-2">
            <Label>Jornada</Label>
            <Select 
              value={formData.jornada} 
              onValueChange={(value) => setFormData({...formData, jornada: value as any})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione jornada" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mañana">Mañana</SelectItem>
                <SelectItem value="Tarde">Tarde</SelectItem>
                <SelectItem value="Noche">Noche</SelectItem>
                <SelectItem value="Única">Única</SelectItem>
                <SelectItem value="Sabatina">Sabatina</SelectItem>
                <SelectItem value="Nocturna">Nocturna</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Concepto */}
          <div className="space-y-2 md:col-span-2">
            <Label>Concepto</Label>
            <Input
              value={formData.concepto}
              onChange={(e) => setFormData({...formData, concepto: e.target.value})}
            />
          </div>
          
          {/* Soporte Incapacidad (opcional) */}
          <div className="space-y-2 md:col-span-2">
            <Label>Soporte de Incapacidad (PDF)</Label>
            <Input
              type="file"
              accept=".pdf"
              ref={incapacidadRef}
              onChange={(e) => handleFileChange(e, 'soporteIncapacidad')}
            />
            {formData.soporteIncapacidad && (
              <p className="text-sm text-green-600">
                Archivo seleccionado: {formData.soporteIncapacidad.name}
              </p>
            )}
          </div>
          
          {/* Soporte Horas (opcional) */}
         <div className="space-y-2 md:col-span-2">
            <Label>Soporte de Horas (PDF)</Label>
            <Input
              type="file"
              accept=".pdf"
              ref={horasRef}
              onChange={(e) => handleFileChange(e, 'soporteHoras')}
            />
            {formData.soporteHoras && (
              <p className="text-sm text-green-600">
                Archivo seleccionado: {formData.soporteHoras.name}
              </p>
            )}
          </div>
          
          {/* Observaciones */}
          <div className="space-y-2 md:col-span-2">
            <Label>Observaciones</Label>
            <Input
              value={formData.observaciones || ""}
              onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => { onClose(); setCurrentSuplencia(null); }}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {currentSuplencia ? "Actualizar" : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}