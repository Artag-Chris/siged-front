import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Rutas que requieren autenticación
  const protectedPaths = ["/dashboard"]

  // Rutas que solo pueden acceder usuarios no autenticados
  const authPaths = ["/login"]

  const { pathname } = request.nextUrl

  // Verificar si la ruta actual es protegida
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path))

  // Verificar si la ruta actual es de autenticación
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path))

  // Obtener el token de autenticación desde las cookies
  const authToken = request.cookies.get("auth-token")
  const hasValidToken = authToken?.value

  // Si es una ruta protegida y no hay token válido, redirigir al login
  if (isProtectedPath && !hasValidToken) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Si es una ruta de auth y ya hay token válido, redirigir al dashboard
  if (isAuthPath && hasValidToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}