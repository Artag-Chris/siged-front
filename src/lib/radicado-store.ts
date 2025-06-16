import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface RadicadoState {
  lastRadicadoNumber: number
  generateRadicado: () => string
  setLastRadicadoNumber: (number: number) => void
}

export const useRadicadoStore = create<RadicadoState>()(
  persist(
    (set, get) => ({
      lastRadicadoNumber: 0,

      generateRadicado: () => {
        const currentYear = new Date().getFullYear()
        const currentNumber = get().lastRadicadoNumber + 1
        const paddedNumber = currentNumber.toString().padStart(6, "0")

        set({ lastRadicadoNumber: currentNumber })

        return `RAD-${currentYear}-${paddedNumber}`
      },

      setLastRadicadoNumber: (number: number) => {
        set({ lastRadicadoNumber: number })
      },
    }),
    {
      name: "radicado-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
