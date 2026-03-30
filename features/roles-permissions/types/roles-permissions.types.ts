import { z } from 'zod';

export enum Action {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  ACTIVATE = "activate",
  DEACTIVATE = "deactivate",
  TOGGLE = "toggle",
  SOFT_DELETE = "soft_delete",
  PAY = "pay",
}

export interface Permission {
  id_: string;
  resource: string;
  action: Action;
  description?: string | null;
}

export interface Role {
  id_: string;
  name: string;
  description?: string | null;
  permissions: Permission[];
}

export const CreateRoleSchema = z.object({
  name: z.string().min(1, "Le nom est requis").transform(val => val.toUpperCase()),
  description: z.string().optional().nullable(),
});

export type CreateRoleRequest = z.infer<typeof CreateRoleSchema>;

export const CreatePermissionSchema = z.object({
  resource: z.string().min(1, "La ressource est requise").transform(val => val.toLowerCase().replace(/\s+/g, '_')),
  actions: z.array(z.nativeEnum(Action)).min(1, "Au moins une action est requise"),
  description: z.string().optional().nullable(),
});

export type CreatePermissionRequest = z.infer<typeof CreatePermissionSchema>;

export interface AddPermissionToRoleRequest {
  role_id: string;
  permission_id: string;
}

export interface RoleResponse {
  id_?: string;
  id?: string;
  name: string;
  description?: string | null;
  permissions: Permission[];
}

export interface PermissionResponse {
  id_?: string;
  id?: string;
  resource: string;
  action: string;
  description?: string | null;
}

export interface RolesQueryParams {
  search?: string;
  limit?: number;
  offset?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PermissionsQueryParams {
  search?: string;
  limit?: number;
  offset?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface ListRolesResponse {
  data: Role[];
  total: number;
  page?: number;
  limit?: number;
}

export interface ListPermissionsResponse {
  data: Permission[];
  total: number;
  page?: number;
  limit?: number;
}
