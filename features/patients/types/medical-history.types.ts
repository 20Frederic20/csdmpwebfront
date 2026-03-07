export interface PatientMedicalHistory {
  id_: string;
  category: string;
  description: string;
  onset_date: string;
  status: string;
  code?: string;
  severity?: string;
  notes?: string;
  resolution_date?: string;
  is_active: boolean;
  deleted_at?: string;
}

export interface CreateMedicalHistoryRequest {
  category: 'medical' | 'surgical' | 'obstetric';
  description: string;
  onset_date: string;
  status: 'active' | 'resolved' | 'chronic';
  code: string | null;
  severity: 'mild' | 'moderate' | 'severe';
  notes: string | null;
  resolution_date: string | null;
  is_active: boolean;
}

export interface UpdateMedicalHistoryRequest {
  category: string | null;
  description: string | null;
  onset_date: string | null;
  status: string | null;
  code: string | null;
  severity: string | null;
  notes: string | null;
  resolution_date: string | null;
  is_active: boolean | null;
}

export interface PatientMedicalHistoryResponse {
  data: PatientMedicalHistory[];
  total: number;
}

export interface MedicalHistoryQueryParams {
  patient_id: string;
  limit?: number;
  offset?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}
