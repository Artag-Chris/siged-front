"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useInstitutionStore } from "@/lib/instituition-store"
import { usePAEStore } from "@/lib/pae-store"
import { PAEFormData } from "@/interfaces"

interface AsignacionCuposModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AsignacionCuposModal({ isOpen, onClose }: AsignacionCuposModalProps) {
  const { institutions } = useInstitutionStore()
  const { addBeneficio } = usePAEStore()
  const [formData, setFormData] = useState<{
    institucionId: string
    cantidad: number
    tipoBeneficio: "Desayuno" | "Almuerzo" | "Completo"
    fechaVencimiento: string
  }>({
    institucionId: "",
    cantidad: 10,
    tipoBeneficio: "Completo",
    fechaVencimiento: new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0]
  })

  const handleSubmit = async () => {
    if (!formData.institucionId) return
    
    
    for (let i = 0; i < formData.cantidad; i++) {
      const newBeneficio: PAEFormData = {
        estudianteId: "", 
        institucionId: formData.institucionId,
        fechaAsignacion: new Date().toISOString(),
        fechaVencimiento: formData.fechaVencimiento,
        estado: "Activo",
        tipoBeneficio: formData.tipoBeneficio
      }
      
      await addBeneficio(newBeneficio)
    }
    
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Asignar Cupos PAE</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="institucion" className="text-right">
              Institución
            </Label>
            <Select 
              value={formData.institucionId} 
              onValueChange={(value) => setFormData({...formData, institucionId: value})}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleccione una institución" />
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
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cantidad" className="text-right">
              Cantidad de Cupos
            </Label>
            <Input
              id="cantidad"
              type="number"
              value={formData.cantidad}
              onChange={(e) => setFormData({...formData, cantidad: parseInt(e.target.value) || 0})}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tipo" className="text-right">
              Tipo de Beneficio
            </Label>
            <Select 
              value={formData.tipoBeneficio} 
              onValueChange={(value: any) => setFormData({...formData, tipoBeneficio: value})}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleccione el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Desayuno">Desayuno</SelectItem>
                <SelectItem value="Almuerzo">Almuerzo</SelectItem>
                <SelectItem value="Completo">Completo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="vencimiento" className="text-right">
              Fecha de Vencimiento
            </Label>
            <Input
              id="vencimiento"
              type="date"
              value={formData.fechaVencimiento}
              onChange={(e) => setFormData({...formData, fechaVencimiento: e.target.value})}
              className="col-span-3"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Asignar Cupos</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}