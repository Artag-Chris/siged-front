import { DUMMY_VEHICULOS } from "@/dummyData/dummyVehiculos"
import { Vehiculo, VehiculoFormData, VehiculoState } from "@/interfaces"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export const useVehiculoStore = create<VehiculoState>()(
  persist(
    (set, get) => ({
      vehiculos: DUMMY_VEHICULOS,
      isLoading: false,
      currentVehiculo: null,

      addVehiculo: async (vehiculoData: VehiculoFormData): Promise<string> => {
        set({ isLoading: true })

        try {
          await new Promise((resolve) => setTimeout(resolve, 1000))

          const newVehiculo: Vehiculo = {
            id: Date.now().toString(),
            ...vehiculoData,
            estado: "Activo",
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString(),
          }

          set((state) => ({
            vehiculos: [...state.vehiculos, newVehiculo],
            isLoading: false,
          }))

          return newVehiculo.id
        } catch (error) {
          console.log(error)
          set({ isLoading: false })
          throw error
        }
      },

      updateVehiculo: async (id: string, vehiculoData: Partial<VehiculoFormData>): Promise<boolean> => {
        set({ isLoading: true })

        try {
          await new Promise((resolve) => setTimeout(resolve, 1000))

          set((state) => ({
            vehiculos: state.vehiculos.map((vehiculo) =>
              vehiculo.id === id
                ? {
                    ...vehiculo,
                    ...vehiculoData,
                    fechaActualizacion: new Date().toISOString(),
                  }
                : vehiculo,
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

      deleteVehiculo: async (id: string): Promise<boolean> => {
        set({ isLoading: true })

        try {
          await new Promise((resolve) => setTimeout(resolve, 500))

          set((state) => ({
            vehiculos: state.vehiculos.filter((vehiculo) => vehiculo.id !== id),
            isLoading: false,
          }))

          return true
        } catch (error) {
          console.log(error)
          set({ isLoading: false })
          return false
        }
      },

      getVehiculo: (id: string) => {
        return get().vehiculos.find((vehiculo) => vehiculo.id === id)
      },

      getVehiculoByPlaca: (placa: string) => {
        return get().vehiculos.find((vehiculo) => vehiculo.placa.toLowerCase() === placa.toLowerCase())
      },

      setCurrentVehiculo: (vehiculo: Vehiculo | null) => {
        set({ currentVehiculo: vehiculo })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      searchVehiculos: (query: string) => {
        const lowercaseQuery = query.toLowerCase()
        return get().vehiculos.filter(
          (vehiculo) =>
            vehiculo.placa.toLowerCase().includes(lowercaseQuery) ||
            vehiculo.marca.toLowerCase().includes(lowercaseQuery) ||
            vehiculo.modelo.toLowerCase().includes(lowercaseQuery) ||
            (vehiculo.numeroInterno && vehiculo.numeroInterno.toLowerCase().includes(lowercaseQuery)),
        )
      },

      getAllVehiculos: () => {
        return get().vehiculos
      },

      getVehiculosDisponibles: () => {
        return get().vehiculos.filter((vehiculo) => vehiculo.estado === "Activo" && !vehiculo.conductorAsignado)
      },

      assignConductor: async (vehiculoId: string, conductorId: string): Promise<boolean> => {
        set({ isLoading: true })

        try {
          await new Promise((resolve) => setTimeout(resolve, 500))

          set((state) => ({
            vehiculos: state.vehiculos.map((vehiculo) =>
              vehiculo.id === vehiculoId
                ? {
                    ...vehiculo,
                    conductorAsignado: conductorId,
                    fechaActualizacion: new Date().toISOString(),
                  }
                : vehiculo,
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
    }),
    {
      name: "vehiculo-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        vehiculos: state.vehiculos,
      }),
    },
  ),
)
