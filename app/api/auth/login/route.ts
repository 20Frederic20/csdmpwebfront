import { NextRequest, NextResponse } from 'next/server';

function setAuthCookies(request: NextRequest, response: NextResponse, accessToken: string, refreshToken: string, expiresIn: number, refreshExpiresIn: number) {
  const isProd = process.env.NODE_ENV === 'production';
  const isSecure = isProd && !request.nextUrl.hostname.includes('192.168.0.3') && request.nextUrl.protocol === 'https:';

  const cookieOptions = {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax' as const,
    path: '/',
  };

  // 1. Gérer l'Access Token (Splitting si > 3800 chars)
  // On nettoie d'abord les anciens cookies partitionnés potentiels
  // (Note: on ne peut pas facilement lister les cookies à supprimer ici,
  // mais on peut écraser les principaux).
  
  if (accessToken.length <= 3800) {
    response.cookies.set('access_token', accessToken, {
      ...cookieOptions,
      maxAge: expiresIn,
    });
    // On s'assure de vider les cookies de partition au cas où
    response.cookies.delete('access_token_parts');
  } else {
    // Découpage
    const CHUNK_SIZE = 3500;
    const chunks = [];
    for (let i = 0; i < accessToken.length; i += CHUNK_SIZE) {
      chunks.push(accessToken.substring(i, i + CHUNK_SIZE));
    }

    // Stocker le nombre de morceaux
    response.cookies.set('access_token_parts', chunks.length.toString(), {
      ...cookieOptions,
      maxAge: expiresIn,
    });

    // Stocker chaque morceau
    chunks.forEach((chunk, index) => {
      response.cookies.set(`access_token_${index}`, chunk, {
        ...cookieOptions,
        maxAge: expiresIn,
      });
    });

    // On supprime le cookie principal s'il existait
    response.cookies.delete('access_token');
  }

  // 2. Gérer le Refresh Token (Généralement plus petit, on ne splitte pas pour l'instant)
  response.cookies.set('refresh_token', refreshToken, {
    ...cookieOptions,
    maxAge: refreshExpiresIn,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { health_id, password } = body;

    const API_BASE = process.env.NODE_ENV === 'development'
      ? 'http://192.168.0.3:8000/api/v1'
      : 'http://192.168.0.3:8000/api/v1';

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
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
}
