import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface Student {
  id: string
  nombreCompleto: string
  tipoDocumento: "TI" | "CC" | "RC" | "CE" | "PEP"
  numeroDocumento: string
  fechaNacimiento: string
  direccionResidencia: string
  telefonoContacto?: string
  gradoSolicitado: string
  institucionAsignada?: string
  fechaAsignacion?: string
  estado: "Activo" | "Retirado" | "Trasladado" | "Pendiente"
  nombreAcudiente: string
  parentescoAcudiente: "Padre" | "Madre" | "Tío" | "Abuelo" | "Tutor" | "Otro"
  telefonoAcudiente: string
  observaciones?: string
}

export interface StudentFormData {
  nombreCompleto: string
  tipoDocumento: "TI" | "CC" | "RC" | "CE" | "PEP"
  numeroDocumento: string
  fechaNacimiento: string
  direccionResidencia: string
  telefonoContacto?: string
  gradoSolicitado: string
  nombreAcudiente: string
  parentescoAcudiente: "Padre" | "Madre" | "Tío" | "Abuelo" | "Tutor" | "Otro"
  telefonoAcudiente: string
  observaciones?: string
}

interface StudentState {
  students: Student[]
  isLoading: boolean
  currentStudent: Student | null

  // Actions
  addStudent: (student: StudentFormData) => Promise<string>
  updateStudent: (id: string, student: Partial<StudentFormData>) => Promise<boolean>
  deleteStudent: (id: string) => Promise<boolean>
  getStudent: (id: string) => Student | undefined
  getStudentByDocument: (tipoDocumento: string, numeroDocumento: string) => Student | undefined
  setCurrentStudent: (student: Student | null) => void
  setLoading: (loading: boolean) => void
  assignInstitution: (
    studentId: string,
    institucionId: string,
    fechaAsignacion: string,
    estado?: "Activo" | "Retirado" | "Trasladado" | "Pendiente",
  ) => Promise<boolean>
  searchStudents: (query: string) => Student[]
}

// Datos dummy para estudiantes
const DUMMY_STUDENTS: Student[] = [
  {
    id: "1",
    nombreCompleto: "Ana María Gómez Pérez",
    tipoDocumento: "TI",
    numeroDocumento: "1001234567",
    fechaNacimiento: "2010-05-15",
    direccionResidencia: "Calle 45 #23-67, Barrio Centro",
    telefonoContacto: "3001234567",
    gradoSolicitado: "5",
    institucionAsignada: "1", // ID de la institución San Judas Tadeo
    fechaAsignacion: "2024-01-10",
    estado: "Activo",
    nombreAcudiente: "Carlos Gómez Rodríguez",
    parentescoAcudiente: "Padre",
    telefonoAcudiente: "3109876543",
    observaciones: "Estudiante con buen rendimiento académico",
  },
  {
    id: "2",
    nombreCompleto: "Juan Pablo Martínez Silva",
    tipoDocumento: "TI",
    numeroDocumento: "1002345678",
    fechaNacimiento: "2012-08-20",
    direccionResidencia: "Carrera 30 #15-45, Barrio La Esperanza",
    telefonoContacto: "3112345678",
    gradoSolicitado: "3",
    institucionAsignada: "2", // ID de la institución Rural La Esperanza
    fechaAsignacion: "2024-01-15",
    estado: "Activo",
    nombreAcudiente: "María Silva Ortiz",
    parentescoAcudiente: "Madre",
    telefonoAcudiente: "3203456789",
    observaciones: "Requiere apoyo adicional en matemáticas",
  },
  {
    id: "3",
    nombreCompleto: "Valentina Rodríguez López",
    tipoDocumento: "RC",
    numeroDocumento: "1003456789",
    fechaNacimiento: "2015-03-10",
    direccionResidencia: "Avenida Principal #78-90, Barrio Industrial",
    telefonoContacto: "",
    gradoSolicitado: "Transición",
    estado: "Pendiente",
    nombreAcudiente: "Jorge Rodríguez Mendoza",
    parentescoAcudiente: "Padre",
    telefonoAcudiente: "3154567890",
    observaciones: "Primera vez en el sistema educativo",
  },
  {
    id: "4",
    nombreCompleto: "Santiago Herrera Duarte",
    tipoDocumento: "TI",
    numeroDocumento: "1004567890",
    fechaNacimiento: "2009-11-25",
    direccionResidencia: "Calle 80 #45-12, Barrio Robledo",
    telefonoContacto: "3045678901",
    gradoSolicitado: "6",
    institucionAsignada: "3", // ID de la institución Técnico Industrial
    fechaAsignacion: "2023-12-05",
    estado: "Trasladado",
    nombreAcudiente: "Ana Duarte Pérez",
    parentescoAcudiente: "Madre",
    telefonoAcudiente: "3176789012",
    observaciones: "Trasladado por cambio de residencia",
  },
  {
    id: "5",
    nombreCompleto: "Sofía Ramírez Ochoa",
    tipoDocumento: "TI",
    numeroDocumento: "1005678901",
    fechaNacimiento: "2011-07-08",
    direccionResidencia: "Carrera 65 #23-45, Barrio Laureles",
    telefonoContacto: "3057890123",
    gradoSolicitado: "4",
    institucionAsignada: "1", // ID de la institución San Judas Tadeo
    fechaAsignacion: "2024-01-12",
    estado: "Activo",
    nombreAcudiente: "Roberto Ramírez Gómez",
    parentescoAcudiente: "Padre",
    telefonoAcudiente: "3188901234",
    observaciones: "",
  },
]

