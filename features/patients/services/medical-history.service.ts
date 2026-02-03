import { PatientMedicalHistory, CreateMedicalHistoryRequest, UpdateMedicalHistoryRequest, PatientMedicalHistoryResponse } from '../types/medical-history.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

export interface MedicalHistoryQueryParams {
  patient_id: string;
  limit?: number;
  offset?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export class MedicalHistoryService {
  static async getPatientMedicalHistory(params: MedicalHistoryQueryParams, token?: string): Promise<PatientMedicalHistoryResponse> {
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
    
    const url = `${API_BASE}/patients/${params.patient_id}/medical-histories?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch medical history: ${response.statusText}`);
    }

    return response.json();
  }

  static async getMedicalHistoryById(id: string, token?: string): Promise<PatientMedicalHistory> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/medical-histories/${id}`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch medical history: ${response.statusText}`);
    }

    return response.json();
  }

  static async createMedicalHistory(medicalHistoryData: CreateMedicalHistoryRequest, patientId: string, token?: string): Promise<PatientMedicalHistory> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/patients/${patientId}/medical-histories`, {
      method: 'POST',
      headers,
      body: JSON.stringify(medicalHistoryData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create medical history: ${response.statusText}`);
    }

    return response.json();
  }

  static async updateMedicalHistory(id: string, medicalHistoryData: UpdateMedicalHistoryRequest, token?: string): Promise<PatientMedicalHistory> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/medical-histories/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(medicalHistoryData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update medical history: ${response.statusText}`);
    }

    return response.json();
  }

  static async deleteMedicalHistory(id: string, token?: string): Promise<void> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/medical-histories/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete medical history: ${response.statusText}`);
    }
  }
}
