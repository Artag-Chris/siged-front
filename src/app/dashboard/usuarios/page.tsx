"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  RefreshCw,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Eye
} from 'lucide-react';

// Importar tipos y servicios JWT
import { User, UserFilters, UsersListResponse } from '@/types/auth.types';
import JwtUserService from '@/services/jwt-user.service';
import { getRoleLabel, getDocumentTypeLabel } from '@/utils/jwt-validators';

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 10,
    nombre: '',
    email: '',
    rol: undefined,
    estado: 'activo'
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [filters]);

  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Cargando usuarios con filtros:', filters);
      const response: UsersListResponse = await JwtUserService.getUsers(filters);
      
      if (response.success) {
        setUsers(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
        console.log('✅ Usuarios cargados:', response.data.length);
      } else {
        throw new Error(response.message || 'Error cargando usuarios');
      }
    } catch (error: any) {
      console.error('❌ Error cargando usuarios:', error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: keyof UserFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset a primera página al cambiar filtros
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleDeactivateUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de que quieres desactivar este usuario?')) {
      return;
    }

    try {
      await JwtUserService.deactivateUser(userId);
      loadUsers(); // Recargar lista
    } catch (error: any) {
      alert(`Error desactivando usuario: ${error.message}`);
    }
  };

  const handleReactivateUser = async (userId: string) => {
    if (!confirm('¿Estás seguro de que quieres reactivar este usuario?')) {
      return;
    }

    try {
      await JwtUserService.reactivateUser(userId);
      loadUsers(); // Recargar lista
    } catch (error: any) {
      alert(`Error reactivando usuario: ${error.message}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios JWT</h1>
              <p className="text-gray-600">Sistema de autenticación con tokens JWT</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Link href="/dashboard/usuarios/crear-inicial">
              <Button variant="outline" size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Usuario Inicial
              </Button>
            </Link>
            <Button onClick={loadUsers} variant="outline" size="sm" disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filtros de Búsqueda</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? 'Ocultar' : 'Mostrar'}
              </Button>
            </div>
          </CardHeader>
          
          {showFilters && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <Input
                    value={filters.nombre || ''}
                    onChange={(e) => handleFilterChange('nombre', e.target.value)}
                    placeholder="Buscar por nombre..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    value={filters.email || ''}
                    onChange={(e) => handleFilterChange('email', e.target.value)}
                    placeholder="Buscar por email..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rol
                  </label>
                  <Select
                    value={filters.rol || 'all'}
                    onValueChange={(value) => handleFilterChange('rol', value === 'all' ? undefined : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los roles</SelectItem>
                      <SelectItem value="super_admin">Super Administrador</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="gestor">Gestor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <Select
                    value={filters.estado || 'activo'}
                    onValueChange={(value) => handleFilterChange('estado', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activo">Activos</SelectItem>
                      <SelectItem value="inactivo">Inactivos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Error */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Tabla de usuarios */}
        {!isLoading && !error && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>
                  Usuarios ({pagination.totalItems} total)
                </CardTitle>
                <CardDescription>
                  Página {pagination.currentPage} de {pagination.totalPages}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usuario
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Documento
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contacto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rol
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {user.nombre} {user.apellido}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {getDocumentTypeLabel(user.tipo_documento)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.documento}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {user.email}
                            </div>
                            {user.celular && (
                              <div className="text-sm text-gray-500">
                                {user.celular}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge 
                              variant={
                                user.rol === 'super_admin' ? 'destructive' :
                                user.rol === 'admin' ? 'default' : 'secondary'
                              }
                            >
                              {getRoleLabel(user.rol)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={user.estado === 'activo' ? 'default' : 'secondary'}>
                              {user.estado === 'activo' ? (
                                <>
                                  <UserCheck className="h-3 w-3 mr-1" />
                                  Activo
                                </>
                              ) : (
                                <>
                                  <UserX className="h-3 w-3 mr-1" />
                                  Inactivo
                                </>
                              )}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.fecha_creacion)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              {user.estado === 'activo' ? (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleDeactivateUser(user.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <UserX className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleReactivateUser(user.id)}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <UserCheck className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Paginación */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-700">
                  Mostrando {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} a{' '}
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} de{' '}
                  {pagination.totalItems} usuarios
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage <= 1}
                  >
                    Anterior
                  </Button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter(page => 
                        page === 1 || 
                        page === pagination.totalPages || 
                        Math.abs(page - pagination.currentPage) <= 2
                      )
                      .map((page, index, array) => {
                        if (index > 0 && array[index - 1] !== page - 1) {
                          return (
                            <React.Fragment key={`ellipsis-${page}`}>
                              <span className="px-3 py-2 text-sm text-gray-500">...</span>
                              <Button
                                variant={page === pagination.currentPage ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePageChange(page)}
                              >
                                {page}
                              </Button>
                            </React.Fragment>
                          );
                        }
                        
                        return (
                          <Button
                            key={page}
                            variant={page === pagination.currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </Button>
                        );
                      })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= pagination.totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Estado vacío */}
        {!isLoading && !error && users.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay usuarios
                </h3>
                <p className="text-gray-500 mb-4">
                  Comienza creando tu primer usuario administrativo
                </p>
                <Link href="/dashboard/usuarios/crear-inicial">
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Crear Usuario Inicial
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}