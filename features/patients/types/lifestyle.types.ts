export interface PatientLifestyle {
  id: string;
  tobacco_status: 'non-smoker' | 'smoker' | 'former-smoker';
  alcohol_consumption: 'none' | 'moderate' | 'heavy';
  physical_activity: 'sedentary' | 'moderate' | 'active';
  assessment_date?: string;
  tobacco_per_week?: number;
  alcohol_units_per_week?: number;
  dietary_regime?: string;
  occupational_risks?: string;
  notes?: string;
  is_active: boolean;
  deleted_at?: string;
}

export interface CreateLifestyleRequest {
  tobacco_status: string | null;
  alcohol_consumption: string | null;
  physical_activity: string | null;
  assessment_date: string | null;
  tobacco_per_week: number | null;
  alcohol_units_per_week: number | null;
  dietary_regime: string | null;
  occupational_risks: string | null;
  notes: string | null;
}

export interface UpdateLifestyleRequest {
  patient_id: string | null;
  tobacco_status: string | null;
  alcohol_consumption: string | null;
  physical_activity: string | null;
  assessment_date: string | null;
  tobacco_per_week: number | null;
  alcohol_units_per_week: number | null;
  dietary_regime: string | null;
  occupational_risks: string | null;
  notes: string | null;
  is_active: boolean | null;
}

export interface PatientLifestyleResponse {
  data: PatientLifestyle[];
  total: number;
}

export interface LifestyleQueryParams {
  patient_id: string;
  limit?: number;
  offset?: number;
}
