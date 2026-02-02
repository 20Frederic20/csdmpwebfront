export interface Patient {
  id_: string;
  given_name: string;
  family_name: string;
  birth_date: string;
  gender: 'male' | 'female' | 'other' | 'unknown';
  location: string;
  owner_id: string;
  is_active: boolean;
}

export interface PatientsResponse {
  patients: Patient[];
  total: number;
}

export interface PatientsQueryParams {
  limit?: number;
  offset?: number;
  sorting_field?: string ;
  sorting_order?: 'ASC' | 'DESC';
  search?: string;
}
