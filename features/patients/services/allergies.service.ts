import { PatientAllergy, PatientAllergiesResponse, CreateAllergyRequest, UpdateAllergyRequest, AllergiesQueryParams } from '../types/allergies.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Helper pour obtenir le token d'authentification côté client
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token') || null;
  }
  return null;
}

export class AllergiesService {
  static async getPatientAllergies(params: AllergiesQueryParams, token?: string): Promise<PatientAllergiesResponse> {
    const searchParams = new URLSearchParams();
    
    // Ajouter les paramètres de query (sauf patient_id qui est dans l'URL)
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.offset) searchParams.append('offset', params.offset.toString());
    if (params.sorting_field) searchParams.append('sorting_field', params.sorting_field);
    if (params.sorting_order) searchParams.append('sorting_order', params.sorting_order);
    if (params.search) searchParams.append('search', params.search);

    const url = `${API_BASE}/patients/${params.patient_id}/allergies${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    // Obtenir le token d'authentification (priorité au paramètre passé)
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Ajouter le token s'il existe
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch allergies: ${response.statusText}`);
    }

    return response.json();
  }

  static async getAllergyById(id: string, token?: string): Promise<PatientAllergy> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/allergies/${id}`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch allergy: ${response.statusText}`);
    }

    return response.json();
  }

  static async createAllergy(allergyData: CreateAllergyRequest, patientId: string, token?: string): Promise<PatientAllergy> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/patients/${patientId}/allergies`, {
      method: 'POST',
      headers,
      body: JSON.stringify(allergyData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create allergy: ${response.statusText}`);
    }

    return response.json();
  }

  static async updateAllergy(id: string, allergyData: UpdateAllergyRequest, token?: string): Promise<PatientAllergy> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/allergies/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(allergyData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update allergy: ${response.statusText}`);
    }

    return response.json();
  }

  static async deleteAllergy(id: string, token?: string): Promise<void> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {};
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/allergies/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete allergy: ${response.statusText}`);
    }
  }
}
