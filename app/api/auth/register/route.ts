import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { health_id, name, email, password } = body;

    const API_BASE = process.env.NODE_ENV === 'development'
      ? 'http://localhost:8000/api/v1'
      : 'http://localhost:8000/api/v1';

    const response = await fetch(`${API_BASE}/account/register`, {
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

    return NextResponse.json({
      success: true,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
      refresh_expires_in: data.refresh_expires_in
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    );
  }
}
