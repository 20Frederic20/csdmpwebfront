import { AuthResponse } from '../types/auth.types';

interface RefreshTokenResponse {
  access_token: string;
  expires_in: number;
}

export class AuthClientService {
  private static readonly BASE_URL = typeof window !== 'undefined'
    ? '/api/v1'
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1');
  private static readonly API_URL = `${this.BASE_URL}`;

  /**
   * Rafraîchit le token en appelant l'API Next.js qui gère les cookies HTTP-only
   */
  static async refreshToken(): Promise<RefreshTokenResponse | null> {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          return null;
        }
        throw new Error(`Failed to refresh token: ${response.statusText}`);
      }

      const data: RefreshTokenResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error refreshing token:', error);
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return null;
    }
  }

  /**
   * Fait une requête authentifiée en utilisant les cookies HTTP-only
   * Le token est automatiquement ajouté via le middleware
   */
  static async makeAuthenticatedRequest(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const makeRequest = async (): Promise<Response> => {
      const headers = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      };

      return fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });
    };

    let response = await makeRequest();

    // Si 401, essayer de rafraîchir le token via les cookies
    if (response.status === 401) {
      console.log('Token expired, attempting refresh...');

      const tokenData = await this.refreshToken();

      if (tokenData && tokenData.access_token) {
        // Refaire la requête
        response = await makeRequest();
      }
    }

    return response;
  }

  /**
   * Login via l'API Next.js qui stocke les tokens dans des cookies HTTP-only
   */
  static async login(health_id: string, password: string): Promise<AuthResponse> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ health_id, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Login error:', errorText);
      throw new Error('Invalid credentials');
    }

    const data: AuthResponse = await response.json();
    return data;
  }

  /**
   * Logout en appelant l'API qui nettoie les cookies
   */
  static async logout(): Promise<void> {
    try {
      await fetch('/api/auth/refresh', {
        method: 'DELETE',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
  }

  /**
   * Vérifie si l'utilisateur est authentifié (présence du cookie access_token)
   * Note: Cette méthode est limitée car les cookies HTTP-only ne sont pas lisibles en JS
   * Utiliser le middleware ou un endpoint API pour une vérification fiable
   */
  static isAuthenticated(): boolean {
    // On ne peut pas lire les cookies HTTP-only depuis JavaScript
    // Cette méthode retourne true par défaut, la vérification réelle se fait côté serveur
    return true;
  }

  /**
   * Register via l'API Next.js qui stocke les tokens dans des cookies HTTP-only
   */
  static async register(
    health_id: string,
    given_name: string,
    family_name: string,
    email: string,
    password: string,
    birth_date?: string,
    gender?: string,
    location?: string,
    blood_group?: string
  ): Promise<AuthResponse> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        health_id,
        given_name,
        family_name,
        email,
        password,
        birth_date,
        gender,
        location,
        blood_group
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Erreur lors de l\'inscription');
    }

    const data: AuthResponse = await response.json();
    return data;
  }
}
