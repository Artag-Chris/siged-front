"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, User, Phone, MapPin, Mail } from "lucide-react"
import { Conductor } from "@/interfaces"
import { useConductorStore } from "@/lib/conductor-store"


interface ConductorInfoEditProps {
  conductor: Conductor
  onCancel: () => void
}

export default function ConductorInfoEdit({ conductor, onCancel }: ConductorInfoEditProps) {
  
  const { updateConductor, isLoading } = useConductorStore()

  const [formData, setFormData] = useState({
    telefono: conductor.telefono,
    email: conductor.email || "",
    direccion: conductor.direccion,
    observaciones: conductor.observaciones || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.telefono.trim()) newErrors.telefono = "El teléfono es obligatorio"
    if (!formData.direccion.trim()) newErrors.direccion = "La dirección es obligatoria"
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "El formato del email no es válido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      const updated = await updateConductor(conductor.id, formData)
      if (updated) {
        setSuccess(true)
        setTimeout(() => {
          onCancel()
        }, 1500)
      }
    } catch (error) {
      console.error("Error al actualizar conductor:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Editar Información Personal</CardTitle>
            <CardDescription>Actualice sus datos de contacto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nombreCompleto" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Nombre completo
              </Label>
              <Input id="nombreCompleto" value={conductor.nombreCompleto} disabled className="bg-gray-50" />
              <p className="text-xs text-gray-500">El nombre no se puede modificar</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Teléfono *
              </Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => handleInputChange("telefono", e.target.value)}
                placeholder="Número de teléfono"
                className={errors.telefono ? "border-red-500" : ""}
              />
              {errors.telefono && <p className="text-sm text-red-500">{errors.telefono}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email (opcional)
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Correo electrónico"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Dirección de residencia *
              </Label>
              <Textarea
                id="direccion"
                value={formData.direccion}
                onChange={(e) => handleInputChange("direccion", e.target.value)}
                placeholder="Dirección completa de residencia"
                className={errors.direccion ? "border-red-500" : ""}
              />
              {errors.direccion && <p className="text-sm text-red-500">{errors.direccion}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones adicionales</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={(e) => handleInputChange("observaciones", e.target.value)}
                placeholder="Información adicional"
                rows={3}
              />
            </div>

            {success && (
              <Alert className="bg-green-50 border-green-200">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">Información actualizada correctamente</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
