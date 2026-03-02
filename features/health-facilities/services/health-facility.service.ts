import { HealthFacility, CreateHealthFacilityRequest, UpdateHealthFacilityRequest, HealthFacilityResponse, HealthFacilityQueryParams as ServiceQueryParams } from '../types/health-facility.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

export interface HealthFacilityServiceQueryParams {
  limit?: number;
  offset?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  search?: string;
  deleted_at?: string | null;
}

export class HealthFacilityService {
  static async getHealthFacilities(params: ServiceQueryParams = {}, token?: string): Promise<HealthFacilityResponse> {
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
    
    if (params.deleted_at !== undefined) {
      queryParams.append('deleted_at', params.deleted_at || '');
    }
    
    const url = `${API_BASE}/health-facilities?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch health facilities: ${response.statusText}`);
    }

    return response.json();
  }

  static async getHealthFacilityById(id: string, token?: string): Promise<HealthFacility> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/health-facilities/${id}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch health facility: ${response.statusText}`);
    }

    return response.json();
  }

  static async createHealthFacility(facilityData: CreateHealthFacilityRequest, token?: string): Promise<HealthFacility> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/health-facilities`, {
      method: 'POST',
      headers,
      body: JSON.stringify(facilityData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create health facility: ${response.statusText}`);
    }

    return response.json();
  }

  static async updateHealthFacility(id: string, facilityData: UpdateHealthFacilityRequest, token?: string): Promise<HealthFacility> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/health-facilities/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(facilityData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update health facility: ${response.statusText}`);
    }

    return response.json();
  }

  static async deleteHealthFacility(id: string, token?: string): Promise<void> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/health-facilities/${id}/soft-delete`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete health facility: ${response.statusText}`);
    }
  }

  static async permanentlyDeleteHealthFacility(id: string, token?: string): Promise<void> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/health-facilities/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to permanently delete health facility: ${response.statusText}`);
    }
  }

  static async restoreHealthFacility(id: string, token?: string): Promise<HealthFacility> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/health-facilities/${id}/restore`, {
      method: 'PATCH',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to restore health facility: ${response.statusText}`);
    }

    return response.json();
  }

  static async toggleHealthFacilityStatus(id: string, token?: string): Promise<HealthFacility> {
    const authToken = token || getAuthToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}/health-facilities/${id}/toggle-status`, {
      method: 'PATCH',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to toggle health facility status: ${response.statusText}`);
    }

    return response.json();
  }
}
