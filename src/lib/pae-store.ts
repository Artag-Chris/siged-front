// pae-store.ts
import { DUMMY_PAE } from "@/dummyData";
import { PAEState, PAEFormData, PAE } from "@/interfaces";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";



export const usePAEStore = create<PAEState>()(
  persist(
    (set, get) => ({
      beneficios: DUMMY_PAE,
      isLoading: false,
      currentBeneficio: null,

      addBeneficio: async (beneficioData: PAEFormData): Promise<string> => {
        set({ isLoading: true });
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          const newBeneficio: PAE = {
            id: Date.now().toString(),
            ...beneficioData,
          };

          set((state) => ({
            beneficios: [...state.beneficios, newBeneficio],
            isLoading: false,
          }));

          return newBeneficio.id;
        } catch (error) {
          console.error("Error adding PAE benefit:", error);
          set({ isLoading: false });
          throw error;
        }
      },

      updateBeneficio: async (id: string, beneficioData: Partial<PAEFormData>): Promise<boolean> => {
        set({ isLoading: true });
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          set((state) => ({
            beneficios: state.beneficios.map((ben) => 
              ben.id === id ? { ...ben, ...beneficioData } : ben
            ),
            isLoading: false,
          }));

          return true;
        } catch (error) {
          console.error("Error updating PAE benefit:", error);
          set({ isLoading: false });
          return false;
        }
      },

      deleteBeneficio: async (id: string): Promise<boolean> => {
        set({ isLoading: true });
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          set((state) => ({
            beneficios: state.beneficios.filter((ben) => ben.id !== id),
            isLoading: false,
          }));

          return true;
        } catch (error) {
          console.error("Error deleting PAE benefit:", error);
          set({ isLoading: false });
          return false;
        }
      },

      getBeneficio: (id: string) => {
        return get().beneficios.find((ben) => ben.id === id);
      },

      getBeneficiosByStudent: (estudianteId: string) => {
        return get().beneficios.filter((ben) => ben.estudianteId === estudianteId);
      },

      getBeneficiosByInstitution: (institucionId: string) => {
        return get().beneficios.filter((ben) => ben.institucionId === institucionId);
      },

      setCurrentBeneficio: (beneficio: PAE | null) => {
        set({ currentBeneficio: beneficio });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: "pae-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        beneficios: state.beneficios,
      }),
    }
  )
);