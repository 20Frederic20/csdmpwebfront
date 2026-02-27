import { PatientsResponse, PatientsQueryParams, Patient, CreatePatientRequest, UpdatePatientRequest } from '../types/patients.types';
import { handleFetchError, createServiceErrorHandler } from '@/lib/error-handler';
import { AuthClientService } from '@/features/core/auth/services/auth-client.service';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export class PatientService {
  private static errorHandler = createServiceErrorHandler('patients');

  static async getPatients(params: PatientsQueryParams = {}, token?: string): Promise<PatientsResponse> {
    const searchParams = new URLSearchParams();
    
    // Ajouter les paramètres de query
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.offset) searchParams.append('offset', params.offset.toString());
    if (params.sorting_field) searchParams.append('sorting_field', params.sorting_field);
    if (params.sorting_order) searchParams.append('sorting_order', params.sorting_order);
    if (params.search) searchParams.append('search', params.search);
    if (params.birth_date_from) searchParams.append('birth_date_from', params.birth_date_from);
    if (params.genders) searchParams.append('genders', params.genders);

    const url = `${API_BASE}/patients${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    const response = await AuthClientService.makeAuthenticatedRequest(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      await this.errorHandler(response, 'accéder');
    }

    return response.json();
  }

  static async getPatientById(id: string, token?: string): Promise<Patient> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/patients/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      await this.errorHandler(response, 'accéder à ce patient');
    }

    return response.json();
  }

  static async createPatient(patientData: CreatePatientRequest, token?: string): Promise<Patient> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/patients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
    });

    if (!response.ok) {
      await this.errorHandler(response, 'créer');
    }

    return response.json();
  }

  static async updatePatient(id: string, patientData: UpdatePatientRequest, token?: string): Promise<Patient> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/patients/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
    });

    if (!response.ok) {
      await this.errorHandler(response, 'modifier');
    }

    return response.json();
  }

  static async deletePatient(id: string, token?: string): Promise<void> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/patients/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      await this.errorHandler(response, 'supprimer');
    }
  }

  static async softDeletePatient(id: string, token?: string): Promise<void> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/patients/${id}/soft-delete`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      await this.errorHandler(response, 'supprimer');
    }
  }

  static async permanentlyDeletePatient(id: string, token?: string): Promise<void> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/patients/${id}/permanently-delete`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      await this.errorHandler(response, 'supprimer définitivement');
    }
  }

  static async restorePatient(id: string, token?: string): Promise<Patient> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/patients/${id}/restore`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      await this.errorHandler(response, 'restaurer');
    }

    return response.json();
  }

  static async togglePatientActivation(id: string, token?: string): Promise<Patient> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/patients/${id}/toggle-activation`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      await this.errorHandler(response, 'modifier l\'activation');
    }

    return response.json();
  }
}
