"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Save, ArrowLeft, CheckCircle, AlertCircle, UserPlus } from "lucide-react"
import Link from "next/link"

// Importar la nueva arquitectura de empleados
import { useEmpleados } from '@/hooks/useEmpleados';
import { CreateEmpleadoRequest } from '@/types/empleados.types';
import { ProtectedRoute } from '@/components/protected-route';

// Tipos de documento disponibles
const TIPOS_DOCUMENTO = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'PP', label: 'Pasaporte' }
];

// Estados disponibles
const ESTADOS = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' }
];

function AgregarProfesorContent() {
  const router = useRouter()
  
  // Usar el hook de empleados
  const {
    isLoading,
    error,
    
    // Operaciones
    createEmpleado,
    clearErrors,
    
    // Auth
    isUserAuthenticated,
    currentUser
  } = useEmpleados();

  const [formData, setFormData] = useState<CreateEmpleadoRequest>({
    nombre: '',
    apellido: '',
    tipo_documento: 'CC',
    documento: '',
    email: '',
    direccion: '',
    cargo: 'Docente', // Fijo para profesores
    estado: 'activo'
  });

  const [localError, setLocalError] = useState('')
  const [success, setSuccess] = useState('')

  const handleInputChange = (field: keyof CreateEmpleadoRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setLocalError('');
    clearErrors();
  };

  const validateForm = (): boolean => {
    if (!formData.nombre.trim()) {
      setLocalError('El nombre es obligatorio');
      return false;
    }
    if (!formData.apellido.trim()) {
      setLocalError('El apellido es obligatorio');
      return false;
    }
    if (!formData.documento.trim()) {
      setLocalError('El número de documento es obligatorio');
      return false;
    }
    if (!formData.email.trim()) {
      setLocalError('El email es obligatorio');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setLocalError('El email no tiene un formato válido');
      return false;
    }
    if (!formData.direccion.trim()) {
      setLocalError('La dirección es obligatoria');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      console.log('Creating new professor:', formData);
      
      const newEmpleado = await createEmpleado(formData);
      
      if (newEmpleado) {
        setSuccess(`Profesor ${newEmpleado.nombre} ${newEmpleado.apellido} creado exitosamente`);
        console.log('Professor created successfully:', newEmpleado.id);
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          router.push('/dashboard/profesores');
        }, 2000);
      } else {
        setLocalError('Error al crear el profesor. Intente nuevamente.');
      }
    } catch (error) {
      console.error('Error creating professor:', error);
      setLocalError('Error al crear el profesor. Intente nuevamente.');
    }
  };

  if (!isUserAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <UserPlus className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Acceso Restringido</h2>
          <p className="text-gray-600">Debes estar autenticado para agregar profesores</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/profesores">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Agregar Profesor</h1>
              <p className="text-gray-600">Crear un nuevo profesor usando arquitectura JWT</p>
            </div>
          </div>
        </div>

        {/* Usuario actual */}
        {currentUser && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <span>Usuario Autenticado</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Nombre</p>
                  <p className="text-green-900 font-semibold">{currentUser.nombre}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-green-900">{currentUser.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Rol</p>
                  <Badge variant="default">{currentUser.rol}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alerts */}
        {(error || localError) && (
          <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || localError}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6" variant="default">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-700">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Formulario */}
        <Card>
          <CardHeader>
            <CardTitle>Datos del Profesor</CardTitle>
            <CardDescription>
              Complete la información básica del nuevo profesor. El cargo se establecerá automáticamente como "Docente".
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información Personal */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      placeholder="Nombre del profesor"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="apellido">Apellido *</Label>
                    <Input
                      id="apellido"
                      type="text"
                      value={formData.apellido}
                      onChange={(e) => handleInputChange('apellido', e.target.value)}
                      placeholder="Apellido del profesor"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tipo_documento">Tipo de Documento *</Label>
                    <Select value={formData.tipo_documento} onValueChange={(value) => handleInputChange('tipo_documento', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIPOS_DOCUMENTO.map((tipo) => (
                          <SelectItem key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="documento">Número de Documento *</Label>
                    <Input
                      id="documento"
                      type="text"
                      value={formData.documento}
                      onChange={(e) => handleInputChange('documento', e.target.value)}
                      placeholder="Número de documento"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="email@ejemplo.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="direccion">Dirección *</Label>
                  <Input
                    id="direccion"
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => handleInputChange('direccion', e.target.value)}
                    placeholder="Dirección completa"
                    required
                  />
                </div>
              </div>

              {/* Información Profesional */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Información Profesional</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cargo">Cargo</Label>
                    <Input
                      id="cargo"
                      type="text"
                      value={formData.cargo}
                      disabled
                      className="bg-gray-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">El cargo se establece automáticamente como "Docente"</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="estado">Estado *</Label>
                    <Select value={formData.estado} onValueChange={(value) => handleInputChange('estado', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {ESTADOS.map((estado) => (
                          <SelectItem key={estado.value} value={estado.value}>
                            {estado.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                <Link href="/dashboard/profesores">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Crear Profesor
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AgregarProfesorPage() {
  return (
    <ProtectedRoute requiredRole={['super_admin', 'admin', 'gestor']}>
      <AgregarProfesorContent />
    </ProtectedRoute>
  );
}
