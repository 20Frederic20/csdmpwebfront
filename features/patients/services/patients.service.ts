import { PatientsResponse, PatientsQueryParams, Patient } from '../types/patients.types';
import { handleFetchError, createServiceErrorHandler } from '@/lib/error-handler';

const API_BASE = process.env.NODE_ENV === 'development' 
  ? '/api/v1'  // Utilise le proxy Next.js en développement
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1');

// Helper pour obtenir le token d'authentification côté client
function getAuthToken(): string | null {
  // Note: Les cookies HttpOnly ne sont pas accessibles côté client
  // Nous devons soit passer le token en paramètre, soit utiliser un autre moyen
  // Pour l'instant, nous allons chercher dans localStorage (moins sécurisé)
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token') || null;
  }
  return null;
}

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

    const url = `${API_BASE}/patients${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
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
      await this.errorHandler(response, 'accéder');
    }

    return response.json();
  }

  static async getPatientById(id: string, token?: string): Promise<Patient> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/patients/${id}`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      await this.errorHandler(response, 'accéder à ce patient');
    }

    return response.json();
  }

  static async createPatient(patientData: Omit<Patient, 'id_' | 'owner_id' | 'is_active'>, token?: string): Promise<Patient> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/patients`, {
      method: 'POST',
      headers,
      body: JSON.stringify(patientData),
    });

    if (!response.ok) {
      await this.errorHandler(response, 'créer');
    }

    return response.json();
  }

  static async updatePatient(id: string, patientData: Partial<Patient>, token?: string): Promise<Patient> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/patients/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(patientData),
    });

    if (!response.ok) {
      await this.errorHandler(response, 'modifier');
    }

    return response.json();
  }

  static async deletePatient(id: string, token?: string): Promise<void> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {};
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/patients/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      await this.errorHandler(response, 'supprimer');
    }
  }

  static async togglePatientActivation(id: string, token?: string): Promise<Patient> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/patients/${id}/toggle-activation`, {
      method: 'PATCH',
      headers,
    });

    if (!response.ok) {
      await this.errorHandler(response, 'modifier l\'activation');
    }

    return response.json();
  }
}
