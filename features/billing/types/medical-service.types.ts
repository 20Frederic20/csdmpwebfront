export enum ServiceMainCategory {
  CONSULTATION = "CONSULTATION",
  LAB = "LAB",
  HOSPITALIZATION = "HOSPITALIZATION",
  PHARMACY = "PHARMACY",
  IMAGING = "IMAGING",
  OTHER = "OTHER",
}

export enum ServiceCode {
  // Granular Consultation Codes
  CONSULTATION_STANDARD = "CONSULTATION_STANDARD",
  CONSULTATION_EMERGENCY = "CONSULTATION_EMERGENCY",
  CONSULTATION_INTENSIVE_CARE = "CONSULTATION_INTENSIVE_CARE",
  CONSULTATION_SURGERY = "CONSULTATION_SURGERY",
  CONSULTATION_PEDIATRICS = "CONSULTATION_PEDIATRICS",
  CONSULTATION_OBSTETRICS_GYNECOLOGY = "CONSULTATION_OBSTETRICS_GYNECOLOGY",
  CONSULTATION_CARDIOLOGY = "CONSULTATION_CARDIOLOGY",
  CONSULTATION_NEUROLOGY = "CONSULTATION_NEUROLOGY",
  CONSULTATION_ONCOLOGY = "CONSULTATION_ONCOLOGY",
  CONSULTATION_RADIOLOGY = "CONSULTATION_RADIOLOGY",
  CONSULTATION_LABORATORY = "CONSULTATION_LABORATORY",
  CONSULTATION_PHARMACY = "CONSULTATION_PHARMACY",
  CONSULTATION_OUTPATIENT = "CONSULTATION_OUTPATIENT",
  CONSULTATION_INPATIENT = "CONSULTATION_INPATIENT",
  CONSULTATION_MATERNITY = "CONSULTATION_MATERNITY",
  CONSULTATION_NEONATAL = "CONSULTATION_NEONATAL",
  CONSULTATION_PSYCHIATRY = "CONSULTATION_PSYCHIATRY",
  CONSULTATION_DENTISTRY = "CONSULTATION_DENTISTRY",
  CONSULTATION_OPHTHALMOLOGY = "CONSULTATION_OPHTHALMOLOGY",
  CONSULTATION_ORTHOPEDICS = "CONSULTATION_ORTHOPEDICS",
  CONSULTATION_DERMATOLOGY = "CONSULTATION_DERMATOLOGY",
  CONSULTATION_INFECTIOUS_DISEASES = "CONSULTATION_INFECTIOUS_DISEASES",
  CONSULTATION_INTERNAL_MEDICINE = "CONSULTATION_INTERNAL_MEDICINE",
  CONSULTATION_ANESTHESIOLOGY = "CONSULTATION_ANESTHESIOLOGY",
  CONSULTATION_PATHOLOGY = "CONSULTATION_PATHOLOGY",
  CONSULTATION_NUTRITION = "CONSULTATION_NUTRITION",
  CONSULTATION_REHABILITATION = "CONSULTATION_REHABILITATION",
  CONSULTATION_EMERGENCY_ROOM = "CONSULTATION_EMERGENCY_ROOM",
  CONSULTATION_INTENSIVE_CARE_UNIT = "CONSULTATION_INTENSIVE_CARE_UNIT",
  CONSULTATION_PEDIATRIC_EMERGENCY = "CONSULTATION_PEDIATRIC_EMERGENCY",
  CONSULTATION_SURGICAL_EMERGENCY = "CONSULTATION_SURGICAL_EMERGENCY",
  CONSULTATION_OBSTETRIC_EMERGENCY = "CONSULTATION_OBSTETRIC_EMERGENCY",

