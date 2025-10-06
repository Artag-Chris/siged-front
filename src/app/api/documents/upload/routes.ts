import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const maxDuration = 60; 

export async function POST(request: NextRequest) {
  try {

    const backendUrl = process.env.NEXT_PUBLIC_CV_UPLOAD_API_URL;
    if (!backendUrl) {
      throw new Error('NEXT_PUBLIC_CV_UPLOAD_API_URL no está configurada');
    }

    const formData = await request.formData();
    
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: Archivo "${value.name}" (${(value.size / 1024 / 1024).toFixed(2)} MB)`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }

    const backendResponse = await fetch(`${backendUrl}/upload`, {
      method: 'POST',
      body: formData,

      headers: {
        'Accept': 'application/json',
      },
    });

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

    const responseData = await backendResponse.json();

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

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', 
    },
  });
}