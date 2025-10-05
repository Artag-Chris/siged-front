// app/dashboard/empleados/page.tsx
// Nueva página de gestión de empleados/profesores con arquitectura JWT

"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  UserPlus, 
  RefreshCw,
  Upload,
  MessageSquare,
  GraduationCap,
  Shield,
  CheckCircle,
  AlertCircle,
  FileText,
  BookOpen
} from 'lucide-react';

// Importar hook y tipos de la nueva arquitectura
import { useEmpleados } from '@/hooks/useEmpleados';
import { CreateEmpleadoRequest, Empleado } from '@/types/empleados.types';
import { ProtectedRoute } from '@/components/protected-route';

function EmpleadosContent() {
  const {
    empleados,
    selectedEmpleado,
    isLoading,
    error,
    stats,
    
    // Operaciones
    createEmpleado,
    uploadDocument,
    addComentario,
    
    // Utilidades
    selectEmpleado,
    clearErrors,
    refreshEmpleados,
    
    // Auth
    isUserAuthenticated,
    currentUser
  } = useEmpleados({
    autoLoad: true,
    initialFilters: { estado: 'activo' }
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [newComentario, setNewComentario] = useState('');

  // =============== CREAR EMPLEADO ===============
  const handleCreateEmpleado = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data: CreateEmpleadoRequest = {
      tipo_documento: formData.get('tipo_documento') as any,
      documento: formData.get('documento') as string,
      nombre: formData.get('nombre') as string,
      apellido: formData.get('apellido') as string,
      email: formData.get('email') as string,
      direccion: formData.get('direccion') as string,
      cargo: formData.get('cargo') as any,
      estado: 'activo',
      comentario: formData.get('comentario') as string || undefined
    };

    try {
      const newEmpleado = await createEmpleado(data);
      if (newEmpleado) {
        setShowCreateForm(false);
        (e.target as HTMLFormElement).reset();
        alert(`✅ Empleado ${newEmpleado.nombre} ${newEmpleado.apellido} creado exitosamente`);
      }
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  // =============== SUBIR DOCUMENTO ===============
  const handleUploadDocument = async () => {
    if (!selectedEmpleado || !documentFile) {
      alert('⚠️ Selecciona un empleado y un archivo');
      return;
    }

    try {
      console.log('📎 Subiendo documento para empleado UUID:', selectedEmpleado.id);
      
      const success = await uploadDocument(
        selectedEmpleado.id, // UUID REAL del empleado (ya no dummy)
        documentFile,
        'curriculum-vitae',
        'Documento subido desde módulo de empleados'
      );

      if (success) {
        alert('✅ Documento subido exitosamente con UUID real');
        setDocumentFile(null);
      }
    } catch (error: any) {
      alert(`❌ Error subiendo documento: ${error.message}`);
    }
  };

  // =============== AGREGAR COMENTARIO ===============
  const handleAddComentario = async () => {
    if (!selectedEmpleado || !newComentario.trim()) {
      return;
    }

    try {
      const success = await addComentario(selectedEmpleado.id, newComentario.trim());
      if (success) {
        setNewComentario('');
        alert('✅ Comentario agregado exitosamente');
      }
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  if (!isUserAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Acceso Restringido</h2>
          <p className="text-gray-600">Debes estar autenticado para ver esta página</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Empleados</h1>
              <p className="text-gray-600">Módulo con arquitectura JWT y UUID real</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Nuevo Empleado
            </Button>
            <Button onClick={refreshEmpleados} variant="outline" size="sm" disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Docentes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.docentes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rectores</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.rectores}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Activos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activos}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usuario actual */}
        {currentUser && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-700">
                <Shield className="h-5 w-5" />
                <span>Sesión JWT Activa</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Usuario</p>
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

        {/* Error */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button onClick={clearErrors} variant="ghost" size="sm" className="ml-2">
                Cerrar
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Formulario de creación */}
        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Crear Nuevo Empleado</CardTitle>
              <CardDescription>
                Los datos se enviarán a la API con JWT authentication
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateEmpleado} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Documento *
                    </label>
                    <Select name="tipo_documento" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                        <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                        <SelectItem value="PA">Pasaporte</SelectItem>
                        <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documento *
                    </label>
                    <Input name="documento" required placeholder="12345678" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <Input name="nombre" required placeholder="Juan Carlos" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido *
                    </label>
                    <Input name="apellido" required placeholder="Pérez García" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <Input name="email" type="email" required placeholder="juan@colegio.edu.co" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo *
                    </label>
                    <Select name="cargo" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar cargo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Docente">Docente</SelectItem>
                        <SelectItem value="Rector">Rector</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección *
                  </label>
                  <Input name="direccion" required placeholder="Calle 123 #45-67, Ciudad" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comentario (opcional)
                  </label>
                  <Input name="comentario" placeholder="Información adicional del empleado..." />
                </div>
                
                <div className="flex space-x-2">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creando...' : 'Crear Empleado'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de empleados y acciones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Lista de empleados */}
          <Card>
            <CardHeader>
              <CardTitle>Empleados Registrados ({empleados.length})</CardTitle>
              <CardDescription>
                Haz clic en un empleado para seleccionarlo y realizar acciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {empleados.map((empleado) => (
                  <div
                    key={empleado.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedEmpleado?.id === empleado.id
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => selectEmpleado(empleado)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {empleado.nombre} {empleado.apellido}
                        </h3>
                        <p className="text-sm text-gray-600">{empleado.email}</p>
                        <p className="text-xs text-gray-500">
                          {empleado.tipo_documento}: {empleado.documento}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={empleado.cargo === 'Docente' ? 'default' : 'destructive'}
                          className="text-xs mb-1"
                        >
                          {empleado.cargo}
                        </Badge>
                        <br />
                        <Badge 
                          variant={empleado.estado === 'activo' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {empleado.estado}
                        </Badge>
                      </div>
                    </div>
                    
                    {selectedEmpleado?.id === empleado.id && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <p className="text-xs text-blue-600 font-medium">UUID seleccionado:</p>
                        <p className="text-xs font-mono text-blue-800 break-all">
                          {empleado.id}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                
                {empleados.length === 0 && !isLoading && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No hay empleados registrados</p>
                    <Button 
                      onClick={() => setShowCreateForm(true)}
                      variant="outline"
                      className="mt-2"
                    >
                      Crear primer empleado
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Panel de acciones */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones con UUID Real</CardTitle>
              <CardDescription>
                {selectedEmpleado 
                  ? `Empleado: ${selectedEmpleado.nombre} ${selectedEmpleado.apellido}`
                  : 'Selecciona un empleado para realizar acciones'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedEmpleado ? (
                <div className="space-y-6">
                  
                  {/* Información del empleado */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">📋 Información del Empleado</h4>
                    <div className="space-y-1 text-sm text-blue-800">
                      <p><strong>UUID:</strong> <span className="font-mono text-xs">{selectedEmpleado.id}</span></p>
                      <p><strong>Cargo:</strong> {selectedEmpleado.cargo}</p>
                      <p><strong>Email:</strong> {selectedEmpleado.email}</p>
                      <p><strong>Dirección:</strong> {selectedEmpleado.direccion}</p>
                      <p><strong>Estado:</strong> {selectedEmpleado.estado}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Subir documento */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">📎 Subir Documento</h4>
                    <div className="space-y-3">
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                        className="cursor-pointer"
                      />
                      <Button 
                        onClick={handleUploadDocument}
                        disabled={!documentFile || isLoading}
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {isLoading ? 'Subiendo...' : 'Subir con UUID Real'}
                      </Button>
                      <div className="bg-green-50 p-3 rounded text-xs">
                        <p className="text-green-700 font-medium">✅ Se usará UUID real (no dummy):</p>
                        <p className="font-mono text-green-800 break-all">{selectedEmpleado.id}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Agregar comentario */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">💬 Agregar Comentario</h4>
                    <div className="space-y-3">
                      <Input
                        value={newComentario}
                        onChange={(e) => setNewComentario(e.target.value)}
                        placeholder="Escribe un comentario sobre este empleado..."
                      />
                      <Button 
                        onClick={handleAddComentario}
                        disabled={!newComentario.trim() || isLoading}
                        variant="outline"
                        className="w-full"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Agregar Comentario
                      </Button>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">Selecciona un empleado</p>
                  <p className="text-sm text-gray-500">
                    Las acciones usarán el UUID real del empleado seleccionado
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Procesando con JWT...</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function EmpleadosPage() {
  return (
    <ProtectedRoute requiredRole={['super_admin', 'admin', 'gestor']}>
      <EmpleadosContent />
    </ProtectedRoute>
  );
}