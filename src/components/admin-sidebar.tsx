"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Home,
  Users,
  UserPlus,
  BookOpen,
  Calendar,
  Settings,
  BarChart3,
  FileText,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Building2,
  Plus,
} from "lucide-react"

interface SidebarProps {
  className?: string
}

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
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

export function AdminSidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>(null)
  const pathname = usePathname()

  // Determinar qué sección debería estar abierta basada en la ruta actual
  const getActiveSectionFromPath = () => {
    if (pathname.startsWith("/dashboard/profesores")) return "profesores"
    if (pathname.startsWith("/dashboard/instituciones")) return "instituciones"
    if (pathname.startsWith("/dashboard/estudiantes")) return "estudiantes"
    return null
  }

  // Inicializar la sección abierta basada en la ruta actual
  useState(() => {
    const activeSection = getActiveSectionFromPath()
    if (activeSection && !openSection) {
      setOpenSection(activeSection)
    }
  })

  const toggleSection = (sectionKey: string) => {
    if (collapsed) return
    setOpenSection(openSection === sectionKey ? null : sectionKey)
  }

  const isPathInSection = (sectionKey: string) => {
    return pathname.startsWith(`/dashboard/${sectionKey}`)
  }

  return (
    <div
      className={cn(
        "relative flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-slate-600" />
            <span className="font-semibold text-slate-800">EduAdmin</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0 hover:bg-gray-100"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-500" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-1">
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.items ? (
                // Menu with submenu (accordion style)
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    onClick={() => toggleSection(item.key!)}
                    className={cn(
                      "w-full justify-between text-sm font-medium transition-colors",
                      collapsed && "justify-center px-2",
                      isPathInSection(item.key!)
                        ? "bg-slate-100 text-slate-900 hover:bg-slate-100"
                        : "text-slate-600 hover:bg-gray-50 hover:text-slate-900",
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span className="ml-3">{item.title}</span>}
                    </div>
                    {!collapsed && (
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          openSection === item.key ? "rotate-180" : "rotate-0",
                        )}
                      />
                    )}
                  </Button>

                  {/* Submenu items */}
                  {!collapsed && openSection === item.key && (
                    <div className="ml-4 space-y-1 border-l border-gray-100 pl-4">
                      {item.items.map((subItem, subIndex) => (
                        <Link key={subIndex} href={subItem.href}>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start text-sm font-normal transition-colors",
                              pathname === subItem.href
                                ? "bg-slate-50 text-slate-900 hover:bg-slate-50 border-l-2 border-slate-400"
                                : "text-slate-600 hover:bg-gray-50 hover:text-slate-900",
                            )}
                          >
                            <subItem.icon className="h-4 w-4" />
                            <span className="ml-3">{subItem.title}</span>
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Simple menu item
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-sm font-medium transition-colors",
                      collapsed && "justify-center px-2",
                      pathname === item.href
                        ? "bg-slate-100 text-slate-900 hover:bg-slate-100"
                        : "text-slate-600 hover:bg-gray-50 hover:text-slate-900",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span className="ml-3">{item.title}</span>}
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-100">
          <div className="text-xs text-slate-500 text-center">Sistema de Gestión Educativa v1.0</div>
        </div>
      )}
    </div>
  )
}
