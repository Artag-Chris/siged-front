import { DUMMY_RECTORES } from "@/dummyData";
import { RectorState, RectorFormData, Rector } from "@/interfaces";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";



export const useRectorStore = create<RectorState>()(
  persist(
    (set, get) => ({
      rectores: DUMMY_RECTORES,
      isLoading: false,
      currentRector: null,

      addRector: async (rectorData: RectorFormData): Promise<boolean> => {
        set({ isLoading: true });
        try {
          // Simular llamada a API
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          const newRector: Rector = {
            id: Date.now().toString(),
            ...rectorData,
          };

          set((state) => ({
            rectores: [...state.rectores, newRector],
            isLoading: false,
          }));

          return true;
        } catch (error) {
          console.error("Error adding rector:", error);
          set({ isLoading: false });
          return false;
        }
      },

      updateRector: async (id: string, rectorData: Partial<RectorFormData>): Promise<boolean> => {
        set({ isLoading: true });
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          set((state) => ({
            rectores: state.rectores.map((rect) => 
              rect.id === id ? { ...rect, ...rectorData } : rect
            ),
            isLoading: false,
          }));

          return true;
        } catch (error) {
          console.error("Error updating rector:", error);
          set({ isLoading: false });
          return false;
        }
      },

      deleteRector: async (id: string): Promise<boolean> => {
        set({ isLoading: true });
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          set((state) => ({
            rectores: state.rectores.filter((rect) => rect.id !== id),
            isLoading: false,
          }));

          return true;
        } catch (error) {
          console.error("Error deleting rector:", error);
          set({ isLoading: false });
          return false;
        }
      },

      getRector: (id: string) => {
        return get().rectores.find((rect) => rect.id === id);
      },

      getRectorByInstitution: (institucionId: string) => {
        return get().rectores.find((rect) => rect.institucionId === institucionId);
      },

      setCurrentRector: (rector: Rector | null) => {
        set({ currentRector: rector });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: "rector-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        rectores: state.rectores,
      }),
    }
  )
);