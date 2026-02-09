export interface User {
  id: string;
  email: string;
  name?: string;
  role?: 'user' | 'admin';
}

export interface TokenPayload extends User {
  exp: number;
  iat: number;
  sub: string;
}

export interface AuthResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
}