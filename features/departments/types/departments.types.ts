export enum HospitalDepartment {
  EMERGENCY = "EMERGENCY",
  INTENSIVE_CARE = "INTENSIVE_CARE",
  SURGERY = "SURGERY",
  PEDIATRICS = "PEDIATRICS",
  OBSTETRICS_GYNECOLOGY = "OBSTETRICS_GYNECOLOGY",
  CARDIOLOGY = "CARDIOLOGY",
  NEUROLOGY = "NEUROLOGY",
  ONCOLOGY = "ONCOLOGY",
  RADIOLOGY = "RADIOLOGY",
  LABORATORY = "LABORATORY",
  PHARMACY = "PHARMACY",
  OUTPATIENT = "OUTPATIENT",
  INPATIENT = "INPATIENT",
  MATERNITY = "MATERNITY",
  NEONATAL = "NEONATAL",
  PSYCHIATRY = "PSYCHIATRY",
  DENTISTRY = "DENTISTRY",
  OPHTHALMOLOGY = "OPHTHALMOLOGY",
  ORTHOPEDICS = "ORTHOPEDICS",
  DERMATOLOGY = "DERMATOLOGY",
  INFECTIOUS_DISEASES = "INFECTIOUS_DISEASES",
  INTERNAL_MEDICINE = "INTERNAL_MEDICINE",
  ANESTHESIOLOGY = "ANESTHESIOLOGY",
  PATHOLOGY = "PATHOLOGY",
  NUTRITION = "NUTRITION",
  REHABILITATION = "REHABILITATION",
  EMERGENCY_ROOM = "EMERGENCY_ROOM",
  INTENSIVE_CARE_UNIT = "INTENSIVE_CARE_UNIT",
  PEDIATRIC_EMERGENCY = "PEDIATRIC_EMERGENCY",
  SURGICAL_EMERGENCY = "SURGICAL_EMERGENCY",
  OBSTETRIC_EMERGENCY = "OBSTETRIC_EMERGENCY",
}

export interface Department {
  id_: string;
  health_facility_id: string;
  name: string;
  code: HospitalDepartment;
  is_active: boolean;
  deleted_at?: string | null;
  version?: number;
}

export interface DepartmentFilterParams {
  search?: string | null;
  health_facility_id?: string | null;
  code?: HospitalDepartment | null;
  is_active?: boolean | null;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface CreateDepartmentRequest {
  health_facility_id: string;
  name: string;
  code: HospitalDepartment;
  is_active?: boolean;
}

export interface UpdateDepartmentRequest {
  name?: string | null;
  code?: HospitalDepartment | null;
  is_active?: boolean | null;
}

export interface ToggleDepartmentStatusRequest {
  is_active: boolean;
}

export interface DepartmentResponse {
  id_: string;
  health_facility_id: string;
  name: string;
  code: HospitalDepartment;
  is_active: boolean;
  deleted_at?: string | null;
}

export interface DepartmentsResponse {
  data: Department[];
  total: number;
  limit: number;
  offset: number;
}

export interface DepartmentQueryModel {
  id_: string;
  health_facility_id: string;
  name: string;
  code: HospitalDepartment;
  is_active: boolean;
  deleted_at?: string | null;
  version: number;
}
