import { 
  CreateAppointmentRequest, 
  CreateAppointmentResponse, 
  ListAppointmentsResponse, 
  ListAppointmentsQueryParams,
  Appointment 
} from '../types/appointments.types';

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

class AppointmentsService {
  async createAppointment(data: CreateAppointmentRequest, token?: string): Promise<CreateAppointmentResponse> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(errorText || 'Failed to create appointment');
    }

    const responseText = await response.text();
    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError, 'Response:', responseText);
      throw new Error('Invalid JSON response from server');
    }
  }

  async getAppointments(params: ListAppointmentsQueryParams = {}, token?: string): Promise<ListAppointmentsResponse> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const searchParams = new URLSearchParams();
    
    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    
    const url = `${API_BASE}/appointments${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    const response = await fetch(url, { 
      method: 'GET',
      headers,
      cache: 'no-store',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(errorText || 'Failed to fetch appointments');
    }

    const responseText = await response.text();
    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError, 'Response:', responseText);
      throw new Error('Invalid JSON response from server');
    }
  }

  async getAppointment(id: string, token?: string): Promise<Appointment> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/appointments/${id}`, { 
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(errorText || 'Failed to fetch appointment');
    }

    const responseText = await response.text();
    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError, 'Response:', responseText);
      throw new Error('Invalid JSON response from server');
    }
  }

  async updateAppointment(id: string, appointmentData: Partial<CreateAppointmentRequest>, token?: string): Promise<Appointment> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/appointments/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(errorText || 'Failed to update appointment');
    }

    const responseText = await response.text();
    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError, 'Response:', responseText);
      throw new Error('Invalid JSON response from server');
    }
  }

  async deleteAppointment(id: string, token?: string): Promise<void> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {};
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/appointments/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(errorText || 'Failed to delete appointment');
    }
  }

  async toggleAppointmentStatus(id: string, token?: string): Promise<Appointment> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/appointments/${id}/toggle-status`, {
      method: 'PATCH',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(errorText || 'Failed to toggle appointment status');
    }

    const responseText = await response.text();
    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError, 'Response:', responseText);
      throw new Error('Invalid JSON response from server');
    }
  }
}

export const appointmentsService = new AppointmentsService();