  // Granular Lab Codes
  LAB_BLOOD_COUNT = "LAB_BLOOD_COUNT",
  LAB_CHEMISTRY = "LAB_CHEMISTRY",
  LAB_HEMATOLOGY = "LAB_HEMATOLOGY",
  LAB_MICROBIOLOGY = "LAB_MICROBIOLOGY",
  LAB_PATHOLOGY = "LAB_PATHOLOGY",
  LAB_IMMUNOLOGY = "LAB_IMMUNOLOGY",
  LAB_GENETICS = "LAB_GENETICS",
  LAB_TOXICOLOGY = "LAB_TOXICOLOGY",
  LAB_ENDOCRINOLOGY = "LAB_ENDOCRINOLOGY",
  LAB_CARDIOLOGY = "LAB_CARDIOLOGY",
  LAB_URINALYSIS = "LAB_URINALYSIS",
  LAB_STOOL_ANALYSIS = "LAB_STOOL_ANALYSIS",
  LAB_IMAGING = "LAB_IMAGING",
  LAB_OTHER = "LAB_OTHER",

  // Granular Hospitalization Codes
  HOSP_ROOM_DAILY = "HOSP_ROOM_DAILY",
  HOSP_ICU_DAILY = "HOSP_ICU_DAILY",
  HOSP_EMERGENCY_STAY = "HOSP_EMERGENCY_STAY",

  // Granular Pharmacy Codes
  PHARMA_MEDICATION = "PHARMA_MEDICATION",
  PHARMA_CONSUMABLE = "PHARMA_CONSUMABLE",

  // Granular Imaging Codes
  IMAG_XRAY = "IMAG_XRAY",
  IMAG_CT_SCAN = "IMAG_CT_SCAN",
  IMAG_MRI = "IMAG_MRI",
  IMAG_ULTRASOUND = "IMAG_ULTRASOUND",

  // Granular Other Codes
  SERVICE_ADMIN = "SERVICE_ADMIN",
  SERVICE_TRANSPORT = "SERVICE_TRANSPORT",
}

export const MAIN_CATEGORY_LABELS: Record<ServiceMainCategory, string> = {
  [ServiceMainCategory.CONSULTATION]: "Consultation",
  [ServiceMainCategory.LAB]: "Laboratoire",
  [ServiceMainCategory.HOSPITALIZATION]: "Hospitalisation",
  [ServiceMainCategory.PHARMACY]: "Pharmacie",
  [ServiceMainCategory.IMAGING]: "Imagerie",
  [ServiceMainCategory.OTHER]: "Autre",
};

