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

  console.log('Authentication successful, tokens received'); // Debug

  redirect('/dashboard');
}

export async function logoutAction() {
  // Nettoyer les cookies HTTP-only
  const cookieStore = await cookies();
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');

  redirect('/login');
}

export async function getCurrentUser(): Promise<User | null> {
  // Récupérer le token depuis les cookies HTTP-only
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) return null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.log('getCurrentUser: API response not ok');
      return null;
    }

    const user = await res.json();
    return user;
  } catch (err) {
    console.error('getCurrentUser error:', err);
    return null;
  }
}