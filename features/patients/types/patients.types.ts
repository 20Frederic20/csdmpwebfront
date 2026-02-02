export interface Patient {
  id_: string;
  owner_id: string;
  given_name: string;
  family_name: string;
  birth_date: string;
  gender: 'male' | 'female' | 'other';
  location: string;
  is_main: boolean;
  is_minor: boolean;
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
