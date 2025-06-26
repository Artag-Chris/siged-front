import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useStudentStore } from '@/lib/student-store'
import { useInstitutionStore } from '@/lib/instituition-store'
import { useProfessorStore } from '@/lib/profesor-store'
import { useGradeStore } from '@/lib/grade-store'
import { useConductorStore } from '@/lib/conductor-store'
import { usePAEStore } from '@/lib/pae-store'
import { useSuplenciaStore } from '@/lib/suplencia-store'

export function getStatusColor(status: string) {
    const colors: Record<string, string> = {
        Activo: "#10b981",
        Pendiente: "#f59e0b",
        Trasladado: "#3b82f6",
        Retirado: "#ef4444",
        Inactivo: "#6b7280",
        Vencido: "#dc2626",
    }
    return colors[status] || "#6b7280"
}

interface ExportOptions {
  type: 'excel' | 'pdf'
  data: 'students' | 'institutions' | 'professors' | 'quotas' | 'conductors' | 'pae' | 'suplencias' | 'all'
  filename?: string
}

export const exportData = ({ type, data, filename }: ExportOptions) => {
  const { students } = useStudentStore.getState()
  const { institutions } = useInstitutionStore.getState()
  const { professors } = useProfessorStore.getState()
  const { gradeQuotas } = useGradeStore.getState()
  const { conductores } = useConductorStore.getState()
  const { beneficios } = usePAEStore.getState()
  const { suplencias } = useSuplenciaStore.getState()

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString()
  }

  const getDataToExport = (): any => {
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

      case 'conductors':
        return conductores.map(conductor => ({
          'Nombre Completo': conductor.nombreCompleto,
          'Tipo Documento': conductor.tipoDocumento,
          'Número Documento': conductor.numeroDocumento,
          'Licencia de Conducir': conductor.licenciaConducir,
          'Categoría Licencia': conductor.categoriaLicencia,
          'Fecha Vencimiento Licencia': conductor.fechaVencimientoLicencia ? formatDate(conductor.fechaVencimientoLicencia) : 'No registrada',
          'Teléfono': conductor.telefono,
          'Email': conductor.email || 'No registrado',
          'Dirección': conductor.direccion,
          'Estado': conductor.estado,
          'Fecha Ingreso': formatDate(conductor.fechaIngreso)
        }))

      case 'pae':
        return beneficios.map(beneficio => {
          const estudiante = students.find(s => s.id === beneficio.estudianteId)
          const institucion = institutions.find(i => i.id === beneficio.institucionId)
          return {
            'Estudiante': estudiante?.nombreCompleto || 'N/A',
            'Documento Estudiante': estudiante?.numeroDocumento || 'N/A',
            'Institución': institucion?.nombre || 'N/A',
            'Tipo Beneficio': beneficio.tipoBeneficio,
            'Fecha Asignación': formatDate(beneficio.fechaAsignacion),
            'Fecha Vencimiento': formatDate(beneficio.fechaVencimiento),
            'Estado': beneficio.estado,
            'Observaciones': beneficio.observaciones || 'Sin observaciones'
          }
        })

      case 'suplencias':
        return suplencias.map(suplencia => {
          const docenteAusente = professors.find(p => p.id === suplencia.docenteAusenteId)
          const docenteReemplazo = professors.find(p => p.id === suplencia.docenteReemplazoId)
          const institucion = institutions.find(i => i.id === suplencia.institucionId)
          return {
            'Docente Ausente': docenteAusente ? `${docenteAusente.nombres} ${docenteAusente.apellidos}` : 'N/A',
            'Docente Reemplazo': docenteReemplazo ? `${docenteReemplazo.nombres} ${docenteReemplazo.apellidos}` : 'N/A',
            'Institución': institucion?.nombre || 'N/A',
            'Tipo Ausencia': suplencia.tipoAusencia,
            'Fecha Inicio Ausencia': formatDate(suplencia.fechaInicioAusencia),
            'Fecha Fin Ausencia': formatDate(suplencia.fechaFinAusencia),
            'Fecha Inicio Reemplazo': formatDate(suplencia.fechaInicioReemplazo),
            'Fecha Fin Reemplazo': formatDate(suplencia.fechaFinReemplazo),
            'Horas Cubiertas': suplencia.horasCubiertas,
            'Jornada': suplencia.jornada,
            'Concepto': suplencia.concepto,
            'Observaciones': suplencia.observaciones || 'Sin observaciones'
          }
        })

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
          })),
          Conductores: conductores.map(conductor => ({
            'Nombre Completo': conductor.nombreCompleto,
            'Tipo Documento': conductor.tipoDocumento,
            'Número Documento': conductor.numeroDocumento,
            'Licencia de Conducir': conductor.licenciaConducir,
            'Categoría Licencia': conductor.categoriaLicencia,
            'Fecha Vencimiento Licencia': conductor.fechaVencimientoLicencia ? formatDate(conductor.fechaVencimientoLicencia) : 'No registrada',
            'Teléfono': conductor.telefono,
            'Email': conductor.email || 'No registrado',
            'Estado': conductor.estado
          })),
          'Beneficios PAE': beneficios.map(beneficio => {
            const estudiante = students.find(s => s.id === beneficio.estudianteId)
            const institucion = institutions.find(i => i.id === beneficio.institucionId)
            return {
              'Estudiante': estudiante?.nombreCompleto || 'N/A',
              'Institución': institucion?.nombre || 'N/A',
              'Tipo Beneficio': beneficio.tipoBeneficio,
              'Fecha Asignación': formatDate(beneficio.fechaAsignacion),
              'Estado': beneficio.estado
            }
          }),
          Suplencias: suplencias.map(suplencia => {
            const docenteAusente = professors.find(p => p.id === suplencia.docenteAusenteId)
            const docenteReemplazo = professors.find(p => p.id === suplencia.docenteReemplazoId)
            const institucion = institutions.find(i => i.id === suplencia.institucionId)
            return {
              'Docente Ausente': docenteAusente ? `${docenteAusente.nombres} ${docenteAusente.apellidos}` : 'N/A',
              'Docente Reemplazo': docenteReemplazo ? `${docenteReemplazo.nombres} ${docenteReemplazo.apellidos}` : 'N/A',
              'Institución': institucion?.nombre || 'N/A',
              'Tipo Ausencia': suplencia.tipoAusencia,
              'Horas Cubiertas': suplencia.horasCubiertas,
              'Jornada': suplencia.jornada
            }
          })
        }
      default:
        return []
    }
  }

  const exportToExcel = (data: any) => {
    const wb = XLSX.utils.book_new()
    
    if (data.Estudiantes || data.Conductores || data['Beneficios PAE'] || data.Suplencias) {
      // Si es 'all', crear múltiples hojas
      Object.entries(data).forEach(([sheetName, sheetData]) => {
        if (Array.isArray(sheetData) && sheetData.length > 0) {
          const ws = XLSX.utils.json_to_sheet(sheetData as any[])
          // Ajustar ancho de columnas
          const colWidths = Object.keys(sheetData[0]).map(() => ({ wch: 20 }))
          ws['!cols'] = colWidths
          XLSX.utils.book_append_sheet(wb, ws, sheetName)
        }
      })
    } else {
      // Si es un solo tipo de datos, crear una hoja
      if (Array.isArray(data) && data.length > 0) {
        const ws = XLSX.utils.json_to_sheet(data)
        // Ajustar ancho de columnas
        const colWidths = Object.keys(data[0]).map(() => ({ wch: 20 }))
        ws['!cols'] = colWidths
        XLSX.utils.book_append_sheet(wb, ws, 'Datos')
      }
    }

    XLSX.writeFile(wb, `${filename || 'reporte'}.xlsx`)
  }

  const exportToPDF = (data: any) => {
    const doc = new jsPDF('landscape') // Cambiar a orientación horizontal para más espacio
    const title = filename || 'Reporte del Sistema'
    
    doc.setFontSize(18)
    doc.text(title, 14, 22)
    
    if (data.Estudiantes || data.Conductores || data['Beneficios PAE'] || data.Suplencias) {
      // Si es 'all', crear múltiples tablas
      let yOffset = 30
      Object.entries(data).forEach(([tableName, tableData]) => {
        const typedTableData = tableData as Record<string, any>[]
        if (Array.isArray(typedTableData) && typedTableData.length > 0) {
          // Verificar si hay suficiente espacio, si no, agregar nueva página
          if (yOffset > 180) {
            doc.addPage()
            yOffset = 20
          }
          
          doc.setFontSize(14)
          doc.text(tableName, 14, yOffset)
          
          autoTable(doc, {
            startY: yOffset + 10,
            head: [Object.keys(typedTableData[0])],
            body: typedTableData.map(Object.values),
            margin: { top: 10 },
            styles: { 
              fontSize: 6,
              cellPadding: 2
            },
            headStyles: {
              fillColor: [66, 139, 202],
              textColor: 255,
              fontSize: 7
            },
            columnStyles: {
              // Ajustar ancho de columnas dinámicamente
              ...Object.keys(typedTableData[0]).reduce((acc, _, index) => {
                acc[index] = { cellWidth: 'auto' }
                return acc
              }, {} as any)
            }
          })
          
          yOffset = (doc as any).lastAutoTable.finalY + 20
        }
      })
    } else {
      // Si es un solo tipo de datos, crear una tabla
      if (Array.isArray(data) && data.length > 0) {
        autoTable(doc, {
          startY: 30,
          head: [Object.keys(data[0])],
          body: data.map(Object.values),
          margin: { top: 10 },
          styles: { 
            fontSize: 8,
            cellPadding: 3
          },
          headStyles: {
            fillColor: [66, 139, 202],
            textColor: 255,
            fontSize: 9
          }
        })
      }
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

// Función auxiliar para obtener estadísticas generales de cualquier store
export const getStoreStats = () => {
  const { students } = useStudentStore.getState()
  const { institutions } = useInstitutionStore.getState()
  const { professors } = useProfessorStore.getState()
  const { conductores } = useConductorStore.getState()
  const { beneficios } = usePAEStore.getState()
  const { suplencias } = useSuplenciaStore.getState()

  return {
    students: {
      total: students.length,
      active: students.filter(s => s.estado === 'Activo').length,
      pending: students.filter(s => s.estado === 'Pendiente').length
    },
    institutions: {
      total: institutions.length,
      active: institutions.filter(i => i.activa).length
    },
    professors: {
      total: professors.length,
      active: professors.filter(p => p.estado === 'activa').length
    },
    conductors: {
      total: conductores.length,
      active: conductores.filter(c => c.estado === 'Activo').length
    },
    pae: {
      total: beneficios.length,
      active: beneficios.filter(b => b.estado === 'Activo').length,
      expired: beneficios.filter(b => b.estado === 'Vencido').length
    },
    suplencias: {
      total: suplencias.length,
      byType: suplencias.reduce((acc, s) => {
        acc[s.tipoAusencia] = (acc[s.tipoAusencia] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }
  }
}