// app/dashboard/horas-extra/crear/page.tsx
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useHorasExtra, useJornadasHorasExtra } from '@/hooks/useHorasExtra';
import { useEmpleados } from '@/hooks/useEmpleados';
import { useSedes } from '@/hooks/useSedes';
import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Clock, 
  ArrowLeft, 
  Save,
  Upload,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Building2,
  User,
  Calendar
} from 'lucide-react';
import { ICreateHoraExtra } from '@/types/horas-extra.types';

type FlowStep = 'form' | 'uploading' | 'success' | 'error';

function CrearHoraExtraContent() {
  const router = useRouter();
  const { crearHoraExtraCompleta, loading: horaExtraLoading } = useHorasExtra();
  const { empleados } = useEmpleados({ autoLoad: true });
  const { sedes, loading: sedesLoading } = useSedes({ autoLoad: true, estado: 'activa' });
  const { jornadas } = useJornadasHorasExtra();

  const [flowStep, setFlowStep] = useState<FlowStep>('form');
  const [progress, setProgress] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
//  const [createdId, setCreatedId] = useState('');

  const [formData, setFormData] = useState({
    empleado_id: '',
    sede_id: '',
    cantidad_horas: 1,
    fecha_realizacion: '',
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
    if (!formData.sede_id) {
      alert('Selecciona la sede');
      return false;
    }
    if (!formData.empleado_id) {
      alert('Selecciona el empleado');
      return false;
    }
    if (!formData.fecha_realizacion) {
      alert('Ingresa la fecha de realización');
      return false;
    }
    if (formData.cantidad_horas < 0.5 || formData.cantidad_horas > 24) {
      alert('La cantidad de horas debe estar entre 0.5 y 24');
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
      setProgress('Creando registro de horas extra...');
      
      const result = await crearHoraExtraCompleta(formData as ICreateHoraExtra, archivos);

      setProgress('¡Proceso completado exitosamente!');
      setFlowStep('success');
    //  setCreatedId(result.horaExtra.id);

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push(`/dashboard/horas-extra`);
      }, 2000);

    } catch (error: any) {
      console.error('Error creando hora extra:', error);
      setErrorMsg(error.message || 'Error desconocido');
      setFlowStep('error');
    }
  };

  // Filtrar empleados (solo personal activo)
  const empleadosActivos = empleados.filter(emp => emp.estado === 'activo');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <Link href="/dashboard/horas-extra">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Horas Extra
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Registrar Horas Extra</h1>
              <p className="text-sm text-gray-500">Registra las horas extra realizadas por un empleado</p>
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
                  <p className="font-medium text-green-900">¡Registro creado exitosamente!</p>
                  <p className="text-sm text-green-600">Redirigiendo...</p>
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
            
            {/* Información de la Sede */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Sede
                </CardTitle>
                <CardDescription>Selecciona la sede donde se realizaron las horas extra</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="sede_id">Sede *</Label>
                  {sedesLoading ? (
                    <div className="flex items-center gap-2 p-3 border rounded-md bg-gray-50">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                      <span className="text-sm text-gray-600">Cargando sedes...</span>
                    </div>
                  ) : (
                    <Select
                      value={formData.sede_id}
                      onValueChange={(value) => handleInputChange('sede_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la sede" />
                      </SelectTrigger>
                      <SelectContent>
                        {sedes.map(sede => (
                          <SelectItem key={sede.id} value={sede.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{sede.nombre}</span>
                              <span className="text-xs text-gray-500">
                                {sede.direccion} - {sede.zona === 'urbana' ? 'Urbana' : 'Rural'}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Información del Empleado */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-600" />
                  Empleado
                </CardTitle>
                <CardDescription>Selecciona el empleado que realizó las horas extra</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="empleado_id">Empleado *</Label>
                  <Select
                    value={formData.empleado_id}
                    onValueChange={(value) => handleInputChange('empleado_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el empleado" />
                    </SelectTrigger>
                    <SelectContent>
                      {empleadosActivos.map(empleado => (
                        <SelectItem key={empleado.id} value={empleado.id}>
                          {empleado.nombre} {empleado.apellido} - {empleado.documento} ({empleado.cargo})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Detalles de las Horas Extra */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  Detalles de las Horas Extra
                </CardTitle>
                <CardDescription>Información sobre las horas realizadas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fecha_realizacion">Fecha de Realización *</Label>
                    <Input
                      id="fecha_realizacion"
                      type="date"
                      value={formData.fecha_realizacion}
                      onChange={(e) => handleInputChange('fecha_realizacion', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cantidad_horas">Cantidad de Horas *</Label>
                    <Input
                      id="cantidad_horas"
                      type="number"
                      min="0.5"
                      max="24"
                      step="0.5"
                      value={formData.cantidad_horas}
                      onChange={(e) => handleInputChange('cantidad_horas', parseFloat(e.target.value))}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Ingresa valores con decimales (ej: 4.5)</p>
                  </div>
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

                <div>
                  <Label htmlFor="observacion">Observaciones</Label>
                  <Textarea
                    id="observacion"
                    value={formData.observacion}
                    onChange={(e) => handleInputChange('observacion', e.target.value)}
                    placeholder="Información adicional sobre las horas extra..."
                    rows={4}
                  />
                </div>

              </CardContent>
            </Card>

            {/* Documentos (Opcional) */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Documentos de Respaldo
                  <span className="text-xs font-normal text-gray-500">(Opcional)</span>
                </CardTitle>
                <CardDescription>
                  Autorizaciones, comprobantes, etc.
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
                      Haz click para subir archivos (Opcional)
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
              <Link href="/dashboard/horas-extra">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button 
                type="submit" 
                disabled={horaExtraLoading}
              >
                {horaExtraLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Registrar Horas Extra
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

export default function CrearHoraExtraPage() {
  return (
    <ProtectedRoute requiredRole={['super_admin', 'admin', 'gestor']}>
      <CrearHoraExtraContent />
    </ProtectedRoute>
  );
}
