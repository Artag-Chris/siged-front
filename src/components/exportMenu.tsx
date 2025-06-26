import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  User, 
  School, 
  Bus, 
  Sandwich, 
  BookUser,
  BookMarked,
  List 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportData } from "@/funtions";

export function ExportMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const exportOptions = [
    {
      label: "Estudiantes",
      icon: <User className="mr-2 h-4 w-4" />,
      data: "students",
      formats: ["excel", "pdf"]
    },
    {
      label: "Instituciones",
      icon: <School className="mr-2 h-4 w-4" />,
      data: "institutions",
      formats: ["excel", "pdf"]
    },
    {
      label: "Profesores",
      icon: <BookUser className="mr-2 h-4 w-4" />,
      data: "professors",
      formats: ["excel", "pdf"]
    },
    {
      label: "Cupos",
      icon: <BookMarked className="mr-2 h-4 w-4" />,
      data: "quotas",
      formats: ["excel", "pdf"]
    },
    {
      label: "Conductores",
      icon: <Bus className="mr-2 h-4 w-4" />,
      data: "conductors",
      formats: ["excel", "pdf"]
    },
    {
      label: "PAE",
      icon: <Sandwich className="mr-2 h-4 w-4" />,
      data: "pae",
      formats: ["excel", "pdf"]
    },
    {
      label: "Suplencias",
      icon: <List className="mr-2 h-4 w-4" />,
      data: "suplencias",
      formats: ["excel", "pdf"]
    },
    {
      label: "Todo",
      icon: <List className="mr-2 h-4 w-4" />,
      data: "all",
      formats: ["excel", "pdf"]
    }
  ];

  const handleExport = (data: string, type: string) => {
    exportData({
      type: type as 'excel' | 'pdf',
      data: data as 'students' | 'institutions' | 'professors' | 'quotas' | 'conductors' | 'pae' | 'suplencias' | 'all',
      filename: `reporte-${data}`
    });
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar datos
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Exportar reportes</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {exportOptions.map((option) => (
          <DropdownMenuGroup key={option.data}>
            <DropdownMenuItem className="flex items-center justify-between">
              <div className="flex items-center">
                {option.icon}
                <span>{option.label}</span>
              </div>
              <div className="flex space-x-1 ml-2">
                {option.formats.includes("excel") && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-green-600 hover:text-green-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExport(option.data, "excel");
                    }}
                    title="Exportar a Excel"
                  >
                    <span className="font-bold text-xs">XLS</span>
                  </Button>
                )}
                {option.formats.includes("pdf") && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-red-600 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExport(option.data, "pdf");
                    }}
                    title="Exportar a PDF"
                  >
                    <span className="font-bold text-xs">PDF</span>
                  </Button>
                )}
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}