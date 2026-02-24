import { 
  HospitalStaff, 
  CreateHospitalStaffRequest, 
  UpdateHospitalStaffRequest, 
  HospitalStaffResponse, 
  HospitalStaffQueryParams 
} from '../types/hospital-staff.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

export class HospitalStaffService {
  static async getHospitalStaff(params: HospitalStaffQueryParams = {}, token?: string): Promise<HospitalStaffResponse> {
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
    
    if (params.search) {
      queryParams.append('search', params.search);
    }
    
    if (params.health_facility_id) {
      queryParams.append('health_facility_id', params.health_facility_id);
    }
    
    if (params.department) {
      queryParams.append('department', params.department);
    }
    
    if (params.specialty) {
      queryParams.append('specialty', params.specialty);
    }
    
    if (params.employment_status) {
      queryParams.append('employment_status', params.employment_status);
    }
    
    if (params.deleted_at !== undefined) {
      queryParams.append('deleted_at', params.deleted_at || '');
    }
    
    const url = `${API_BASE}/hospital-staff?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch hospital staff: ${response.statusText}`);
    }

    return response.json();
  }

  static async getHospitalStaffById(id: string, token?: string): Promise<HospitalStaff> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/hospital-staff/${id}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch hospital staff: ${response.statusText}`);
    }

    return response.json();
  }

  static async createHospitalStaff(staffData: CreateHospitalStaffRequest, token?: string): Promise<HospitalStaff> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/hospital-staff`, {
      method: 'POST',
      headers,
      body: JSON.stringify(staffData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create hospital staff: ${response.statusText}`);
    }

    return response.json();
  }

  static async updateHospitalStaff(id: string, staffData: UpdateHospitalStaffRequest, token?: string): Promise<HospitalStaff> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/hospital-staff/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(staffData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update hospital staff: ${response.statusText}`);
    }

    return response.json();
  }

  static async deleteHospitalStaff(id: string, token?: string): Promise<void> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/hospital-staff/${id}/soft-delete`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete hospital staff: ${response.statusText}`);
    }
  }

  static async permanentlyDeleteHospitalStaff(id: string, token?: string): Promise<void> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/hospital-staff/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to permanently delete hospital staff: ${response.statusText}`);
    }
  }

  static async restoreHospitalStaff(id: string, token?: string): Promise<HospitalStaff> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/hospital-staff/${id}/restore`, {
      method: 'PATCH',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to restore hospital staff: ${response.statusText}`);
    }

    return response.json();
  }

  static async toggleHospitalStaffStatus(id: string, token?: string): Promise<HospitalStaff> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/hospital-staff/${id}/toggle-status`, {
      method: 'PATCH',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to toggle hospital staff status: ${response.statusText}`);
    }

    return response.json();
  }
}
