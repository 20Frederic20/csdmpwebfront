import { UserWithRoles, UserRole } from '../types/roles.types';

/**
 * Service de permissions basé sur les claims du JWT.
 * Les données sont lues depuis /api/auth/me (décodage côté serveur Next.js)
 * sans aucun appel au backend de permissions.
 */
export class PermissionsService {

  static async getUserPermissions(): Promise<UserWithRoles> {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
        throw new Error(`Failed to decode token: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Failed to get user from token:', error);

      if (error instanceof Error && (
        error.message.includes('401') ||
        error.message.includes('Unauthorized')
      )) {
        throw error;
      }

      // Pour les autres erreurs, retourner un utilisateur vide
      return {
        id: '',
        roles: [],
        permissions: [],
      };
    }
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
    if (user.is_superadmin) return true;
    return this.hasPermission(user, resource, action);
  }
}
