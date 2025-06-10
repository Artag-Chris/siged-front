import { DUMMY_STUDENTS } from "@/dummyData/dummyStudents/dummyStudents"
import { Student, StudentFormData, StudentState } from "@/interfaces"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

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
