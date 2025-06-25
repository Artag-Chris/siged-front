export interface PAE {
  id: string;
  estudianteId: string;
  institucionId: string;
  fechaAsignacion: string;
  fechaVencimiento: string;
  estado: "Activo" | "Inactivo" | "Vencido";
  tipoBeneficio: "Desayuno" | "Almuerzo" | "Completo";
  observaciones?: string;
}

export interface PAEFormData {
  estudianteId: string;
  institucionId: string;
  fechaAsignacion: string;
  fechaVencimiento: string;
  estado: "Activo" | "Inactivo" | "Vencido";
  tipoBeneficio: "Desayuno" | "Almuerzo" | "Completo";
  observaciones?: string;
}

export interface PAEState {
  beneficios: PAE[];
  isLoading: boolean;
  currentBeneficio: PAE | null;

  // Actions
  addBeneficio: (beneficio: PAEFormData) => Promise<string>;
  updateBeneficio: (id: string, beneficio: Partial<PAEFormData>) => Promise<boolean>;
  deleteBeneficio: (id: string) => Promise<boolean>;
  getBeneficio: (id: string) => PAE | undefined;
  getBeneficiosByStudent: (estudianteId: string) => PAE[];
  getBeneficiosByInstitution: (institucionId: string) => PAE[];
  setCurrentBeneficio: (beneficio: PAE | null) => void;
  setLoading: (loading: boolean) => void;
}