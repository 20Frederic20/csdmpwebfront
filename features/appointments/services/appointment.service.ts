import { 
  Appointment, 
  AppointmentStatusUpdate,
  CreateAppointmentRequest, 
  CreateAppointmentResponse,
  UpdateAppointmentRequest,
  ListAppointmentQueryParams, 
  ListAppointmentQM 
} from '../types/appointment.types';
import { FetchService } from '@/features/core/services/fetch.service';

export class AppointmentService {
  
  static async getAppointments(params?: ListAppointmentQueryParams): Promise<ListAppointmentQM> {
    const queryParams = new URLSearchParams();
    
    if (params?.search) queryParams.append('search', params.search);
    if (params?.patient_id) queryParams.append('patient_id', params.patient_id);
    if (params?.doctor_id) queryParams.append('doctor_id', params.doctor_id);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.scheduled_at) queryParams.append('scheduled_at', params.scheduled_at);
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);

    const endpoint = `appointments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    console.log('Fetching appointments from:', endpoint);
    
    return FetchService.get<ListAppointmentQM>(endpoint, 'Appointments');
  }

  static async getAppointmentById(id: string): Promise<Appointment> {
    console.log('Fetching appointment by ID:', id);
    return FetchService.get<Appointment>(`appointments/${id}`, 'Appointment');
  }

  static async createAppointment(data: CreateAppointmentRequest): Promise<CreateAppointmentResponse> {
    console.log('Creating appointment:', data);
    return FetchService.post<CreateAppointmentResponse>('appointments', data, 'Appointment');
  }

  static async updateAppointment(id: string, data: UpdateAppointmentRequest): Promise<Appointment> {
    console.log('Updating appointment:', id, data);
    return FetchService.put<Appointment>(`appointments/${id}`, data, 'Appointment');
  }

  static async deleteAppointment(id: string): Promise<void> {
    console.log('Soft deleting appointment:', id);
    return FetchService.delete<void>(`appointments/${id}/soft-delete`, 'Appointment');
  }

  static async permanentlyDeleteAppointment(id: string): Promise<void> {
    console.log('Permanently deleting appointment:', id);
    return FetchService.delete<void>(`appointments/${id}`, 'Appointment');
  }

  static async restoreAppointment(id: string): Promise<Appointment> {
    console.log('Restoring appointment:', id);
    return FetchService.patch<Appointment>(`appointments/${id}/restore`, {}, 'Appointment');
  }

  static async updateAppointmentStatus(id: string, status: AppointmentStatusUpdate): Promise<Appointment> {
    console.log('Updating appointment status:', id, status);
    return FetchService.patch<Appointment>(`appointments/${id}/${status}`, {}, 'Appointment');
  }

  // Helper methods
  static async getAppointmentsByPatientId(patientId: string, params?: Omit<ListAppointmentQueryParams, 'patient_id'>): Promise<ListAppointmentQM> {
    return this.getAppointments({ ...params, patient_id: patientId });
  }

  static async getAppointmentsByDoctorId(doctorId: string, params?: Omit<ListAppointmentQueryParams, 'doctor_id'>): Promise<ListAppointmentQM> {
    return this.getAppointments({ ...params, doctor_id: doctorId });
  }

  static async getAppointmentsByDate(date: string, params?: Omit<ListAppointmentQueryParams, 'scheduled_at'>): Promise<ListAppointmentQM> {
    return this.getAppointments({ ...params, scheduled_at: date });
  }

  static async getUpcomingAppointments(params?: Omit<ListAppointmentQueryParams, 'status'>): Promise<ListAppointmentQM> {
    return this.getAppointments({ 
      ...params, 
      status: 'scheduled',
      sort_by: 'scheduled_at',
      sort_order: 'asc'
    });
  }

  static async getTodayAppointments(params?: Omit<ListAppointmentQueryParams, 'scheduled_at'>): Promise<ListAppointmentQM> {
    const today = new Date().toISOString().split('T')[0];
    return this.getAppointments({ ...params, scheduled_at: today });
  }
}
