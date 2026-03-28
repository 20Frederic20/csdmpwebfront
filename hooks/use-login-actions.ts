'use client';

import { useRouter } from 'next/navigation';
import { usePermissionsContext } from '@/contexts/permissions-context';

export function useLoginActions() {
  const router = useRouter();
  const { refreshPermissions } = usePermissionsContext();

  const handleLoginSuccess = async () => {
    // Les tokens sont maintenant stockés dans des cookies HTTP-only
    // Aucun besoin de sauvegarder manuellement

    // Rafraîchir les permissions après la connexion
    await refreshPermissions();

    // Rediriger vers le dashboard
    router.push('/dashboard');
    router.refresh();
  };

  return { handleLoginSuccess };
}
