import { FetchService } from '@/features/core/services/fetch.service';
import { UserWithRoles, PermissionsResponse, UserRole } from '../types/roles.types';

export class PermissionsService {
  
  static async getUserPermissions(): Promise<UserWithRoles> {
    console.log('Fetching user permissions from /me/permissions');
    try {
      const result = await FetchService.get<UserWithRoles>('me/permissions', 'User permissions');
      console.log('User permissions result:', result);
      return result;
    } catch (error) {
      console.error('Failed to fetch user permissions:', error);
      // Return default user with no permissions if API fails
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
    console.log('Fetching all permissions');
    return FetchService.get<PermissionsResponse>('permissions', 'All permissions');
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
    return this.hasPermission(user, resource, action) || this.hasRole(user, UserRole.ADMIN);
  }
}
