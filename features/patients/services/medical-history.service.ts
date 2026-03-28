import { PatientMedicalHistory, CreateMedicalHistoryRequest, UpdateMedicalHistoryRequest, PatientMedicalHistoryResponse } from '../types/medical-history.types';
import { AuthClientService } from '@/features/core/auth/services/auth-client.service';

// Utiliser le proxy Next.js pour que les cookies soient correctement envoyés
const API_BASE = '/api/v1';

export interface MedicalHistoryQueryParams {
  patient_id: string;
  limit?: number;
  offset?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export class MedicalHistoryService {
  static async getPatientMedicalHistory(params: MedicalHistoryQueryParams): Promise<PatientMedicalHistoryResponse> {
    const queryParams = new URLSearchParams();

    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);

    const url = `${API_BASE}/patients/${params.patient_id}/medical-histories?${queryParams.toString()}`;

    const response = await AuthClientService.makeAuthenticatedRequest(url, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch medical history: ${response.statusText}`);
    }

    return response.json();
  }

  static async getMedicalHistoryById(id: string): Promise<PatientMedicalHistory> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/medical-histories/${id}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch medical history: ${response.statusText}`);
    }

    return response.json();
  }

  static async createMedicalHistory(medicalHistoryData: CreateMedicalHistoryRequest, patientId: string): Promise<PatientMedicalHistory> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/patients/${patientId}/medical-histories`, {
      method: 'POST',
      body: JSON.stringify(medicalHistoryData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create medical history: ${response.statusText}`);
    }

    return response.json();
  }

  static async updateMedicalHistory(id: string, medicalHistoryData: UpdateMedicalHistoryRequest): Promise<PatientMedicalHistory> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/medical-histories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(medicalHistoryData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update medical history: ${response.statusText}`);
    }

    return response.json();
  }

  static async deleteMedicalHistory(id: string): Promise<void> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/medical-histories/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete medical history: ${response.statusText}`);
    }
  }
}
