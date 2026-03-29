import { NextRequest, NextResponse } from 'next/server';

function setAuthCookies(request: NextRequest, response: NextResponse, accessToken: string, refreshToken: string, expiresIn: number, refreshExpiresIn: number) {
  const isProd = process.env.NODE_ENV === 'production';
  const isSecure = isProd && !request.nextUrl.hostname.includes('localhost') && request.nextUrl.protocol === 'https:';

  const cookieOptions = {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax' as const,
    path: '/',
  };

  if (accessToken.length <= 3800) {
    response.cookies.set('access_token', accessToken, {
      ...cookieOptions,
      maxAge: expiresIn,
    });
    response.cookies.delete('access_token_parts');
  } else {
    const CHUNK_SIZE = 3500;
    const chunks = [];
    for (let i = 0; i < accessToken.length; i += CHUNK_SIZE) {
      chunks.push(accessToken.substring(i, i + CHUNK_SIZE));
    }
    response.cookies.set('access_token_parts', chunks.length.toString(), {
      ...cookieOptions,
      maxAge: expiresIn,
    });
    chunks.forEach((chunk, index) => {
      response.cookies.set(`access_token_${index}`, chunk, {
        ...cookieOptions,
        maxAge: expiresIn,
      });
    });
    response.cookies.delete('access_token');
  }

  response.cookies.set('refresh_token', refreshToken, {
    ...cookieOptions,
    maxAge: refreshExpiresIn,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { health_id, name, email, password } = body;

    const API_BASE = process.env.NODE_ENV === 'development'
      ? 'http://localhost:8000/api/v1'
      : 'http://localhost:8000/api/v1';

    const response = await fetch(`${API_BASE}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ health_id, name, email, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Erreur lors de l\'inscription' }));
      return NextResponse.json(
        { error: errorData.detail || 'Erreur lors de l\'inscription' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Créer une réponse avec les tokens dans des cookies HTTP-only
    const nextResponse = NextResponse.json({
      success: true,
      expires_in: data.expires_in,
      refresh_expires_in: data.refresh_expires_in
    });

    setAuthCookies(
      request,
      nextResponse,
      data.access_token,
      data.refresh_token,
      data.expires_in,
      data.refresh_expires_in
    );

    return nextResponse;
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    );
  }
}
