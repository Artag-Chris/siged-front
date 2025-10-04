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
  Eye,
  Grid3X3,
  List,
  Mail,
  Phone,
  Calendar,
  IdCard
} from 'lucide-react';

// Importar tipos y servicios JWT
import { User, UserFilters, UsersListResponse } from '@/types/auth.types';
import JwtUserService from '@/services/jwt-user.service';
import { getRoleLabel, getDocumentTypeLabel } from '@/utils/jwt-validators';
import { ProtectedRoute } from '@/components/protected-route';

export default function UsuariosPage() {
  return (
    <ProtectedRoute requiredRole={['super_admin', 'admin']}>
      <UsuariosContent />
    </ProtectedRoute>
  );
}

function UsuariosContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
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

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setSelectedUserId(user.id);
    console.log('👤 Usuario seleccionado:', {
      id: user.id,
      nombre: `${user.nombre} ${user.apellido}`,
      email: user.email,
      rol: user.rol
    });
  };

  const clearSelection = () => {
    setSelectedUser(null);
    setSelectedUserId(null);
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
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios </h1>
              <p className="text-gray-600">Sistema de autenticación</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {/* Toggle de vista */}
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Tarjetas
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4 mr-2" />
                Tabla
              </Button>
            </div>
            
            <Link href="/dashboard/usuarios/crear">
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Nuevo Usuario
              </Button>
            </Link>
            <Button onClick={loadUsers} variant="outline" size="sm" disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Usuario seleccionado */}
        {selectedUser && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 text-blue-700">
                  <UserCheck className="h-5 w-5" />
                  <span>Usuario Seleccionado</span>
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={clearSelection}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Nombre Completo</p>
                  <p className="text-blue-900 font-semibold">
                    {selectedUser.nombre} {selectedUser.apellido}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-blue-900">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">UUID</p>
                  <p className="text-blue-900 font-mono text-sm">{selectedUser.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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

        {/* Vista de usuarios */}
        {!isLoading && !error && (
          <>
            {/* Vista de Tarjetas */}
            {viewMode === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {users.map((user) => (
                  <Card 
                    key={user.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedUserId === user.id 
                        ? 'ring-2 ring-blue-500 bg-blue-50' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => handleUserSelect(user)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`
                            w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg
                            ${user.rol === 'super_admin' ? 'bg-red-500' : 
                              user.rol === 'admin' ? 'bg-blue-500' : 'bg-gray-500'}
                          `}>
                            {user.nombre.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {user.nombre} {user.apellido}
                            </h3>
                            <Badge 
                              variant={
                                user.rol === 'super_admin' ? 'destructive' :
                                user.rol === 'admin' ? 'default' : 'secondary'
                              }
                              className="text-xs"
                            >
                              {getRoleLabel(user.rol)}
                            </Badge>
                          </div>
                        </div>
                        
                        <Badge 
                          variant={user.estado === 'activo' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
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
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <IdCard className="h-4 w-4" />
                          <span>
                            {getDocumentTypeLabel(user.tipo_documento)} - {user.documento}
                          </span>
                        </div>
                        
                        {user.celular && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" />
                            <span>{user.celular}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(user.fecha_creacion)}</span>
                        </div>
                        
                        {selectedUserId === user.id && (
                          <div className="mt-3 p-2 bg-blue-100 rounded text-xs">
                            <p className="font-medium text-blue-700">UUID:</p>
                            <p className="font-mono text-blue-600 break-all">{user.id}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-end space-x-2 mt-4 pt-3 border-t">
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeactivateUser(user.id);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReactivateUser(user.id);
                            }}
                            className="text-green-600 hover:text-green-700"
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Vista de Tabla */}
            {viewMode === 'table' && (
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
            )}

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
                  Comienza creando tu primer usuario en el sistema
                </p>
                <Link href="/dashboard/usuarios/crear">
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Crear Usuario
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