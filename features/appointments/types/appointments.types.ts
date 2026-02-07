export interface CreateAppointmentRequest {
  patient_id: string;
  doctor_id: string | null;
  scheduled_at: string;
  estimated_duration: number | null;
  reason: string | null;
  status: string;
  is_confirmed_by_patient: boolean;
  is_active: boolean;
}

export interface CreateAppointmentResponse {
  id: string;
  patient_id: string;
  doctor_id: string | null;
  last_modified_by_id: string | null;
  scheduled_at: string;
  estimated_duration: number | null;
  reason: string | null;
  status: string;
  is_confirmed_by_patient: boolean;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string | null;
  last_modified_by_id: string | null;
  scheduled_at: string;
  estimated_duration: number | null;
  reason: string | null;
  status: string;
  is_confirmed_by_patient: boolean;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface ListAppointmentsResponse {
  data: Appointment[];
  total: number;
}

export interface ListAppointmentsQueryParams {
  page?: number;
  items_per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  search?: string;
  status?: string;
  patient_id?: string;
  doctor_id?: string;
  date_from?: string;
  date_to?: string;
}
