'use client';

import { useRouter } from 'next/navigation';
import { useAuthToken } from '@/hooks/use-auth-token';

export function useLoginActions() {
  const router = useRouter();
  const { saveToken } = useAuthToken();

  const handleLoginSuccess = (token: string) => {
    // Sauvegarder le token dans localStorage pour les appels API côté client
    saveToken(token);
    
    // Rediriger vers le dashboard
    router.push('/dashboard');
    router.refresh();
  };

  return { handleLoginSuccess };
}
