import { Users, DollarSign, ShoppingCart, Activity } from "lucide-react"

  export const stats = [
    {
      title: "Total Usuarios",
      value: "2,543",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Ventas",
      value: "$45,231",
      change: "+8%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Pedidos",
      value: "1,234",
      change: "+23%",
      icon: ShoppingCart,
      color: "text-purple-600",
    },
    {
      title: "Actividad",
      value: "89%",
      change: "+5%",
      icon: Activity,
      color: "text-orange-600",
    },
  ]

  export const userActivities= (user:any) => [
    { action: "Nuevo usuario registrado", time: "Hace 2 minutos", user: "Juan Pérez" },
    { action: "Pedido completado", time: "Hace 15 minutos", user: "María García" },
    { action: "Producto actualizado", time: "Hace 1 hora", user: user?.name || "Admin" },
    { action: "Nueva venta realizada", time: "Hace 2 horas", user: "Carlos López" },
  ]
