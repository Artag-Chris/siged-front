import { Home, Users, UserPlus, Building2, Plus, GraduationCap, Bus, Car, MapPin, UserCheck, Calendar, BookOpen, BarChart3, FileText, Settings, List, UserCog, Utensils } from "lucide-react";

export const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
   {
    key: "rectores",
    title: "Rectores",
    icon: UserCog,
    items: [
      {
        title: "Lista de Rectores",
        href: "/dashboard/rectores",
        icon: List,
      },
      {
        title: "Agregar Rector",
        href: "/dashboard/rectores/agregar",
        icon: UserPlus,
      },
    ],
  },
  // Sección para PAE (preparación)
  {
    key: "pae",
    title: "Programa PAE",
    icon: Utensils,
    items: [
      {
        title: "Lista de Beneficios",
        href: "/dashboard/pae",
        icon: List,
      },
      {
        title: "Asignar Beneficio",
        href: "/dashboard/pae/agregar",
        icon: Plus,
      },
    ],
  },
  {
    title: "Profesores",
    icon: Users,
    key: "profesores",
    items: [
      {
        title: "Lista de Profesores",
        href: "/dashboard/profesores",
        icon: Users,
      },
      {
        title: "Agregar Profesor",
        href: "/dashboard/profesores/agregar",
        icon: UserPlus,
      },
    ],
  },
  {
    title: "Instituciones",
    icon: Building2,
    key: "instituciones",
    items: [
      {
        title: "Lista de Instituciones",
        href: "/dashboard/instituciones",
        icon: Building2,
      },
      {
        title: "Agregar Institución",
        href: "/dashboard/instituciones/agregar",
        icon: Plus,
      },
    ],
  },
  {
    title: "Estudiantes",
    icon: GraduationCap,
    key: "estudiantes",
    items: [
      {
        title: "Lista de Estudiantes",
        href: "/dashboard/estudiantes",
        icon: GraduationCap,
      },
      {
        title: "Agregar Estudiante",
        href: "/dashboard/estudiantes/agregar",
        icon: UserPlus,
      },
    ],
  },
  {
    title: "Transporte",
    icon: Bus,
    key: "transporte",
    items: [
      {
        title: "Conductores",
        href: "/dashboard/transporte/conductores",
        icon: Users,
      },
      {
        title: "Vehículos",
        href: "/dashboard/transporte/vehicles",
        icon: Car,
      },
      {
        title: "Rutas",
        href: "/dashboard/transporte/rutas",
        icon: MapPin,
      },
      {
        title: "Asignaciones",
        href: "/dashboard/transporte/asignaciones",
        icon: UserCheck,
      },
      {
        title: "Registro Conductor",
        href: "/transporte/conductores/registro",
        icon: UserPlus,
      },
    ],
  },
  {
    title: "Asignación de Cupos",
    href: "/dashboard/asignacion-cupos",
    icon: Calendar,
  },
  {
    title: "Materias",
    href: "/dashboard/materias",
    icon: BookOpen,
  },
  {
    title: "Horarios",
    href: "/dashboard/horarios",
    icon: Calendar,
  },
  {
    title: "Reportes",
    href: "/dashboard/reportes",
    icon: BarChart3,
  },
  {
    title: "Documentos",
    href: "/dashboard/documentos",
    icon: FileText,
  },
  {
    title: "Configuración",
    href: "/dashboard/configuracion",
    icon: Settings,
  },
]

export interface SidebarProps {
  className?: string
}