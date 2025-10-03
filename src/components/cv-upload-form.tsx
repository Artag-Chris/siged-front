"use client";

import React, { useState } from 'react';
import { Upload, FileText, X, User, Hash, Tag, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useDocumentSearch } from '@/hooks/useDocumentSearch';
import { DocumentUploadParams } from '@/types/documentSearch';

interface CVUploadFormProps {
  professorId: string;
  professorData?: {
    name: string;
    cedula: string;
  };
  onUploadSuccess?: (document: any) => void;
  onUploadError?: (error: string) => void;
}

const CVUploadForm: React.FC<CVUploadFormProps> = ({
  professorId,
  professorData,
  onUploadSuccess,
  onUploadError
}) => {
  const { uploadDocument, uploading, uploadProgress, error } = useDocumentSearch();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'curriculum-vitae',
    documentType: 'hojas',
    tagInput: '',
    tags: [] as string[]
  });

  // Tipos de documento permitidos según la API
  const documentTypes = [
    { value: 'hojas', label: 'Hojas de Vida' },
    { value: 'contratos', label: 'Contratos' },
    { value: 'reportes', label: 'Reportes' },
    { value: 'facturas', label: 'Facturas' },
    { value: 'certificados', label: 'Certificados' },
    { value: 'documentos', label: 'Documentos' },
    { value: 'imagenes', label: 'Imágenes' },
    { value: 'formularios', label: 'Formularios' },
    { value: 'correspondencia', label: 'Correspondencia' }
  ];

  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (file: File) => {
    // Validaciones según la documentación CV API
    if (file.type !== 'application/pdf') {
      onUploadError?.('Solo se permiten archivos PDF');
      return;
    }

    // Removida la validación de tamaño para permitir archivos más grandes
    // if (file.size > 10 * 1024 * 1024) { // 10MB
    //   onUploadError?.('El archivo no puede ser mayor a 10MB');
    //   return;
    // }

    setSelectedFile(file);
    
    // Auto-generar título si no existe
    if (!formData.title && professorData?.name) {
      setFormData(prev => ({
        ...prev,
        title: `Hoja de Vida - ${professorData.name}`
      }));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const addTag = () => {
    const tag = formData.tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
        tagInput: ''
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      onUploadError?.('Por favor selecciona un archivo PDF');
      return;
    }

    if (!professorData?.name || !professorData?.cedula) {
      onUploadError?.('Faltan datos del profesor (nombre y cédula)');
      return;
    }

    if (!formData.title.trim()) {
      onUploadError?.('Por favor ingresa un título para el documento');
      return;
    }

    try {
      const finalTags = formData.tags.length > 0 ? formData.tags : ['curriculum', 'docente', 'profesor'];
      
      // TODO: Cambiar por UUID real del profesor cuando esté disponible
      const simulatedUUID = crypto.randomUUID ? crypto.randomUUID() : '550e8400-e29b-41d4-a716-446655440002';
      
      const uploadParams: DocumentUploadParams = {
        file: selectedFile,
        employeeUuid: simulatedUUID,
        employeeName: professorData.name,
        employeeCedula: professorData.cedula,
        title: formData.title.trim(),
        description: formData.description,
        category: formData.category,
        documentType: formData.documentType,
        tags: finalTags
      };

      // 🐛 DEBUG: Mostrar parámetros completos antes del upload
      console.log('🚀 [DEBUG CV-FORM] Parámetros para upload CV:');
      console.log('📁 Archivo seleccionado (se enviará como "document"):', {
        name: selectedFile.name,
        size: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
        type: selectedFile.type,
        lastModified: new Date(selectedFile.lastModified).toLocaleString()
      });
      console.log('👤 Datos del profesor:', {
        employeeUuid: simulatedUUID,
        employeeName: professorData.name,
        employeeCedula: professorData.cedula
      });
      console.log('📋 Metadatos del formulario:', {
        title: formData.title.trim(),
        description: formData.description || 'Sin descripción',
        category: formData.category,
        documentType: formData.documentType,
        tags: finalTags
      });

      const result = await uploadDocument(uploadParams);

      // Reset form
      setSelectedFile(null);
      setFormData({
        title: '',
        description: '',
        category: 'curriculum-vitae',
        documentType: 'hojas',
        tagInput: '',
        tags: []
      });

      onUploadSuccess?.(result.document);
    } catch (error: any) {
      onUploadError?.(error.message || 'Error al subir el documento');
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setFormData({
      title: '',
      description: '',
      category: 'curriculum-vitae',
      documentType: 'hojas',
      tagInput: '',
      tags: []
    });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileUp className="h-5 w-5" />
          <span>Subir Hoja de Vida (CV API)</span>
        </CardTitle>
        <CardDescription>
          Sube documentos PDF usando la nueva API de procesamiento de hojas de vida
        </CardDescription>
        
        {professorData && (
          <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
            <User className="h-4 w-4 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">{professorData.name}</p>
              <p className="text-sm text-blue-700">Cédula: {professorData.cedula}</p>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Área de subida de archivo */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-400 bg-blue-50'
                : selectedFile
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragActive(false);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-2">
                <FileText className="h-12 w-12 mx-auto text-green-600" />
                <p className="font-medium text-green-900">{selectedFile.name}</p>
                <p className="text-sm text-green-700">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Remover
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-12 w-12 mx-auto text-gray-400" />
                <p className="text-lg font-medium">Arrastra tu archivo PDF aquí</p>
                <p className="text-sm text-gray-500">o haz clic para seleccionar</p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-input"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  Seleccionar archivo
                </Button>
              </div>
            )}
          </div>

          {/* Metadatos del documento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título del documento *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ej: Hoja de Vida Actualizada 2024"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de documento *</label>
              <Select
                value={formData.documentType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, documentType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Organización en carpetas del servidor
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Descripción</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descripción opcional del documento..."
              rows={3}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Etiquetas</label>
            <div className="flex space-x-2">
              <Input
                value={formData.tagInput}
                onChange={(e) => setFormData(prev => ({ ...prev, tagInput: e.target.value }))}
                placeholder="Agregar etiqueta..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" onClick={addTag} size="sm">
                <Tag className="h-4 w-4 mr-1" />
                Agregar
              </Button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            
            <p className="text-xs text-gray-500">
              Se agregan etiquetas por defecto: curriculum, docente, profesor
            </p>
          </div>

          {/* Progress bar */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Subiendo documento...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-gray-500">
                Procesando: extracción de texto, generación de keywords, indexación...
              </p>
            </div>
          )}

          {/* Acciones */}
          <div className="flex space-x-2 pt-4 border-t">
            <Button
              type="submit"
              disabled={!selectedFile || uploading || !professorData}
              className="flex-1"
            >
              {uploading ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Subir Documento
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={uploading}
            >
              Limpiar
            </Button>
          </div>
        </form>

        {/* Información técnica */}
        <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
          <h4 className="font-medium">Procesamiento automático:</h4>
          <ul className="space-y-1 text-gray-600">
            <li>• ✅ Extracción de texto del PDF</li>
            <li>• ✅ Generación automática de 50+ keywords</li>
            <li>• ✅ Indexación en Elasticsearch para búsqueda</li>
            <li>• ✅ Organización por estructura de carpetas</li>
            <li>• ✅ URLs de descarga y visualización</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CVUploadForm;