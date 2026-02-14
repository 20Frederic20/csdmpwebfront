export interface HospitalStaff {
  id_: string;
  user_id: string;
  health_facility_id: string;
  health_facility_name: string;
  matricule: string;
  year_of_exp: number;
  specialty: HospitalStaffSpecialty;
  department: HospitalStaffDepartment;
  is_active: boolean;
  user_given_name?: string;
  user_family_name?: string;
  deleted_at?: string | null;
  updated_at?: string;
  version?: number;
}

export interface CreateHospitalStaffRequest {
  health_facility_id: string;
  matricule: string;
  year_of_exp: number;
  specialty: HospitalStaffSpecialty;
  department: HospitalStaffDepartment;
  user_id?: string | null;
  user_data?: CreateUserRequest | null;
}

export interface CreateUserRequest {
  given_name: string;
  family_name: string;
  health_id: string;
  password: string;
  roles?: string[] | null;
  is_active?: boolean;
}

export interface ListHospitalStaffResponse {
  data: HospitalStaff[];
  total: number;
}

export interface ListHospitalStaffQueryParams {
  search?: string;
  health_facility_id?: string;
  specialty?: HospitalStaffSpecialty;
  department?: HospitalStaffDepartment;
  is_active?: boolean;
  deleted_at?: string | null;
  limit?: number;
  offset?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export type HospitalStaffSpecialty = 
  | "general_practitioner"
  | "cardiologist"
  | "pediatrician"
  | "surgeon"
  | "gynecologist"
  | "orthopedist"
  | "radiologist"
  | "anesthesiologist"
  | "neurologist"
  | "psychiatrist"
  | "ophthalmologist"
  | "otolaryngologist"
  | "dermatologist"
  | "nurse"
  | "midwife"
  | "physiotherapist"
  | "laboratory_technician"
  | "pharmacist"
  | "administrative"
  | "other";

export type HospitalStaffDepartment = 
  | "emergency"
  | "internal_medicine"
  | "cardiology"
  | "pediatrics"
  | "general_surgery"
  | "gynecology_obstetrics"
  | "orthopedics"
  | "radiology"
  | "laboratory"
  | "pharmacy"
  | "anesthesiology"
  | "neurology"
  | "psychiatry"
  | "ophthalmology"
  | "otolaryngology"
  | "dermatology"
  | "rehabilitation"
  | "intensive_care"
  | "administration"
  | "other";
