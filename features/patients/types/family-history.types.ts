export interface PatientFamilyHistory {
  id_: string;
  relationship: string;
  condition: string;
  age_at_onset?: number;
  is_deceased?: boolean;
  notes?: string;
  is_active: boolean;
  deleted_at?: string;
}

export interface CreateFamilyHistoryRequest {
  relationship: string;
  condition: string;
  age_at_onset?: number;
  is_deceased?: boolean;
  notes?: string;
}

export interface UpdateFamilyHistoryRequest {
  relationship?: string;
  condition?: string;
  age_at_onset?: number;
  is_deceased?: boolean;
  notes?: string;
  is_active?: boolean;
}

export interface PatientFamilyHistoryResponse {
  data: PatientFamilyHistory[];
  total: number;
}

export interface FamilyHistoryQueryParams {
  patient_id: string;
  limit?: number;
  offset?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}
