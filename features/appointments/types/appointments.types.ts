export enum AppointmentStatus {
  SCHEDULED = "SCHEDULED",
  CONFIRMED = "CONFIRMED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
  RESCHEDULED = "RESCHEDULED",
}

export enum AppointmentType {
  ROUTINE_CONSULTATION = "ROUTINE_CONSULTATION",
  EMERGENCY_CONSULTATION = "EMERGENCY_CONSULTATION",
  FOLLOW_UP = "FOLLOW_UP",
  SPECIALIST_CONSULTATION = "SPECIALIST_CONSULTATION",
  SURGERY = "SURGERY",
  IMAGING = "IMAGING",
  LABORATORY = "LABORATORY",
  VACCINATION = "VACCINATION",
  PREVENTIVE_CARE = "PREVENTIVE_CARE",
}

export enum PaymentMethod {
  FREE_OF_CHARGE = "FREE_OF_CHARGE",
  INSURANCE = "INSURANCE",
  CASH = "CASH",
  CREDIT_CARD = "CREDIT_CARD",
  MOBILE_MONEY = "MOBILE_MONEY",
  BANK_TRANSFER = "BANK_TRANSFER",
}

export interface CreateAppointmentRequest {
  patient_id: string;
  health_facility_id: string;
  department_id: string;
  insurance_company_id?: string | null;
  appointment_type?: AppointmentType;
  payment_method?: PaymentMethod;
  doctor_id?: string | null;
  scheduled_at: string;
  estimated_duration?: number | null; // en minutes
  reason?: string | null;
  status?: AppointmentStatus;
  is_confirmed_by_patient?: boolean;
  is_active?: boolean;
}

export interface AppointmentResponse {
  id: string;
  patient_id: string;
  doctor_id?: string | null;
  scheduled_at: string;
  estimated_duration?: number | null; // en minutes
  reason?: string | null;
  status: AppointmentStatus;
  appointment_type?: AppointmentType | null;
  payment_method?: PaymentMethod | null;
  health_facility_id?: string | null;
  department_id?: string | null;
  insurance_company_id?: string | null;
  is_confirmed_by_patient: boolean;
  is_active: boolean;
  deleted_at?: string | null;
}

export interface AppointmentQM {
  id: string;
  patient_id: string;
  doctor_id?: string | null;
  patient_full_name?: string | null;
  doctor_full_name?: string | null;
  scheduled_at: string;
  estimated_duration?: number | null; // en minutes
  reason?: string | null;
  insurance_company_id?: string | null;
  insurance_company_name?: string | null;
  department_id?: string | null;
  department_name?: string | null;
  health_facility_id?: string | null;
  health_facility_name?: string | null;
  appointment_type?: AppointmentType | null;
  payment_method?: PaymentMethod | null;
  status: AppointmentStatus;
  is_confirmed_by_patient: boolean;
  is_active: boolean;
  deleted_at?: string | null;
}

export interface ListAppointmentsQM {
  data: AppointmentQM[];
  total: number;
}

export interface UpdateAppointmentRequest {
  doctor_id?: string | null;
  scheduled_at?: string | null;
  estimated_duration?: number | null; // en minutes
  reason?: string | null;
  insurance_company_id?: string | null;
  department_id?: string | null;
  health_facility_id?: string | null;
  appointment_type?: AppointmentType | null;
  payment_method?: PaymentMethod | null;
  status?: AppointmentStatus | null;
  is_confirmed_by_patient?: boolean | null;
  is_active?: boolean | null;
}

export interface Appointment {
  id_: string;
  patient_id: string;
  doctor_id?: string | null;
  patient_full_name?: string | null;
  doctor_full_name?: string | null;
  scheduled_at: string;
  estimated_duration?: number | null; // en minutes
  reason?: string | null;
  insurance_company_id?: string | null;
  insurance_company_name?: string | null;
  department_id?: string | null;
  department_name?: string | null;
  health_facility_id?: string | null;
  health_facility_name?: string | null;
  appointment_type?: AppointmentType | null;
  payment_method?: PaymentMethod | null;
  status: AppointmentStatus;
  is_confirmed_by_patient: boolean;
  is_active: boolean;
  deleted_at?: string | null;
}

export interface AppointmentFilterParams {
  search?: string | null;
  patient_id?: string | null;
  doctor_id?: string | null;
  health_facility_id?: string | null;
  department_id?: string | null;
  appointment_type?: AppointmentType | null;
  payment_method?: PaymentMethod | null;
  status?: AppointmentStatus | null;
  is_confirmed_by_patient?: boolean | null;
  is_active?: boolean | null;
  scheduled_from?: string | null;
  scheduled_to?: string | null;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface ListAppointmentsResponse {
  data: Appointment[];
  total: number;
  limit: number;
  offset: number;
}
