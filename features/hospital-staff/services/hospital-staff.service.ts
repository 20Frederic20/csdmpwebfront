import {
  HospitalStaff,
  CreateHospitalStaffRequest,
  UpdateHospitalStaffRequest,
  HospitalStaffResponse,
  HospitalStaffQueryParams
} from '../types/hospital-staff.types';
import { AuthClientService } from '@/features/core/auth/services/auth-client.service';

// Utiliser le proxy Next.js pour que les cookies soient correctement envoyés
const API_BASE = '/api/v1';

export class HospitalStaffService {
  static async getHospitalStaff(params: HospitalStaffQueryParams = {}): Promise<HospitalStaffResponse> {
    const queryParams = new URLSearchParams();

    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);
    if (params.search) queryParams.append('search', params.search);
    if (params.health_facility_id) queryParams.append('health_facility_id', params.health_facility_id);
    if (params.department_id) queryParams.append('department_id', params.department_id);
    if (params.specialty) queryParams.append('specialty', params.specialty);
    if (params.employment_status) queryParams.append('employment_status', params.employment_status);
    if (params.order_number) queryParams.append('order_number', params.order_number);
    if (params.include_deleted !== undefined) queryParams.append('include_deleted', params.include_deleted.toString());

    const url = `${API_BASE}/hospital-staff?${queryParams.toString()}`;

    const response = await AuthClientService.makeAuthenticatedRequest(url, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch hospital staff: ${response.statusText}`);
    }

    return response.json();
  }

  static async getHospitalStaffById(id: string): Promise<HospitalStaff> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/hospital-staff/${id}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch hospital staff: ${response.statusText}`);
    }

    return response.json();
  }

  static async createHospitalStaff(staffData: CreateHospitalStaffRequest): Promise<HospitalStaff> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/hospital-staff`, {
      method: 'POST',
      body: JSON.stringify(staffData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create hospital staff: ${response.statusText}`);
    }

    return response.json();
  }

  static async updateHospitalStaff(id: string, staffData: UpdateHospitalStaffRequest): Promise<HospitalStaff> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/hospital-staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(staffData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update hospital staff: ${response.statusText}`);
    }

    return response.json();
  }

  static async deleteHospitalStaff(id: string): Promise<void> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/hospital-staff/${id}/soft-delete`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete hospital staff: ${response.statusText}`);
    }
  }

  static async permanentlyDeleteHospitalStaff(id: string): Promise<void> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/hospital-staff/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to permanently delete hospital staff: ${response.statusText}`);
    }
  }

  static async restoreHospitalStaff(id: string): Promise<HospitalStaff> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/hospital-staff/${id}/restore`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error(`Failed to restore hospital staff: ${response.statusText}`);
    }

    return response.json();
  }

  static async toggleHospitalStaffStatus(id: string): Promise<HospitalStaff> {
    const response = await AuthClientService.makeAuthenticatedRequest(`${API_BASE}/hospital-staff/${id}/toggle-status`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error(`Failed to toggle hospital staff status: ${response.statusText}`);
    }

    return response.json();
  }
}
