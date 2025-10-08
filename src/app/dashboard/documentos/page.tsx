"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  FileText,
  Upload,
  BarChart3,
  FolderOpen,
  ArrowRight,
  Database,
} from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import Link from "next/link";

function DocumentosHomeContent() {
  const router = useRouter();

  const features = [
    {
      title: "Búsqueda de Documentos",
      description: "Busca documentos con filtros avanzados y búsqueda por contenido",
      icon: Search,
      href: "/dashboard/documentos/buscar",
      color: "blue",
    },
    {
      title: "Subir Documentos",
      description: "Carga nuevos documentos al sistema con metadata automática",
      icon: Upload,
      href: "/dashboard/documentos/subir",
      color: "green",
      disabled: true,
    },
    {
      title: "Estadísticas",
      description: "Ve estadísticas y analíticas de todos los documentos",
      icon: BarChart3,
      href: "/dashboard/documentos/estadisticas",
      color: "purple",
      disabled: true,
    },
    {
      title: "Categorías",
      description: "Explora documentos organizados por categorías",
      icon: FolderOpen,
      href: "/dashboard/documentos/categorias",
      color: "orange",
      disabled: true,
    },
  ];

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Database className="h-8 w-8 mr-3 text-blue-600" />
            Sistema de Gestión de Documentos
          </h1>
          <p className="text-gray-600 text-lg">
            Busca, gestiona y analiza todos los documentos del sistema SIGED
          </p>
        </div>

        {/* Info Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <FileText className="h-5 w-5 mr-2" />
              Sistema de Búsqueda Avanzada
            </CardTitle>
            <CardDescription className="text-blue-700">
              Potenciado por Elasticsearch para búsquedas rápidas y precisas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-center">
                <ArrowRight className="h-4 w-4 mr-2" />
                Búsqueda por contenido dentro de PDFs y documentos
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-4 w-4 mr-2" />
                Filtros avanzados por categoría, tipo, fecha y más
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-4 w-4 mr-2" />
                Búsqueda aproximada (fuzzy) que tolera errores de escritura
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-4 w-4 mr-2" />
                Resultados ordenados por relevancia, fecha, tamaño o nombre
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colorClasses = {
              blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-600",
              green: "from-green-50 to-green-100 border-green-200 text-green-600",
              purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-600",
              orange: "from-orange-50 to-orange-100 border-orange-200 text-orange-600",
            };

            if (feature.disabled) {
              return (
                <Card
                  key={index}
                  className={`bg-gradient-to-br ${colorClasses[feature.color as keyof typeof colorClasses]} opacity-50 cursor-not-allowed`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Icon className="h-12 w-12" />
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                        Próximamente
                      </span>
                    </div>
                    <CardTitle className="text-xl mt-4">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            }

            return (
              <Link key={index} href={feature.href}>
                <Card
                  className={`bg-gradient-to-br ${colorClasses[feature.color as keyof typeof colorClasses]} hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1`}
                >
                  <CardHeader>
                    <Icon className="h-12 w-12 mb-4" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="ghost"
                      className="w-full justify-between hover:bg-white/50"
                    >
                      Acceder
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Acceso Rápido</CardTitle>
            <CardDescription>Acciones frecuentes del sistema de documentos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/dashboard/documentos/buscar">
                <Button variant="outline" className="w-full justify-start">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar Documentos
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start" disabled>
                <Upload className="h-4 w-4 mr-2" />
                Subir Documento
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled>
                <BarChart3 className="h-4 w-4 mr-2" />
                Ver Estadísticas
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info adicional */}
        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Tipos de documentos soportados:</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-white border border-gray-300 rounded text-sm">
              Contratos Laborales
            </span>
            <span className="px-3 py-1 bg-white border border-gray-300 rounded text-sm">
              Actos Administrativos
            </span>
            <span className="px-3 py-1 bg-white border border-gray-300 rounded text-sm">
              Suplencias
            </span>
            <span className="px-3 py-1 bg-white border border-gray-300 rounded text-sm">
              Horas Extra
            </span>
            <span className="px-3 py-1 bg-white border border-gray-300 rounded text-sm">
              Reportes
            </span>
            <span className="px-3 py-1 bg-white border border-gray-300 rounded text-sm">
              Certificados
            </span>
            <span className="px-3 py-1 bg-white border border-gray-300 rounded text-sm">
              CVs y Hojas de Vida
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DocumentosHomePage() {
  return (
    <ProtectedRoute requiredRole={["super_admin", "admin", "gestor"]}>
      <DocumentosHomeContent />
    </ProtectedRoute>
  );
}
