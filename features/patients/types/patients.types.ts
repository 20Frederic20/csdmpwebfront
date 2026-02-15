export interface Patient {
  id_: string;
  given_name: string;
  family_name: string;
  birth_date: string;
  gender: 'male' | 'female' | 'other' | 'unknown';
  location: string;
  owner_id: string;
  is_active: boolean;
  deleted_at?: string | null;
  version?: number | null;
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
