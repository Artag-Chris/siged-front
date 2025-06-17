import ConductorDashboard from "@/components/conductor-dashboard"

interface PageProps {
  params: {
    id: string
  }
}

export default function DashboardConductorPage({ params }: PageProps) {
  return <ConductorDashboard conductorId={params.id} />
}
