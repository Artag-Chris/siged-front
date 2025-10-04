import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración para manejar archivos grandes
  experimental: {
    serverComponentsExternalPackages: [],
  },
  
  // Headers para manejar CORS desde el frontend (como fallback)
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
