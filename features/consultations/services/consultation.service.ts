import {
  Consultation,
  ConsultationQM,
  CreateConsultationRequest,
  UpdateConsultationRequest,
  CompleteConsultationRequest,
  ListConsultationsQM,
  ConsultationQueryParams,
  ConsultationStatus
} from '../types/consultations.types';
import { AuthClientService } from '@/features/core/auth/services/auth-client.service';

const API_BASE = '/api/v1';

export class ConsultationService {
  static async getConsultations(
    params?: ConsultationQueryParams
  ): Promise<ListConsultationsQM> {
    console.log('Fetching consultations with params:', params);

    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `${API_BASE}/consultations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await AuthClientService.makeAuthenticatedRequest(endpoint, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch consultations');
    }

    return response.json();
  }

  static async getConsultationById(
    id: string
  ): Promise<Consultation> {
    console.log('Fetching consultation by ID:', id);
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/consultations/${id}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch consultation');
    }

    return response.json();
  }

  static async createConsultation(
    data: CreateConsultationRequest
  ): Promise<Consultation> {
    console.log('Creating consultation:', data);
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/consultations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create consultation');
    }

    return response.json();
  }

  static async updateConsultation(
    id: string,
    data: UpdateConsultationRequest
  ): Promise<Consultation> {
    console.log('Updating consultation:', id, data);
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/consultations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update consultation');
    }

    return response.json();
  }

  static async completeConsultation(
    id: string,
    data: CompleteConsultationRequest
  ): Promise<Consultation> {
    console.log('Completing consultation:', id, data);
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/consultations/${id}/complete`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to complete consultation');
    }

    return response.json();
  }

  static async deleteConsultation(
    id: string
  ): Promise<void> {
    console.log('Soft deleting consultation:', id);
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/consultations/${id}/soft-delete`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to soft delete consultation');
    }
  }

  static async restoreConsultation(
    id: string
  ): Promise<Consultation> {
    console.log('Restoring consultation:', id);
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/consultations/${id}/restore`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error('Failed to restore consultation');
    }

    return response.json();
  }

  static async permanentlyDeleteConsultation(
    id: string
  ): Promise<void> {
    console.log('Permanently deleting consultation:', id);
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/consultations/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to permanently delete consultation');
    }
  }

  static async toggleConsultationStatus(
    id: string
  ): Promise<Consultation> {
    console.log('Toggling consultation status:', id);
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/consultations/${id}/toggle-status`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error('Failed to toggle consultation status');
    }

    return response.json();
  }
}
