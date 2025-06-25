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

export const recentActivityRectores = [
  { action: "Nuevo rector registrado", time: "Hace 3 horas", user: "María Elena Rodríguez" },
  { action: "Documento de nombramiento subido", time: "Hace 5 horas", user: "Carlos Alberto Gómez" },
  { action: "Rector actualizado", time: "Hace 1 día", user: "Ana Patricia Morales" },
  { action: "Informe de gestión completado", time: "Hace 2 días", user: "Juan Pablo Restrepo" },
  { action: "Cambio de institución asignada", time: "Hace 3 días", user: "María Elena Rodríguez" },
  { action: "Actualización de experiencia", time: "Hace 4 días", user: "Carlos Alberto Gómez" },
];