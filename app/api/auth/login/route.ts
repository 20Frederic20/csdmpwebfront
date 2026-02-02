import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/features/core/auth/services/auth-api.service';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { health_id, password } = body;

    // Authentifier l'utilisateur avec l'API backend
    const data = await authenticateUser(health_id, password);

    // Set HttpOnly cookie from Next.js (most secure & SSR-friendly)
    const cookieStore = await cookies();
    cookieStore.set('access_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: data.expires_in,
    });

    // Retourner les données pour le stockage côté client
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Login failed' },
      { status: 401 }
    );
  }
}
