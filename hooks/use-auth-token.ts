import { useState, useEffect } from 'react';

export function useAuthToken() {
  const [token, setToken] = useState<string | null>(null);

  // Synchroniser avec localStorage à chaque render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('access_token');
      if (storedToken !== token) {
        setToken(storedToken);
      }
    }
  });

  const saveToken = (newToken: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', newToken);
      setToken(newToken);
    }
  };

  const clearToken = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token_expires_at');
      localStorage.removeItem('refresh_token_expires_at');
      setToken(null);
    }
  };

  return { token, saveToken, clearToken };
}
