import { AuthClientService } from '@/features/core/auth/services/auth-client.service';
import { 
  Role, 
  Permission, 
  CreateRoleRequest, 
  CreatePermissionRequest, 
  AddPermissionToRoleRequest,
  RoleResponse,
  PermissionResponse
} from '../types/roles-permissions.types';

const API_BASE = '/api/v1';

export class RolesPermissionsService {
  /**
   * Roles
   */
  static async getRoles(params: import('../types/roles-permissions.types').RolesQueryParams = {}): Promise<import('../types/roles-permissions.types').ListRolesResponse> {
    const queryParams = new URLSearchParams();
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params.offset !== undefined) queryParams.append('offset', params.offset.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);

    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/roles?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch roles: ${response.statusText}`);
    }
    return response.json();
  }

  static async createRole(data: CreateRoleRequest): Promise<Role> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/roles`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || `Failed to create role: ${response.statusText}`);
    }
    return response.json();
  }

  static async deleteRole(id: string): Promise<void> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/roles/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete role: ${response.statusText}`);
    }
  }

  /**
   * Permissions
   */
  static async getPermissions(params: import('../types/roles-permissions.types').PermissionsQueryParams = {}): Promise<import('../types/roles-permissions.types').ListPermissionsResponse> {
    const queryParams = new URLSearchParams();
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params.offset !== undefined) queryParams.append('offset', params.offset.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);

    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/permissions?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch permissions: ${response.statusText}`);
    }
    return response.json();
  }

  static async createPermissions(data: CreatePermissionRequest): Promise<Permission[]> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/permissions`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || `Failed to create permissions: ${response.statusText}`);
    }
    return response.json();
  }

  static async deletePermission(id: string): Promise<void> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/permissions/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete permission: ${response.statusText}`);
    }
  }

  /**
   * Role-Permission Assignment
   */
  static async addPermissionToRole(data: AddPermissionToRoleRequest): Promise<void> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/roles/permissions`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || `Failed to add permission to role: ${response.statusText}`);
    }
  }

  static async removePermissionFromRole(roleId: string, permissionId: string): Promise<void> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/roles/${roleId}/permissions/${permissionId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to remove permission from role: ${response.statusText}`);
    }
  }
}
