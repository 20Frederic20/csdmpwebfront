export enum TestType {
  BLOOD_COUNT = "blood_count",
  CHEMISTRY = "chemistry",
  HEMATOLOGY = "hematology",
  MICROBIOLOGY = "microbiology",
  PATHOLOGY = "pathology",
  IMMUNOLOGY = "immunology",
  GENETICS = "genetics",
  TOXICOLOGY = "toxicology",
  ENDOCRINOLOGY = "endocrinology",
  CARDIOLOGY = "cardiology",
  URINALYSIS = "urinalysis",
  STOOL_ANALYSIS = "stool_analysis",
  IMAGING = "imaging",
  OTHER = "other"
}

export interface CreateLabResultRequest {
  patient_id: string;
  performer_id: string; // ID du personnel qui a réalisé le test
  test_type: TestType;
  date_performed: string; // ISO date string
  date_reported: string; // ISO date string
  issuing_facility?: string | null;
  extracted_values?: object | null;
  document_id?: string | null;
  is_active?: boolean;
}

export interface LabResult {
  id_: string;
  patient_id: string;
  performer_id: string; // ID du personnel qui a réalisé le test
  test_type: TestType;
  date_performed: string;
  date_reported: string;
  issuing_facility?: string | null;
  extracted_values?: object | null;
  document_id?: string | null;
  is_active: boolean;
}

export interface ListLabResultQM {
  data: LabResult[];
  total: number;
}

export interface HospitalStaff {
  id_: string;
  given_name: string;
  family_name: string;
  matricule: string;
  is_active: boolean;
}

export interface Patient {
  id_: string;
  given_name: string;
  family_name: string;
  email?: string;
  phone?: string;
  is_active: boolean;
}

export interface HealthFacility {
  id_: string;
  code: string;
  name: string;
  is_active: boolean;
}

export interface ListLabResultQueryParams {
  patient_id?: string;
  performer_id?: string;
  test_type?: TestType;
  date_performed_from?: string;
  date_performed_to?: string;
  date_reported_from?: string;
  date_reported_to?: string;
  issuing_facility?: string;
  is_active?: boolean;
  limit?: number;
  offset?: number;
  sort_by?: 'date_performed' | 'date_reported' | 'test_type' | 'issuing_facility';
  sort_order?: 'asc' | 'desc';
}
