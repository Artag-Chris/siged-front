"use client"

import SolicitudDetalle from "@/components/solicitud-detalle"

interface PageProps {
  params: {
    radicado: string
  }
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default function DetalleSolicitudPage({ params }: PageProps) {
  return <SolicitudDetalle radicado={decodeURIComponent(params.radicado)} />
}