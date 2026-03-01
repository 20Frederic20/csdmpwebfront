export enum ConsultationStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  RESCHEDULED = 'RESCHEDULED',
  NO_SHOW = 'NO_SHOW'
}

export interface VitalSigns {
  temperature?: number | null;  // en °C
  pulse?: number | null;          // en battements/minute
  systolic_bp?: number | null;    // tension systolique (ex: 120)
  diastolic_bp?: number | null;   // tension diastolique (ex: 80)
  weight?: number | null;         // poids en kg
  height?: number | null;         // taille en cm
}

export interface CreateConsultationRequest {
  patient_id: string;
  chief_complaint: string;
  health_facility_id: string;
  department_id: string;
  insurance_company_id?: string | null;
  physical_examination?: string | null;
  triage_by_id?: string | null;
  consulted_by_id?: string | null;
  parent_consultation_id?: string | null;
  other_symptoms?: string | null;
  vital_signs?: VitalSigns;
  diagnosis?: string | null;
  treatment_plan?: string | null;
  follow_up_notes?: string | null;
  follow_up_date?: string | null;
  status?: ConsultationStatus;
  billing_code?: string | null;
  amount_paid?: number | null;
  is_confidential?: boolean | null;
}

export interface UpdateConsultationRequest {
  patient_id?: string;
  chief_complaint?: string;
  insurance_company_id?: string | null;
  health_facility_id?: string;
  department_id?: string;
  physical_examination?: string | null;
  triage_by_id?: string  | null;
  consulted_by_id?: string | null;
  parent_consultation_id?: string | null;
  other_symptoms?: string | null;
  vital_signs?: VitalSigns;
  diagnosis?: string | null;
  treatment_plan?: string | null;
  follow_up_notes?: string | null;
  follow_up_date?: string | null;
  status?: ConsultationStatus;
  billing_code?: string | null;
  amount_paid?: number | null;
  is_confidential?: boolean | null;
}

export interface CompleteConsultationRequest {
  diagnosis?: string | null;
  treatment_plan?: string | null;
  follow_up_notes?: string | null;
  follow_up_date?: string | null;
  status?: ConsultationStatus;
  billing_code?: string | null;
  amount_paid?: number | null;
  is_confidential?: boolean | null;
}

export interface Consultation {
  id: string;
  patient_id: string;
  chief_complaint: string;
  insurance_company_id?: string;
  health_facility_id?: string;
  department_id?: string;
  physical_examination?: string;
  triage_by_id?: string;
  consulted_by_id?: string;
  parent_consultation_id?: string;
  other_symptoms?: string;
  vital_signs?: VitalSigns;
  diagnosis?: string;
  treatment_plan?: string;
  follow_up_notes?: string;
  follow_up_date?: string;
  status: ConsultationStatus;
  billing_code?: string;
  amount_paid?: number;
  is_confidential: boolean;
  is_active: boolean;
  deleted_at?: string;
}

export interface ConsultationQM {
  id_: string;
  patient_id: string;
  insurance_company_id?: string;
  insurance_company_name?: string;
  health_facility_id?: string;
  health_facility_name?: string;
  department_id?: string;
  department_name?: string;
  physical_examination?: string;
  patient_full_name: string;
  chief_complaint: string;
  triage_by_id?: string;
  consulted_by_id?: string;
  consulted_by_full_name: string;
  parent_consultation_id?: string;
  other_symptoms?: string;
  vital_signs?: VitalSigns;
  diagnosis?: string;
  treatment_plan?: string;
  follow_up_notes?: string;
  follow_up_date?: string;
  status: ConsultationStatus;
  billing_code?: string;
  amount_paid?: number;
  is_confidential: boolean;
  is_active: boolean;
  deleted_at?: string;
}

export interface ListConsultationsQM {
  data: ConsultationQM[];
  total: number;
}

export interface ConsultationQueryParams {
  search?: string;
  status?: string;
  follow_up_date?: string;
  limit?: number;
  offset?: number;
  sorting_field?: string;
  sorting_order?: 'asc' | 'desc';
}
