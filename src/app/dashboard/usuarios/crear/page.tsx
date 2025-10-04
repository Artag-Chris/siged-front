"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  UserPlus,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Shield,
  User,
  Mail,
  Phone,
  FileText,
  Key
} from 'lucide-react';

// Importar tipos y servicios
import { CreateUserRequest } from '@/types/auth.types';
import JwtUserService from '@/services/jwt-user.service';
import { 
  validateDocumentType, 
  validateDocument, 
  validateEmail,
  validatePassword,
  getRoleLabel,
  getDocumentTypeLabel
} from '@/utils/jwt-validators';

export default function CrearUsuarioPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState<CreateUserRequest>({
    tipo_documento: 'CC',
    documento: '',
    nombre: '',
    apellido: '',
    email: '',
    celular: '',
    contrasena: '',
    rol: 'gestor',
    estado: 'activo'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof CreateUserRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo cuando el usuario comience a escribir
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar tipo de documento
    if (!validateDocumentType(formData.tipo_documento)) {
      newErrors.tipo_documento = 'Tipo de documento requerido';
    }

    // Validar documento
    if (!validateDocument(formData.documento, formData.tipo_documento)) {
      newErrors.documento = 'Documento inválido para el tipo seleccionado';
    }

    // Validar nombre
    if (!formData.nombre?.trim()) {
      newErrors.nombre = 'Nombre es requerido';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'Nombre debe tener al menos 2 caracteres';
    }

    // Validar apellido
    if (!formData.apellido?.trim()) {
      newErrors.apellido = 'Apellido es requerido';
    } else if (formData.apellido.trim().length < 2) {
      newErrors.apellido = 'Apellido debe tener al menos 2 caracteres';
    }

    // Validar email
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validar contraseña
    if (!validatePassword(formData.contrasena)) {
      newErrors.contrasena = 'Contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo';
    }

    // Validar celular (opcional)
    if (formData.celular && formData.celular.length > 0) {
      if (!/^[0-9]{10}$/.test(formData.celular)) {
        newErrors.celular = 'Celular debe tener 10 dígitos';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
     

      const result = await JwtUserService.createUser(formData);
      
      console.log('✅ [CREAR-USUARIO] Usuario creado exitosamente:', result);
      setSuccess(true);
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push('/dashboard/usuarios');
      }, 2000);

    } catch (error: any) {
      console.error('❌ [CREAR-USUARIO] Error:', error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const generateStrongPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    handleInputChange('contrasena', password);
  };

  if (success) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  ¡Usuario Creado Exitosamente!
                </h2>
                <p className="text-gray-600 mb-6">
                  El usuario {formData.nombre} {formData.apellido} ha sido creado con el rol de{' '}
                  {getRoleLabel(formData.rol || 'gestor')}.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    Redirigiendo a la lista de usuarios...
                  </p>
                  <div className="animate-pulse">
                    <div className="h-2 bg-blue-600 rounded-full w-24 mx-auto"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/dashboard/usuarios">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div className="flex items-center space-x-3">
            <UserPlus className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Usuario</h1>
              <p className="text-gray-600">Sistema de autenticación</p>
            </div>
          </div>
        </div>

      
       

        {/* Formulario */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Usuario</CardTitle>
            <CardDescription>
              Completa todos los campos requeridos para crear el nuevo usuario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Error general */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Datos de Identificación */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-medium">Datos de Identificación</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="tipo_documento">Tipo de Documento *</Label>
                    <Select
                      value={formData.tipo_documento}
                      onValueChange={(value) => handleInputChange('tipo_documento', value)}
                    >
                      <SelectTrigger className={errors.tipo_documento ? 'border-red-500' : ''}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                        <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                        <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
                        <SelectItem value="PP">Pasaporte</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.tipo_documento && (
                      <p className="text-sm text-red-600 mt-1">{errors.tipo_documento}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="documento">Número de Documento *</Label>
                    <Input
                      id="documento"
                      value={formData.documento}
                      onChange={(e) => handleInputChange('documento', e.target.value)}
                      placeholder="Ingresa el número de documento"
                      className={errors.documento ? 'border-red-500' : ''}
                    />
                    {errors.documento && (
                      <p className="text-sm text-red-600 mt-1">{errors.documento}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Datos Personales */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <User className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-medium">Datos Personales</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      placeholder="Nombre del usuario"
                      className={errors.nombre ? 'border-red-500' : ''}
                    />
                    {errors.nombre && (
                      <p className="text-sm text-red-600 mt-1">{errors.nombre}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="apellido">Apellido *</Label>
                    <Input
                      id="apellido"
                      value={formData.apellido}
                      onChange={(e) => handleInputChange('apellido', e.target.value)}
                      placeholder="Apellido del usuario"
                      className={errors.apellido ? 'border-red-500' : ''}
                    />
                    {errors.apellido && (
                      <p className="text-sm text-red-600 mt-1">{errors.apellido}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Datos de Contacto */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Mail className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-medium">Datos de Contacto</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="usuario@ejemplo.com"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="celular">Celular (opcional)</Label>
                    <Input
                      id="celular"
                      value={formData.celular}
                      onChange={(e) => handleInputChange('celular', e.target.value)}
                      placeholder="3001234567"
                      className={errors.celular ? 'border-red-500' : ''}
                    />
                    {errors.celular && (
                      <p className="text-sm text-red-600 mt-1">{errors.celular}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Datos del Sistema */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Key className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-medium">Datos del Sistema</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rol">Rol del Usuario *</Label>
                    <Select
                      value={formData.rol}
                      onValueChange={(value) => handleInputChange('rol', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gestor">Gestor</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="super_admin">Super Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="estado">Estado *</Label>
                    <Select
                      value={formData.estado}
                      onValueChange={(value) => handleInputChange('estado', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="inactivo">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="contrasena">Contraseña *</Label>
                  <div className="relative">
                    <Input
                      id="contrasena"
                      type={showPassword ? "text" : "password"}
                      value={formData.contrasena}
                      onChange={(e) => handleInputChange('contrasena', e.target.value)}
                      placeholder="Contraseña segura"
                      className={errors.contrasena ? 'border-red-500 pr-20' : 'pr-20'}
                    />
                    <div className="absolute right-0 top-0 h-full flex items-center space-x-1 pr-3">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="h-8 w-8 p-0"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={generateStrongPassword}
                        className="h-8 px-2 text-xs"
                      >
                        Gen
                      </Button>
                    </div>
                  </div>
                  {errors.contrasena && (
                    <p className="text-sm text-red-600 mt-1">{errors.contrasena}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Mínimo 8 caracteres, incluye mayúscula, minúscula, número y símbolo
                  </p>
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-4 pt-6">
                <Link href="/dashboard/usuarios">
                  <Button variant="outline" disabled={isLoading}>
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Crear Usuario
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}