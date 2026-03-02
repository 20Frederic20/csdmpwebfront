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
  patient_full_name?: string | null;
  performer_id: string;
  performer_full_name?: string | null;
  test_type: TestType;
  date_performed: string;
  date_reported: string;
  issuing_facility?: string | null;
  extracted_values?: object | null;
  document_id?: string | null;
  is_active: boolean;
  deleted_at?: string | null;
}

export interface ListLabResultQM {
  data: LabResult[];
  total: number;
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
  search?: string; // Pour la recherche par nom du patient
}

export const getTestTypeOptions = () => [
  { value: TestType.BLOOD_COUNT, label: 'Numération globulaire' },
  { value: TestType.CHEMISTRY, label: 'Chimie' },
  { value: TestType.HEMATOLOGY, label: 'Hématologie' },
  { value: TestType.MICROBIOLOGY, label: 'Microbiologie' },
  { value: TestType.PATHOLOGY, label: 'Pathologie' },
  { value: TestType.IMMUNOLOGY, label: 'Immunologie' },
  { value: TestType.GENETICS, label: 'Génétique' },
  { value: TestType.TOXICOLOGY, label: 'Toxicologie' },
  { value: TestType.ENDOCRINOLOGY, label: 'Endocrinologie' },
  { value: TestType.CARDIOLOGY, label: 'Cardiologie' },
  { value: TestType.URINALYSIS, label: 'Analyse d\'urine' },
  { value: TestType.STOOL_ANALYSIS, label: 'Analyse de selles' },
  { value: TestType.IMAGING, label: 'Imagerie' },
  { value: TestType.OTHER, label: 'Autre' }
];

export const canDeleteLabResult = (labResult: LabResult): boolean => {
  return labResult.is_active && !labResult.deleted_at;
};

export const canRestoreLabResult = (labResult: LabResult): boolean => {
  return !!labResult.deleted_at;
};

export const formatTestType = (testType: TestType): string => {
  const option = getTestTypeOptions().find(opt => opt.value === testType);
  return option?.label || testType;
};

export const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

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
