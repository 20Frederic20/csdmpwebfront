import { useState, useEffect } from 'react';

export function useAuthToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Récupérer le token au montage
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('access_token');
      setToken(storedToken);
    }
  }, []);

  const saveToken = (newToken: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', newToken);
      setToken(newToken);
    }
  };

  const clearToken = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      setToken(null);
    }
  };

  return { token, setToken: saveToken, clearToken };
}
