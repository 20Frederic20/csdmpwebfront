export enum UserRole {
  ADMIN = 'admin',
  DOCTOR = 'doctor', 
  NURSE = 'nurse',
  RECEPTIONIST = 'receptionist',
  LAB_TECHNICIAN = 'lab_technician'
}

export interface Permission {
  resource: string;  // 'patients', 'lab_results', 'insurance_companies'
  action: string;    // 'read', 'write', 'delete'
}

export interface Role {
  id: string;
  name: UserRole;
  permissions: Permission[];
}

export interface UserWithRoles {
  id: string;
  email: string;
  given_name: string;
  family_name: string;
  roles: UserRole[];
  permissions: Permission[];
}

export interface PermissionsResponse {
  data: Permission[];
  total: number;
}
