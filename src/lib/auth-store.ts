import { DUMMY_USERS } from "@/dummyData/dummyUsers"
import { AuthState } from "@/interfaces/AuthContext"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"


export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, password: string): Promise<boolean> => {
        set({ isLoading: true })

        try {
          // Limpiar cualquier estado anterior para evitar conflictos
          get().clearAllStorage()

          // Simular delay de API
          await new Promise((resolve) => setTimeout(resolve, 1000))

          const foundUser = DUMMY_USERS.find((u) => u.email === email && u.password === password)

          if (foundUser) {
            const userData = {
              id: foundUser.id,
              email: foundUser.email,
              name: foundUser.name,
              role: foundUser.role,
              avatar: foundUser.avatar,
              department: foundUser.department,
              lastLogin: new Date().toISOString(),
              permissions: foundUser.permissions,
            }

            set({
              user: userData,
              isLoading: false,
              isAuthenticated: true,
            })

            // Establecer cookie para el middleware
            document.cookie = `auth-token=${userData.id}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 días

            return true
          }

          set({ isLoading: false })
          return false
        } catch (error) {
          console.error("Error en login:", error)
          set({ isLoading: false })
          return false
        }
      },

      logout: () => {
        try {
          // Limpiar estado
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          })

          // Limpiar cookie
          document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
        } catch (error) {
          console.error("Error en logout:", error)
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      clearAllStorage: () => {
        try {
          // Limpiar localStorage específicamente
          localStorage.removeItem("auth-storage")
          localStorage.removeItem("professor-storage")
          localStorage.removeItem("document-storage")

          // Limpiar cookies
          document.cookie.split(";").forEach((c) => {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)
          })
        } catch (error) {
          console.error("Error al limpiar storage:", error)
        }
      },

      forceLogout: () => {
        try {
          // Limpiar estado
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          })

          // Limpiar storage
          get().clearAllStorage()
        } catch (error) {
          console.error("Error en forceLogout:", error)
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
