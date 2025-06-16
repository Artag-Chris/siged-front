import SolicitudDetalle from "@/components/solicitud-detalle"

interface PageProps {
  params: {
    radicado: string
  }
}

export default function DetalleSolicitudPage({ params }: PageProps) {
  return <SolicitudDetalle radicado={decodeURIComponent(params.radicado)} />
}
