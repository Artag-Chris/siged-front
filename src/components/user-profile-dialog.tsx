// components/user-profile-dialog.tsx
// Dialog para editar perfil de usuario con cambio de contraseña

"use client"

import { useState, useEffect } from 'react'
import { useJwtAuth } from '@/hooks/useJwtAuth'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  Shield,
  Loader2
} from "lucide-react"

interface UserProfileDialogProps {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function UserProfileDialog({ 
  trigger, 
  open, 
  onOpenChange 
}: UserProfileDialogProps) {
  const { user, updateUser, error, clearError } = useJwtAuth()
  
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)
  
  // Formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    contrasena: '',
    confirmPassword: ''
  })

  // Sincronizar con props de control externo
  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  // Cargar datos del usuario cuando se abre el dialog
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        nombre: user.nombre || '',
        email: user.email || '',
        contrasena: '',
        confirmPassword: ''
      })
      setSuccessMessage(null)
      setLocalError(null)
      clearError()
    }
  }, [isOpen, user, clearError])

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setLocalError(null)
    setSuccessMessage(null)
  }

  const validateForm = (): boolean => {
    // Validar que al menos un campo esté lleno
    const hasChanges = 
      formData.nombre !== user?.nombre ||
      formData.email !== user?.email ||
      formData.contrasena.length > 0

    if (!hasChanges) {
      setLocalError('No se detectaron cambios para actualizar')
      return false
    }

    // Validar nombre
    if (formData.nombre.trim().length < 3) {
      setLocalError('El nombre debe tener al menos 3 caracteres')
      return false
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setLocalError('Por favor ingresa un email válido')
      return false
    }

    // Validar contraseña si se proporcionó
    if (formData.contrasena.length > 0) {
      if (formData.contrasena.length < 6) {
        setLocalError('La contraseña debe tener al menos 6 caracteres')
        return false
      }

      if (formData.contrasena !== formData.confirmPassword) {
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
      const updateData: any = {
        nombre: formData.nombre.trim(),
        email: formData.email.trim().toLowerCase(),
      }

      // Solo agregar contraseña si se proporcionó
      if (formData.contrasena.length > 0) {
        updateData.contrasena = formData.contrasena
      }

      console.log('📤 [PROFILE-DIALOG] Enviando actualización:', {
        userId: user.id,
        fields: Object.keys(updateData)
      })

      const success = await updateUser(user.id, updateData)

      if (success) {
        setSuccessMessage('✅ Perfil actualizado exitosamente')
        
        // Limpiar campos de contraseña
        setFormData(prev => ({
          ...prev,
          contrasena: '',
          confirmPassword: ''
        }))

        // Cerrar el dialog después de 2 segundos
        setTimeout(() => {
          handleOpenChange(false)
        }, 2000)
      } else {
        setLocalError(error || 'Error al actualizar el perfil')
      }
    } catch (err: any) {
      setLocalError(err.message || 'Error inesperado al actualizar')
      console.error('❌ [PROFILE-DIALOG] Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    handleOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Editar Perfil
          </DialogTitle>
          <DialogDescription>
            Actualiza tu información personal y contraseña
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            
            {/* Rol Badge */}
            <div className="flex items-center gap-2 pb-2 border-b">
              <Shield className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Rol actual:</span>
              <Badge variant={user?.rol === 'admin' ? 'destructive' : 'default'}>
                {user?.rol}
              </Badge>
            </div>

            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombre" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Nombre completo
              </Label>
              <Input
                id="nombre"
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ingresa tu nombre"
                disabled={isLoading}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Correo electrónico
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="correo@ejemplo.com"
                disabled={isLoading}
                required
              />
            </div>

            {/* Divisor */}
            <div className="pt-2 border-t">
              <p className="text-sm text-gray-600 mb-3">
                <Lock className="h-4 w-4 inline mr-1" />
                Cambiar contraseña (opcional)
              </p>
            </div>

            {/* Nueva Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="contrasena">Nueva contraseña</Label>
              <div className="relative">
                <Input
                  id="contrasena"
                  name="contrasena"
                  type={showPassword ? "text" : "password"}
                  value={formData.contrasena}
                  onChange={handleInputChange}
                  placeholder="Dejar vacío para no cambiar"
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Mínimo 6 caracteres
              </p>
            </div>

            {/* Confirmar Contraseña */}
            {formData.contrasena.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirma tu nueva contraseña"
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={isLoading}
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
                  Actualizando...
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

export default UserProfileDialog
