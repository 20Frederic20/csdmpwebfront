import { AuthResponse } from '../types/auth.types';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

interface RefreshTokenResponse {
  access_token: string;
  expires_in: number;
}

export class AuthClientService {
  private static readonly BASE_URL = process.env.NODE_ENV === 'development' 
    ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1')
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1');
  private static readonly API_URL = `${this.BASE_URL}`;

  // Stocker les dates d'expiration pour le refresh
  private static getExpirationTime(): number | null {
    if (typeof window !== 'undefined') {
      const expiration = localStorage.getItem('token_expires_at');
      return expiration ? parseInt(expiration) : null;
    }
    return null;
  }

  private static setExpirationTime(expiresIn: number, refreshExpiresIn?: number): void {
    if (typeof window !== 'undefined') {
      const accessExpiresAt = Date.now() + (expiresIn * 1000);
      localStorage.setItem('token_expires_at', accessExpiresAt.toString());
      
      if (refreshExpiresIn) {
        const refreshExpiresAt = Date.now() + (refreshExpiresIn * 1000);
        localStorage.setItem('refresh_token_expires_at', refreshExpiresAt.toString());
      }
    }
  }

  private static clearExpirationTime(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token_expires_at');
      localStorage.removeItem('refresh_token_expires_at');
    }
  }

  private static getRefreshTokenExpiration(): number | null {
    if (typeof window !== 'undefined') {
      const expiration = localStorage.getItem('refresh_token_expires_at');
      return expiration ? parseInt(expiration) : null;
    }
    return null;
  }

  private static getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  }

  private static setTokens(access_token: string, refresh_token: string, expiresIn?: number, refreshExpiresIn?: number): void {
    if (typeof window !== 'undefined') {
      // Garder uniquement dans localStorage (pas de cookies)
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      
      // Stocker les dates d'expiration
      this.setExpirationTime(expiresIn || 15 * 60, refreshExpiresIn);
    }
  }

  private static clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      this.clearExpirationTime();
    }
  }

  static async refreshToken(): Promise<RefreshTokenResponse | null> {
    // Utiliser le refresh_token depuis localStorage
    const refreshToken = this.getRefreshToken();
    const refreshExpiration = this.getRefreshTokenExpiration();
    
    if (!refreshToken) {
      console.warn('No refresh token available');
      return null;
    }
    
    // Vérifier si le refresh token est expiré
    if (refreshExpiration && Date.now() > refreshExpiration) {
      console.warn('Refresh token expired');
      this.clearTokens();
      window.location.href = '/login';
      return null;
    }
    
    try {
      // Appeler directement le backend pour rafraîchir
      const response = await fetch(`${this.API_URL}/token/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Refresh token invalide, déconnexion
          this.clearTokens();
          window.location.href = '/login';
          return null;
        }
        throw new Error(`Failed to refresh token: ${response.statusText}`);
      }

      const data: RefreshTokenResponse = await response.json();
      
      // Mettre à jour les tokens dans localStorage uniquement
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        this.setExpirationTime(data.expires_in, data.expires_in);
      }
      
      return data;
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.clearTokens();
      window.location.href = '/login';
      return null;
    }
  }

  static async makeAuthenticatedRequest(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    let token = localStorage.getItem('access_token');
    
    // Vérifier si le token est expiré
    const expirationTime = this.getExpirationTime();
    if (expirationTime && Date.now() > expirationTime) {
      console.log('Token expired, attempting refresh before request...');
      const tokenData = await this.refreshToken();
      token = tokenData?.access_token || null;
      if (!token) {
        throw new Error('Failed to refresh token');
      }
    }
    
    const makeRequest = async (accessToken: string): Promise<Response> => {
      const headers = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      };

      return fetch(url, {
        ...options,
        headers,
      });
    };

    let response = await makeRequest(token || '');

    // Si 401, essayer de rafraîchir le token
    if (response.status === 401) {
      console.log('Token expired, attempting refresh...');
      
      const tokens = await this.refreshToken();
      
      if (tokens && tokens.access_token) {
        // Refaire la requête avec le nouveau token
        response = await makeRequest(tokens.access_token);
      }
    }

    return response;
  }

  static async login(health_id: string, password: string): Promise<AuthResponse> {

    const response = await fetch(`${this.API_URL}/account/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ health_id, password }),
      credentials: 'include',
    });

    console.log('Login response status:', response.status); // Debug

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Login error:', errorText); // Debug
      throw new Error('Invalid credentials');
    }

    const data: AuthResponse = await response.json();
    
    this.setTokens(data.access_token, data.refresh_token, data.expires_in, data.refresh_expires_in);

    return data;
  }

  static logout(): void {
    this.clearTokens();
    window.location.href = '/login';
  }

  static isAuthenticated(): boolean {
    return !!this.getRefreshToken();
  }
}
