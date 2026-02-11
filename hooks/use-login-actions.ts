'use client';

import { useRouter } from 'next/navigation';
import { useAuthToken } from '@/hooks/use-auth-token';

export function useLoginActions() {
  const router = useRouter();
  const { saveToken } = useAuthToken();

  const handleLoginSuccess = (token: string, refreshToken: string, expiresIn: number, refreshExpiresIn?: number) => {
    // Sauvegarder les tokens via le hook (localStorage uniquement)
    if (token) {
      saveToken(token);
    }
    
    // Rediriger vers le dashboard
    router.push('/dashboard');
    router.refresh();
  };

  return { handleLoginSuccess };
}
