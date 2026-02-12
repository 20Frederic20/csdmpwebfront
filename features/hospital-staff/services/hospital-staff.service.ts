import { 
  HospitalStaff, 
  CreateHospitalStaffRequest, 
  ListHospitalStaffResponse, 
  ListHospitalStaffQueryParams 
} from '../types/hospital-staff.types';

export class HospitalStaffService {
  private static readonly BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  private static getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  static async getHospitalStaff(
    params?: ListHospitalStaffQueryParams, 
    token?: string
  ): Promise<ListHospitalStaffResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.search) queryParams.append('search', params.search);
    if (params?.health_facility_id) queryParams.append('health_facility_id', params.health_facility_id);
    if (params?.specialty) queryParams.append('specialty', params.specialty);
    if (params?.department) queryParams.append('department', params.department);
    if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);

    const url = `${this.BASE_URL}/hospital-staff${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const authToken = token || this.getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });


    if (!response.ok) {
      throw new Error(`Failed to fetch hospital staff: ${response.statusText} (${response.status})`);
    }

    return response.json();
  }

  static async createHospitalStaff(
    staffData: CreateHospitalStaffRequest, 
    token?: string
  ): Promise<HospitalStaff> {
    const authToken = token || this.getAuthToken();
    
    const response = await fetch(`${this.BASE_URL}/hospital-staff`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      },
      body: JSON.stringify(staffData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create hospital staff: ${response.statusText}`);
    }

    return response.json();
  }

  static async updateHospitalStaff(
    id: string, 
    staffData: Partial<CreateHospitalStaffRequest>, 
    token?: string
  ): Promise<HospitalStaff> {
    const authToken = token || this.getAuthToken();
    
    const response = await fetch(`${this.BASE_URL}/hospital-staff/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      },
      body: JSON.stringify(staffData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update hospital staff: ${response.statusText}`);
    }

    return response.json();
  }

  static async deleteHospitalStaff(
    id: string, 
    token?: string
  ): Promise<void> {
    const authToken = token || this.getAuthToken();
    
    const response = await fetch(`${this.BASE_URL}/hospital-staff/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete hospital staff: ${response.statusText}`);
    }
  }

  static async toggleHospitalStaffStatus(
    id: string, 
    token?: string
  ): Promise<HospitalStaff> {
    const authToken = token || this.getAuthToken();
    
    const response = await fetch(`${this.BASE_URL}/hospital-staff/${id}/toggle-status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to toggle hospital staff status: ${response.statusText}`);
    }

    // Vérifier si la réponse est vide
    const text = await response.text();
    if (!text) {
      throw new Error('Le serveur a retourné une réponse vide');
    }
    
    try {
      const parsed = JSON.parse(text);
      console.log('Réponse JSON parsée pour staff:', parsed);
      return parsed;
    } catch (parseError) {
      console.error('Erreur de parsing JSON:', parseError, 'Texte reçu:', text);
      throw new Error('La réponse du serveur n\'est pas au format JSON valide');
    }
  }

  static async getHospitalStaffById(
    id: string, 
    token?: string
  ): Promise<HospitalStaff> {
    const authToken = token || this.getAuthToken();
    
    const response = await fetch(`${this.BASE_URL}/hospital-staff/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch hospital staff: ${response.statusText}`);
    }

    return response.json();
  }
}
