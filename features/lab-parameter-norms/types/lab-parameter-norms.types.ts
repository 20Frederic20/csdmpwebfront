export type Gender = 'M' | 'F' | 'O' | 'ALL';

export interface LabParameterNorm {
  id: string;
  parameter_code: string;
  display_name: string;
  unit: string;
  gender: Gender;
  age_min_months: number;
  age_max_months: number;
  min_value: number;
  max_value: number;
  is_pregnant: boolean;
  trimester: number;
  created_at: string;
  updated_at: string;
}

export interface CreateLabParameterNormRequest {
  parameter_code: string;
  display_name: string;
  unit: string;
  gender: string; // The backend uses str, we'll map to our Gender type in the UI
  age_min_months: number;
  age_max_months: number;
  min_value: number;
  max_value: number;
  is_pregnant?: boolean;
  trimester?: number;
}

export interface UpdateLabParameterNormRequest {
  min_value: number;
  max_value: number;
}

export interface ListLabParameterNormsQueryParams {
  parameter_codes?: string;
  gender?: Gender;
  limit?: number;
  offset?: number;
}

export interface ListLabParameterNormsResponse {
  data: LabParameterNorm[];
  total: number;
}
