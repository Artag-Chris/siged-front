"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Car, Calendar, AlertCircle } from "lucide-react"

import { TIPOS_VEHICULO, MARCAS_VEHICULO } from "@/dummyData/dummyVehiculos"
import { VehiculoFormData } from "@/interfaces"
import { useVehiculoStore } from "@/lib/vehiculo-store"


interface VehiculoFormProps {
  conductorId: string
  onCancel: () => void
}

export default function VehiculoForm({ conductorId, onCancel }: VehiculoFormProps) {
  const { addVehiculo, isLoading } = useVehiculoStore()

  const [formData, setFormData] = useState<VehiculoFormData>({
    placa: "",
    marca: "",
    modelo: "",
    anio: new Date().getFullYear(),
    color: "",
    cupoMaximo: 0,
    tipoVehiculo: "Buseta",
    numeroInterno: "",
    fechaVencimientoTecnomecanica: "",
    fechaVencimientoSoat: "",
    conductorAsignado: conductorId,
    observaciones: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [vehiculoId, setVehiculoId] = useState("")

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.placa.trim()) newErrors.placa = "La placa es obligatoria"
    if (!formData.marca) newErrors.marca = "La marca es obligatoria"
    if (!formData.modelo.trim()) newErrors.modelo = "El modelo es obligatorio"
    if (!formData.color.trim()) newErrors.color = "El color es obligatorio"
    if (!formData.tipoVehiculo) newErrors.tipoVehiculo = "El tipo de vehículo es obligatorio"
    if (formData.cupoMaximo <= 0) newErrors.cupoMaximo = "El cupo máximo debe ser mayor a 0"
    if (!formData.fechaVencimientoTecnomecanica) {
      newErrors.fechaVencimientoTecnomecanica = "La fecha de vencimiento de la tecno-mecánica es obligatoria"
    }
    if (!formData.fechaVencimientoSoat) {
      newErrors.fechaVencimientoSoat = "La fecha de vencimiento del SOAT es obligatoria"
    }

    // Validar que las fechas no estén vencidas
    const hoy = new Date()
    if (formData.fechaVencimientoTecnomecanica && new Date(formData.fechaVencimientoTecnomecanica) < hoy) {
      newErrors.fechaVencimientoTecnomecanica = "La tecno-mecánica no puede estar vencida"
    }
    if (formData.fechaVencimientoSoat && new Date(formData.fechaVencimientoSoat) < hoy) {
      newErrors.fechaVencimientoSoat = "El SOAT no puede estar vencido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof VehiculoFormData, value: any) => {
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
      const id = await addVehiculo(formData)
      setVehiculoId(id)
      setSuccess(true)
      setTimeout(() => {
        onCancel()
      }, 2000)
    } catch (error) {
      console.error("Error al registrar vehículo:", error)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Car className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">¡Vehículo Registrado!</CardTitle>
            <CardDescription>El vehículo ha sido registrado y asignado exitosamente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600 font-medium">ID del Vehículo:</p>
              <p className="text-xl font-bold text-blue-800">{vehiculoId}</p>
            </div>
            <Button onClick={onCancel} className="w-full">
              Volver al Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Car className="w-5 h-5" />
              Registrar Vehículo
            </CardTitle>
            <CardDescription>Complete la información del vehículo que operará</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="placa">Placa *</Label>
                <Input
                  id="placa"
                  value={formData.placa}
                  onChange={(e) => handleInputChange("placa", e.target.value.toUpperCase())}
                  placeholder="Ej: ABC123"
                  className={errors.placa ? "border-red-500" : ""}
                />
                {errors.placa && <p className="text-sm text-red-500">{errors.placa}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroInterno">Número interno (opcional)</Label>
                <Input
                  id="numeroInterno"
                  value={formData.numeroInterno}
                  onChange={(e) => handleInputChange("numeroInterno", e.target.value)}
                  placeholder="Ej: T001"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="marca">Marca *</Label>
                <Select value={formData.marca} onValueChange={(value) => handleInputChange("marca", value)}>
                  <SelectTrigger id="marca" className={errors.marca ? "border-red-500" : ""}>
                    <SelectValue placeholder="Seleccionar marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {MARCAS_VEHICULO.map((marca) => (
                      <SelectItem key={marca} value={marca}>
                        {marca}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.marca && <p className="text-sm text-red-500">{errors.marca}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="modelo">Modelo *</Label>
                <Input
                  id="modelo"
                  value={formData.modelo}
                  onChange={(e) => handleInputChange("modelo", e.target.value)}
                  placeholder="Ej: Sprinter"
                  className={errors.modelo ? "border-red-500" : ""}
                />
                {errors.modelo && <p className="text-sm text-red-500">{errors.modelo}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="anio">Año *</Label>
                <Input
                  id="anio"
                  type="number"
                  min="1990"
                  max={new Date().getFullYear()}
                  value={formData.anio}
                  onChange={(e) =>
                    handleInputChange("anio", Number.parseInt(e.target.value) || new Date().getFullYear())
                  }
                  className={errors.anio ? "border-red-500" : ""}
                />
                {errors.anio && <p className="text-sm text-red-500">{errors.anio}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color *</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                  placeholder="Ej: Amarillo"
                  className={errors.color ? "border-red-500" : ""}
                />
                {errors.color && <p className="text-sm text-red-500">{errors.color}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cupoMaximo">Cupo máximo *</Label>
                <Input
                  id="cupoMaximo"
                  type="number"
                  min="1"
                  value={formData.cupoMaximo}
                  onChange={(e) => handleInputChange("cupoMaximo", Number.parseInt(e.target.value) || 0)}
                  placeholder="Número de pasajeros"
                  className={errors.cupoMaximo ? "border-red-500" : ""}
                />
                {errors.cupoMaximo && <p className="text-sm text-red-500">{errors.cupoMaximo}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoVehiculo">Tipo de vehículo *</Label>
              <Select
                value={formData.tipoVehiculo}
                onValueChange={(value) => handleInputChange("tipoVehiculo", value as any)}
              >
                <SelectTrigger id="tipoVehiculo" className={errors.tipoVehiculo ? "border-red-500" : ""}>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_VEHICULO.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tipoVehiculo && <p className="text-sm text-red-500">{errors.tipoVehiculo}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fechaVencimientoTecnomecanica" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Vencimiento tecno-mecánica *
                </Label>
                <Input
                  id="fechaVencimientoTecnomecanica"
                  type="date"
                  value={formData.fechaVencimientoTecnomecanica}
                  onChange={(e) => handleInputChange("fechaVencimientoTecnomecanica", e.target.value)}
                  className={errors.fechaVencimientoTecnomecanica ? "border-red-500" : ""}
                />
                {errors.fechaVencimientoTecnomecanica && (
                  <p className="text-sm text-red-500">{errors.fechaVencimientoTecnomecanica}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaVencimientoSoat" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Vencimiento SOAT *
                </Label>
                <Input
                  id="fechaVencimientoSoat"
                  type="date"
                  value={formData.fechaVencimientoSoat}
                  onChange={(e) => handleInputChange("fechaVencimientoSoat", e.target.value)}
                  className={errors.fechaVencimientoSoat ? "border-red-500" : ""}
                />
                {errors.fechaVencimientoSoat && <p className="text-sm text-red-500">{errors.fechaVencimientoSoat}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones adicionales</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones || ""}
                onChange={(e) => handleInputChange("observaciones", e.target.value)}
                placeholder="Información adicional sobre el vehículo"
                rows={3}
              />
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Asegúrese de que toda la documentación del vehículo esté vigente y en regla
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Registrando..." : "Registrar Vehículo"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