// Listas de opciones para los campos
export const TIPOS_DOCUMENTO = [
  { value: "TI", label: "Tarjeta de Identidad" },
  { value: "CC", label: "Cédula de Ciudadanía" },
  { value: "RC", label: "Registro Civil" },
  { value: "CE", label: "Cédula de Extranjería" },
  { value: "PEP", label: "Permiso Especial de Permanencia" },
]

export const GRADOS_DISPONIBLES = [
  { value: "Transición", label: "Transición" },
  { value: "1", label: "Primero" },
  { value: "2", label: "Segundo" },
  { value: "3", label: "Tercero" },
  { value: "4", label: "Cuarto" },
  { value: "5", label: "Quinto" },
  { value: "6", label: "Sexto" },
  { value: "7", label: "Séptimo" },
  { value: "8", label: "Octavo" },
  { value: "9", label: "Noveno" },
  { value: "10", label: "Décimo" },
  { value: "11", label: "Undécimo" },
]

export const PARENTESCOS = [
  { value: "Padre", label: "Padre" },
  { value: "Madre", label: "Madre" },
  { value: "Tío", label: "Tío/Tía" },
  { value: "Abuelo", label: "Abuelo/Abuela" },
  { value: "Tutor", label: "Tutor Legal" },
  { value: "Otro", label: "Otro" },
]

export const ESTADOS_ESTUDIANTE = [
  { value: "Activo", label: "Activo" },
  { value: "Retirado", label: "Retirado" },
  { value: "Trasladado", label: "Trasladado" },
  { value: "Pendiente", label: "Pendiente" },
]

export const useStudentStore = create<StudentState>()(
  persist(
    (set, get) => ({
      students: DUMMY_STUDENTS,
      isLoading: false,
      currentStudent: null,

      addStudent: async (studentData: StudentFormData): Promise<string> => {
        set({ isLoading: true })

        try {
          // Simular llamada a API
          await new Promise((resolve) => setTimeout(resolve, 1000))

          const newStudent: Student = {
            id: Date.now().toString(),
            ...studentData,
            estado: "Pendiente",
          }

          set((state) => ({
            students: [...state.students, newStudent],
            isLoading: false,
          }))

          return newStudent.id
        } catch (error) {
          console.log(error)
          set({ isLoading: false })
          throw error
        }
      },

      updateStudent: async (id: string, studentData: Partial<StudentFormData>): Promise<boolean> => {
        set({ isLoading: true })

        try {
          await new Promise((resolve) => setTimeout(resolve, 1000))

          set((state) => ({
            students: state.students.map((student) => (student.id === id ? { ...student, ...studentData } : student)),
            isLoading: false,
          }))

          return true
        } catch (error) {
          console.log(error)
          set({ isLoading: false })
          return false
        }
      },

      deleteStudent: async (id: string): Promise<boolean> => {
        set({ isLoading: true })

        try {
          await new Promise((resolve) => setTimeout(resolve, 500))

          set((state) => ({
            students: state.students.filter((student) => student.id !== id),
            isLoading: false,
          }))

          return true
        } catch (error) {
          console.log(error)
          set({ isLoading: false })
          return false
        }
      },

      getStudent: (id: string) => {
        return get().students.find((student) => student.id === id)
      },

      getStudentByDocument: (tipoDocumento: string, numeroDocumento: string) => {
        return get().students.find(
          (student) => student.tipoDocumento === tipoDocumento && student.numeroDocumento === numeroDocumento,
        )
      },

      setCurrentStudent: (student: Student | null) => {
        set({ currentStudent: student })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      assignInstitution: async (
        studentId: string,
        institucionId: string,
        fechaAsignacion: string,
        estado: "Activo" | "Retirado" | "Trasladado" | "Pendiente" = "Activo",
      ): Promise<boolean> => {
        set({ isLoading: true })

        try {
          await new Promise((resolve) => setTimeout(resolve, 1000))

          set((state) => ({
            students: state.students.map((student) =>
              student.id === studentId
                ? {
                    ...student,
                    institucionAsignada: institucionId,
                    fechaAsignacion,
                    estado,
                  }
                : student,
            ),
            isLoading: false,
          }))

          return true
        } catch (error) {
          console.log(error)
          set({ isLoading: false })
          return false
        }
      },

      searchStudents: (query: string) => {
        const lowercaseQuery = query.toLowerCase()
        return get().students.filter(
          (student) =>
            student.nombreCompleto.toLowerCase().includes(lowercaseQuery) || student.numeroDocumento.includes(query),
        )
      },
    }),
    {
      name: "student-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        students: state.students,
      }),
    },
  ),
)
