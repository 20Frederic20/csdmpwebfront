import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RolesPermissionsService } from '../services/roles-permissions.service';
import { CreateRoleRequest, AddPermissionToRoleRequest, CreatePermissionRequest } from '../types/roles-permissions.types';
import { toast } from 'sonner';

export const ROLES_QUERY_KEY = ['roles'];
export const PERMISSIONS_QUERY_KEY = ['permissions'];

/**
 * Roles Hooks
 */
export function useRoles(params: import('../types/roles-permissions.types').RolesQueryParams = {}) {
  return useQuery({
    queryKey: [...ROLES_QUERY_KEY, params],
    queryFn: () => RolesPermissionsService.getRoles(params),
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRoleRequest) => RolesPermissionsService.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
      toast.success('Rôle créé avec succès');
    },
    onError: (error) => {
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'Une erreur est survenue'}`);
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => RolesPermissionsService.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
      toast.success('Rôle supprimé avec succès');
    },
    onError: (error) => {
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'Une erreur est survenue'}`);
    },
  });
}

/**
 * Permissions Hooks
 */
export function usePermissions(params: import('../types/roles-permissions.types').PermissionsQueryParams = {}) {
  return useQuery({
    queryKey: [...PERMISSIONS_QUERY_KEY, params],
    queryFn: () => RolesPermissionsService.getPermissions(params),
  });
}

export function useCreatePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePermissionRequest) => 
      RolesPermissionsService.createPermissions(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PERMISSIONS_QUERY_KEY });
      toast.success('Permissions créées avec succès');
    },
    onError: (error) => {
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'Une erreur est survenue'}`);
    },
  });
}

export function useDeletePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => RolesPermissionsService.deletePermission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PERMISSIONS_QUERY_KEY });
      toast.success('Permission supprimée avec succès');
    },
    onError: (error) => {
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'Une erreur est survenue'}`);
    },
  });
}

/**
 * Role-Permission Links Hooks
 */
export function useAddPermissionToRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddPermissionToRoleRequest) => RolesPermissionsService.addPermissionToRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
      toast.success('Permission ajoutée au rôle');
    },
    onError: (error) => {
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'Une erreur est survenue'}`);
    },
  });
}

export function useRemovePermissionFromRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, permissionId }: { roleId: string; permissionId: string }) => 
      RolesPermissionsService.removePermissionFromRole(roleId, permissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
      toast.success('Permission retirée du rôle');
    },
    onError: (error) => {
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'Une erreur est survenue'}`);
    },
  });
}
