import { PatientLifestyle, CreateLifestyleRequest, UpdateLifestyleRequest, PatientLifestyleResponse } from '../types/lifestyle.types';
import { AuthClientService } from '@/features/core/auth/services/auth-client.service';

// Utiliser le proxy Next.js pour que les cookies soient correctement envoyés
const API_BASE = '/api/v1';

export interface LifestyleQueryParams {
  patient_id: string;
  limit?: number;
  offset?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export class LifestyleService {
  static async getPatientLifestyle(params: LifestyleQueryParams): Promise<PatientLifestyleResponse> {
    const queryParams = new URLSearchParams();

    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);

    const url = `${API_BASE}/patients/${params.patient_id}/lifestyles?${queryParams.toString()}`;

    const response = await AuthClientService.makeAuthenticatedRequest(url, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch lifestyle: ${response.statusText}`);
    }

    return response.json();
  }

  static async getLifestyleById(id: string): Promise<PatientLifestyle> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/lifestyles/${id}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch lifestyle: ${response.statusText}`);
    }

    return response.json();
  }

  static async createLifestyle(lifestyleData: CreateLifestyleRequest, patientId: string): Promise<PatientLifestyle> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/patients/${patientId}/lifestyles`, {
      method: 'POST',
      body: JSON.stringify(lifestyleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create lifestyle: ${response.statusText}`);
    }

    return response.json();
  }

  static async updateLifestyle(id: string, lifestyleData: UpdateLifestyleRequest): Promise<PatientLifestyle> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/lifestyles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(lifestyleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update lifestyle: ${response.statusText}`);
    }

    return response.json();
  }

  static async deleteLifestyle(id: string): Promise<void> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/lifestyles/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete lifestyle: ${response.statusText}`);
    }
  }
}
