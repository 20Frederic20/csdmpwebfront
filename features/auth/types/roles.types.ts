export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
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
  health_id?: string;
  email?: string;
  name?: string;
  /** @deprecated Utiliser `name` (claim du token). Conservé pour compatibilité. */
  given_name?: string;
  /** @deprecated Utiliser `name` (claim du token). Conservé pour compatibilité. */
  family_name?: string;
  is_admin?: boolean;
  is_superadmin?: boolean;
  is_active?: boolean;
  roles: UserRole[];
  permissions: Permission[];
  // Profils liés
  patient_id?: string;
  hospital_staff_id?: string;
  hospital_staff_matricule?: string;
  hospital_staff_specialty?: string;
  health_facility_id?: string;
  health_facility_name?: string;
  health_facility_phone?: string;
}

export interface PermissionsResponse {
  data: Permission[];
  total: number;
}
