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

export interface StudentState {
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