'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { authenticateUser } from './auth-api.service';
import { AuthResponse, User } from '../types/auth.types';

export async function loginAction(formData: FormData) {
  const health_id = formData.get('health_id') as string;
  const password = formData.get('password') as string;

  // Authentifier l'utilisateur
  const data = await authenticateUser(health_id, password);

  // Set HttpOnly cookie from Next.js (most secure & SSR-friendly)
  const cookieStore = await cookies();
  cookieStore.set('access_token', data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: data.expires_in, // Utilise la durée d'expiration du JWT
  });

  console.log('Cookie set successfully'); // Debug
  
  redirect('/dashboard');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('access_token');
  redirect('/login');
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  
  console.log('getCurrentUser: token =', token ? 'exists' : 'missing');
  
  if (!token) return null;

  try {
    // Optional: verify signature here if you have secret in frontend env (risky)
    // Better: call FastAPI /me endpoint that validates token server→server
    console.log('getCurrentUser: calling API /users/me');
    const res = await fetch(`${API_BASE}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    console.log('getCurrentUser: API response status =', res.status);

    if (!res.ok) {
      console.log('getCurrentUser: API response not ok');
      return null;
    }
    
    const user = await res.json();
    console.log('getCurrentUser: user =', user);
    return user;
  } catch (err) {
    console.log('getCurrentUser: error =', err);
    return null;
  }
}