export interface PatientInsurance {
  id_: string;
  patient_id: string;
  patient_full_name: string;
  insurance_id: string;
  insurance_name: string;
  policy_number: string;
  priority: number;
  is_active: boolean;
  deleted_at?: string | null;
}

export interface CreatePatientInsuranceRequest {
  patient_id: string;
  insurance_id: string;
  policy_number: string;
  priority: number;
  is_active?: boolean;
}

export interface CreatePatientInsuranceResponse {
  id: string;
  patient_id: string;
  insurance_id: string;
  policy_number: string;
  priority: number;
  is_active: boolean;
  created_by?: string | null;
}

export interface ListPatientInsuranceQueryParams {
  search?: string;
  patient_id?: string;
  insurance_id?: string;
  patient_full_name?: string;
  insurance_name?: string;
  policy_number?: string;
  priority?: number;
  is_active?: boolean;
  deleted_at?: string | null;
  limit?: number;
  offset?: number;
  sort_by?: 'patient_full_name' | 'insurance_name' | 'policy_number' | 'priority' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface ListPatientInsuranceQM {
  data: PatientInsurance[];
  total: number;
}
