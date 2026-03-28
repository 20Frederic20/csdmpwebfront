import {
  Appointment,
  AppointmentQM,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  AppointmentFilterParams,
  ListAppointmentsResponse,
  AppointmentStatus,
  AppointmentType
} from '../types/appointments.types';
import { AuthClientService } from '@/features/core/auth/services/auth-client.service';

const API_BASE = '/api/v1';

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

    const endpoint = `${API_BASE}/appointments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await AuthClientService.makeAuthenticatedRequest(endpoint, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }

    return response.json();
  }

  static async getAppointmentById(id: string): Promise<Appointment> {
    console.log('Fetching appointment by ID:', id);
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/appointments/${id}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch appointment');
    }

    return response.json();
  }

  static async createAppointment(data: CreateAppointmentRequest): Promise<Appointment> {
    console.log('Creating appointment:', data);
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create appointment');
    }

    return response.json();
  }

  static async updateAppointment(id: string, data: UpdateAppointmentRequest): Promise<Appointment> {
    console.log('Updating appointment:', id, data);
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/appointments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update appointment');
    }

    return response.json();
  }

  static async deleteAppointment(id: string): Promise<void> {
    console.log('Soft deleting appointment:', id);
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/appointments/${id}/soft-delete`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to soft delete appointment');
    }
  }

  static async permanentlyDeleteAppointment(id: string): Promise<void> {
    console.log('Permanently deleting appointment:', id);
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/appointments/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to permanently delete appointment');
    }
  }

  static async restoreAppointment(id: string): Promise<Appointment> {
    console.log('Restoring appointment:', id);
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/appointments/${id}/restore`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error('Failed to restore appointment');
    }

    return response.json();
  }

  static async updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    console.log('Updating appointment status:', id, status);
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/appointments/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update appointment status');
    }

    return response.json();
  }

  static async confirmAppointmentByPatient(id: string): Promise<Appointment> {
    console.log('Confirming appointment by patient:', id);
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/appointments/${id}/confirm`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error('Failed to confirm appointment by patient');
    }

    return response.json();
  }

  static async confirmAppointment(id: string): Promise<Appointment> {
    console.log('Confirming appointment:', id);
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/appointments/${id}/confirm`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error('Failed to confirm appointment');
    }

    return response.json();
  }

  static async cancelAppointment(id: string): Promise<Appointment> {
    console.log('Cancelling appointment:', id);
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/appointments/${id}/cancel`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error('Failed to cancel appointment');
    }

    return response.json();
  }

  static async completeAppointment(id: string): Promise<Appointment> {
    console.log('Completing appointment:', id);
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/appointments/${id}/complete`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error('Failed to complete appointment');
    }

    return response.json();
  }

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
