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
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "relative flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <span className="font-semibold text-gray-900">EduAdmin</span>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8 p-0">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.items ? (
                // Menu with submenu
                <div className="space-y-1">
                  <div
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium text-gray-600",
                      collapsed && "justify-center",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span className="ml-3">{item.title}</span>}
                  </div>
                  {!collapsed && (
                    <div className="ml-6 space-y-1">
                      {item.items.map((subItem, subIndex) => (
                        <Link key={subIndex} href={subItem.href}>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start text-sm font-normal",
                              pathname === subItem.href
                                ? "bg-blue-50 text-blue-700 hover:bg-blue-50"
                                : "text-gray-600 hover:bg-gray-50",
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
                      "w-full justify-start",
                      collapsed && "justify-center px-2",
                      pathname === item.href
                        ? "bg-blue-50 text-blue-700 hover:bg-blue-50"
                        : "text-gray-600 hover:bg-gray-50",
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
        <div className="p-4 border-t">
          <div className="text-xs text-gray-500 text-center">Sistema de Gestión Educativa v1.0</div>
        </div>
      )}
    </div>
  )
}
