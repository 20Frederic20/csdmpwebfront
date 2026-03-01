import { 
  Appointment, 
  AppointmentQM,
  CreateAppointmentRequest, 
  UpdateAppointmentRequest,
  AppointmentFilterParams,
  ListAppointmentsResponse,
  AppointmentStatus,
  AppointmentType,
  PaymentMethod
} from '../types/appointments.types';
import { FetchService } from '@/features/core/services/fetch.service';

export class AppointmentService {
  
  static async getAppointments(params?: AppointmentFilterParams): Promise<ListAppointmentsResponse> {
    console.log('Fetching appointments with params:', params);
    
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `appointments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return FetchService.get<ListAppointmentsResponse>(endpoint, 'Appointments');
  }

  static async getAppointmentById(id: string): Promise<Appointment> {
    console.log('Fetching appointment by ID:', id);
    return FetchService.get<Appointment>(`appointments/${id}`, 'Appointment');
  }

  static async createAppointment(data: CreateAppointmentRequest): Promise<Appointment> {
    console.log('Creating appointment:', data);
    return FetchService.post<Appointment>('appointments', data, 'Appointment');
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

  static async updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    console.log('Updating appointment status:', id, status);
    return FetchService.patch<Appointment>(`appointments/${id}/status`, { status }, 'Appointment');
  }

  // Helper methods
  static async getAppointmentsByPatientId(patientId: string, params?: Omit<AppointmentFilterParams, 'patient_id'>): Promise<ListAppointmentsResponse> {
    return this.getAppointments({ ...params, patient_id: patientId });
  }

  static async getAppointmentsByDoctorId(doctorId: string, params?: Omit<AppointmentFilterParams, 'doctor_id'>): Promise<ListAppointmentsResponse> {
    return this.getAppointments({ ...params, doctor_id: doctorId });
  }

  static async getAppointmentsByHealthFacilityId(healthFacilityId: string, params?: Omit<AppointmentFilterParams, 'health_facility_id'>): Promise<ListAppointmentsResponse> {
    return this.getAppointments({ ...params, health_facility_id: healthFacilityId });
  }

  static async getAppointmentsByDepartmentId(departmentId: string, params?: Omit<AppointmentFilterParams, 'department_id'>): Promise<ListAppointmentsResponse> {
    return this.getAppointments({ ...params, department_id: departmentId });
  }

  static async getUpcomingAppointments(params?: Omit<AppointmentFilterParams, 'status'>): Promise<ListAppointmentsResponse> {
    return this.getAppointments({ 
      ...params, 
      status: AppointmentStatus.SCHEDULED,
      sort_by: 'scheduled_at',
      sort_order: 'asc'
    });
  }

  static async getTodayAppointments(params?: AppointmentFilterParams): Promise<ListAppointmentsResponse> {
    const today = new Date().toISOString().split('T')[0];
    return this.getAppointments({ 
      ...params, 
      scheduled_from: today,
      scheduled_to: today
    });
  }
}
