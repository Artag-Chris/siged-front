"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  ArrowLeft, 
  Save, 
  Eye, 
  EyeOff,
  Shield,
  Info,
  CheckCircle
} from 'lucide-react';

// Importar tipos y servicios JWT
import { CreateUserRequest } from '@/types/auth.types';
import JwtUserService from '@/services/jwt-user.service';
import JwtValidators, { 
  formatDocument, 
  formatPhone, 
  getRoleLabel, 
  getDocumentTypeLabel 
} from '@/utils/jwt-validators';

export default function CrearUsuarioInicialPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<CreateUserRequest>({
    tipo_documento: 'CC',
    documento: '',
    nombre: '',
    apellido: '',
    email: '',
    celular: '',
    contrasena: '',
    rol: 'super_admin'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleChange = (field: keyof CreateUserRequest, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Formatear campos automáticamente
      if (field === 'documento') {
        newData.documento = formatDocument(value, newData.tipo_documento);
      }
      
      if (field === 'celular') {
        newData.celular = formatPhone(value);
      }
      
      if (field === 'email') {
        newData.email = value.toLowerCase().trim();
      }
      
      if (field === 'nombre' || field === 'apellido') {
        newData[field] = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]/g, '');
      }
      
      return newData;
    });
    
    // Limpiar errores cuando el usuario modifica campos
    if (error) setError(null);
    if (validationErrors.length > 0) setValidationErrors([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulario
    const validation = JwtValidators.validateUserForm(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setValidationErrors([]);

    try {
      console.log('🚀 Creando usuario inicial con datos:', {
        ...formData,
        contrasena: '[HIDDEN]'
      });

      const newUser = await JwtUserService.createInitialUser(formData);
      
      console.log('✅ Usuario inicial creado exitosamente:', newUser);
      setSuccess(true);
      
      // Esperar 2 segundos para mostrar el mensaje de éxito
      setTimeout(() => {
        router.push('/dashboard/usuarios');
      }, 2000);

    } catch (error: any) {
      console.error('❌ Error creando usuario inicial:', error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      tipo_documento: 'CC',
      documento: '',
      nombre: '',
      apellido: '',
      email: '',
      celular: '',
      contrasena: '',
      rol: 'super_admin'
    });
    setError(null);
    setValidationErrors([]);
    setSuccess(false);
  };

  if (success) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="py-12">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
                <h2 className="text-2xl font-bold text-green-900 mb-2">
                  ¡Usuario Inicial Creado!
                </h2>
                <p className="text-green-700 mb-6">
                  El usuario administrativo ha sido creado exitosamente.
                  Redirigiendo a la lista de usuarios...
                </p>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Link href="/dashboard/usuarios">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <UserPlus className="h-6 w-6 text-blue-600" />
                <span>Crear Usuario Inicial</span>
              </h1>
              <p className="text-gray-600">Sistema de autenticación JWT</p>
            </div>
          </div>
        </div>

        {/* Información importante */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Usuario Inicial:</strong> Este es el primer usuario administrativo del sistema.
            No requiere autenticación previa y tendrá permisos de Super Administrador.
          </AlertDescription>
        </Alert>

        {/* Formulario */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span>Datos del Administrador</span>
            </CardTitle>
            <CardDescription>
              Complete todos los campos para crear el usuario inicial del sistema
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Errores de validación */}
              {validationErrors.length > 0 && (
                <Alert variant="destructive">
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Error general */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Tipo y número de documento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Tipo de Documento *
                  </label>
                  <Select
                    value={formData.tipo_documento}
                    onValueChange={(value) => handleChange('tipo_documento', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                      <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                      <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
                      <SelectItem value="PP">Pasaporte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Número de Documento *
                  </label>
                  <Input
                    value={formData.documento}
                    onChange={(e) => handleChange('documento', e.target.value)}
                    placeholder="Ingrese el número..."
                    required
                  />
                </div>
              </div>

              {/* Nombres y apellidos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Nombres *
                  </label>
                  <Input
                    value={formData.nombre}
                    onChange={(e) => handleChange('nombre', e.target.value)}
                    placeholder="Nombres completos"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Apellidos *
                  </label>
                  <Input
                    value={formData.apellido}
                    onChange={(e) => handleChange('apellido', e.target.value)}
                    placeholder="Apellidos completos"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Correo Electrónico *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="usuario@ejemplo.com"
                  required
                />
              </div>

              {/* Celular */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Celular (Opcional)
                </label>
                <Input
                  value={formData.celular}
                  onChange={(e) => handleChange('celular', e.target.value)}
                  placeholder="+57 300 123 4567"
                />
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Contraseña *
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.contrasena}
                    onChange={(e) => handleChange('contrasena', e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Rol (fijo para usuario inicial) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Rol del Usuario
                </label>
                <div className="flex items-center space-x-2">
                  <Badge variant="destructive">
                    <Shield className="h-3 w-3 mr-1" />
                    {getRoleLabel(formData.rol!)}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    (Rol fijo para usuario inicial)
                  </span>
                </div>
              </div>

              {/* Resumen de datos */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Resumen:</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Documento:</strong> {getDocumentTypeLabel(formData.tipo_documento)} - {formData.documento || 'No ingresado'}</p>
                  <p><strong>Nombre:</strong> {formData.nombre} {formData.apellido || ''}</p>
                  <p><strong>Email:</strong> {formData.email || 'No ingresado'}</p>
                  <p><strong>Celular:</strong> {formData.celular || 'No especificado'}</p>
                  <p><strong>Rol:</strong> {getRoleLabel(formData.rol!)}</p>
                </div>
              </div>

              {/* Botones */}
              <div className="flex space-x-4 pt-4 border-t">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creando Usuario...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Crear Usuario Inicial
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={isLoading}
                >
                  Limpiar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Información adicional */}
        <Card className="mt-6 border-gray-200 bg-gray-50">
          <CardContent className="py-4">
            <h4 className="font-medium text-gray-900 mb-2">Información del Sistema JWT:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• El usuario inicial no requiere autenticación previa</li>
              <li>• Tendrá permisos completos de Super Administrador</li>
              <li>• Podrá crear y gestionar otros usuarios del sistema</li>
              <li>• Las contraseñas se encriptan automáticamente con bcrypt</li>
              <li>• Se generarán tokens JWT para la autenticación</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}