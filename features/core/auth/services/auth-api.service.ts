import { AuthResponse } from '../types/auth.types';

export async function authenticateUser(health_id: string, password: string): Promise<AuthResponse> {
  // URL complète et valide pour l'API backend
  const API_BASE = 'http://localhost:8000/api/v1';

  console.log('Attempting login to:', `${API_BASE}/account/login`); // Debug

  const res = await fetch(`${API_BASE}/account/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ health_id, password }),
    credentials: 'include',
  });

  console.log('Login response status:', res.status); // Debug

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Login error:', errorText); // Debug
    throw new Error('Invalid credentials');
  }

  const data = await res.json();
  console.log('Login success, tokens received:', { 
    hasAccessToken: !!data.access_token, 
    hasRefreshToken: !!data.refresh_token 
  }); // Debug

  return data;
}
