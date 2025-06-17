import ConductorDashboard from "@/components/conductor-dashboard"


export default function DashboardConductorPage({ params }: any) {
  return <ConductorDashboard conductorId={params.id} />
}
