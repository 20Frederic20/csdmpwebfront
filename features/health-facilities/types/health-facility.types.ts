export enum FacilityType {
  UNIVERSITY_HOSPITAL = "UNIVERSITY_HOSPITAL",
  DEPARTMENTAL_HOSPITAL = "DEPARTMENTAL_HOSPITAL",
  ZONE_HOSPITAL = "ZONE_HOSPITAL",
  HEALTH_CENTER = "HEALTH_CENTER",
  DISPENSARY = "DISPENSARY",
  PRIVATE_CLINIC = "PRIVATE_CLINIC",
  MATERNITY_CLINIC = "MATERNITY_CLINIC",
  MEDICAL_OFFICE = "MEDICAL_OFFICE",
  CONFESSIONAL_CENTER = "CONFESSIONAL_CENTER"
}

export enum HealthcareLevel {
  NATIONAL = "NATIONAL",
  DEPARTMENTAL = "DEPARTMENTAL",
  ZONAL = "ZONAL",
  COMMUNAL = "COMMUNAL",
  PRIMARY = "PRIMARY",
  PRIVATE = "PRIVATE"
}

export interface HealthFacility {
  id_: string;
  name: string;
  code: string;
  facility_type: FacilityType;
  healthcare_level: HealthcareLevel;
  region: string;
  district: string;
  health_zone: string;
  snis_code: string | null;
  tax_id: string | null;
  authorization_decree_number: string | null;
  authorization_decree_date: string | null;
  commune_code: string | null;
  latitude: number | null;
  longitude: number | null;
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
  facility_type: FacilityType;
  healthcare_level: HealthcareLevel;
  region: string;
  district: string;
  health_zone: string;
  snis_code: string | null;
  tax_id: string | null;
  authorization_decree_number: string | null;
  authorization_decree_date: string | null;
  commune_code: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  admin_user_id: string | null;
  admin_user: AdminUser | null;
  is_active: boolean;
}

export interface UpdateHealthFacilityRequest {
  name?: string | null;
  code?: string | null;
  facility_type?: FacilityType | null;
  healthcare_level?: HealthcareLevel | null;
  region?: string | null;
  district?: string | null;
  health_zone?: string | null;
  snis_code?: string | null;
  tax_id?: string | null;
  authorization_decree_number?: string | null;
  authorization_decree_date?: string | null;
  commune_code?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string | null;
  admin_user_id?: string | null;
  is_active?: boolean | null;
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
