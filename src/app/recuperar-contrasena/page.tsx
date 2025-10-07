// app/recuperar-contrasena/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Smartphone,
  Shield,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { RecoveryStep } from '@/types/password-recovery.types';
import PasswordRecoveryService from '@/services/password-recovery.service';

export default function RecuperarContrasenaPage() {
  const router = useRouter();

  // Estado general
  const [step, setStep] = useState<RecoveryStep>('solicitar');
  const [documento, setDocumento] = useState('');
  const [celularParcial, setCelularParcial] = useState('');
  //const [validoHasta, setValidoHasta] = useState<Date | null>(null);
  const [usuarioNombre, setUsuarioNombre] = useState('');

  // Estado del paso 1: Solicitar código
  const [loadingSolicitar, setLoadingSolicitar] = useState(false);
  const [errorSolicitar, setErrorSolicitar] = useState<string | null>(null);

  // Estado del paso 2: Verificar código
  const [codigo, setCodigo] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [loadingVerificar, setLoadingVerificar] = useState(false);
  const [errorVerificar, setErrorVerificar] = useState<string | null>(null);
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const [puedeReenviar, setPuedeReenviar] = useState(false);
  const [loadingReenviar, setLoadingReenviar] = useState(false);

  // ============================================================================
  // PASO 1: Solicitar Código
  // ============================================================================
  const handleSolicitarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSolicitar(true);
    setErrorSolicitar(null);

    try {
      // Validar documento
      if (!PasswordRecoveryService.validarDocumento(documento)) {
        throw new Error('Número de documento inválido');
      }

      // Solicitar código
      const response = await PasswordRecoveryService.solicitarCodigo(documento);

      if (response.success && response.data) {
        setCelularParcial(response.data.celularParcial);
      //  setValidoHasta(new Date(response.data.validoHasta));
        setStep('verificar');

        // Iniciar contador de tiempo
        iniciarContador(new Date(response.data.validoHasta));
      }
    } catch (error: any) {
      console.error('Error:', error);
      setErrorSolicitar(error.message || 'Error al solicitar código');
    } finally {
      setLoadingSolicitar(false);
    }
  };

  // ============================================================================
  // PASO 2: Verificar Código y Cambiar Contraseña
  // ============================================================================
  const handleVerificarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingVerificar(true);
    setErrorVerificar(null);

    try {
      // Validar que las contraseñas coincidan
      if (nuevaContrasena !== confirmarContrasena) {
        throw new Error('Las contraseñas no coinciden');
      }

      // Verificar código y cambiar contraseña
      const response = await PasswordRecoveryService.verificarCodigoYCambiarContrasena(
        documento,
        codigo,
        nuevaContrasena
      );

      if (response.success && response.data) {
        setUsuarioNombre(response.data.usuario);
        setStep('exito');

        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (error: any) {
      console.error('Error:', error);
      setErrorVerificar(error.message || 'Error al verificar código');
    } finally {
      setLoadingVerificar(false);
    }
  };

  // ============================================================================
  // REENVIAR CÓDIGO
  // ============================================================================
  const handleReenviarCodigo = async () => {
    setLoadingReenviar(true);
    setErrorVerificar(null);

    try {
      const response = await PasswordRecoveryService.reenviarCodigo(documento);

      if (response.success && response.data) {
        setCelularParcial(response.data.celularParcial);
      //  setValidoHasta(new Date(response.data.validoHasta));
        setPuedeReenviar(false);
        iniciarContador(new Date(response.data.validoHasta));

        // Mostrar mensaje de éxito
        alert('✅ Código reenviado exitosamente');
      }
    } catch (error: any) {
      setErrorVerificar(error.message || 'Error al reenviar código');
    } finally {
      setLoadingReenviar(false);
    }
  };

  // ============================================================================
  // UTILIDADES
  // ============================================================================
  const iniciarContador = (expiracion: Date) => {
    const interval = setInterval(() => {
      const ahora = new Date().getTime();
      const exp = expiracion.getTime();
      const diferencia = exp - ahora;

      if (diferencia <= 0) {
        setTiempoRestante(0);
        setPuedeReenviar(true);
        clearInterval(interval);
      } else {
        setTiempoRestante(Math.floor(diferencia / 1000));
        // Permitir reenvío en el último minuto
        setPuedeReenviar(diferencia < 60000);
      }
    }, 1000);
  };

  const formatearTiempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}:${segs.toString().padStart(2, '0')}`;
  };

  const fortalezaContrasena = PasswordRecoveryService.calcularFortaleza(nuevaContrasena);
  const colorFortaleza = PasswordRecoveryService.getColorFortaleza(fortalezaContrasena);
  const textoFortaleza = PasswordRecoveryService.getTextoFortaleza(fortalezaContrasena);

  const handleVolverAlInicio = () => {
    setStep('solicitar');
    setDocumento('');
    setCodigo('');
    setNuevaContrasena('');
    setConfirmarContrasena('');
    setErrorSolicitar(null);
    setErrorVerificar(null);
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Recuperar Contraseña
          </h1>
          <p className="text-gray-600">
            Recupera el acceso a tu cuenta de forma segura
          </p>
        </div>

        {/* Indicador de pasos */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            {/* Paso 1 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === 'solicitar'
                    ? 'bg-blue-600 text-white'
                    : 'bg-green-500 text-white'
                }`}
              >
                {step === 'solicitar' ? '1' : <CheckCircle2 className="h-5 w-5" />}
              </div>
              <span className="text-xs mt-1 text-gray-600">Solicitar</span>
            </div>

            {/* Línea */}
            <div
              className={`w-16 h-1 mx-2 ${
                step === 'verificar' || step === 'exito' ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />

            {/* Paso 2 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === 'verificar'
                    ? 'bg-blue-600 text-white'
                    : step === 'exito'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {step === 'exito' ? <CheckCircle2 className="h-5 w-5" /> : '2'}
              </div>
              <span className="text-xs mt-1 text-gray-600">Verificar</span>
            </div>

            {/* Línea */}
            <div
              className={`w-16 h-1 mx-2 ${
                step === 'exito' ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />

            {/* Paso 3 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === 'exito'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {step === 'exito' ? <CheckCircle2 className="h-5 w-5" /> : '3'}
              </div>
              <span className="text-xs mt-1 text-gray-600">Éxito</span>
            </div>
          </div>
        </div>

        {/* Contenido según el paso */}
        <Card>
          <CardHeader>
            <CardTitle>
              {step === 'solicitar' && 'Solicitar Código de Verificación'}
              {step === 'verificar' && 'Verificar Código y Cambiar Contraseña'}
              {step === 'exito' && '¡Contraseña Cambiada!'}
            </CardTitle>
            <CardDescription>
              {step === 'solicitar' &&
                'Ingresa tu número de documento para recibir un código por SMS'}
              {step === 'verificar' &&
                'Ingresa el código recibido y tu nueva contraseña'}
              {step === 'exito' && 'Tu contraseña ha sido actualizada exitosamente'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* ========== PASO 1: SOLICITAR CÓDIGO ========== */}
            {step === 'solicitar' && (
              <form onSubmit={handleSolicitarCodigo} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="documento">Número de Documento</Label>
                  <Input
                    id="documento"
                    type="text"
                    placeholder="Ej: 1234567890"
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                    disabled={loadingSolicitar}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Recibirás un código de 6 dígitos en tu celular registrado
                  </p>
                </div>

                {errorSolicitar && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errorSolicitar}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loadingSolicitar || !documento}
                >
                  {loadingSolicitar ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando código...
                    </>
                  ) : (
                    <>
                      <Smartphone className="mr-2 h-4 w-4" />
                      Enviar Código por SMS
                    </>
                  )}
                </Button>

                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 text-sm">
                    <strong>Información importante:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                      <li>El código será válido por 15 minutos</li>
                      <li>Verifica que tu número de celular esté actualizado</li>
                      <li>Si no recibes el código, podrás solicitar un reenvío</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </form>
            )}

            {/* ========== PASO 2: VERIFICAR CÓDIGO ========== */}
            {step === 'verificar' && (
              <form onSubmit={handleVerificarCodigo} className="space-y-4">
                {/* Info del celular */}
                <Alert className="bg-blue-50 border-blue-200">
                  <Smartphone className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 text-sm">
                    <p>
                      Código enviado a: <strong>{celularParcial}</strong>
                    </p>
                    {tiempoRestante > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">
                          Expira en: <strong>{formatearTiempo(tiempoRestante)}</strong>
                        </span>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>

                {/* Código de verificación */}
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código de Verificación</Label>
                  <Input
                    id="codigo"
                    type="text"
                    placeholder="123456"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    disabled={loadingVerificar}
                    maxLength={6}
                    className="text-center text-2xl font-mono tracking-widest"
                    required
                  />
                </div>

                {/* Botón reenviar */}
                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleReenviarCodigo}
                    disabled={!puedeReenviar || loadingReenviar || tiempoRestante === 0}
                  >
                    {loadingReenviar ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Reenviando...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-3 w-3" />
                        {tiempoRestante === 0 ? 'Código expirado - Solicita uno nuevo' : 'Reenviar código'}
                      </>
                    )}
                  </Button>
                </div>

                <div className="border-t pt-4 space-y-4">
                  {/* Nueva contraseña */}
                  <div className="space-y-2">
                    <Label htmlFor="nuevaContrasena">Nueva Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="nuevaContrasena"
                        type={mostrarContrasena ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={nuevaContrasena}
                        onChange={(e) => setNuevaContrasena(e.target.value)}
                        disabled={loadingVerificar}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setMostrarContrasena(!mostrarContrasena)}
                      >
                        {mostrarContrasena ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* Indicador de fortaleza */}
                    {nuevaContrasena && (
                      <div className="space-y-1">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((nivel) => (
                            <div
                              key={nivel}
                              className={`h-2 flex-1 rounded ${
                                nivel <= fortalezaContrasena
                                  ? colorFortaleza
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-600">
                          Fortaleza: <strong>{textoFortaleza}</strong>
                        </p>
                      </div>
                    )}

                    <ul className="text-xs text-gray-500 space-y-1">
                      <li className={nuevaContrasena.length >= 8 ? 'text-green-600' : ''}>
                        ✓ Mínimo 8 caracteres
                      </li>
                      <li className={/[a-z]/.test(nuevaContrasena) ? 'text-green-600' : ''}>
                        ✓ Una letra minúscula
                      </li>
                      <li className={/[A-Z]/.test(nuevaContrasena) ? 'text-green-600' : ''}>
                        ✓ Una letra mayúscula
                      </li>
                      <li className={/\d/.test(nuevaContrasena) ? 'text-green-600' : ''}>
                        ✓ Un número
                      </li>
                    </ul>
                  </div>

                  {/* Confirmar contraseña */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmarContrasena">Confirmar Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="confirmarContrasena"
                        type={mostrarConfirmar ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={confirmarContrasena}
                        onChange={(e) => setConfirmarContrasena(e.target.value)}
                        disabled={loadingVerificar}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                      >
                        {mostrarConfirmar ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {confirmarContrasena && confirmarContrasena !== nuevaContrasena && (
                      <p className="text-xs text-red-600">
                        Las contraseñas no coinciden
                      </p>
                    )}
                  </div>
                </div>

                {errorVerificar && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errorVerificar}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleVolverAlInicio}
                    disabled={loadingVerificar}
                    className="flex-1"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      loadingVerificar ||
                      !codigo ||
                      codigo.length !== 6 ||
                      !nuevaContrasena ||
                      !confirmarContrasena ||
                      nuevaContrasena !== confirmarContrasena
                    }
                    className="flex-1"
                  >
                    {loadingVerificar ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verificando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Cambiar Contraseña
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}

            {/* ========== PASO 3: ÉXITO ========== */}
            {step === 'exito' && (
              <div className="text-center space-y-6 py-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    ¡Contraseña Actualizada!
                  </h3>
                  <p className="text-gray-600">
                    {usuarioNombre}, tu contraseña ha sido cambiada exitosamente.
                  </p>
                </div>

                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 text-sm">
                    Serás redirigido al login en unos segundos...
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={() => router.push('/login')}
                  className="w-full"
                >
                  Ir al Login Ahora
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Link para volver al login */}
        {step !== 'exito' && (
          <div className="text-center mt-6">
            <Button
              variant="ghost"
              onClick={() => router.push('/login')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