export const SERVICE_CODE_LABELS: Record<ServiceCode, string> = {
  [ServiceCode.CONSULTATION_STANDARD]: "Consultation Standard",
  [ServiceCode.CONSULTATION_EMERGENCY]: "Consultation d'Urgence",
  [ServiceCode.CONSULTATION_INTENSIVE_CARE]: "Soins Intensifs",
  [ServiceCode.CONSULTATION_SURGERY]: "Chirurgie",
  [ServiceCode.CONSULTATION_PEDIATRICS]: "Pédiatrie",
  [ServiceCode.CONSULTATION_OBSTETRICS_GYNECOLOGY]: "Gynécologie Obstétrique",
  [ServiceCode.CONSULTATION_CARDIOLOGY]: "Cardiologie",
  [ServiceCode.CONSULTATION_NEUROLOGY]: "Neurologie",
  [ServiceCode.CONSULTATION_ONCOLOGY]: "Oncologie",
  [ServiceCode.CONSULTATION_RADIOLOGY]: "Radiologie",
  [ServiceCode.CONSULTATION_LABORATORY]: "Laboratoire",
  [ServiceCode.CONSULTATION_PHARMACY]: "Pharmacie",
  [ServiceCode.CONSULTATION_OUTPATIENT]: "Ambulatoire",
  [ServiceCode.CONSULTATION_INPATIENT]: "Hospitalisé",
  [ServiceCode.CONSULTATION_MATERNITY]: "Maternité",
  [ServiceCode.CONSULTATION_NEONATAL]: "Néonatologie",
  [ServiceCode.CONSULTATION_PSYCHIATRY]: "Psychiatrie",
  [ServiceCode.CONSULTATION_DENTISTRY]: "Dentisterie",
  [ServiceCode.CONSULTATION_OPHTHALMOLOGY]: "Ophtalmologie",
  [ServiceCode.CONSULTATION_ORTHOPEDICS]: "Orthopédie",
  [ServiceCode.CONSULTATION_DERMATOLOGY]: "Dermatologie",
  [ServiceCode.CONSULTATION_INFECTIOUS_DISEASES]: "Maladies Infectieuses",
  [ServiceCode.CONSULTATION_INTERNAL_MEDICINE]: "Médecine Interne",
  [ServiceCode.CONSULTATION_ANESTHESIOLOGY]: "Anesthésiologie",
  [ServiceCode.CONSULTATION_PATHOLOGY]: "Pathologie",
  [ServiceCode.CONSULTATION_NUTRITION]: "Nutrition",
  [ServiceCode.CONSULTATION_REHABILITATION]: "Rééducation",
  [ServiceCode.CONSULTATION_EMERGENCY_ROOM]: "Urgences (SAU)",
  [ServiceCode.CONSULTATION_INTENSIVE_CARE_UNIT]: "Unité de Soins Intensifs",
  [ServiceCode.CONSULTATION_PEDIATRIC_EMERGENCY]: "Urgences Pédiatriques",
  [ServiceCode.CONSULTATION_SURGICAL_EMERGENCY]: "Urgences Chirurgicales",
  [ServiceCode.CONSULTATION_OBSTETRIC_EMERGENCY]: "Urgences Obstétricales",
  [ServiceCode.LAB_BLOOD_COUNT]: "Numération Formule Sanguine (NFS)",
  [ServiceCode.LAB_CHEMISTRY]: "Biochimie",
  [ServiceCode.LAB_HEMATOLOGY]: "Hématologie",
  [ServiceCode.LAB_MICROBIOLOGY]: "Microbiologie",
  [ServiceCode.LAB_PATHOLOGY]: "Anatomo-pathologie",
  [ServiceCode.LAB_IMMUNOLOGY]: "Immunologie",
  [ServiceCode.LAB_GENETICS]: "Génétique",
  [ServiceCode.LAB_TOXICOLOGY]: "Toxicologie",
  [ServiceCode.LAB_ENDOCRINOLOGY]: "Endocrinologie",
  [ServiceCode.LAB_CARDIOLOGY]: "Marqueurs Cardiaques",
  [ServiceCode.LAB_URINALYSIS]: "Analyse d'Urines",
  [ServiceCode.LAB_STOOL_ANALYSIS]: "Analyse de Selles",
  [ServiceCode.LAB_IMAGING]: "Imagerie Labo",
  [ServiceCode.LAB_OTHER]: "Autre Analyse Labo",
  [ServiceCode.HOSP_ROOM_DAILY]: "Chambre d'Hospitalisation (Journalier)",
  [ServiceCode.HOSP_ICU_DAILY]: "Chambre Soins Intensifs (Journalier)",
  [ServiceCode.HOSP_EMERGENCY_STAY]: "Séjour d'Urgence",
  [ServiceCode.PHARMA_MEDICATION]: "Médicaments",
  [ServiceCode.PHARMA_CONSUMABLE]: "Consommables Médicaux",
  [ServiceCode.IMAG_XRAY]: "Radiographie (Rayons X)",
  [ServiceCode.IMAG_CT_SCAN]: "Scanner (TDM)",
  [ServiceCode.IMAG_MRI]: "IRM",
  [ServiceCode.IMAG_ULTRASOUND]: "Échographie",
  [ServiceCode.SERVICE_ADMIN]: "Frais Administratifs",
  [ServiceCode.SERVICE_TRANSPORT]: "Transport Sanitaire (Ambulance)",
};

