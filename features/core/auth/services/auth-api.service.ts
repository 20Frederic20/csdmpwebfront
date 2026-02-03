import { AuthResponse } from '../types/auth.types';

const API_BASE = process.env.NODE_ENV === 'development' 
  ? '/api/v1'  // Utilise le proxy Next.js en développement
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1');

export async function authenticateUser(health_id: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/account/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ health_id, password }),
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Invalid credentials');
  }

  return res.json();
}
