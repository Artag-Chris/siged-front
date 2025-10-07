
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCrearActoAdministrativo } from '@/hooks/useActosAdministrativos';
import { useInstituciones } from '@/hooks/useInstituciones';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Save,
  Loader2,
  Upload,
  X,
  FileText,
  CheckCircle2,
  AlertCircle,
  Building2,
} from 'lucide-react';
import { ActoAdministrativoFormData } from '@/types/actos-administrativos.types';

export default function CrearActoAdministrativoPage() {
  const router = useRouter();
  const { crearActoAdministrativo, flowStatus, resetFlow } = useCrearActoAdministrativo();
  const { instituciones, loading: loadingInstituciones } = useInstituciones({ autoLoad: true });

  // Form state
  const [formData, setFormData] = useState<ActoAdministrativoFormData>({
    institucion_educativa_id: '',
    descripcion: '',
    archivos: [],
  });

  const [archivosPreview, setArchivosPreview] = useState<
    Array<{ file: File; name: string; size: string }>
  >([]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    // Agregar archivos
    const newArchivos = [...formData.archivos, ...files];
    setFormData({ ...formData, archivos: newArchivos });

    // Actualizar preview
    const newPreviews = files.map((file) => ({
      file,
      name: file.name,
      size: `${(file.size / 1024).toFixed(2)} KB`,
    }));
    setArchivosPreview([...archivosPreview, ...newPreviews]);

    // Reset input
    e.target.value = '';
  };

  // Remove file
  const handleRemoveFile = (index: number) => {
    const newArchivos = formData.archivos.filter((_, i) => i !== index);
    const newPreviews = archivosPreview.filter((_, i) => i !== index);
    
    setFormData({ ...formData, archivos: newArchivos });
    setArchivosPreview(newPreviews);
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.institucion_educativa_id) {
      alert('Debe seleccionar una institución educativa');
      return;
    }

    if (formData.archivos.length === 0) {
      alert('Debe subir al menos un archivo');
      return;
    }

    try {
      const result = await crearActoAdministrativo(formData);
      
      console.log('✅ Acto administrativo creado:', result.actoAdministrativo.nombre);

      // Esperar 2 segundos para mostrar el mensaje de éxito
      setTimeout(() => {
        router.push('/dashboard/actos-administrativos');
      }, 2000);
    } catch (error: any) {
      console.error('❌ Error creando acto:', error);
      // El error ya se maneja en flowStatus
    }
  };

  // Reset cuando hay error
  const handleTryAgain = () => {
    resetFlow();
  };

  // Deshabilitar formulario durante el flujo
  const isFormDisabled = flowStatus.state === 'uploading' || flowStatus.state === 'success';

  return (
    <div className="container mx-auto py-6 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard/actos-administrativos')}
          disabled={isFormDisabled}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Acto Administrativo</h1>
          <p className="text-gray-500 mt-1">
            El nombre se generará automáticamente: "Resolución I.E [Institución]-[Consecutivo]"
          </p>
        </div>
      </div>

      {/* Flow Status Messages */}
      {flowStatus.state === 'uploading' && (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>
            {flowStatus.currentStep === 1 && 'Paso 1/3: Creando acto administrativo...'}
            {flowStatus.currentStep === 2 && 'Paso 2/3: Subiendo archivos a Document API...'}
            {flowStatus.currentStep === 3 && 'Paso 3/3: Registrando documentos en base de datos...'}
          </AlertDescription>
        </Alert>
      )}

      {flowStatus.state === 'success' && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {flowStatus.message}
          </AlertDescription>
        </Alert>
      )}

      {flowStatus.state === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p>{flowStatus.error}</p>
              <Button variant="outline" size="sm" onClick={handleTryAgain}>
                Intentar de nuevo
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Información del Acto */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Acto Administrativo</CardTitle>
              <CardDescription>
                Complete los datos del acto administrativo. El nombre se generará automáticamente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Institución Educativa */}
              <div className="space-y-2">
                <Label htmlFor="institucion">
                  Institución Educativa <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.institucion_educativa_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, institucion_educativa_id: value })
                  }
                  disabled={isFormDisabled || loadingInstituciones}
                >
                  <SelectTrigger id="institucion">
                    <SelectValue placeholder="Seleccione una institución educativa" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingInstituciones ? (
                      <SelectItem value="loading" disabled>
                        <div className="flex items-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Cargando instituciones educativas...
                        </div>
                      </SelectItem>
                    ) : instituciones.length === 0 ? (
                      <SelectItem value="no-data" disabled>
                        <div className="flex items-center text-gray-500">
                          <AlertCircle className="mr-2 h-4 w-4" />
                          No hay instituciones disponibles
                        </div>
                      </SelectItem>
                    ) : (
                      instituciones.map((institucion) => (
                        <SelectItem key={institucion.id} value={institucion.id}>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <div className="flex flex-col">
                              <span className="font-medium">{institucion.nombre}</span>
                              {institucion.empleado && (
                                <span className="text-xs text-gray-500">
                                  Rector: {institucion.empleado.nombre} {institucion.empleado.apellido}
                                </span>
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  El nombre se generará como: "Resolución I.E [Nombre Institución]-[Consecutivo]"
                </p>
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción (Opcional)</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Descripción del acto administrativo..."
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  disabled={isFormDisabled}
                  rows={4}
                  maxLength={1000}
                />
                <p className="text-sm text-gray-500">
                  {formData.descripcion.length}/1000 caracteres
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Documentos */}
          <Card>
            <CardHeader>
              <CardTitle>Documentos</CardTitle>
              <CardDescription>
                Suba al menos un documento para el acto administrativo (OBLIGATORIO)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload Button */}
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file-upload"
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${
                    isFormDisabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click para subir</span> o arrastra archivos
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX, imágenes</p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    disabled={isFormDisabled}
                  />
                </label>
              </div>

              {/* Files Preview */}
              {archivosPreview.length > 0 && (
                <div className="space-y-2">
                  <Label>Archivos seleccionados ({archivosPreview.length})</Label>
                  <div className="space-y-2">
                    {archivosPreview.map((preview, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {preview.name}
                            </p>
                            <p className="text-xs text-gray-500">{preview.size}</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFile(index)}
                          disabled={isFormDisabled}
                          className="flex-shrink-0"
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {archivosPreview.length === 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Debe subir al menos un archivo para crear el acto administrativo
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard/actos-administrativos')}
                  disabled={isFormDisabled}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isFormDisabled ||
                    !formData.institucion_educativa_id ||
                    formData.archivos.length === 0
                  }
                >
                  {flowStatus.state === 'uploading' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Crear Acto Administrativo
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
