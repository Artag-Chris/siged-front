import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  avatar: string
  department: string
  lastLogin: string
  permissions: string[]
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  setLoading: (loading: boolean) => void
  forceLogout: () => void
  clearAllStorage: () => void
}

// Datos dummy actualizados - todos los managers ahora son admin
const DUMMY_USERS = [
  {
    id: "1",
    email: "admin@example.com",
    password: "admin123",
    name: "Carlos Rodríguez",
    role: "admin" as const,
    avatar: "/placeholder.svg?height=40&width=40",
    department: "Administración",
    lastLogin: "2024-01-15 09:30:00",
    permissions: ["read", "write", "delete", "manage_users", "view_analytics", "manage_professors", "upload_documents"],
  },
  {
    id: "2",
    email: "user@example.com",
    password: "user123",
    name: "Ana García",
    role: "user" as const,
    avatar: "/placeholder.svg?height=40&width=40",
    department: "Ventas",
    lastLogin: "2024-01-15 08:45:00",
    permissions: ["read", "write"],
  },
  {
    id: "3",
    email: "manager@example.com",
    password: "manager123",
    name: "Luis Martínez",
    role: "admin" as const, // Cambiado de manager a admin
    avatar: "/placeholder.svg?height=40&width=40",
    department: "Marketing",
    lastLogin: "2024-01-14 16:20:00",
    permissions: ["read", "write", "delete", "manage_users", "view_analytics", "manage_professors", "upload_documents"],
  },
]

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
