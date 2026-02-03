import { PatientLifestyle, CreateLifestyleRequest, UpdateLifestyleRequest, PatientLifestyleResponse } from '../types/lifestyle.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

export interface LifestyleQueryParams {
  patient_id: string;
  limit?: number;
  offset?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export class LifestyleService {
  static async getPatientLifestyle(params: LifestyleQueryParams, token?: string): Promise<PatientLifestyleResponse> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const queryParams = new URLSearchParams();
    
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    
    if (params.offset) {
      queryParams.append('offset', params.offset.toString());
    }
    
    if (params.sort_by) {
      queryParams.append('sort_by', params.sort_by);
    }
    
    if (params.sort_order) {
      queryParams.append('sort_order', params.sort_order);
    }
    
    const url = `${API_BASE}/patients/${params.patient_id}/lifestyles?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch lifestyle: ${response.statusText}`);
    }

    return response.json();
  }

  static async getLifestyleById(id: string, token?: string): Promise<PatientLifestyle> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/lifestyles/${id}`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch lifestyle: ${response.statusText}`);
    }

    return response.json();
  }

  static async createLifestyle(lifestyleData: CreateLifestyleRequest, patientId: string, token?: string): Promise<PatientLifestyle> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/patients/${patientId}/lifestyles`, {
      method: 'POST',
      headers,
      body: JSON.stringify(lifestyleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create lifestyle: ${response.statusText}`);
    }

    return response.json();
  }

  static async updateLifestyle(id: string, lifestyleData: UpdateLifestyleRequest, token?: string): Promise<PatientLifestyle> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/lifestyles/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(lifestyleData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update lifestyle: ${response.statusText}`);
    }

    return response.json();
  }

  static async deleteLifestyle(id: string, token?: string): Promise<void> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/lifestyles/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete lifestyle: ${response.statusText}`);
    }
  }
}
