import { User, CreateUserRequest, UpdateUserRequest, ListUsersResponse, ListUsersQueryParams } from "../types/user.types";
import { AuthClientService } from "@/features/core/auth/services/auth-client.service";

export class UserService {
  private static readonly BASE_URL = process.env.NODE_ENV === 'development' 
    ? ''  // Utilise le proxy Next.js en développement
    : (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000');
  private static readonly API_URL = `${this.BASE_URL}/api/v1`;

  private static getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  static async getUsers(params?: ListUsersQueryParams, token?: string): Promise<ListUsersResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.search) queryParams.append('search', params.search);
    if (params?.roles && params.roles.length > 0) queryParams.append('roles', params.roles.join(','));
    if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);

    const url = `${this.API_URL}/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    console.log('Fetching users from:', url);
    
    // Utiliser AuthClientService pour la gestion automatique du refresh token
    const response = await AuthClientService.makeAuthenticatedRequest(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText} (${response.status})`);
    }

    return response.json();
  }

  static async getUserById(id: string, token?: string): Promise<User> {
    const url = `${this.API_URL}/users/${id}`;
    
    // Utiliser AuthClientService pour la gestion automatique du refresh token
    const response = await AuthClientService.makeAuthenticatedRequest(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    return response.json();
  }

  static async createUser(userData: CreateUserRequest, token?: string): Promise<User> {
    const url = `${this.API_URL}/users`;
    
    // Utiliser AuthClientService pour la gestion automatique du refresh token
    const response = await AuthClientService.makeAuthenticatedRequest(url, {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.statusText}`);
    }

    return response.json();
  }

  static async updateUser(id: string, userData: UpdateUserRequest, token?: string): Promise<User> {
    const url = `${this.API_URL}/users/${id}`;
    
    // Utiliser AuthClientService pour la gestion automatique du refresh token
    const response = await AuthClientService.makeAuthenticatedRequest(url, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user: ${response.statusText}`);
    }

    return response.json();
  }

  static async deleteUser(id: string, token?: string): Promise<void> {
    const url = `${this.API_URL}/users/${id}`;
    
    // Utiliser AuthClientService pour la gestion automatique du refresh token
    const response = await AuthClientService.makeAuthenticatedRequest(url, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete user: ${response.statusText}`);
    }
  }

  static async toggleUserStatus(id: string, isActive: boolean, token?: string): Promise<User> {
    return this.updateUser(id, { is_active: isActive }, token);
  }
}
