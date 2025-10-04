import { NextRequest, NextResponse } from 'next/server';

// Configuración para manejar archivos grandes
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Aumentar límites para archivos grandes
export const maxDuration = 60; // 60 segundos

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 [PROXY API] Recibiendo upload request...');
    
    // Obtener la URL del backend desde las variables de entorno
    const backendUrl = process.env.NEXT_PUBLIC_CV_UPLOAD_API_URL;
    if (!backendUrl) {
      throw new Error('NEXT_PUBLIC_CV_UPLOAD_API_URL no está configurada');
    }

    // Obtener el FormData del request original
    const formData = await request.formData();
    
    // Log de los datos recibidos
    console.log('📋 [PROXY API] Datos del formulario:');
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: Archivo "${value.name}" (${(value.size / 1024 / 1024).toFixed(2)} MB)`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }

    // Reenviar la petición al backend real
    const backendResponse = await fetch(`${backendUrl}/upload`, {
      method: 'POST',
      body: formData,
      // No establecer Content-Type manualmente para FormData
      headers: {
        // Agregar headers necesarios para CORS y autenticación si es necesario
        'Accept': 'application/json',
      },
    });

    console.log(`🌐 [PROXY API] Respuesta del backend: ${backendResponse.status} ${backendResponse.statusText}`);

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error('❌ [PROXY API] Error del backend:', {
        status: backendResponse.status,
        statusText: backendResponse.statusText,
        body: errorText
      });
      
      return NextResponse.json(
        { 
          success: false, 
          message: `Error del servidor: ${backendResponse.status} - ${backendResponse.statusText}`,
          details: errorText
        },
        { status: backendResponse.status }
      );
    }

    // Obtener la respuesta exitosa del backend
    const responseData = await backendResponse.json();
    console.log('✅ [PROXY API] Upload exitoso, reenviando respuesta...');

    // Retornar la respuesta del backend con headers CORS apropiados
    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error: any) {
    console.error('❌ [PROXY API] Error en el proxy:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error interno del proxy',
        details: error.message 
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}

// Manejar OPTIONS request para CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // 24 horas
    },
  });
}