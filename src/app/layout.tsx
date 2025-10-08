import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

// Optimización de fuentes para producción
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap', // Mejora el rendimiento de carga
  preload: true,
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: "Sistema de Gestión Educativa",
  description: "Dashboard admin con autenticación y gestión de profesores",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
