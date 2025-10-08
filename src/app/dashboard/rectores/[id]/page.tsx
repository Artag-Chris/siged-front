"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CVUploadForm from "@/components/cv-upload-form";
import EmployeeDocumentSearch from "@/components/employee-document-search";
import EmployeeDocumentStats from "@/components/employee-document-stats";
import {
  ArrowLeft,
  Building2,
  Calendar,
  GraduationCap,
  Mail,
  MapPin,
  User,
  Users,
  Clock,
  FileText,
  School,
  Loader2,
  XCircle,
  RefreshCcw,
  Upload,
  Eye,
  AlertCircle,
  CheckCircle,
  UserCheck,
  GitBranch,
  Building,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import { useRector, useAsignarRector, useTransferirRector, useInstitucionesDisponibles } from "@/hooks/useRectores";
import { ProtectedRoute } from "@/components/protected-route";

function RectorDetailContent() {
  const params = useParams();
  const router = useRouter();
  const rectorId = params.id as string;

  const { rector, loading, error, refresh } = useRector(rectorId);
  const { asignar, loading: asignandoRector } = useAsignarRector();
  const { transferir, loading: transfiriendoRector } = useTransferirRector();
  const { instituciones, loading: loadingInstituciones, refresh: refreshInstituciones } = useInstitucionesDisponibles({
    sinRector: true,
    conSedes: true,
    autoLoad: false
  });

  const [activeTab, setActiveTab] = useState("profile");
  const [refreshDocuments, setRefreshDocuments] = useState(0);
  const [showAsignarDialog, setShowAsignarDialog] = useState(false);
  const [showTransferirDialog, setShowTransferirDialog] = useState(false);
  const [selectedInstitucionId, setSelectedInstitucionId] = useState("");
  const [asignarTodasSedes, setAsignarTodasSedes] = useState(true);

  // Callbacks para CV Upload
  const handleCVUploadSuccess = (document: any) => {
    console.log('✅ [CV-UPLOAD] Documento subido exitosamente:', {
      id: document.id,
      filename: document.filename,
      empleadoUuid: rector?.rector.id
    });
    setRefreshDocuments(prev => prev + 1);
    setActiveTab("documents");
  };

  const handleCVUploadError = (error: string) => {
    console.error('❌ [CV-UPLOAD] Error subiendo documento:', error);
  };

  // Abrir diálogo de asignar institución
  const handleOpenAsignarDialog = () => {
    refreshInstituciones();
    setShowAsignarDialog(true);
  };

  // Asignar rector a institución
  const handleAsignarInstitucion = async () => {
    if (!selectedInstitucionId) return;

    const result = await asignar(rectorId, selectedInstitucionId, asignarTodasSedes, []);
    
    if (result) {
      setShowAsignarDialog(false);
      setSelectedInstitucionId("");
      refresh();
    }
  };

  // Abrir diálogo de transferir
  const handleOpenTransferirDialog = () => {
    refreshInstituciones();
    setShowTransferirDialog(true);
  };

  // Transferir rector a otra institución
  const handleTransferirInstitucion = async () => {
    if (!selectedInstitucionId) return;

    const result = await transferir(rectorId, selectedInstitucionId, false);
    
    if (result) {
      setShowTransferirDialog(false);
      setSelectedInstitucionId("");
      refresh();
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Cargando información del rector...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Link href="/dashboard/rectores">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la lista
          </Button>
        </Link>
      </div>
    )
  }

  if (!rector) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>Rector no encontrado</AlertDescription>
        </Alert>
        <Link href="/dashboard/rectores">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la lista
          </Button>
        </Link>
      </div>
    )
  }

  const formatDate = (date: string | Date | undefined | null) => {
    if (!date) return "No especificada"
    return new Date(date).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/rectores">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {rector.rector.nombre} {rector.rector.apellido}
              </h1>
              <p className="text-gray-600">
                {rector.institucion?.nombre 
                  ? `Rector de ${rector.institucion.nombre}`
                  : "Rector sin institución asignada"}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            {!rector.institucion && (
              <Button onClick={handleOpenAsignarDialog} variant="default" size="sm">
                <Building className="h-4 w-4 mr-2" />
                Asignar Institución
              </Button>
            )}
            {rector.institucion && (
              <Button onClick={handleOpenTransferirDialog} variant="outline" size="sm">
                <GitBranch className="h-4 w-4 mr-2" />
                Transferir
              </Button>
            )}
            <Button onClick={refresh} variant="outline" size="sm" disabled={loading}>
              <Clock className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" />
              Subir Documentos
            </TabsTrigger>
            <TabsTrigger value="documents">
              <Eye className="h-4 w-4 mr-2" />
              Ver Documentos
            </TabsTrigger>
          </TabsList>

          {/* TAB: Perfil */}
          <TabsContent value="profile">
            <div className="space-y-6">
              {/* Estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {rector.estadisticas?.totalSedes || 0}
                  </p>
                  <p className="text-sm text-gray-600">Sedes Asignadas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {rector.estadisticas?.totalAsignaciones || 0}
                  </p>
                  <p className="text-sm text-gray-600">Asignaciones Activas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {rector.estadisticas?.jornadasCubiertas || 0}
                  </p>
                  <p className="text-sm text-gray-600">Jornadas Cubiertas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grid de información */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Información Personal</span>
                </CardTitle>
                <CardDescription>Datos de contacto y personales del rector</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Documento</p>
                      <p className="text-sm text-gray-900">
                        {rector.rector.tipo_documento} {rector.rector.documento}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Email</p>
                      <p className="text-sm text-gray-900 break-all">
                        {rector.rector.email}
                      </p>
                    </div>
                  </div>

                  {rector.rector.direccion && (
                    <div className="flex items-start space-x-3 md:col-span-2">
                      <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Dirección</p>
                        <p className="text-sm text-gray-900">{rector.rector.direccion}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-3">
                    <Briefcase className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Cargo</p>
                      <p className="text-sm text-gray-900">{rector.rector.cargo}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Fecha de Creación
                      </p>
                      <p className="text-sm text-gray-900">
                        {formatDate(rector.rector.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {rector.rector.informacionAcademica && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <GraduationCap className="h-5 w-5" />
                    <span>Información Académica</span>
                  </CardTitle>
                  <CardDescription>
                    Formación y experiencia profesional
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <School className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Nivel Educativo
                        </p>
                        <p className="text-sm text-gray-900 capitalize">
                          {rector.rector.informacionAcademica.nivel_educativo}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <GraduationCap className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Título</p>
                        <p className="text-sm text-gray-900">
                          {rector.rector.informacionAcademica.titulo}
                        </p>
                      </div>
                    </div>

                    {rector.rector.informacionAcademica.institucion_educativa && (
                      <div className="flex items-start space-x-3">
                        <Building2 className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Institución Educativa
                          </p>
                          <p className="text-sm text-gray-900">
                            {rector.rector.informacionAcademica.institucion_educativa}
                          </p>
                        </div>
                      </div>
                    )}

                    {rector.rector.informacionAcademica.anos_experiencia !== null &&
                      rector.rector.informacionAcademica.anos_experiencia !==
                        undefined && (
                        <div className="flex items-start space-x-3">
                          <Briefcase className="h-5 w-5 text-gray-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Años de Experiencia
                            </p>
                            <p className="text-sm text-gray-900">
                              {rector.rector.informacionAcademica.anos_experiencia} años
                            </p>
                          </div>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Sedes Asignadas ({rector.sedes?.length || 0})</span>
                </CardTitle>
                <CardDescription>Sedes bajo la dirección de este rector</CardDescription>
              </CardHeader>
              <CardContent>
                {!rector.sedes || rector.sedes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>No hay sedes asignadas</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rector.sedes.map((sede) => (
                      <div
                        key={sede.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900">
                                {sede.nombre}
                              </h4>
                              <Badge
                                variant={
                                  sede.estado === "activa" ? "default" : "secondary"
                                }
                              >
                                {sede.estado}
                              </Badge>
                              <Badge variant="outline" className="capitalize">
                                {sede.zona}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {sede.direccion}
                              </p>
                              {sede.codigo_DANE && (
                                <p className="text-xs text-gray-500">
                                  Código DANE: {sede.codigo_DANE}
                                </p>
                              )}
                            </div>
                            {sede.jornadas && sede.jornadas.length > 0 && (
                              <div className="mt-3">
                                <p className="text-xs font-medium text-gray-600 mb-2">
                                  Jornadas:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {sede.jornadas.map((jornada) => (
                                    <Badge
                                      key={jornada.id}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      <Clock className="h-3 w-3 mr-1" />
                                      {jornada.nombre}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {rector.institucion ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>Institución</span>
                  </CardTitle>
                  <CardDescription>Institución educativa asignada</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Nombre</p>
                    <p className="text-sm text-gray-900">{rector.institucion.nombre}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Rector Encargado
                    </p>
                    <p className="text-sm text-gray-900">
                      {rector.rector.nombre} {rector.rector.apellido}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Fecha de Creación
                    </p>
                    <p className="text-sm text-gray-900">
                      {formatDate(rector.institucion.created_at)}
                    </p>
                  </div>

                  {rector.institucion.sedes && rector.institucion.sedes.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Total de Sedes
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                          <span className="text-lg font-bold text-blue-600">
                            {rector.institucion.sedes.length}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          sede{rector.institucion.sedes.length !== 1 ? "s" : ""}{" "}
                          registrada
                          {rector.institucion.sedes.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>Institución</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <Building2 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>No hay institución asignada</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </TabsContent>

      {/* TAB: Subir Documentos */}
      <TabsContent value="upload">
        <div className="space-y-6">
          <CVUploadForm
            professorId={rector.rector.id}
            professorData={{
              name: `${rector.rector.nombre} ${rector.rector.apellido}`,
              cedula: rector.rector.documento
            }}
            onUploadSuccess={handleCVUploadSuccess}
            onUploadError={handleCVUploadError}
          />
        </div>
      </TabsContent>

      {/* TAB: Ver Documentos */}
      <TabsContent value="documents">
        <div className="space-y-6">
          <EmployeeDocumentStats
            employeeUuid={rector.rector.id}
            refreshTrigger={refreshDocuments}
          />
          
          <EmployeeDocumentSearch
            employeeUuid={rector.rector.id}
            employeeName={`${rector.rector.nombre} ${rector.rector.apellido}`}
            onDocumentSelect={(doc) => {
              console.log('📄 [DOCUMENT] Documento seleccionado:', doc);
            }}
            autoLoad={true}
            key={`${rector.rector.id}-${refreshDocuments}`}
          />
        </div>
      </TabsContent>
    </Tabs>

    {/* Dialog: Asignar Institución */}
    <Dialog open={showAsignarDialog} onOpenChange={setShowAsignarDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Asignar Institución</DialogTitle>
          <DialogDescription>
            Seleccione una institución para asignar al rector {rector.rector.nombre}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="institucion">Institución</Label>
            <Select 
              value={selectedInstitucionId} 
              onValueChange={setSelectedInstitucionId}
              disabled={loadingInstituciones}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una institución" />
              </SelectTrigger>
              <SelectContent>
                {instituciones.map((inst) => (
                  <SelectItem key={inst.id} value={inst.id}>
                    {inst.nombre} ({inst._count?.sedes || 0} sedes)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="asignarTodasSedes"
              checked={asignarTodasSedes}
              onChange={(e) => setAsignarTodasSedes(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="asignarTodasSedes" className="text-sm">
              Asignar todas las sedes de la institución
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setShowAsignarDialog(false)}
            disabled={asignandoRector}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleAsignarInstitucion}
            disabled={!selectedInstitucionId || asignandoRector}
          >
            {asignandoRector ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Asignando...
              </>
            ) : (
              <>
                <Building className="h-4 w-4 mr-2" />
                Asignar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Dialog: Transferir Institución */}
    <Dialog open={showTransferirDialog} onOpenChange={setShowTransferirDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transferir Rector</DialogTitle>
          <DialogDescription>
            Transferir a {rector.rector.nombre} a otra institución
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              El rector será transferido de <strong>{rector.institucion?.nombre}</strong> a la nueva institución.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="nuevaInstitucion">Nueva Institución</Label>
            <Select 
              value={selectedInstitucionId} 
              onValueChange={setSelectedInstitucionId}
              disabled={loadingInstituciones}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una institución" />
              </SelectTrigger>
              <SelectContent>
                {instituciones.map((inst) => (
                  <SelectItem key={inst.id} value={inst.id}>
                    {inst.nombre} ({inst._count?.sedes || 0} sedes)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setShowTransferirDialog(false)}
            disabled={transfiriendoRector}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleTransferirInstitucion}
            disabled={!selectedInstitucionId || transfiriendoRector}
          >
            {transfiriendoRector ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Transfiriendo...
              </>
            ) : (
              <>
                <GitBranch className="h-4 w-4 mr-2" />
                Transferir
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</div>
  )
}

export default function RectorDetailPage() {
  return (
    <ProtectedRoute requiredRole={['super_admin', 'admin', 'gestor']}>
      <RectorDetailContent />
    </ProtectedRoute>
  );
}
