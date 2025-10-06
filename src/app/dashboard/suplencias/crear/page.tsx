// app/dashboard/suplencias/crear/page.tsx
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSuplencias, useJornadas } from '@/hooks/useSuplencias';
import { useEmpleados } from '@/hooks/useEmpleados';
import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  UserX, 
  ArrowLeft, 
  Save,
  Upload,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ICreateSuplencia } from '@/types/suplencia.types';

type FlowStep = 'form' | 'uploading' | 'success' | 'error';

function CrearSuplenciaContent() {
  const router = useRouter();
  const { crearSuplenciaCompleta, loading: suplenciaLoading } = useSuplencias();
  const { empleados, loadEmpleados } = useEmpleados({ autoLoad: true });
  const { jornadas } = useJornadas();

  const [flowStep, setFlowStep] = useState<FlowStep>('form');
  const [progress, setProgress] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [createdId, setCreatedId] = useState('');

  const [formData, setFormData] = useState({
    docente_ausente_id: '',
    causa_ausencia: '',
    fecha_inicio_ausencia: '',
    fecha_fin_ausencia: '',
    sede_id: 'default-sede-id', // Por ahora un valor por defecto
    docente_reemplazo_id: '',
    fecha_inicio_reemplazo: '',
    fecha_fin_reemplazo: '',
    horas_cubiertas: 1,
    jornada: 'ma_ana' as const,
    observacion: '',
  });

  const [archivos, setArchivos] = useState<File[]>([]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setArchivos(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setArchivos(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    if (!formData.docente_ausente_id) {
      alert('Selecciona el docente ausente');
      return false;
    }
    if (!formData.causa_ausencia.trim()) {
      alert('Ingresa la causa de ausencia');
      return false;
    }
    if (!formData.fecha_inicio_ausencia || !formData.fecha_fin_ausencia) {
      alert('Ingresa las fechas de ausencia');
      return false;
    }
    if (!formData.docente_reemplazo_id) {
      alert('Selecciona el docente de reemplazo');
      return false;
    }
    if (formData.docente_ausente_id === formData.docente_reemplazo_id) {
      alert('El docente ausente y el docente de reemplazo deben ser diferentes');
      return false;
    }
    if (!formData.fecha_inicio_reemplazo || !formData.fecha_fin_reemplazo) {
      alert('Ingresa las fechas de reemplazo');
      return false;
    }
    if (formData.horas_cubiertas < 1 || formData.horas_cubiertas > 24) {
      alert('Las horas cubiertas deben estar entre 1 y 24');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setFlowStep('uploading');
    setProgress('Iniciando proceso...');

    try {
      // Ejecutar el flujo completo de 3 promesas
      setProgress('Paso 1/3: Creando suplencia...');
      
      const result = await crearSuplenciaCompleta(formData as ICreateSuplencia, archivos);

      setProgress('¡Proceso completado exitosamente!');
      setFlowStep('success');
      setCreatedId(result.suplencia.id);

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push(`/dashboard/suplencias/${result.suplencia.id}`);
      }, 2000);

    } catch (error: any) {
      console.error('Error creando suplencia:', error);
      setErrorMsg(error.message || 'Error desconocido');
      setFlowStep('error');
    }
  };

  const getDocenteNombre = (id: string) => {
    const empleado = empleados.find(e => e.id === id);
    return empleado ? `${empleado.nombre} ${empleado.apellido}` : '';
  };

  // Solo docentes
  const docentes = empleados.filter(emp => emp.cargo === 'Docente');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <Link href="/dashboard/suplencias">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Suplencias
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <UserX className="h-8 w-8 text-orange-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Crear Nueva Suplencia</h1>
              <p className="text-sm text-gray-500">Registra un reemplazo docente</p>
            </div>
          </div>
        </div>

        {/* Flujo de carga */}
        {flowStep === 'uploading' && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="py-6">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">{progress}</p>
                  <p className="text-sm text-blue-600">Por favor espera...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success */}
        {flowStep === 'success' && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="py-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">¡Suplencia creada exitosamente!</p>
                  <p className="text-sm text-green-600">Redirigiendo a los detalles...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error */}
        {flowStep === 'error' && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-600">
              <strong>Error:</strong> {errorMsg}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setFlowStep('form')}
                className="ml-4"
              >
                Reintentar
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Formulario */}
        {(flowStep === 'form' || flowStep === 'error') && (
          <form onSubmit={handleSubmit}>
            
            {/* Información del Docente Ausente */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Docente Ausente</CardTitle>
                <CardDescription>Información sobre la ausencia</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <div>
                  <Label htmlFor="docente_ausente_id">Docente Ausente *</Label>
                  <Select
                    value={formData.docente_ausente_id}
                    onValueChange={(value) => handleInputChange('docente_ausente_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el docente" />
                    </SelectTrigger>
                    <SelectContent>
                      {docentes.map(docente => (
                        <SelectItem key={docente.id} value={docente.id}>
                          {docente.nombre} {docente.apellido} - {docente.documento}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="causa_ausencia">Causa de Ausencia *</Label>
                  <Input
                    id="causa_ausencia"
                    value={formData.causa_ausencia}
                    onChange={(e) => handleInputChange('causa_ausencia', e.target.value)}
                    placeholder="Ej: Incapacidad médica, Permiso personal..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fecha_inicio_ausencia">Fecha Inicio Ausencia *</Label>
                    <Input
                      id="fecha_inicio_ausencia"
                      type="date"
                      value={formData.fecha_inicio_ausencia}
                      onChange={(e) => handleInputChange('fecha_inicio_ausencia', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="fecha_fin_ausencia">Fecha Fin Ausencia *</Label>
                    <Input
                      id="fecha_fin_ausencia"
                      type="date"
                      value={formData.fecha_fin_ausencia}
                      onChange={(e) => handleInputChange('fecha_fin_ausencia', e.target.value)}
                      required
                    />
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Información del Docente de Reemplazo */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Docente de Reemplazo</CardTitle>
                <CardDescription>Información sobre el reemplazo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <div>
                  <Label htmlFor="docente_reemplazo_id">Docente de Reemplazo *</Label>
                  <Select
                    value={formData.docente_reemplazo_id}
                    onValueChange={(value) => handleInputChange('docente_reemplazo_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el docente" />
                    </SelectTrigger>
                    <SelectContent>
                      {docentes
                        .filter(d => d.id !== formData.docente_ausente_id)
                        .map(docente => (
                          <SelectItem key={docente.id} value={docente.id}>
                            {docente.nombre} {docente.apellido} - {docente.documento}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fecha_inicio_reemplazo">Fecha Inicio Reemplazo *</Label>
                    <Input
                      id="fecha_inicio_reemplazo"
                      type="date"
                      value={formData.fecha_inicio_reemplazo}
                      onChange={(e) => handleInputChange('fecha_inicio_reemplazo', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="fecha_fin_reemplazo">Fecha Fin Reemplazo *</Label>
                    <Input
                      id="fecha_fin_reemplazo"
                      type="date"
                      value={formData.fecha_fin_reemplazo}
                      onChange={(e) => handleInputChange('fecha_fin_reemplazo', e.target.value)}
                      required
                    />
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Detalles del Reemplazo */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Detalles del Reemplazo</CardTitle>
                <CardDescription>Información adicional</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="horas_cubiertas">Horas Cubiertas *</Label>
                    <Input
                      id="horas_cubiertas"
                      type="number"
                      min="1"
                      max="24"
                      value={formData.horas_cubiertas}
                      onChange={(e) => handleInputChange('horas_cubiertas', parseInt(e.target.value))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="jornada">Jornada *</Label>
                    <Select
                      value={formData.jornada}
                      onValueChange={(value: any) => handleInputChange('jornada', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la jornada" />
                      </SelectTrigger>
                      <SelectContent>
                        {jornadas.map(jornada => (
                          <SelectItem key={jornada.valor} value={jornada.valor}>
                            {jornada.descripcion} ({jornada.ejemplo})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="observacion">Observaciones</Label>
                  <Textarea
                    id="observacion"
                    value={formData.observacion}
                    onChange={(e) => handleInputChange('observacion', e.target.value)}
                    placeholder="Información adicional sobre la suplencia..."
                    rows={4}
                  />
                </div>

              </CardContent>
            </Card>

            {/* Documentos */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Documentos de Soporte
                </CardTitle>
                <CardDescription>
                  Certificados médicos, permisos, etc. (Opcional)
                </CardDescription>
              </CardHeader>
              <CardContent>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      Haz click para subir archivos
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      PDF, JPG, PNG, DOC (Max 10MB cada uno)
                    </span>
                  </label>
                </div>

                {/* Lista de archivos */}
                {archivos.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {archivos.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Upload className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

              </CardContent>
            </Card>

            {/* Botones */}
            <div className="flex justify-end gap-4">
              <Link href="/dashboard/suplencias">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button 
                type="submit" 
                disabled={suplenciaLoading}
              >
                {suplenciaLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Crear Suplencia
                  </>
                )}
              </Button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}

export default function CrearSuplenciaPage() {
  return (
    <ProtectedRoute requiredRole={['super_admin', 'admin', 'gestor']}>
      <CrearSuplenciaContent />
    </ProtectedRoute>
  );
}
