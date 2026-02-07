import { NextRequest, NextResponse } from 'next/server';
import { loginAction } from '@/features/core/auth/services/auth.service';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { health_id, password } = body;

    // URL de l'API backend
    const API_BASE = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:8000/api/v1'  // Direct en développement
      : 'http://localhost:8000/api/v1';     // Direct en production

    // Appeler l'API backend directement avec le bon endpoint
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
    
    // Set HttpOnly cookie from Next.js (most secure & SSR-friendly)
    const cookieStore = await cookies();
    cookieStore.set('access_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: data.expires_in,
    });

    // Rediriger vers le dashboard
    return NextResponse.redirect('/dashboard');
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
}