export const CATEGORY_TO_CODES: Record<ServiceMainCategory, ServiceCode[]> = {
  [ServiceMainCategory.CONSULTATION]: [
    ServiceCode.CONSULTATION_STANDARD,
    ServiceCode.CONSULTATION_EMERGENCY,
    ServiceCode.CONSULTATION_INTENSIVE_CARE,
    ServiceCode.CONSULTATION_SURGERY,
    ServiceCode.CONSULTATION_PEDIATRICS,
    ServiceCode.CONSULTATION_OBSTETRICS_GYNECOLOGY,
    ServiceCode.CONSULTATION_CARDIOLOGY,
    ServiceCode.CONSULTATION_NEUROLOGY,
    ServiceCode.CONSULTATION_ONCOLOGY,
    ServiceCode.CONSULTATION_RADIOLOGY,
    ServiceCode.CONSULTATION_LABORATORY,
    ServiceCode.CONSULTATION_PHARMACY,
    ServiceCode.CONSULTATION_OUTPATIENT,
    ServiceCode.CONSULTATION_INPATIENT,
    ServiceCode.CONSULTATION_MATERNITY,
    ServiceCode.CONSULTATION_NEONATAL,
    ServiceCode.CONSULTATION_PSYCHIATRY,
    ServiceCode.CONSULTATION_DENTISTRY,
    ServiceCode.CONSULTATION_OPHTHALMOLOGY,
    ServiceCode.CONSULTATION_ORTHOPEDICS,
    ServiceCode.CONSULTATION_DERMATOLOGY,
    ServiceCode.CONSULTATION_INFECTIOUS_DISEASES,
    ServiceCode.CONSULTATION_INTERNAL_MEDICINE,
    ServiceCode.CONSULTATION_ANESTHESIOLOGY,
    ServiceCode.CONSULTATION_PATHOLOGY,
    ServiceCode.CONSULTATION_NUTRITION,
    ServiceCode.CONSULTATION_REHABILITATION,
    ServiceCode.CONSULTATION_EMERGENCY_ROOM,
    ServiceCode.CONSULTATION_INTENSIVE_CARE_UNIT,
    ServiceCode.CONSULTATION_PEDIATRIC_EMERGENCY,
    ServiceCode.CONSULTATION_SURGICAL_EMERGENCY,
    ServiceCode.CONSULTATION_OBSTETRIC_EMERGENCY,
  ],
  [ServiceMainCategory.LAB]: [
    ServiceCode.LAB_BLOOD_COUNT,
    ServiceCode.LAB_CHEMISTRY,
    ServiceCode.LAB_HEMATOLOGY,
    ServiceCode.LAB_MICROBIOLOGY,
    ServiceCode.LAB_PATHOLOGY,
    ServiceCode.LAB_IMMUNOLOGY,
    ServiceCode.LAB_GENETICS,
    ServiceCode.LAB_TOXICOLOGY,
    ServiceCode.LAB_ENDOCRINOLOGY,
    ServiceCode.LAB_CARDIOLOGY,
    ServiceCode.LAB_URINALYSIS,
    ServiceCode.LAB_STOOL_ANALYSIS,
    ServiceCode.LAB_IMAGING,
    ServiceCode.LAB_OTHER,
  ],
  [ServiceMainCategory.HOSPITALIZATION]: [
    ServiceCode.HOSP_ROOM_DAILY,
    ServiceCode.HOSP_ICU_DAILY,
    ServiceCode.HOSP_EMERGENCY_STAY,
  ],
  [ServiceMainCategory.PHARMACY]: [
    ServiceCode.PHARMA_MEDICATION,
    ServiceCode.PHARMA_CONSUMABLE,
  ],
  [ServiceMainCategory.IMAGING]: [
    ServiceCode.IMAG_XRAY,
    ServiceCode.IMAG_CT_SCAN,
    ServiceCode.IMAG_MRI,
    ServiceCode.IMAG_ULTRASOUND,
  ],
  [ServiceMainCategory.OTHER]: [
    ServiceCode.SERVICE_ADMIN,
    ServiceCode.SERVICE_TRANSPORT,
  ],
};

// Backwards compatibility or if the API still expects ServiceCategory
export type ServiceCategory = ServiceMainCategory;
export const ServiceCategory = ServiceMainCategory;

export interface MedicalService {
  id: string;
  health_facility_id: string;
  code: string;
  label: string;
  base_price: string; // Decimal is usually handled as string in JSON
  category: ServiceMainCategory;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface CreateMedicalServiceDTO {
  health_facility_id: string;
  code: string;
  label: string;
  base_price: number;
  category: ServiceMainCategory;
}

export interface UpdateMedicalServiceDTO extends Partial<CreateMedicalServiceDTO> {
  is_active?: boolean;
}

export interface ListMedicalServicesQueryParams {
  limit?: number;
  offset?: number;
  category?: ServiceCategory;
  health_facility_id?: string;
  search?: string;
  include_deleted?: boolean;
}

export interface ListMedicalServicesQM {
  data: MedicalService[];
  total: number;
}
