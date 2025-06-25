export interface Rector {
  id: string;
  nombres: string;
  apellidos: string;
  cedula: string;
  email: string;
  telefono: string;
  institucionId: string; // ID de la institución asignada
  fechaVinculacion: string;
  estado: "activa" | "inactiva";
  experienciaAnios: number;
  observaciones?: string;
}

export interface RectorFormData {
  nombres: string;
  apellidos: string;
  cedula: string;
  email: string;
  telefono: string;
  institucionId: string;
  fechaVinculacion: string;
  estado: "activa" | "inactiva";
  experienciaAnios: number;
  observaciones?: string;
}

export interface RectorState {
  rectores: Rector[];
  isLoading: boolean;
  currentRector: Rector | null;

  // Actions
  addRector: (rector: RectorFormData) => Promise<boolean>;
  updateRector: (id: string, rector: Partial<RectorFormData>) => Promise<boolean>;
  deleteRector: (id: string) => Promise<boolean>;
  getRector: (id: string) => Rector | undefined;
  getRectorByInstitution: (institucionId: string) => Rector | undefined;
  setCurrentRector: (rector: Rector | null) => void;
  setLoading: (loading: boolean) => void;
}