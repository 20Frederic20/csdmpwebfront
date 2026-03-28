import { PatientAllergy, PatientAllergiesResponse, CreateAllergyRequest, UpdateAllergyRequest, AllergiesQueryParams } from '../types/allergies.types';
import { AuthClientService } from '@/features/core/auth/services/auth-client.service';

// Utiliser le proxy Next.js pour que les cookies soient correctement envoyés
const API_BASE = '/api/v1';

export class AllergiesService {
  static async getPatientAllergies(params: AllergiesQueryParams): Promise<PatientAllergiesResponse> {
    const searchParams = new URLSearchParams();

    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.offset) searchParams.append('offset', params.offset.toString());
    if (params.sorting_field) searchParams.append('sorting_field', params.sorting_field);
    if (params.sorting_order) searchParams.append('sorting_order', params.sorting_order);
    if (params.search) searchParams.append('search', params.search);

    const url = `${API_BASE}/patients/${params.patient_id}/allergies${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

    const response = await AuthClientService.makeAuthenticatedRequest(url, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch allergies: ${response.statusText}`);
    }

    return response.json();
  }

  static async getAllergyById(id: string): Promise<PatientAllergy> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/allergies/${id}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch allergy: ${response.statusText}`);
    }

    return response.json();
  }

  static async createAllergy(allergyData: CreateAllergyRequest, patientId: string): Promise<PatientAllergy> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/patients/${patientId}/allergies`, {
      method: 'POST',
      body: JSON.stringify(allergyData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create allergy: ${response.statusText}`);
    }

    return response.json();
  }

  static async updateAllergy(id: string, allergyData: UpdateAllergyRequest): Promise<PatientAllergy> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/allergies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(allergyData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update allergy: ${response.statusText}`);
    }

    return response.json();
  }

  static async deleteAllergy(id: string): Promise<void> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/allergies/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete allergy: ${response.statusText}`);
    }
  }
}
