import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useStudentStore } from '@/lib/student-store'
import { useInstitutionStore } from '@/lib/instituition-store'
import { useProfessorStore } from '@/lib/profesor-store'
import { useGradeStore } from '@/lib/grade-store'

export function getStatusColor(status: string) {
    const colors: Record<string, string> = {
        Activo: "#10b981",
        Pendiente: "#f59e0b",
        Trasladado: "#3b82f6",
        Retirado: "#ef4444",
    }
    return colors[status] || "#6b7280"
}
interface ExportOptions {
  type: 'excel' | 'pdf'
  data: 'students' | 'institutions' | 'professors' | 'quotas' | 'all'
  filename?: string
}
export const exportData = ({ type, data, filename }: ExportOptions) => {
  const { students } = useStudentStore.getState()
  const { institutions } = useInstitutionStore.getState()
  const { professors } = useProfessorStore.getState()
  const { gradeQuotas } = useGradeStore.getState()

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString()
  }

  const getDataToExport = ():any => {
    switch (data) {
      case 'students':
        return students.map(student => ({
          'Nombre Completo': student.nombreCompleto,
          'Documento': student.numeroDocumento,
          'Grado': student.gradoSolicitado,
          'Estado': student.estado,
          'Fecha Asignación': student.fechaAsignacion ? formatDate(student.fechaAsignacion) : 'No asignado',
          'Acudiente': student.nombreAcudiente,
          'Teléfono': student.telefonoContacto || 'No registrado'
        }))
      case 'institutions':
        return institutions.map(inst => ({
          'Nombre': inst.nombre,
          'Código DANE': inst.codigoDane,
          'Dirección': inst.direccion,
          'Teléfono': inst.telefono,
          'Email': inst.email,
          'Rector': inst.rector,
          'Estado': inst.activa ? 'Activa' : 'Inactiva'
        }))
      case 'professors':
        return professors.map(prof => ({
          'Nombre': `${prof.nombres} ${prof.apellidos}`,
          'Cédula': prof.cedula,
          'Cargo': prof.cargo,
          'Materias': prof.materias.join(', '),
          'Estado': prof.estado,
          'Email': prof.email,
          'Teléfono': prof.telefono
        }))
      case 'quotas':
        return gradeQuotas.map(quota => ({
          'Institución': institutions.find(i => i.id === quota.institucionId)?.nombre || 'N/A',
          'Grado': quota.grado,
          'Jornada': quota.jornada,
          'Cupos Totales': quota.cuposTotales,
          'Cupos Asignados': quota.cuposAsignados,
          'Disponibles': quota.cuposTotales - quota.cuposAsignados
        }))
      case 'all':
        return {
          Estudiantes: students.map(student => ({
            'Nombre Completo': student.nombreCompleto,
            'Documento': student.numeroDocumento,
            'Grado': student.gradoSolicitado,
            'Estado': student.estado,
            'Fecha Asignación': student.fechaAsignacion ? formatDate(student.fechaAsignacion) : 'No asignado',
            'Acudiente': student.nombreAcudiente,
            'Teléfono': student.telefonoContacto || 'No registrado'
          })),
          Instituciones: institutions.map(inst => ({
            'Nombre': inst.nombre,
            'Código DANE': inst.codigoDane,
            'Dirección': inst.direccion,
            'Teléfono': inst.telefono,
            'Email': inst.email,
            'Rector': inst.rector,
            'Estado': inst.activa ? 'Activa' : 'Inactiva'
          })),
          Profesores: professors.map(prof => ({
            'Nombre': `${prof.nombres} ${prof.apellidos}`,
            'Cédula': prof.cedula,
            'Cargo': prof.cargo,
            'Materias': prof.materias.join(', '),
            'Estado': prof.estado,
            'Email': prof.email,
            'Teléfono': prof.telefono
          })),
          Cupos: gradeQuotas.map(quota => ({
            'Institución': institutions.find(i => i.id === quota.institucionId)?.nombre || 'N/A',
            'Grado': quota.grado,
            'Jornada': quota.jornada,
            'Cupos Totales': quota.cuposTotales,
            'Cupos Asignados': quota.cuposAsignados,
            'Disponibles': quota.cuposTotales - quota.cuposAsignados
          }))
        }
      default:
        return []
    }
  }

  const exportToExcel = (data: any) => {
    const wb = XLSX.utils.book_new()
    
    if (data.Estudiantes) {
      // Si es 'all', crear múltiples hojas
      Object.entries(data).forEach(([sheetName, sheetData]) => {
        const ws = XLSX.utils.json_to_sheet(sheetData as any[])
        XLSX.utils.book_append_sheet(wb, ws, sheetName)
      })
    } else {
      // Si es un solo tipo de datos, crear una hoja
      const ws = XLSX.utils.json_to_sheet(data)
      XLSX.utils.book_append_sheet(wb, ws, 'Datos')
    }

    XLSX.writeFile(wb, `${filename || 'reporte'}.xlsx`)
  }

  const exportToPDF = (data: any) => {
    const doc = new jsPDF()
    const title = filename || 'Reporte del Sistema'
    
    doc.setFontSize(18)
    doc.text(title, 14, 22)
    
    if (data.Estudiantes) {
      // Si es 'all', crear múltiples tablas
      let yOffset = 30
      Object.entries(data).forEach(([tableName, tableData]) => {
        doc.setFontSize(14)
        doc.text(tableName, 14, yOffset)
        
        const typedTableData = tableData as Record<string, any>[]
        autoTable(doc, {
          startY: yOffset + 10,
          head: [Object.keys(typedTableData[0])],
          body: typedTableData.map(Object.values),
          margin: { top: 10 },
          styles: { fontSize: 8 }
        })
        
        yOffset = (doc as any).lastAutoTable.finalY + 20
        
        if (yOffset > 250) {
          doc.addPage()
          yOffset = 20
        }
      })
    } else {
      // Si es un solo tipo de datos, crear una tabla
      autoTable(doc, {
        startY: 30,
        head: [Object.keys(data[0])],
        body: data.map(Object.values),
        margin: { top: 10 },
        styles: { fontSize: 8 }
      })
    }
    
    doc.save(`${filename || 'reporte'}.pdf`)
  }

  const dataToExport = getDataToExport()
  
  try {
    if (type === 'excel') {
      exportToExcel(dataToExport)
    } else {
      exportToPDF(dataToExport)
    }
  } catch (error) {
    console.error('Error al exportar datos:', error)
    throw new Error('Error al exportar datos')
  }
}