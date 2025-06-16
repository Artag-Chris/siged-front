"use client"

import SolicitudDetalle from "@/components/solicitud-detalle"

export default function DetalleSolicitudPage({
  params,
}: {
  params: { radicado: string }
}) {
  return (
    <SolicitudDetalle 
      radicado={decodeURIComponent(params.radicado)} 
    />
  )
}