import { 
  Consultation, 
  CreateConsultationRequest, 
  UpdateConsultationRequest, 
  ListConsultationsQueryParams, 
  ListConsultationsResponse 
} from '../types/consultation.types';

export class ConsultationService {
  private static readonly BASE_URL = process.env.NODE_ENV === 'development'
    ? ''
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');
  private static readonly API_URL = `${this.BASE_URL}/api/v1`;

  private static getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  // Récupérer toutes les consultations
  static async getConsultations(
    params?: ListConsultationsQueryParams,
    token?: string
  ): Promise<ListConsultationsResponse> {
    const authToken = token || this.getAuthToken();
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(`${this.API_URL}/consultations?${queryParams.toString()}`, {
      headers: {
        'Authorization': authToken ? `Bearer ${authToken}` : '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch consultations: ${response.statusText}`);
    }

    return response.json();
  }

  // Récupérer une consultation par ID
  static async getConsultationById(
    id: string,
    token?: string
  ): Promise<Consultation> {
    const authToken = token || this.getAuthToken();
    
    const response = await fetch(`${this.API_URL}/consultations/${id}`, {
      headers: {
        'Authorization': authToken ? `Bearer ${authToken}` : '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch consultation: ${response.statusText}`);
    }

    return response.json();
  }

  // Créer une consultation
  static async createConsultation(
    data: CreateConsultationRequest,
    token?: string
  ): Promise<Consultation> {
    const authToken = token || this.getAuthToken();
    
    const response = await fetch(`${this.API_URL}/consultations`, {
      method: 'POST',
      headers: {
        'Authorization': authToken ? `Bearer ${authToken}` : '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create consultation: ${response.statusText}`);
    }

    return response.json();
  }

  // Mettre à jour une consultation
  static async updateConsultation(
    id: string,
    data: UpdateConsultationRequest,
    token?: string
  ): Promise<Consultation> {
    const authToken = token || this.getAuthToken();
    
    const response = await fetch(`${this.API_URL}/consultations/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': authToken ? `Bearer ${authToken}` : '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update consultation: ${response.statusText}`);
    }

    return response.json();
  }

  // Supprimer une consultation
  static async deleteConsultation(
    id: string,
    token?: string
  ): Promise<void> {
    const authToken = token || this.getAuthToken();
    
    const response = await fetch(`${this.API_URL}/consultations/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authToken ? `Bearer ${authToken}` : '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete consultation: ${response.statusText}`);
    }
  }

  // Toggle statut de consultation
  static async toggleConsultationStatus(
    id: string,
    token?: string
  ): Promise<Consultation> {
    const authToken = token || this.getAuthToken();
    
    const response = await fetch(`${this.API_URL}/consultations/${id}/toggle-status`, {
      method: 'POST',
      headers: {
        'Authorization': authToken ? `Bearer ${authToken}` : '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to toggle consultation status: ${response.statusText}`);
    }

    return response.json();
  }
}
