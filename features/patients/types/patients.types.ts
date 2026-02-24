export interface Patient {
  id_: string;
  given_name: string;
  family_name: string;
  birth_date: string;
  gender: 'male' | 'female' | 'other' | 'unknown';
  location: string;
  owner_id: string;
  is_active: boolean;
  is_main?: boolean;
  health_id?: string | null;
  birth_place?: string | null;
  residence_city?: string | null;
  neighborhood?: string | null;
  phone_number?: string | null;
  npi_number?: string | null;
  blood_group?: string | null;
  father_full_name?: string | null;
  mother_full_name?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  deleted_at?: string | null;
  version?: number | null;
}

export interface CreatePatientRequest {
  given_name: string;
  family_name: string;
  birth_date: string;
  gender: 'male' | 'female' | 'other' | 'unknown';
  location?: string | null;
  owner_id?: string | null;
  birth_place?: string | null;
  residence_city?: string | null;
  neighborhood?: string | null;
  phone_number?: string | null;
  npi_number?: string | null;
  blood_group?: string | null;
  father_full_name?: string | null;
  mother_full_name?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  is_main?: boolean;
}

export interface UpdatePatientRequest {
  given_name?: string;
  family_name?: string;
  birth_date?: string;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  location?: string | null;
  owner_id?: string | null;
  birth_place?: string | null;
  residence_city?: string | null;
  neighborhood?: string | null;
  phone_number?: string | null;
  npi_number?: string | null;
  blood_group?: string | null;
  father_full_name?: string | null;
  mother_full_name?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  is_main?: boolean;
  is_active?: boolean;
}

export interface PatientsResponse {
  data: Patient[];
  total: number;
}

export interface PatientsQueryParams {
  limit?: number;
  offset?: number;
  sorting_field?: string ;
  sorting_order?: 'ASC' | 'DESC';
  search?: string;
  birth_date_from?: string;
  genders?: 'male' | 'female' | 'other' | 'unknown' | 'all';
}
