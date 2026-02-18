export type ConsultationStatus = "scheduled" | "completed" | "pending" | "cancelled";

export interface VitalSigns {
  temperature?: number | null;
  pulse?: number | null;
  systolic_bp?: number | null;
  diastolic_bp?: number | null;
  weight?: number | null;
  height?: number | null;
}

export interface Consultation {
  id_: string;
  patient_id: string;
  chief_complaint: string;
  triage_by_id?: string | null;
  consulted_by_id?: string | null;
  parent_consultation_id?: string | null;
  other_symptoms?: string | null;
  vital_signs?: VitalSigns | null;
  diagnosis?: string | null;
  treatment_plan?: string | null;
  follow_up_notes?: string | null;
  follow_up_date?: string | null;
  status: ConsultationStatus;
  billing_code?: string | null;
  amount_paid?: number | null;
  is_confidential: boolean;
  is_active: boolean;
  deleted_at?: string | null;
}

export interface CreateConsultationRequest {
  patient_id: string;
  chief_complaint: string;
  triage_by_id?: string | null;
  consulted_by_id?: string | null;
  parent_consultation_id?: string | null;
  other_symptoms?: string | null;
  vital_signs?: VitalSigns | null;
  diagnosis?: string | null;
  treatment_plan?: string | null;
  follow_up_notes?: string | null;
  follow_up_date?: string | null;
  status?: ConsultationStatus;
  billing_code?: string | null;
  amount_paid?: number | null;
  is_confidential?: boolean;
}

export interface UpdateConsultationRequest {
  chief_complaint?: string;
  triage_by_id?: string | null;
  consulted_by_id?: string | null;
  parent_consultation_id?: string | null;
  other_symptoms?: string | null;
  vital_signs?: VitalSigns | null;
  diagnosis?: string | null;
  treatment_plan?: string | null;
  follow_up_notes?: string | null;
  follow_up_date?: string | null;
  status?: ConsultationStatus;
  billing_code?: string | null;
  amount_paid?: number | null;
  is_confidential?: boolean;
  is_active?: boolean;
}

export interface ConsultationResponse {
  id: string;
  patient_id: string;
  chief_complaint: string;
  triage_by_id?: string | null;
  consulted_by_id?: string | null;
  parent_consultation_id?: string | null;
  other_symptoms?: string | null;
  vital_signs?: VitalSigns | null;
  diagnosis?: string | null;
  treatment_plan?: string | null;
  follow_up_notes?: string | null;
  follow_up_date?: string | null;
  status: ConsultationStatus;
  billing_code?: string | null;
  amount_paid?: number | null;
  is_confidential: boolean;
  is_active: boolean;
  deleted_at?: string | null;
}

export interface ListConsultationsQM {
  data: Consultation[];
  total: number;
}

export interface ListConsultationsQueryParams {
  search?: string;
  patient_id?: string;
  consulted_by_id?: string;
  status?: ConsultationStatus;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
  sort_by?: 'chief_complaint' | 'status' | 'created_at' | 'follow_up_date';
  sort_order?: 'asc' | 'desc';
}
