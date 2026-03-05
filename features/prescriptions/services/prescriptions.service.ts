import { 
  CreatePrescriptionRequest, 
  CreatePrescriptionResponse, 
  PrescriptionFilterParams, 
  PrescriptionsResponse 
} from '../types/prescriptions.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export class PrescriptionService {
  static async createPrescription(
    data: CreatePrescriptionRequest,
    token?: string
  ): Promise<CreatePrescriptionResponse> {
    const response = await fetch(`${API_BASE}/prescriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create prescription');
    }

    return response.json();
  }

  static async getPrescriptions(
    params: PrescriptionFilterParams = {},
    token?: string
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
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch prescriptions');
    }

    return response.json();
  }

  static async updatePrescription(
    id: UUID,
    data: Partial<CreatePrescriptionRequest>,
    token?: string
  ): Promise<CreatePrescriptionResponse> {
    const response = await fetch(`${API_BASE}/prescriptions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update prescription');
    }

    return response.json();
  }

  static async deletePrescription(
    id: UUID,
    token?: string
  ): Promise<void> {
    const response = await fetch(`${API_BASE}/prescriptions/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete prescription');
    }
  }

  static async togglePrescriptionStatus(
    id: UUID,
    token?: string
  ): Promise<CreatePrescriptionResponse> {
    const response = await fetch(`${API_BASE}/prescriptions/${id}/toggle-status`, {
      method: 'PATCH',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to toggle prescription status');
    }

    return response.json();
  }
}
