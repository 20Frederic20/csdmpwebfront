import { PatientAllergy } from './allergies.types';
import { PatientLifestyle } from './lifestyle.types';
import { PatientMedicalHistory } from './medical-history.types';
import { PatientFamilyHistory } from './family-history.types';

export type { PatientAllergy };

export interface PatientResponse {
  id_: string;
  given_name: string;
  family_name: string;
  gender: string;
  birth_date: string;
  location: string;
  is_main: boolean;
  owner_id: string;
  is_active: boolean;
  health_id?: string;
  birth_place?: string;
  residence_city?: string;
  neighborhood?: string;
  phone_number?: string;
  npi_number?: string;
  blood_group?: string;
  father_full_name?: string;
  mother_full_name?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  patient_allergies?: PatientAllergy[];
  medical_histories?: PatientMedicalHistory[];
  family_histories?: PatientFamilyHistory[];
  lifestyles?: PatientLifestyle[];
}
