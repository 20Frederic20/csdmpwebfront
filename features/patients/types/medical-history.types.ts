export interface PatientMedicalHistory {
  id: string;
  patient_id: string;
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
