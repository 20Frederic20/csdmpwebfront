import { HealthFacility, CreateHealthFacilityRequest, UpdateHealthFacilityRequest, HealthFacilityResponse, HealthFacilityQueryParams as ServiceQueryParams } from '../types/health-facility.types';
import { AuthClientService } from '@/features/core/auth/services/auth-client.service';

// Utiliser le proxy Next.js pour que les cookies soient correctement envoyés
const API_BASE = '/api/v1';

export class HealthFacilityService {
  static async getHealthFacilities(params: ServiceQueryParams = {}): Promise<HealthFacilityResponse> {
    const queryParams = new URLSearchParams();

    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);
    if (params.search) queryParams.append('search', params.search);
    if (params.deleted_at !== undefined) queryParams.append('deleted_at', params.deleted_at || '');

    const url = `${API_BASE}/health-facilities?${queryParams.toString()}`;

    const response = await AuthClientService.makeAuthenticatedRequest(url, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch health facilities: ${response.statusText}`);
    }

    return response.json();
  }

  static async getHealthFacilityById(id: string): Promise<HealthFacility> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/health-facilities/${id}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch health facility: ${response.statusText}`);
    }

    return response.json();
  }

  static async createHealthFacility(facilityData: CreateHealthFacilityRequest): Promise<HealthFacility> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/health-facilities`, {
      method: 'POST',
      body: JSON.stringify(facilityData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create health facility: ${response.statusText}`);
    }

    return response.json();
  }

  static async updateHealthFacility(id: string, facilityData: UpdateHealthFacilityRequest): Promise<HealthFacility> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/health-facilities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(facilityData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update health facility: ${response.statusText}`);
    }

    return response.json();
  }

  static async deleteHealthFacility(id: string): Promise<void> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/health-facilities/${id}/soft-delete`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete health facility: ${response.statusText}`);
    }
  }

  static async permanentlyDeleteHealthFacility(id: string): Promise<void> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/health-facilities/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to permanently delete health facility: ${response.statusText}`);
    }
  }

  static async restoreHealthFacility(id: string): Promise<HealthFacility> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/health-facilities/${id}/restore`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error(`Failed to restore health facility: ${response.statusText}`);
    }

    return response.json();
  }

  static async toggleHealthFacilityStatus(id: string): Promise<HealthFacility> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/health-facilities/${id}/toggle-status`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error(`Failed to toggle health facility status: ${response.statusText}`);
    }

    return response.json();
  }
}
