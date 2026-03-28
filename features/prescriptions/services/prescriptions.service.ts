import { UUID } from "@/features/hospital-staff/types/hospital-staff.types";
import {
  CreatePrescriptionRequest,
  CreatePrescriptionResponse,
  PrescriptionFilterParams,
  PrescriptionsResponse
} from '../types/prescriptions.types';
import { AuthClientService } from '@/features/core/auth/services/auth-client.service';

// Utiliser le proxy Next.js pour que les cookies soient correctement envoyés
const API_BASE = '/api/v1';

export class PrescriptionService {
  static async createPrescription(
    data: CreatePrescriptionRequest
  ): Promise<CreatePrescriptionResponse> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/prescriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create prescription');
    }

    return response.json();
  }

  static async getPrescriptions(
    params: PrescriptionFilterParams = {}
  ): Promise<PrescriptionsResponse> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `${API_BASE}/prescriptions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await AuthClientService.makeAuthenticatedRequest(endpoint, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch prescriptions');
    }

    return response.json();
  }

  static async updatePrescription(
    id: UUID,
    data: Partial<CreatePrescriptionRequest>
  ): Promise<CreatePrescriptionResponse> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/prescriptions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update prescription');
    }

    return response.json();
  }

  static async deletePrescription(
    id: UUID
  ): Promise<void> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/prescriptions/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete prescription');
    }
  }

  static async togglePrescriptionStatus(
    id: UUID
  ): Promise<CreatePrescriptionResponse> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/prescriptions/${id}/toggle-status`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error('Failed to toggle prescription status');
    }

    return response.json();
  }
}
