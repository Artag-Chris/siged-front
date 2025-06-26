export interface Suplencia {
  id: string;
  docenteAusenteId: string;
  tipoAusencia: "Incapacidad EPS" | "Licencia sin sueldo" | "Comisión oficial" | "Otro";
  fechaInicioAusencia: string; // Fecha en formato ISO (YYYY-MM-DD)
  fechaFinAusencia: string;
  institucionId: string;
  docenteReemplazoId: string;
  fechaInicioReemplazo: string;
  fechaFinReemplazo: string;
  horasCubiertas: number;
  jornada: "Mañana" | "Tarde" | "Noche" | "Única" | "Sabatina" | "Nocturna";
  concepto: string;
  soporteIncapacidad?: File | null; // Cambiado de URL a File
  soporteHoras?: File | null; // Cambiado de URL a File
  observaciones?: string;
}

export interface SuplenciaFormData {
  docenteAusenteId: string;
  tipoAusencia: "Incapacidad EPS" | "Licencia sin sueldo" | "Comisión oficial" | "Otro";
  fechaInicioAusencia: string;
  fechaFinAusencia: string;
  institucionId: string;
  docenteReemplazoId: string;
  fechaInicioReemplazo: string;
  fechaFinReemplazo: string;
  horasCubiertas: number;
  jornada: "Mañana" | "Tarde" | "Noche" | "Única" | "Sabatina" | "Nocturna";
  concepto: string;
  soporteIncapacidad?: File | null;
  soporteHoras?: File | null;
  observaciones?: string;
}

export interface SuplenciaState {
  suplencias: Suplencia[];
  isLoading: boolean;
  currentSuplencia: Suplencia | null;

  // Actions
  addSuplencia: (suplencia: SuplenciaFormData | FormData) => Promise<any>;
   updateSuplencia: (id: string, suplencia: FormData) => Promise<boolean>;
  deleteSuplencia: (id: string) => Promise<boolean>;
  getSuplencia: (id: string) => Suplencia | undefined;
  getSuplenciasByInstitution: (institucionId: string) => Suplencia[];
  setCurrentSuplencia: (suplencia: Suplencia | null) => void;
  setLoading: (loading: boolean) => void;
}