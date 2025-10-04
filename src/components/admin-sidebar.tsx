"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react"
import { SidebarProps, menuItems } from "@/interfaces/navbarItems/menuItems"

export function AdminSidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>(null)
  const pathname = usePathname()

  // Determinar qué sección debería estar abierta basada en la ruta actual
  const getActiveSectionFromPath = () => {
    if (pathname.startsWith("/dashboard/usuarios")) return "usuarios"
    if (pathname.startsWith("/dashboard/profesores")) return "profesores"
    if (pathname.startsWith("/dashboard/instituciones")) return "instituciones"
    if (pathname.startsWith("/dashboard/estudiantes")) return "estudiantes"
    if (pathname.startsWith("/dashboard/transporte") || pathname.startsWith("/transporte")) return "transporte"
    if (pathname.startsWith("/dashboard/rectores")) return "rectores"
    if (pathname.startsWith("/dashboard/pae")) return "pae"
    if (pathname.startsWith("/dashboard/horas-extra")) return "horas-extra"
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
    if (sectionKey === "transporte") {
      return pathname.startsWith(`/dashboard/${sectionKey}`) || pathname.startsWith("/transporte")
    }
    return pathname.startsWith(`/dashboard/${sectionKey}`)
  }

  const isActiveSubItem = (href: string) => {
    return pathname === href || (href.includes("/transporte") && pathname.startsWith(href))
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
                              isActiveSubItem(subItem.href)
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
