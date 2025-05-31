"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, ExternalLink } from "lucide-react"

interface DocumentViewerProps {
  fileName: string
  fileType: string
}

export function DocumentViewer({ fileName, fileType }: DocumentViewerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleViewDocument = () => {
    // En producción, esto abriría el documento real
    // Por ahora simulamos con un PDF de ejemplo
    const pdfUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    window.open(pdfUrl, "_blank")
  }

  const handleViewInModal = () => {
    setIsOpen(true)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" onClick={handleViewInModal}>
            <Eye className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{fileName}</span>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleViewDocument}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Abrir en nueva pestaña
                </Button>
              </div>
            </DialogTitle>
            <DialogDescription>Vista previa del documento</DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
            {fileType === "application/pdf" ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{fileName}</h3>
                  <p className="text-gray-600">Documento PDF</p>
                  <p className="text-sm text-gray-500 mt-2">
                    La vista previa completa estará disponible cuando se integre con el servicio de documentos.
                  </p>
                  <Button className="mt-4" onClick={handleViewDocument}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver documento completo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-500">Vista previa no disponible para este tipo de archivo</p>
                <Button className="mt-4" onClick={handleViewDocument}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Abrir documento
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
