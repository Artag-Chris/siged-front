import { Users, FileText, Activity, TrendingUp, UserPlus } from "lucide-react"

export const statsMainDashboard =(professors:any,documents:any) => [
    {
      title: "Total Profesores",
      value: professors.length.toString(),
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
      href: "/dashboard/profesores",
    },
    {
      title: "Documentos",
      value: documents.length.toString(),
      change: "+8%",
      icon: FileText,
      color: "text-green-600",
      href: "/dashboard/profesores",
    },
    {
      title: "Profesores Activos",
      value: professors.filter((p:any) => p.estado === "activa").length.toString(),
      change: "+23%",
      icon: Activity,
      color: "text-purple-600",
      href: "/dashboard/profesores",
    },
    {
      title: "Promedio Experiencia",
      value:
        professors.length > 0
          ? `${Math.round(professors.reduce((sum:any, p:any) => sum + p.experienciaAnios, 0) / professors.length)} años`
          : "0 años",
      change: "+5%",
      icon: TrendingUp,
      color: "text-orange-600",
      href: "/dashboard/profesores",
    },
  ]

  export const recentActivityMainDashboard=(user:any) => [
    { action: "Nuevo profesor registrado", time: "Hace 2 minutos", user: "Juan Pérez" },
    { action: "Documento subido", time: "Hace 15 minutos", user: "María García" },
    { action: "Profesor actualizado", time: "Hace 1 hora", user: user?.name || "Admin" },
    { action: "Nueva evaluación completada", time: "Hace 2 horas", user: "Carlos López" },
  ]

  export const quickActions = [
    {
      title: "Agregar Profesor",
      description: "Registrar un nuevo profesor en el sistema",
      href: "/dashboard/profesores/agregar",
      icon: UserPlus,
      color: "bg-blue-500",
    },
    {
      title: "Ver Profesores",
      description: "Gestionar lista completa de profesores",
      href: "/dashboard/profesores",
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Documentos",
      description: "Revisar documentos subidos",
      href: "/dashboard/profesores",
      icon: FileText,
      color: "bg-purple-500",
    },
  ]