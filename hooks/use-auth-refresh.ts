import { useState, useCallback } from 'react';
import { AuthClientService } from '@/features/core/auth/services/auth-client.service';

interface AuthState {
  isLoading: boolean;
  error: string | null;
}

export function useAuthRefresh() {
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: null,
  });

  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const newToken = await AuthService.refreshToken();
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return newToken;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du rafraîchissement du token';
      setAuthState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      return null;
    }
  }, []);

  const makeAuthenticatedRequest = useCallback(async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    try {
      return AuthClientService.makeAuthenticatedRequest(url, options);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de requête authentifiée';
      setAuthState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  const logout = useCallback(() => {
    AuthClientService.logout();
  }, []);

  return {
    ...authState,
    refreshAccessToken,
    makeAuthenticatedRequest,
    clearError,
  };
}
