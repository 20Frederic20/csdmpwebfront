export interface HealthFacility {
  id_: string;
  name: string;
  code: string;
  facility_type: 'university_hospital' | 'departmental_hospital' | 'zone_hospital' | 'health_center' | 'dispensary' | 'private_clinic';
  district: string | null;
  region: string | null;
  phone: string | null;
  admin_user_id: string | null;
  admin_given_name: string | null;
  admin_family_name: string | null;
  is_active: boolean;
  deleted_at?: string | null;
}

export interface AdminUser {
  given_name: string;
  family_name: string;
  health_id: string;
  password: string;
  roles: string[];
}

export interface CreateHealthFacilityRequest {
  name: string;
  code: string;
  facility_type: 'university_hospital' | 'departmental_hospital' | 'zone_hospital' | 'health_center' | 'dispensary' | 'private_clinic';
  district: string;
  region: string;
  phone: string | null;
  admin_user_id: string | null;
  admin_user: AdminUser | null;
  is_active: boolean;
}

export interface UpdateHealthFacilityRequest {
  name: string | null;
  code: string | null;
  facility_type: string | null;
  district: string | null;
  region: string | null;
  phone: string | null;
  admin_user_id: string | null;
  is_active: boolean | null;
}

export interface HealthFacilityResponse {
  data: HealthFacility[];
  total: number;
}

export interface HealthFacilityQueryParams {
  limit?: number;
  offset?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  search?: string;
  deleted_at?: string | null;
}
