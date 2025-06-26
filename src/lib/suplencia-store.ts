import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Suplencia, SuplenciaFormData, SuplenciaState } from "@/interfaces/suplencia";
import { DUMMY_SUPLENCIAS } from "@/dummyData";


export const useSuplenciaStore = create<SuplenciaState>()(
  persist(
    (set, get) => ({
      suplencias: DUMMY_SUPLENCIAS,
      isLoading: false,
      currentSuplencia: null,

      addSuplencia: async (suplencia: SuplenciaFormData): Promise<any> => {
        set({ isLoading: true });
        try {
          // Simular llamada a API
          const newSuplencia: Suplencia = {
            id: Date.now().toString(),
            docenteAusenteId: suplencia.docenteAusenteId,
            tipoAusencia: suplencia.tipoAusencia as Suplencia["tipoAusencia"],
            fechaInicioAusencia: suplencia.fechaInicioAusencia,
            fechaFinAusencia: suplencia.fechaFinAusencia,
            institucionId: suplencia.institucionId,
            docenteReemplazoId: suplencia.docenteReemplazoId,
            fechaInicioReemplazo: suplencia.fechaInicioReemplazo,
            fechaFinReemplazo: suplencia.fechaFinReemplazo,
            horasCubiertas: suplencia.horasCubiertas,
            jornada: suplencia.jornada,
            concepto: suplencia.concepto,
            observaciones: suplencia.observaciones,
          };

          set((state) => ({
            suplencias: [...state.suplencias, newSuplencia],
            isLoading: false,
          }));

          return true;
        } catch (error) {
          console.error("Error adding suplencia:", error);
          set({ isLoading: false });
          return false;
        }
      },

updateSuplencia: async (id: string, formData: FormData): Promise<any> => {
  set({ isLoading: true });
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    set((state) => {
      const updatedSuplencias = state.suplencias.map((sup) => {
        if (sup.id === id) {
          return {
            ...sup,
            docenteAusenteId: formData.get('docenteAusenteId') as string,
            tipoAusencia: formData.get('tipoAusencia') as "Incapacidad EPS" | "Licencia sin sueldo" | "Comisión oficial" | "Otro",
            fechaInicioAusencia: formData.get('fechaInicioAusencia') as string,
            fechaFinAusencia: formData.get('fechaFinAusencia') as string,
            institucionId: formData.get('institucionId') as string,
            docenteReemplazoId: formData.get('docenteReemplazoId') as string,
            fechaInicioReemplazo: formData.get('fechaInicioReemplazo') as string,
            fechaFinReemplazo: formData.get('fechaFinReemplazo') as string,
            horasCubiertas: Number(formData.get('horasCubiertas')),
            jornada: formData.get('jornada') as "Mañana" | "Tarde" | "Noche" | "Única" | "Sabatina" | "Nocturna",
            concepto: formData.get('concepto') as string,
            observaciones: formData.get('observaciones') as string || undefined,
            // Mantener los archivos existentes si no se actualizan
            soporteIncapacidad: sup.soporteIncapacidad,
            soporteHoras: sup.soporteHoras
          };
        }
        return sup;
      });

      return {
        ...state,
        suplencias: updatedSuplencias,
        isLoading: false
      };
    });

    return true;
  } catch (error) {
    console.error("Error updating suplencia:", error);
    set({ isLoading: false });
    return false;
  }
},

      deleteSuplencia: async (id: string): Promise<boolean> => {
        set({ isLoading: true });
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          set((state) => ({
            suplencias: state.suplencias.filter((sup) => sup.id !== id),
            isLoading: false,
          }));

          return true;
        } catch (error) {
          console.error("Error deleting suplencia:", error);
          set({ isLoading: false });
          return false;
        }
      },

      getSuplencia: (id: string) => {
        return get().suplencias.find((sup) => sup.id === id);
      },

      getSuplenciasByInstitution: (institucionId: string) => {
        return get().suplencias.filter((sup) => sup.institucionId === institucionId);
      },

      setCurrentSuplencia: (suplencia: Suplencia | null) => {
        set({ currentSuplencia: suplencia });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: "suplencia-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        suplencias: state.suplencias,
      }),
    }
  )
);