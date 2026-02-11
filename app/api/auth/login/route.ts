import { NextRequest, NextResponse } from 'next/server';
import { loginAction } from '@/features/core/auth/services/auth.service';

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
    
    return NextResponse.json({ 
      success: true,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
      refresh_expires_in: data.refresh_expires_in
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
}
