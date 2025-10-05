"use client"

import React, { useState, } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Users, Search, Eye, Activity, GraduationCap, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useEmpleados } from '@/hooks/useEmpleados';
import { ProtectedRoute } from '@/components/protected-route';

function ProfesoresContent() {

  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstado, setFilterEstado] = useState<string>("todos")

  const {
    empleados,
    selectedEmpleado,
    isLoading,
    error,
    refreshEmpleados,
    selectEmpleado,
    clearErrors,
    isUserAuthenticated,
    currentUser
  } = useEmpleados({
    autoLoad: true,
  });


  const profesoresStats = React.useMemo(() => {
    const docentes = empleados.filter(emp => emp.cargo === 'Docente');
    const activosDocentes = docentes.filter(emp => emp.estado === 'activo').length;
    const inactivosDocentes = docentes.filter(emp => emp.estado === 'inactivo').length;
    
    return {
      docentes: docentes.length,
      activos: activosDocentes, 
      inactivos: inactivosDocentes,
      total: empleados.length
    };
  }, [empleados]);
  const filteredProfessors = React.useMemo(() => {
    return empleados.filter((empleado) => {

      if (empleado.cargo !== 'Docente') return false;


      const matchesSearch =
        empleado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empleado.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empleado.documento.includes(searchTerm) ||
        empleado.email.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesEstado = filterEstado === "todos" || empleado.estado === filterEstado

      return matchesSearch && matchesEstado
    });
  }, [empleados, searchTerm, filterEstado]);

  if (!isUserAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 mx-auto text-gray-400 mb-4" />
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Profesores</h1>
            <p className="text-gray-600">Administra la información de los profesores usando arquitectura JWT</p>
          </div>
          <div className="flex space-x-2">
            <Link href="/dashboard/profesores/agregar">
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Agregar Profesor
              </Button>
            </Link>
            <Button onClick={refreshEmpleados} variant="outline" size="sm" disabled={isLoading}>
              <Activity className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
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

        {/* Error */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="text-red-700">{error}</p>
                </div>
                <Button onClick={clearErrors} variant="ghost" size="sm">
                  Cerrar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Profesores</p>
                  <p className="text-2xl font-bold text-gray-900">{profesoresStats.docentes}</p>
                </div>
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Activos</p>
                  <p className="text-2xl font-bold text-gray-900">{profesoresStats.activos}</p>
                  <p className="text-xs text-green-600">
                    {profesoresStats.docentes > 0 ? Math.round((profesoresStats.activos / profesoresStats.docentes) * 100) : 0}% del total
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inactivos</p>
                  <p className="text-2xl font-bold text-gray-900">{profesoresStats.inactivos}</p>
                  <p className="text-xs text-gray-600">
                    {profesoresStats.docentes > 0 ? Math.round((profesoresStats.inactivos / profesoresStats.docentes) * 100) : 0}% del total
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Empleados</p>
                  <p className="text-2xl font-bold text-gray-900">{profesoresStats.total}</p>
                  <p className="text-xs text-blue-600">Incluyendo Rectores</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Lista de profesores */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Profesores</CardTitle>
              <CardDescription>
                Información de todos los profesores registrados con arquitectura JWT ({filteredProfessors.length} resultados)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtros y búsqueda */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por nombre, documento o email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={filterEstado} onValueChange={setFilterEstado}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="activo">Activos</SelectItem>
                      <SelectItem value="inactivo">Inactivos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                {filteredProfessors.map((profesor) => (
                  <div 
                    key={profesor.id} 
                    className={`border rounded-lg p-4 transition-all cursor-pointer ${
                      selectedEmpleado?.id === profesor.id 
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => selectEmpleado(profesor)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {profesor.nombre} {profesor.apellido}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {profesor.cargo} • {profesor.email} • {profesor.tipo_documento}: {profesor.documento}
                            </p>
                            <p className="text-xs text-gray-500">
                              Dirección: {profesor.direccion}
                            </p>
                            {selectedEmpleado?.id === profesor.id && (
                              <p className="text-xs text-blue-600 font-mono mt-1">
                                UUID: {profesor.id}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <Badge variant={profesor.estado === "activo" ? "default" : "secondary"}>
                              {profesor.estado}
                            </Badge>
                            <Badge variant="outline">
                              {profesor.cargo}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link href={`/dashboard/profesores/${profesor.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Perfil
                          </Button>
                        </Link>
                        <Link href={`/dashboard/profesores/${profesor.id}/editar`}>
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredProfessors.length === 0 && !isLoading && (
                  <div className="text-center py-8">
                    <GraduationCap className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-2">No se encontraron profesores que coincidan con los filtros</p>
                    <Link href="/dashboard/profesores/agregar">
                      <Button variant="outline">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Agregar Primer Profesor
                      </Button>
                    </Link>
                  </div>
                )}

                {isLoading && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando profesores...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function ProfesoresPage() {
  return (
    <ProtectedRoute requiredRole={['super_admin', 'admin', 'gestor']}>
      <ProfesoresContent />
    </ProtectedRoute>
  );
}
