"use client"

import { useState, useEffect } from 'react'
import JwtAuthService from '@/services/jwt-auth.service'
import { User } from '@/types/auth.types'
import { UserEditDialog } from './user-edit-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Users, 
  Search, 
  Filter, 
  Edit, 
  Loader2, 
  AlertCircle,
  RefreshCw,
  Shield,
  Crown,
  User as UserIcon
} from "lucide-react"

export function UsersManagementTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [stateFilter, setStateFilter] = useState<string>('all')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await JwtAuthService.getAllUsers()

      if (response.success && response.data) {
        setUsers(response.data)
      } else {
        throw new Error(response.message || 'Error al cargar usuarios')
      }
    } catch (err: any) {
      console.error('❌ [USERS-TABLE] Error:', err)
      setError(err.message || 'Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  const handleEditUser = (user: User) => {
  
    setSelectedUser(user)
    setTimeout(() => {
      setEditDialogOpen(true)
    }, 0)
  }

  const handleEditSuccess = () => {
    loadUsers()
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.documento.includes(searchTerm)

    const matchesRole = roleFilter === 'all' || user.rol === roleFilter
    const matchesState = stateFilter === 'all' || user.estado === stateFilter

    return matchesSearch && matchesRole && matchesState
  })

  const getRoleBadge = (rol: string) => {
    switch (rol) {
      case 'super_admin':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <Crown className="h-3 w-3" />
            Super Admin
          </Badge>
        )
      case 'admin':
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Admin
          </Badge>
        )
      case 'gestor':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <UserIcon className="h-3 w-3" />
            Gestor
          </Badge>
        )
      default:
        return <Badge variant="outline">{rol}</Badge>
    }
  }

  const getStateBadge = (estado: string) => {
    return estado === 'activo' ? (
      <Badge variant="default" className="bg-green-600">Activo</Badge>
    ) : (
      <Badge variant="destructive">Inactivo</Badge>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Gestión de Usuarios
              </CardTitle>
              <CardDescription>
                Administra todos los usuarios del sistema
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {/* Botón de prueba para verificar que los clicks funcionan */}
              <Button
                onClick={() => {
                  console.log('🧪 [TEST] Botón de prueba clickeado!')
                  alert('Los clicks funcionan! El problema está en otro lado.')
                }}
                variant="default"
                size="sm"
              >
                🧪 Test Click
              </Button>
              
              <Button 
                onClick={loadUsers} 
                disabled={loading}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Recargar
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Filtros */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtros:</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Búsqueda */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre, email o documento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtro por Rol */}
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="gestor">Gestor</SelectItem>
                </SelectContent>
              </Select>

              {/* Filtro por Estado */}
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="activo">Activos</SelectItem>
                  <SelectItem value="inactivo">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Contador de resultados */}
            <div className="text-sm text-gray-600">
              Mostrando <strong>{filteredUsers.length}</strong> de <strong>{users.length}</strong> usuarios
            </div>
          </div>

          {/* Error */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Cargando usuarios...</span>
            </div>
          )}

          {/* Tabla */}
          {!loading && filteredUsers.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Celular</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.nombre} {user.apellido}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{user.documento}</span>
                          <span className="text-xs text-gray-500">{user.tipo_documento}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.celular || '-'}</TableCell>
                      <TableCell>{getRoleBadge(user.rol)}</TableCell>
                      <TableCell>{getStateBadge(user.estado)}</TableCell>
                      <TableCell className="text-right">
                        {/* Botón nativo HTML como fallback más confiable */}
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log('🖱️ [USERS-TABLE] Click detectado en botón Editar')
                            console.log('👤 [USERS-TABLE] Usuario a editar:', user.id, user.nombre)
                            handleEditUser(user)
                          }}
                          type="button"
                          className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100 h-9 px-3 cursor-pointer"
                          style={{
                            border: '1px solid #e5e7eb',
                            backgroundColor: 'white',
                            pointerEvents: 'auto'
                          }}
                        >
                          <Edit className="h-4 w-4" />
                          <span>Editar</span>
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Sin resultados */}
          {!loading && filteredUsers.length === 0 && users.length > 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No se encontraron usuarios con los filtros aplicados</p>
              <Button 
                variant="link" 
                onClick={() => {
                  setSearchTerm('')
                  setRoleFilter('all')
                  setStateFilter('all')
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          )}

          {/* Sin usuarios */}
          {!loading && users.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No hay usuarios registrados</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de edición */}
      <UserEditDialog
        user={selectedUser}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={handleEditSuccess}
      />
    </>
  )
}

export default UsersManagementTable
