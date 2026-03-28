import { AuthClientService } from '@/features/core/auth/services/auth-client.service';
import { UserWithRoles, PermissionsResponse, UserRole } from '../types/roles.types';

const API_BASE = '/api/v1';

export class PermissionsService {

  static async getUserPermissions(): Promise<UserWithRoles> {
    try {
      const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/me/permissions`, {
        method: 'GET',
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user permissions: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Failed to fetch user permissions:', error);

      // Si l'erreur est liée à l'authentification, ne pas retourner de faux utilisateur
      if (error instanceof Error && (
        error.message.includes('401') ||
        error.message.includes('Failed to refresh token') ||
        error.message.includes('Unauthorized')
      )) {
        throw error;
      }

      // Pour les autres erreurs, retourner un utilisateur par défaut
      return {
        id: '',
        email: '',
        given_name: '',
        family_name: '',
        roles: [],
        permissions: []
      };
    }
  }

  static async getAllPermissions(): Promise<PermissionsResponse> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/permissions`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch all permissions');
    }

    return response.json();
  }

  static async getUserRoles(): Promise<UserRole[]> {
    const user = await this.getUserPermissions();
    return user.roles;
  }

  static hasRole(user: UserWithRoles, role: UserRole): boolean {
    return user.roles ? user.roles.includes(role) : false;
  }

  static hasPermission(user: UserWithRoles, resource: string, action: string): boolean {
    return user.permissions ? user.permissions.some(
      p => p.resource === resource && p.action === action
    ) : false;
  }

  static canAccess(user: UserWithRoles, resource: string, action: string = 'read'): boolean {
    return this.hasPermission(user, resource, action) || this.hasRole(user, UserRole.SUPER_ADMIN);
  }
}
