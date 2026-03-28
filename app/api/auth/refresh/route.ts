import { NextRequest, NextResponse } from 'next/server';

function setAuthCookies(response: NextResponse, accessToken: string, refreshToken: string, expiresIn: number, refreshExpiresIn: number) {
  const isProd = process.env.NODE_ENV === 'production';

  response.cookies.set('access_token', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: expiresIn,
    path: '/',
  });

  response.cookies.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: refreshExpiresIn,
    path: '/',
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
