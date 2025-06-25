"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, X } from "lucide-react"
import { DOCUMENT_CATEGORIES, DocumentUploadProps, ProfessorDocument } from "@/interfaces/Documents"
import { useDocumentStore } from "@/lib/document-store"

export function DocumentUpload({ professorId, onUploadSuccess }: DocumentUploadProps) {
  const { uploadDocument, isLoading } = useDocumentStore()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [category, setCategory] = useState<ProfessorDocument["category"]>("otros")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Solo se permiten archivos PDF")
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setError("El archivo no puede ser mayor a 10MB")
        return
      }
      setSelectedFile(file)
      setError("")
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Por favor selecciona un archivo")
      return
    }

    if (!category) {
      setError("Por favor selecciona una categoría")
      return
    }

    setError("")
    setSuccess("")

    const success = await uploadDocument(professorId!, selectedFile, category, description)

    if (success) {
      setSuccess("Documento subido exitosamente")
      setSelectedFile(null)
      setDescription("")
      setCategory("otros")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      onUploadSuccess?.()
    } else {
      setError("Error al subir el documento")
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Subir Documento</span>
        </CardTitle>
        <CardDescription>Agrega documentos PDF relacionados con el profesor</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <div>
          <Label htmlFor="file">Archivo PDF</Label>
          <Input
            ref={fileInputRef}
            id="file"
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            disabled={isLoading}
            className="mt-1"
          />
        </div>

        {selectedFile && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">{selectedFile.name}</span>
              <span className="text-xs text-gray-500">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
            <Button variant="ghost" size="sm" onClick={removeFile} disabled={isLoading}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div>
          <Label htmlFor="category">Categoría</Label>
          <Select value={category} onValueChange={(value) => setCategory(value as ProfessorDocument["category"])}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              {DOCUMENT_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Descripción (opcional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe el contenido del documento..."
            rows={3}
            disabled={isLoading}
          />
        </div>

        <Button onClick={handleUpload} disabled={!selectedFile || isLoading} className="w-full">
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Subiendo...
            </div>
          ) : (
            <div className="flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Subir Documento
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
