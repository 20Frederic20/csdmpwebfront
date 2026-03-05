import { UUID } from "@/features/hospital-staff/types/hospital-staff.types";

export interface CreatePrescriptionRequest {
  consultation_id: UUID;
  medication_name: string;
  dosage_instructions: string;
  form?: string[];
  strength?: string;
  duration_days?: number;
  special_instructions?: string;
  is_confidential: boolean;
  is_active: boolean;
}

export interface CreatePrescriptionResponse {
  id: UUID;
  consultation_id: UUID;
  medication_name: string;
  dosage_instructions: string;
  form?: string[];
  strength?: string;
  duration_days?: number;
  special_instructions?: string;
  is_confidential: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface Prescription {
  id: UUID;
  consultation_id: UUID;
  medication_name: string;
  dosage_instructions: string;
  form?: string[];
  strength?: string;
  duration_days?: number;
  special_instructions?: string;
  is_confidential: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface PrescriptionFilterParams {
  search?: string | null;
  consultation_id?: UUID | null;
  is_active?: boolean;
  limit?: number;
  offset?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PrescriptionsResponse {
  data: Prescription[];
  total: number;
}
