import { NextRequest, NextResponse } from 'next/server';

function setAuthCookies(response: NextResponse, accessToken: string, refreshToken: string, expiresIn: number, refreshExpiresIn: number) {
  const isProd = process.env.NODE_ENV === 'production';

  // Access token cookie (court terme)
  response.cookies.set('access_token', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: expiresIn,
    path: '/',
  });

  // Refresh token cookie (long terme)
  response.cookies.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: refreshExpiresIn,
    path: '/',
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { health_id, password } = body;

    const API_BASE = process.env.NODE_ENV === 'development'
      ? 'http://localhost:8000/api/v1'
      : 'http://localhost:8000/api/v1';

    const response = await fetch(`${API_BASE}/account/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ health_id, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
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
      nextResponse,
      data.access_token,
      data.refresh_token,
      data.expires_in,
      data.refresh_expires_in
    );

    return nextResponse;
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
}
