export interface Appointment {
  id: string;
  patient_id: string;
  patient_full_name?: string | null;
  doctor_id: string | null;
  doctor_full_name?: string | null;
  scheduled_at: string;
  estimated_duration?: number | null;
  reason?: string | null;
  status: AppointmentStatus;
  is_confirmed_by_patient: boolean;
  is_active: boolean;
  deleted_at?: string | null;
}

export type AppointmentStatus = "no_show" | "cancelled" | "confirmed" | "completed" | "scheduled" | "rescheduled";
export type AppointmentStatusUpdate = "confirm" | "cancel" | "complete";

export interface CreateAppointmentRequest {
  patient_id: string;
  doctor_id: string | null;
  scheduled_at: string;
  estimated_duration?: number | null;
  reason?: string | null;
  status?: string;
  is_confirmed_by_patient?: boolean;
  is_active?: boolean;
}

export interface CreateAppointmentResponse {
  id: string;
  patient_id: string;
  patient_full_name?: string | null;
  doctor_id: string | null;
  doctor_full_name?: string | null;
  scheduled_at: string;
  estimated_duration?: number | null;
  reason?: string | null;
  status: AppointmentStatus;
  is_confirmed_by_patient: boolean;
  is_active: boolean;
  deleted_at?: string | null;
}

export interface UpdateAppointmentRequest {
  patient_id?: string;
  doctor_id?: string | null;
  scheduled_at?: string;
  estimated_duration?: number | null;
  reason?: string | null;
  status?: AppointmentStatus;
  is_confirmed_by_patient?: boolean;
  is_active?: boolean;
}

export interface ListAppointmentQueryParams {
  search?: string;
  patient_id?: string;
  doctor_id?: string;
  status?: AppointmentStatus;
  scheduled_at?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
  sort_by?: 'scheduled_at' | 'status' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface ListAppointmentQM {
  data: Appointment[];
  total: number;
}
