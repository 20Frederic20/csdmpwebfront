// Removed unused UUID import

export enum RouteOfAdministration {
  ORAL = 'oral',
  INTRAVENOUS = 'intravenous',
  SUBCUTANEOUS = 'subcutaneous',
  TOPICAL = 'topical',
  INHALATION = 'inhalation'
}

export interface Prescription {
  id?: string | null;
  order_id?: string | null;
  medication_name: string;
  dosage: string;
  frequency: string;
  duration_days: number;
  route_of_administration: RouteOfAdministration;
  special_instructions?: string;
}

export interface PrescriptionItemResponse {
  id: string;
  order_id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  duration_days: number;
  route_of_administration: RouteOfAdministration;
  special_instructions?: string;
  updated_at?: string;
}

export interface PrescriptionOrderResponse {
  id: string;
  consultation_id: string;
  doctor_id: string;
  is_confidential: boolean;
  is_locked: boolean;
  items: PrescriptionItemResponse[];
  created_at?: string;
}

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
  physical_examination?: string | null;
  triage_by_id?: string | null;
  consulted_by_id?: string | null;
  parent_consultation_id?: string | null;
  other_symptoms?: string | null;
  vital_signs?: VitalSigns;
  diagnosis?: string | null;
  follow_up_notes?: string | null;
  follow_up_date?: string | null;
  status?: ConsultationStatus;
  is_confidential?: boolean | null;
  prescriptions?: Prescription[];
}

export interface UpdateConsultationRequest {
  patient_id?: string;
  chief_complaint?: string;
  health_facility_id?: string;
  department_id?: string;
  physical_examination?: string | null;
  triage_by_id?: string | null;
  consulted_by_id?: string | null;
  parent_consultation_id?: string | null;
  other_symptoms?: string | null;
  vital_signs?: VitalSigns;
  diagnosis?: string | null;
  follow_up_notes?: string | null;
  follow_up_date?: string | null;
  status?: ConsultationStatus;
  is_confidential?: boolean | null;
  prescriptions?: Prescription[];
}

export interface CompleteConsultationRequest {
  diagnosis?: string | null;
  follow_up_notes?: string | null;
  follow_up_date?: string | null;
  status?: ConsultationStatus;
  is_confidential?: boolean | null;
}

export interface Consultation {
  id_: string;
  patient_id: string;
  chief_complaint: string;
  health_facility_id?: string;
  department_id?: string;
  physical_examination?: string;
  triage_by_id?: string;
  consulted_by_id?: string;
  parent_consultation_id?: string;
  other_symptoms?: string;
  vital_signs?: VitalSigns;
  diagnosis?: string;
  follow_up_notes?: string;
  follow_up_date?: string;
  status: ConsultationStatus;
  is_confidential: boolean;
  is_active: boolean;
  created_at?: string,
  deleted_at?: string;
  prescription?: PrescriptionOrderResponse;
}

export interface ConsultationQM {
  id_: string;
  patient_id: string;
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
  follow_up_notes?: string;
  follow_up_date?: string;
  status: ConsultationStatus;
  is_confidential: boolean;
  is_active: boolean;
  created_at?: string,
  deleted_at?: string;
  prescription?: PrescriptionOrderResponse;
}

export interface ListConsultationsQM {
  data: ConsultationQM[];
  total: number;
}

export interface ConsultationQueryParams {
  search?: string;
  status?: string;
  follow_up_date?: string;
  health_facility_id?: string;
  limit?: number;
  offset?: number;
  sorting_field?: string;
  sorting_order?: 'asc' | 'desc';
}
