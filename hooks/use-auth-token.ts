import { useState, useEffect } from 'react';

/**
 * Hook pour gérer l'état d'authentification avec des cookies HTTP-only
 * Note: Les cookies HTTP-only ne sont pas lisibles depuis JavaScript
 * Ce hook sert principalement à déclencher des actions de logout
 */
export function useAuthToken() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // On ne peut pas lire les cookies HTTP-only, donc on suppose authentifié par défaut
  // La vérification réelle se fait côté serveur/middleware

  const clearToken = async () => {
    // Appeler l'API pour nettoyer les cookies
    try {
      await fetch('/api/auth/refresh', {
        method: 'DELETE',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error clearing token:', error);
    }
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    clearToken,
    // Pour récupérer les infos utilisateur, utiliser une API ou un contexte
    user: isAuthenticated ? {
      name: "Utilisateur",
      initials: "UT",
      role: 'Utilisateur'
    } : null
  };
}
