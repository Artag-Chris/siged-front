import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ============================================================================
  // OPTIMIZACIONES DE PRODUCCIÓN
  // ============================================================================
  
  // Optimización de imágenes
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Compresión y optimización
  compress: true,
  
  // Optimización de producción
  productionBrowserSourceMaps: false, // Deshabilitar source maps en producción
  
  // React en modo producción
  reactStrictMode: true,
  
  // Power-Up para producción
  poweredByHeader: false, // Ocultar el header "X-Powered-By: Next.js"
  
  // Ignorar errores de ESLint y TypeScript en build de producción
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configuración para manejar archivos grandes
  experimental: {
    // optimizeCss: true, // Deshabilitado por error con critters
    
    // Optimizar imports automáticamente (tree shaking)
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'date-fns',
      'lodash',
    ],
  },
  
  // Headers de seguridad y rendimiento
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          // Seguridad
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          // Cache para assets estáticos
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Configuración para el body parser (archivos grandes)
  async rewrites() {
    return [
      {
        source: '/api/upload/:path*',
        destination: `${process.env.NEXT_PUBLIC_CV_UPLOAD_API_URL}/upload/:path*`,
      },
    ];
  },
};

export default nextConfig;
