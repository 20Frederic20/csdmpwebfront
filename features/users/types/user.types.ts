export interface User {
  id_: string;
  health_id: string;
  given_name: string;
  family_name: string;
  roles: UserRole[];
  is_active: boolean;
}

export interface CreateUserRequest {
  given_name: string;
  family_name: string;
  health_id: string;
  password: string;
  roles: UserRole[] | null;
}

export interface UpdateUserRequest {
  given_name?: string | null;
  family_name?: string | null;
  health_id?: string | null;
  password?: string | null;
  roles?: UserRole[] | null;
  is_active?: boolean | null;
}

export interface ListUsersResponse {
  data: User[];
  total: number;
}

export interface ListUsersQueryParams {
  search?: string;
  roles?: UserRole[];
  is_active?: boolean;
  limit?: number;
  offset?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export type UserRole = 
  | "USER"
  | "PARENT"
  | "PATIENT"
  | "HEALTH_PRO"
  | "DOCTOR"
  | "NURSE"
  | "MIDWIFE"
  | "LAB_TECHNICIAN"
  | "PHARMACIST"
  | "COMMUNITY_AGENT"
  | "ADMIN"
  | "SUPER_ADMIN";
