// components/user-edit-dialog.tsx
// Dialog completo para editar cualquier usuario (admin)

"use client"

import { useState, useEffect } from 'react'
import { useJwtAuth } from '@/hooks/useJwtAuth'
import { User, UpdateUserRequest, DOCUMENT_TYPES, USER_ROLES, USER_STATES } from '@/types/auth.types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  User as UserIcon, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  Shield,
  Loader2,
  Phone,
  IdCard,
  FileText
} from "lucide-react"

interface UserEditDialogProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function UserEditDialog({ 
  user, 
  open, 
  onOpenChange,
  onSuccess 
}: UserEditDialogProps) {
  const { updateUser, error, clearError } = useJwtAuth()
  
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)
  
  // Formulario
  const [formData, setFormData] = useState<UpdateUserRequest>({
    tipo_documento: 'CC',
    documento: '',
    nombre: '',
    apellido: '',
    email: '',
    celular: '',
    rol: 'gestor',
    estado: 'activo',
    contrasena: ''
  })
  
  const [confirmPassword, setConfirmPassword] = useState('')

  // Cargar datos del usuario cuando se abre el dialog
  useEffect(() => {
    console.log('🔄 [USER-EDIT-DIALOG] useEffect triggered:', { open, hasUser: !!user })
    if (open && user) {
      console.log('✅ [USER-EDIT-DIALOG] Loading user data:', user)
      setFormData({
        tipo_documento: user.tipo_documento as any,
        documento: user.documento,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        celular: user.celular || '',
        rol: user.rol,
        estado: user.estado,
        contrasena: ''
      })
      setConfirmPassword('')
      setSuccessMessage(null)
      setLocalError(null)
      clearError()
      console.log('📋 [USER-EDIT-DIALOG] Form data loaded')
    } else {
      console.log('⚠️ [USER-EDIT-DIALOG] Dialog not opening:', { open, user })
    }
  }, [open, user, clearError])

  const handleInputChange = (field: keyof UpdateUserRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setLocalError(null)
    setSuccessMessage(null)
  }

  const validateForm = (): boolean => {
    // Validar campos requeridos
    if (!formData.tipo_documento || !formData.documento || !formData.nombre || 
        !formData.apellido || !formData.email || !formData.rol || !formData.estado) {
      setLocalError('Todos los campos marcados con * son obligatorios')
      return false
    }

    // Validar nombre y apellido
    if (formData.nombre.trim().length < 2) {
      setLocalError('El nombre debe tener al menos 2 caracteres')
      return false
    }

    if (formData.apellido.trim().length < 2) {
      setLocalError('El apellido debe tener al menos 2 caracteres')
      return false
    }

    // Validar documento
    if (formData.documento.trim().length < 5) {
      setLocalError('El documento debe tener al menos 5 caracteres')
      return false
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setLocalError('Por favor ingresa un email válido')
      return false
    }

    // Validar celular si se proporcionó
    if (formData.celular && formData.celular.length < 10) {
      setLocalError('El celular debe tener al menos 10 dígitos')
      return false
    }

    // Validar contraseña si se proporcionó
    if (formData.contrasena && formData.contrasena.length > 0) {
      if (formData.contrasena.length < 6) {
        setLocalError('La contraseña debe tener al menos 6 caracteres')
        return false
      }

      if (formData.contrasena !== confirmPassword) {
        setLocalError('Las contraseñas no coinciden')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.id) {
      setLocalError('No se pudo identificar el usuario')
      return
    }

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setLocalError(null)
    setSuccessMessage(null)
    clearError()

    try {
      // Construir el objeto de actualización
      const updateData: UpdateUserRequest = {
        tipo_documento: formData.tipo_documento,
        documento: formData.documento?.trim(),
        nombre: formData.nombre?.trim(),
        apellido: formData.apellido?.trim(),
        email: formData.email?.trim().toLowerCase(),
        celular: formData.celular?.trim(),
        rol: formData.rol,
        estado: formData.estado
      }

      // Solo agregar contraseña si se proporcionó
      if (formData.contrasena && formData.contrasena.length > 0) {
        updateData.contrasena = formData.contrasena
      }

      console.log('📤 [USER-EDIT-DIALOG] Enviando actualización:', {
        userId: user.id,
        fields: Object.keys(updateData).filter(k => updateData[k as keyof UpdateUserRequest])
      })

      const success = await updateUser(user.id, updateData)

      if (success) {
        setSuccessMessage('✅ Usuario actualizado exitosamente')
        
        // Limpiar campos de contraseña
        setFormData(prev => ({ ...prev, contrasena: '' }))
        setConfirmPassword('')

        // Llamar callback de éxito
        onSuccess?.()

        // Cerrar el dialog después de 1.5 segundos
        setTimeout(() => {
          onOpenChange(false)
        }, 1500)
      } else {
        setLocalError(error || 'Error al actualizar el usuario')
      }
    } catch (err: any) {
      setLocalError(err.message || 'Error inesperado al actualizar')
      console.error('❌ [USER-EDIT-DIALOG] Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  console.log('🎨 [USER-EDIT-DIALOG] Render:', { open, hasUser: !!user, userId: user?.id })

  if (!user) {
    console.log('⚠️ [USER-EDIT-DIALOG] No user provided, returning null')
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-blue-600" />
            Editar Usuario
          </DialogTitle>
          <DialogDescription>
            Modifica la información del usuario {user.nombre} {user.apellido}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            
            {/* User ID y Estado */}
            <div className="flex items-center justify-between pb-2 border-b">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">ID:</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">{user.id}</code>
              </div>
              <Badge variant={formData.estado === 'activo' ? 'default' : 'destructive'}>
                {formData.estado}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Tipo de Documento */}
              <div className="space-y-2">
                <Label htmlFor="tipo_documento" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Tipo Documento *
                </Label>
                <Select
                  value={formData.tipo_documento}
                  onValueChange={(value) => handleInputChange('tipo_documento', value as any)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={DOCUMENT_TYPES.CC}>Cédula de Ciudadanía</SelectItem>
                    <SelectItem value={DOCUMENT_TYPES.CE}>Cédula de Extranjería</SelectItem>
                    <SelectItem value={DOCUMENT_TYPES.TI}>Tarjeta de Identidad</SelectItem>
                    <SelectItem value={DOCUMENT_TYPES.PP}>Pasaporte</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Documento */}
              <div className="space-y-2">
                <Label htmlFor="documento" className="flex items-center gap-2">
                  <IdCard className="h-4 w-4" />
                  Documento *
                </Label>
                <Input
                  id="documento"
                  type="text"
                  value={formData.documento}
                  onChange={(e) => handleInputChange('documento', e.target.value)}
                  placeholder="Número de documento"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombre" className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  Nombre *
                </Label>
                <Input
                  id="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  placeholder="Nombre"
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Apellido */}
              <div className="space-y-2">
                <Label htmlFor="apellido">
                  Apellido *
                </Label>
                <Input
                  id="apellido"
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => handleInputChange('apellido', e.target.value)}
                  placeholder="Apellido"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Correo electrónico *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="correo@ejemplo.com"
                disabled={isLoading}
                required
              />
            </div>

            {/* Celular */}
            <div className="space-y-2">
              <Label htmlFor="celular" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Celular
              </Label>
              <Input
                id="celular"
                type="tel"
                value={formData.celular}
                onChange={(e) => handleInputChange('celular', e.target.value)}
                placeholder="3001234567"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Rol */}
              <div className="space-y-2">
                <Label htmlFor="rol" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Rol *
                </Label>
                <Select
                  value={formData.rol}
                  onValueChange={(value) => handleInputChange('rol', value as any)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={USER_ROLES.SUPER_ADMIN}>Super Admin</SelectItem>
                    <SelectItem value={USER_ROLES.ADMIN}>Administrador</SelectItem>
                    <SelectItem value={USER_ROLES.GESTOR}>Gestor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <Label htmlFor="estado">
                  Estado *
                </Label>
                <Select
                  value={formData.estado}
                  onValueChange={(value) => handleInputChange('estado', value as any)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={USER_STATES.ACTIVE}>Activo</SelectItem>
                    <SelectItem value={USER_STATES.INACTIVE}>Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Divisor */}
            <div className="pt-2 border-t">
              <p className="text-sm text-gray-600 mb-3">
                <Lock className="h-4 w-4 inline mr-1" />
                Cambiar contraseña (opcional - dejar vacío para no cambiar)
              </p>
            </div>

            {/* Nueva Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="contrasena">Nueva contraseña</Label>
              <div className="relative">
                <Input
                  id="contrasena"
                  type={showPassword ? "text" : "password"}
                  value={formData.contrasena || ''}
                  onChange={(e) => handleInputChange('contrasena', e.target.value)}
                  placeholder="Dejar vacío para no cambiar"
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Mínimo 6 caracteres
              </p>
            </div>

            {/* Confirmar Contraseña */}
            {formData.contrasena && formData.contrasena.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirma la nueva contraseña"
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={isLoading}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Mensajes */}
            {successMessage && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}

            {(localError || error) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {localError || error}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar cambios'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UserEditDialog
