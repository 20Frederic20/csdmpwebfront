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

function clearAuthCookies(response: NextResponse) {
  response.cookies.set('access_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  response.cookies.set('refresh_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token manquant' },
        { status: 401 }
      );
    }

    const API_BASE = process.env.NODE_ENV === 'development'
      ? 'http://localhost:8000/api/v1'
      : 'http://localhost:8000/api/v1';

    const response = await fetch(`${API_BASE}/token/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
      credentials: 'include',
    });

    if (!response.ok) {
      clearAuthCookies(NextResponse.next());
      return NextResponse.json(
        { error: 'Échec du rafraîchissement du token' },
        { status: 401 }
      );
    }

    const data = await response.json();

    const nextResponse = NextResponse.json({
      success: true,
      expires_in: data.expires_in,
    });

    setAuthCookies(
      request,
      nextResponse,
      data.access_token,
      data.refresh_token || refreshToken,
      data.expires_in,
      data.refresh_expires_in || (60 * 60 * 24 * 7) // 7 jours par défaut
    );

    return nextResponse;
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors du rafraîchissement du token' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  clearAuthCookies(response);
  return response;
}
