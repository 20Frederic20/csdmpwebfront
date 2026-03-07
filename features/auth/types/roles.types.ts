export enum UserRole {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  RECEPTIONIST = 'RECEPTIONIST',
  LAB_TECHNICIAN = 'LAB_TECHNICIAN'
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
  health_facility_id?: string;
  patient_id?: string;
  hospital_staff_id?: string;
  roles: UserRole[];
  permissions: Permission[];
}

export interface PermissionsResponse {
  data: Permission[];
  total: number;
}
