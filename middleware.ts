import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // =============================================
  // MANEJO DE RUTAS API - CORS y otros headers
  // =============================================
  if (pathname.startsWith('/api/')) {
    // Headers CORS para todas las rutas API
    const response = NextResponse.next()
    
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Max-Age', '86400')
    
    // Para rutas de upload, agregar headers específicos
    if (pathname.includes('/upload')) {
      response.headers.set('Access-Control-Allow-Credentials', 'false')
      // No establecer Content-Length para uploads
    }
    
    return response
  }

  // =============================================
  // AUTENTICACIÓN - Rutas protegidas
  // =============================================
  
  // Rutas que requieren autenticación
  const protectedPaths = ["/dashboard"]

  // Rutas que solo pueden acceder usuarios no autenticados
  const authPaths = ["/login"]

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
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Note: Incluimos /api/ para manejar CORS
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}