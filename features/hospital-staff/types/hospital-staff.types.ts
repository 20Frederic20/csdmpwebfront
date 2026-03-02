import { CreateUserRequest } from '@/features/users/types/user.types';

export type UUID = string;

export enum EmploymentStatus {
  STATE_PERMANENT = "STATE_PERMANENT",
  STATE_CONTRACTUAL = "STATE_CONTRACTUAL",
  HOSPITAL_CONTRACTUAL = "HOSPITAL_CONTRACTUAL",
  INTERN = "INTERN",
  VACUM_GUEST = "VACUM_GUEST"
}

export enum MedicalSpecialty {
  GENERAL_PRACTITIONER = "GENERAL_PRACTITIONER",
  CARDIOLOGIST = "CARDIOLOGIST",
  PEDIATRICIAN = "PEDIATRICIAN",
  SURGEON = "SURGEON",
  GYNECOLOGIST = "GYNECOLOGIST",
  ORTHOPEDIST = "ORTHOPEDIST",
  RADIOLOGIST = "RADIOLOGIST",
  ANESTHESIOLOGIST = "ANESTHESIOLOGIST",
  NEUROLOGIST = "NEUROLOGIST",
  PSYCHIATRIST = "PSYCHIATRIST",
  OPHTHALMOLOGIST = "OPHTHALMOLOGIST",
  OTOLARYNGOLOGIST = "OTOLARYNGOLOGIST",
  DERMATOLOGIST = "DERMATOLOGIST",
  NURSE = "NURSE",
  MIDWIFE = "MIDWIFE",
  PHYSIOTHERAPIST = "PHYSIOTHERAPIST",
  LABORATORY_TECHNICIAN = "LABORATORY_TECHNICIAN",
  PHARMACIST = "PHARMACIST",
  ADMINISTRATIVE = "ADMINISTRATIVE",
  OTHER = "OTHER"
}

export enum HospitalDepartment {
  EMERGENCY = "EMERGENCY",
  INTERNAL_MEDICINE = "INTERNAL_MEDICINE",
  CARDIOLOGY = "CARDIOLOGY",
  PEDIATRICS = "PEDIATRICS",
  GENERAL_SURGERY = "GENERAL_SURGERY",
  GYNECOLOGY_OBSTETRICS = "GYNECOLOGY_OBSTETRICS",
  ORTHOPEDICS = "ORTHOPEDICS",
  RADIOLOGY = "RADIOLOGY",
  LABORATORY = "LABORATORY",
  PHARMACY = "PHARMACY",
  ANESTHESIOLOGY = "ANESTHESIOLOGY",
  NEUROLOGY = "NEUROLOGY",
  PSYCHIATRY = "PSYCHIATRY",
  OPHTHALMOLOGY = "OPHTHALMOLOGY",
  OTOLARYNGOLOGY = "OTOLARYNGOLOGY",
  DERMATOLOGY = "DERMATOLOGY",
  REHABILITATION = "REHABILITATION",
  INTENSIVE_CARE = "INTENSIVE_CARE",
  ADMINISTRATION = "ADMINISTRATION",
  OTHER = "OTHER"
}

export interface CreateHospitalStaffRequest {
  health_facility_id: UUID;
  matricule: string;
  year_of_exp: number;
  specialty: MedicalSpecialty;
  department_id: UUID;
  user_id?: UUID | null;
  user_data?: CreateUserRequest | null;
  order_number?: string | null;
  employment_status?: EmploymentStatus | null;
  is_active: boolean;
}

export interface UpdateHospitalStaffRequest {
  health_facility_id?: UUID | null;
  user_id?: UUID | null;
  matricule?: string | null;
  year_of_exp?: number | null;
  specialty?: MedicalSpecialty | null;
  department_id?: UUID | null;
  order_number?: string | null;
  employment_status?: EmploymentStatus | null;
}

export interface HospitalStaff {
  id_: string;
  user_given_name: string;
  user_family_name: string;
  user_id: string;
  health_facility_id: string;
  health_facility_name: string;
  matricule: string;
  year_of_exp: number;
  specialty: MedicalSpecialty;
  department_id: string;
  department_name: string;
  order_number?: string | null;
  employment_status?: EmploymentStatus | null;
  is_active: boolean;
  version: number;
  deleted_at?: string | null;
}

export interface HospitalStaffResponse {
  data: HospitalStaff[];
  total: number;
  page: number;
  limit: number;
}

export interface HospitalStaffQueryParams {
  health_facility_id?: UUID | null;
  search?: string | null;
  specialty?: MedicalSpecialty | null;
  department_id?: UUID | null;
  order_number?: string | null;
  employment_status?: EmploymentStatus | null;
  limit?: number;
  offset?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}
