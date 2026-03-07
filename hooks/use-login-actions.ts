'use client';

import { useRouter } from 'next/navigation';
import { useAuthToken } from '@/hooks/use-auth-token';
import { usePermissionsContext } from '@/contexts/permissions-context';

export function useLoginActions() {
  const router = useRouter();
  const { saveToken } = useAuthToken();
  const { refreshPermissions } = usePermissionsContext();

  const handleLoginSuccess = async (token: string, refreshToken: string, expiresIn: number, refreshExpiresIn?: number) => {
    // Sauvegarder les tokens via le hook (localStorage uniquement)
    if (token) {
      saveToken(token);
    }

    // Rafraîchir les permissions après la connexion
    await refreshPermissions();

    // Rediriger vers le dashboard
    router.push('/dashboard');
    router.refresh();
  };

  return { handleLoginSuccess };
}
